// End-to-end smoke test against a REAL Postgres (set DATABASE_URL) with Clerk sign-in stubbed.
//   DATABASE_URL=postgresql://... pnpm --filter @workspace/api-server run smoke
// Covers: pledges are intent-only, admin allowlist (fail closed), status updates, CSV safety,
// CORS lockdown, rate limiting.
import express from "express";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";

process.env.CLERK_SECRET_KEY ??= "sk_test_dummy";
process.env.CLERK_PUBLISHABLE_KEY ??= "pk_test_ZXhhbXBsZS5jbGVyay5hY2NvdW50cy5kZXYk";
process.env.ADMIN_EMAILS = "admin@kifalah.test";
process.env.FORM_RATE_LIMIT = "14";

const { clerkClient } = await import("@clerk/express");
const { default: router } = await import("../src/routes");
const { default: realApp } = await import("../src/app");

// Fake Clerk users: who is verified, and on which email.
const users: Record<string, { email: string; verified: boolean }> = {
  u_admin: { email: "Admin@Kifalah.test", verified: true }, // case-insensitive match
  u_rando: { email: "someone@else.test", verified: true },
  u_unverified: { email: "admin@kifalah.test", verified: false },
};
(clerkClient.users as unknown as { getUser: (id: string) => Promise<unknown> }).getUser = async (id: string) => {
  const u = users[id];
  return { emailAddresses: [{ emailAddress: u.email, verification: { status: u.verified ? "verified" : "unverified" } }] };
};

// Harness app: same routes, but sign-in comes from an x-test-user header.
const harness = express();
harness.use(express.json());
harness.use((req, _res, next) => {
  const id = req.header("x-test-user");
  // Clerk only trusts an auth function carrying its brand symbol.
  const authFn = () => (id ? { userId: id, tokenType: "session_token" } : { userId: null, tokenType: "session_token" });
  (req as unknown as { auth: unknown }).auth = Object.assign(authFn, { [Symbol.for("@clerk/express.auth")]: true });
  next();
});
harness.use("/api", router);

const listen = (app: express.Express) =>
  new Promise<{ server: Server; url: string }>((resolve) => {
    const server = app.listen(0, () => resolve({ server, url: `http://127.0.0.1:${(server.address() as AddressInfo).port}` }));
  });

let failed = 0;
const check = (name: string, ok: boolean, extra = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : "  " + extra}`);
  if (!ok) failed++;
};
const post = (url: string, body: unknown, headers: Record<string, string> = {}) =>
  fetch(url, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) });

const h = await listen(harness);
const r = await listen(realApp);
const A = { "x-test-user": "u_admin" };

// ---- pledges are intent only
let res = await post(`${h.url}/api/donations`, { donorName: "Ama Mensah", email: "ama@example.com", amount: 200, currency: "GHS", status: "received" });
let pledge = (await res.json()) as { id: number; status: string; amount: number | null };
check("pledge with amount -> 201", res.status === 201);
check("client-supplied status is ignored (server sets 'pledged')", pledge.status === "pledged", JSON.stringify(pledge));

res = await post(`${h.url}/api/donations`, { donorName: "Kofi", email: "k@example.com", inKindSupport: "50 school textbooks" });
const inKind = (await res.json()) as { amount: number | null };
check("in-kind-only pledge -> 201 with null amount", res.status === 201 && inKind.amount === null);

res = await post(`${h.url}/api/donations`, { donorName: "Nobody", email: "n@example.com" });
check("pledge with no amount and no in-kind -> 400", res.status === 400);
res = await post(`${h.url}/api/donations`, { donorName: "Neg", email: "n@example.com", amount: -5 });
check("negative amount -> 400", res.status === 400);

res = await post(`${h.url}/api/donations`, { donorName: '=HYPERLINK("http://evil.test","click")', email: "x@example.com", amount: 1 });
check("formula-looking name still stored as plain data -> 201", res.status === 201);

// ---- other forms store submissions
check("contact -> 201", (await post(`${h.url}/api/contact`, { name: "Esi", email: "e@example.com", subject: "Hello there", message: "A message of enough length" })).status === 201);
check("volunteer -> 201", (await post(`${h.url}/api/volunteer`, { fullName: "Yaw", email: "y@example.com", phone: "0240000000", location: "Tamale", skills: "Teaching", areaOfInterest: "Education", availability: "Weekends", motivation: "I want to help children learn" })).status === 201);
check("partnership -> 201", (await post(`${h.url}/api/partnership`, { organisationName: "Org", contactName: "C", email: "o@example.com", organisationType: "NGO", message: "Let us partner on schools" })).status === 201);
const sub = { fullName: "Sub Scriber", email: `sub${Date.now()}@example.com` };
check("newsletter -> 201", (await post(`${h.url}/api/newsletter`, sub)).status === 201);
check("newsletter duplicate -> 409", (await post(`${h.url}/api/newsletter`, sub)).status === 409);

// ---- admin authorization matrix
const get = (path: string, who?: string) => fetch(`${h.url}/api${path}`, { headers: who ? { "x-test-user": who } : {} });
check("admin route, not signed in -> 401", (await get("/admin/donations")).status === 401);
check("admin route, signed in but not on allowlist -> 403", (await get("/admin/donations", "u_rando")).status === 403);
check("admin route, allowlisted email but UNVERIFIED -> 403", (await get("/admin/donations", "u_unverified")).status === 403);
check("admin route, allowlisted + verified (case-insensitive) -> 200", (await get("/admin/donations", "u_admin")).status === 200);
check("/admin/me as admin -> 200", (await get("/admin/me", "u_admin")).status === 200);
check("write routes also protected (POST /news as non-admin -> 403)", (await post(`${h.url}/api/news`, {}, { "x-test-user": "u_rando" })).status === 403);
check("write routes also protected (DELETE /documents/1 not signed in -> 401)", (await fetch(`${h.url}/api/documents/1`, { method: "DELETE" })).status === 401);

// ---- status updates
const patch = (id: number | string, body: unknown) => fetch(`${h.url}/api/admin/donations/${id}/status`, { method: "PATCH", headers: { "content-type": "application/json", ...A }, body: JSON.stringify(body) });
res = await patch(pledge.id, { status: "received" });
check("mark pledge received -> 200", res.status === 200 && ((await res.json()) as { status: string }).status === "received");
check("mark pledge follow_up -> 200", (await patch(pledge.id, { status: "follow_up" })).status === 200);
check("invalid status ('paid') -> 400", (await patch(pledge.id, { status: "paid" })).status === 400);
check("unknown pledge -> 404", (await patch(999999, { status: "received" })).status === 404);
check("non-admin cannot change status -> 403", (await fetch(`${h.url}/api/admin/donations/${pledge.id}/status`, { method: "PATCH", headers: { "content-type": "application/json", "x-test-user": "u_rando" }, body: JSON.stringify({ status: "received" }) })).status === 403);

// ---- CSV
res = await get("/admin/donations/export.csv", "u_admin");
const csv = await res.text();
check("pledges CSV -> 200 text/csv with header", res.status === 200 && (res.headers.get("content-type") ?? "").startsWith("text/csv") && csv.startsWith("id,date,name,email"));
check("CSV neutralises formula injection (cell starts with ')", csv.includes(`'=HYPERLINK`) && !/(^|,)=HYPERLINK/m.test(csv), csv.split("\n").find((l) => l.includes("HYPERLINK")) ?? "");
check("CSV export requires admin", (await get("/admin/donations/export.csv", "u_rando")).status === 403);
check("subscribers CSV works", (await (await get("/admin/newsletter/export.csv", "u_admin")).text()).includes(sub.email));


