import Cookies from "js-cookie";
import api from "./api";

export async function getSchoolPulse() {
  const response = await api.get("/assistant/school-pulse/");
  return response.data;
}

export async function generateSchoolReport(
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (error: string) => void
) {
  const token = Cookies.get("access");

  if (!token) {
    onError("Not authenticated");
    return;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

  try {
    const response = await fetch(`${apiUrl}/assistant/school-pulse/report/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = JSON.parse(line.slice(6));

        if (data.done) {
          onDone();
        } else if (data.token) {
          onToken(data.token);
        }
      }
    }
  } catch (err) {
    onError(String(err));
  }
}
