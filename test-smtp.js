// ─── SMTP Test Script ────────────────────────────────────────────────
// Run: node test-smtp.js
// Install dep first (one-time): npm install nodemailer
// ─────────────────────────────────────────────────────────────────────
const dotenv = require("dotenv");
dotenv.config();

const nodemailer = require("nodemailer");

// ✏️  Fill in your SMTP credentials below
const config = {
  host: process.env.SMTP_HELO_HOST, // e.g. smtp.gmail.com / smtp.sendgrid.net
  port: process.env.SMTP_HELO_PORT, // 587 (TLS) or 465 (SSL) or 25
  secure: process.env.SMTP_HELO_SECURE === "true", // true if port 465, false for 587/25
  auth: {
    user: process.env.SMTP_HELO_USER,
    pass: process.env.SMTP_HELO_PASS,
  },
};

const from = process.env.SMTP_HELO_FROM || process.env.SMTP_HELO_USER;
const to = "bilalashraf6233@gmail.com";

// ─────────────────────────────────────────────────────────────────────

async function main() {
  const transporter = nodemailer.createTransport(config);

  console.log("Verifying connection...");
  await transporter.verify();
  console.log("✅ SMTP connection OK\n");

  console.log("Sending test email...");
  const info = await transporter.sendMail({
    from: `"${from}" <${process.env.SMTP_USER}>`,
    to,
    subject: "SMTP Test",
    text: "If you can read this, your SMTP credentials are working correctly.",
  });

  console.log("✅ Email sent!");
  console.log("   Message ID :", info.messageId);
  console.log("   Response   :", info.response);
}

main().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