// ---- the rest of the content API (this was broken by the same Date-vs-string bug)
const admin = (method: string, path: string, body?: unknown) =>
  fetch(`${h.url}/api${path}`, { method, headers: { "content-type": "application/json", ...A }, body: body ? JSON.stringify(body) : undefined });
res = await admin("POST", "/programmes", { slug: "education", title: "Education and Scholarship", description: "Learning", icon: "BookOpen" });
check("create programme -> 201", res.status === 201, await res.clone().text());
res = await fetch(`${h.url}/api/programmes`);
const progs = (await res.json()) as { createdAt: string }[];
check("list programmes (public) -> 200 with ISO date strings", res.status === 200 && progs.length > 0 && typeof progs[0].createdAt === "string");
check("get programme by slug (public) -> 200", (await fetch(`${h.url}/api/programmes/education`)).status === 200 || (await fetch(`${h.url}/api/programmes/${(progs[0] as unknown as { id: number }).id}`)).status === 200);
res = await admin("POST", "/news", { title: "First story", slug: `first-story-${Date.now()}`, excerpt: "Short", category: "News", published: true });
check("create news -> 201", res.status === 201, await res.clone().text());
res = await fetch(`${h.url}/api/news`);
check("list news (public) -> 200", res.status === 200 && ((await res.json()) as unknown[]).length > 0);
res = await admin("POST", "/impact-stats", { label: "Students supported", value: "1200", icon: "GraduationCap" });
check("create impact stat -> 201", res.status === 201, await res.clone().text());
check("list impact stats (public) -> 200", (await fetch(`${h.url}/api/impact-stats`)).status === 200);
res = await admin("POST", "/documents", { title: "Annual Report 2025", category: "annual-report", fileUrl: "https://example.org/report.pdf", fileType: "PDF" });
check("create document -> 201", res.status === 201, await res.clone().text());
check("list documents (public) -> 200", (await fetch(`${h.url}/api/documents`)).status === 200);
check("admin summary -> 200", (await get("/admin/summary", "u_admin")).status === 200);
check("admin contact/volunteers/partnerships/newsletter lists -> 200", (await Promise.all(["/admin/contact", "/admin/volunteers", "/admin/partnerships", "/admin/newsletter"].map((p) => get(p, "u_admin")))).every((x) => x.status === 200));

// ---- real app: CORS lockdown + unauthenticated admin
res = await fetch(`${r.url}/api/healthz`, { headers: { Origin: "https://evil.example" } });
check("CORS: foreign origin gets no allow-origin header", res.headers.get("access-control-allow-origin") === null, String(res.headers.get("access-control-allow-origin")));
res = await fetch(`${r.url}/api/admin/donations`);
check("real app: admin route without a session -> 401", res.status === 401, String(res.status));

// ---- fail closed when ADMIN_EMAILS is empty
process.env.ADMIN_EMAILS = "";
check("ADMIN_EMAILS empty -> even the admin is denied (fail closed)", (await get("/admin/donations", "u_admin")).status === 403);
process.env.ADMIN_EMAILS = "admin@kifalah.test";

// ---- rate limit (limit set to 14 per window; we have already used several)
let limited = 0;
for (let i = 0; i < 20; i++) {
  const x = await post(`${h.url}/api/contact`, { name: "Spam", email: "s@example.com", subject: "Spam spam", message: "Spam spam spam spam" });
  if (x.status === 429) { limited++; break; }
}
check("rate limit kicks in on repeated form posts -> 429", limited > 0);

h.server.close();
r.server.close();
console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
