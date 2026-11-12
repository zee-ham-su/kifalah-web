import { rateLimit } from "express-rate-limit";

// Public forms are the spam target. Per-IP cap: 10 submissions per 15 minutes.
// (In-memory: right for one server. Add CAPTCHA/Turnstile later if spam still gets through.)
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.FORM_RATE_LIMIT) || 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many submissions. Please wait a few minutes and try again." },
});
