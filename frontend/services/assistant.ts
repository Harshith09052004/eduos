import Cookies from "js-cookie";
import api from "./api";

export async function sendChatMessage(
  prompt: string,
  conversationId?: number
): Promise<Response> {
  const token = Cookies.get("access");

  const base = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  const res = await fetch(`${base}/assistant/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      prompt,
      conversation_id: conversationId ?? null,
    }),
  });

  return res;
}

export async function getConversations() {
  const res = await api.get("/assistant/conversations/");
  return res.data;
}

export async function getConversationMessages(conversationId: number) {
  const res = await api.get(`/assistant/conversations/${conversationId}/`);
  return res.data;
}

export async function deleteConversation(conversationId: number) {
  const res = await api.delete(
    `/assistant/conversations/${conversationId}/`
  );
  return res.data;
}
