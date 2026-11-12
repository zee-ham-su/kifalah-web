import { getAuth, clerkClient } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

// Being signed in is NOT enough to be an admin: Clerk lets anyone with a link create an account
// unless sign-ups are disabled in the Clerk dashboard. Admin access is therefore an explicit
// allowlist of verified email addresses, set in ADMIN_EMAILS (comma-separated).
// If ADMIN_EMAILS is empty, nobody is admin (fail closed).

function allowedEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

const CACHE_MS = 5 * 60 * 1000;
const cache = new Map<string, { ok: boolean; expires: number }>();

async function isAdminUser(userId: string): Promise<boolean> {
  const allow = allowedEmails();
  if (allow.size === 0) return false;

  const hit = cache.get(userId);
  if (hit && hit.expires > Date.now()) return hit.ok;

  const user = await clerkClient.users.getUser(userId);
  const ok = user.emailAddresses.some(
    (e) => e.verification?.status === "verified" && allow.has(e.emailAddress.toLowerCase()),
  );
  cache.set(userId, { ok, expires: Date.now() + CACHE_MS });
  return ok;
}

export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ error: "Unauthorised" });
    return;
  }
  try {
    if (!(await isAdminUser(auth.userId))) {
      if (allowedEmails().size === 0) logger.warn("ADMIN_EMAILS is not set: all admin requests are denied");
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  } catch (err) {
    logger.error({ err }, "admin check failed");
    res.status(500).json({ error: "Could not verify access" });
  }
};
