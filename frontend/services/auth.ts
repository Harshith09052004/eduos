import api from "./api";

export async function login(email: string, password: string) {
  const response = await api.post("/token/", {
    email,
    password,
  });

  return response.data;
}

export async function refreshToken(refresh: string) {
  const response = await api.post("/token/refresh/", {
    refresh,
  });

  return response.data;
}