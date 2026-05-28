import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/supabase/index";
import { sendEmail } from "@/utils/sendEmail";

// Vercel Cron calls this route every minute (configured in vercel.json).
// It processes all due pending_email_notifications, re-verifies the recipient
// is still offline, sends one email, then marks the row sent.
export async function GET(request) {
  // Protect against unauthorised calls — Vercel Cron always sends this header

  console.log("CRON Job is working");
  //   const authHeader = request.headers.get("authorization");
  //   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }

  const supabase = createAdminSupabaseClient();
  const now = new Date().toISOString();

  // Fetch all due, unsent notifications with the data we need for the email
  const { data: notifications, error: fetchError } = await supabase
    .from("pending_email_notifications")
    .select(
      `
      id,
      recipient_id,
      chat_id,
      recipient:recipient_id ( id, email, full_name ),
      chat:chat_id (
        id,
        listing:listing_id ( id, title )
      ),
      message:message_id (
        id, message,
        sender:sender_id ( id, full_name )
      )
    `,
    )
    .eq("sent", false)
    .lte("send_after", now);

  if (fetchError) {
    console.error("[cron/send-chat-notifications] fetch error:", fetchError);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!notifications?.length) {
    return NextResponse.json({ sent: 0, skipped: 0 });
  }

  const fiveMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
  let sent = 0;
  let skipped = 0;
  const processedIds = [];

  for (const notif of notifications) {
    // Re-check: did the recipient come back online before we got here?
    const { data: activity } = await supabase
      .from("active_chats")
      .select("is_active, updated_at")
      .eq("user_id", notif.recipient_id)
      .eq("chat_id", notif.chat_id)
      .eq("is_active", true)
      .gte("updated_at", fiveMinutesAgo)
      .maybeSingle();

    if (activity?.is_active) {
      // User came back — suppress the email but still mark as processed
      // so we don't retry it on the next cron tick
      processedIds.push(notif.id);
      skipped++;
      continue;
    }

    const recipientEmail = notif.recipient?.email;
    if (!recipientEmail) {
      processedIds.push(notif.id);
      skipped++;
      continue;
    }

    const recipientName = notif.recipient?.full_name || "there";
    const senderName = notif.message?.sender?.full_name || "Someone";
    const listingTitle = notif.chat?.listing?.title || "a listing";
    const rawMessage = notif.message?.message || "";
    const messagePreview =
      rawMessage.length > 140
        ? rawMessage.slice(0, 140) + "…"
        : rawMessage || "sent you a message";
    const chatUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/chats/${notif.chat_id}`;

    console.log(
      recipientEmail,
      recipientName,
      senderName,
      listingTitle,
      messagePreview,
      chatUrl,
    );

    try {
      const result = await sendEmail(
        {
          to: recipientEmail,
          subject: `New message from ${senderName} about "${listingTitle}"`,
          html: buildEmailHtml({
            recipientName,
            senderName,
            listingTitle,
            messagePreview,
            chatUrl,
          }),
        },
        "mail", // use "helo" for the helo SMTP profile
      );

      if (!result.success) throw new Error(result.error);

      processedIds.push(notif.id);
      sent++;
    } catch (emailError) {
      console.error("[cron/send-chat-notifications] Resend error:", emailError);
      // Don't add to processedIds — will retry on next cron tick
    }
  }

  // Mark all processed notifications as sent in one batch update
  if (processedIds.length) {
    await supabase
      .from("pending_email_notifications")
      .update({ sent: true, sent_at: now })
      .in("id", processedIds);
  }

  return NextResponse.json({ sent, skipped });
}

function buildEmailHtml({
  recipientName,
  senderName,
  listingTitle,
  messagePreview,
  chatUrl,
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;padding:32px;">
        <tr>
          <td>
            <h2 style="margin:0 0 6px;color:#0f172a;font-size:20px;">You have a new message</h2>
            <p style="margin:0 0 24px;color:#64748b;font-size:14px;">
              Hi <strong>${recipientName}</strong> — <strong>${senderName}</strong> sent you a message
              about <strong>${listingTitle}</strong>.
            </p>
            <div style="background:#f8fafc;border-left:4px solid #6366f1;border-radius:6px;padding:14px 16px;margin-bottom:28px;">
              <p style="margin:0;color:#334155;font-size:14px;line-height:1.6;">"${messagePreview}"</p>
            </div>
            <a href="${chatUrl}"
               style="display:inline-block;background:#6366f1;color:#ffffff;text-decoration:none;
                      padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;">
              Open conversation
            </a>
            <p style="margin:28px 0 0;color:#94a3b8;font-size:12px;line-height:1.5;">
              You received this because you had an unread message while away.
              We'll only send one email per conversation until you return.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
