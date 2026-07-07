import api from "./api";

export async function login(email: string, password: string) {
  const response = await api.post("/token/", { email, password });
  return response.data;
}

export function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function getRoleFromToken(token: string) {
  const decoded = decodeToken(token);
  return decoded?.role || null;
}
