import { logger } from "./logger";

// Email alert to the Foundation when someone submits a form (PRD F9).
// Uses Resend over plain fetch. Does nothing unless RESEND_API_KEY, EMAIL_FROM and NOTIFY_EMAIL
// are all set, and NEVER throws or delays the visitor's request: a failed alert is only logged.
export function notifyStaff(kind: string, fields: Record<string, unknown>): void {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = (process.env.NOTIFY_EMAIL ?? "").split(",").map((e) => e.trim()).filter(Boolean);
  if (!key || !from || to.length === 0) return;

  // Fixed subject (no visitor text in headers). Body is plain text only, so nothing is rendered as HTML.
  const text =
    `New ${kind} on the Kifalah website.\n\n` +
    Object.entries(fields)
      .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "")
      .map(([k, v]) => `${k}: ${String(v)}`)
      .join("\n") +
    "\n\nReview it in the admin area.";

  void fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: `New ${kind}: Kifalah website`, text }),
  })
    .then(async (res) => {
      if (!res.ok) logger.warn({ status: res.status, body: await res.text() }, "staff alert failed");
    })
    .catch((err) => logger.warn({ err }, "staff alert failed"));
}
