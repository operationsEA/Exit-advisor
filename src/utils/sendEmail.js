/**
 * src/utils/sendEmail.js
 *
 * Reusable SMTP email sender built on Nodemailer.
 *
 * Two named profiles (select via the `transport` parameter):
 *   "helo"  → SMTP_HELO_*  env vars  (default)
 *   "mail"  → SMTP_MAIL_*  env vars
 *
 * NODE_ENV controls connection security:
 *   development  → port 587, secure: false  (STARTTLS)
 *   production   → port 465, secure: true   (SSL)
 * Both can be overridden per-profile with SMTP_*_PORT / SMTP_*_SECURE.
 *
 * Usage:
 *   import { sendEmail } from "@/utils/sendEmail";
 *
 *   await sendEmail({ to: "user@example.com", subject: "Hello", html: "<p>Hi!</p>" });
 *
 *   // Use the "mail" profile:
 *   await sendEmail({ to: "...", subject: "...", html: "..." }, "mail");
 */

import nodemailer from "nodemailer";

const isProd = process.env.NODE_ENV === "production";

// ─── SMTP profiles ────────────────────────────────────────────────────────────
// Port / secure fall back to env var → then NODE_ENV default.

const SMTP_CONFIGS = {
  helo: {
    host: process.env.SMTP_HELO_HOST,
    port: Number(process.env.SMTP_HELO_PORT || (isProd ? 465 : 587)),
    secure:
      process.env.SMTP_HELO_SECURE !== undefined
        ? process.env.SMTP_HELO_SECURE === "true"
        : isProd,
    auth: {
      user: process.env.SMTP_HELO_USER,
      pass: process.env.SMTP_HELO_PASS,
    },
    from: process.env.SMTP_HELO_FROM || process.env.SMTP_HELO_USER,
  },

  mail: {
    host: process.env.SMTP_MAIL_HOST,
    port: Number(process.env.SMTP_MAIL_PORT || (isProd ? 465 : 587)),
    secure:
      process.env.SMTP_MAIL_SECURE !== undefined
        ? process.env.SMTP_MAIL_SECURE === "true"
        : isProd,
    auth: {
      user: process.env.SMTP_MAIL_USER,
      pass: process.env.SMTP_MAIL_PASS,
    },
    from: process.env.SMTP_MAIL_FROM || process.env.SMTP_MAIL_USER,
  },
};

// ─── Transporter cache (one per profile) ─────────────────────────────────────

const transporterCache = {};

function getTransporter(profileKey) {
  if (transporterCache[profileKey]) return transporterCache[profileKey];

  const cfg = SMTP_CONFIGS[profileKey];
  if (!cfg) throw new Error(`Unknown SMTP profile: "${profileKey}"`);
  if (!cfg.host || !cfg.auth.user || !cfg.auth.pass) {
    throw new Error(
      `SMTP profile "${profileKey}" is missing required env vars ` +
        `(SMTP_${profileKey.toUpperCase()}_HOST / USER / PASS)`,
    );
  }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.auth.user, pass: cfg.auth.pass },
  });

  transporterCache[profileKey] = transporter;
  return transporter;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Send an email.
 *
 * @param {{ to: string|string[], subject: string, html: string, text?: string, from?: string }} options
 * @param {"helo"|"mail"} transport  SMTP profile to use (default: "helo")
 * @returns {Promise<{ success: true, messageId: string } | { success: false, error: string }>}
 */
export async function sendEmail(options, transport = "mail") {
  const { to, subject, html, text, from } = options;

  if (!to || !subject || (!html && !text)) {
    return {
      success: false,
      error: "Missing required fields: to, subject, html/text",
    };
  }

  try {
    const cfg = SMTP_CONFIGS[transport];
    if (!cfg)
      return { success: false, error: `Unknown SMTP profile: "${transport}"` };

    const transporter = getTransporter(transport);
    const fromAddress = from || `"${cfg.from}" <${cfg.auth.user}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
      text,
    });

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[sendEmail] Error (transport: ${transport}):`, err.message);
    return { success: false, error: err.message };
  }
}
