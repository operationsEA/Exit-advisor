"use client";

import { useParams, useSearchParams } from "next/navigation";
import AdminChatsPage from "../page";

export default function ChatByIdPage() {
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
