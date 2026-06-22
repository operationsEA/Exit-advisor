"use server";

import { sendEmail } from "@/utils/sendEmail";

export async function submitContactForm(formData) {
  const { name, email, message } = Object.fromEntries(formData);

  if (!name || !email || !message) {
    return { error: "Please fill in all fields" };
  }

  const result = await sendEmail({
    to: process.env.CONTACT_EMAIL_TO || "support@bizforsale.io",
    subject: `New Contact from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
    text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
  });

  if (!result.success) {
    console.error("[Contact] Failed to send email:", result.error);
    return { error: "Failed to send message. Please try again later." };
  }

  return { success: true };
}
