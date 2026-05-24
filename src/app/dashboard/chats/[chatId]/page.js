"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import AdminChatsPage from "../page";

function ChatByIdPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();

  const chatId = Array.isArray(params?.chatId)
    ? params.chatId[0]
    : params?.chatId || "";

  const preset = searchParams.get("preset") || "";

  return (
    <AdminChatsPage initialChatId={chatId} initialPresetMessage={preset} />
  );
}

export default function ChatByIdPage() {
  return (
    <Suspense>
      <ChatByIdPageInner />
    </Suspense>
  );
}
