import api from "./api";

export async function getFaculty() {
  const response = await api.get("/faculty/");
  return response.data;
}

export async function createFaculty(data: any) {
  const response = await api.post("/faculty/", data);
  return response.data;
}

export async function updateFaculty(id: number, data: any) {
  const response = await api.put(`/faculty/${id}/`, data);
  return response.data;
}

export async function deleteFaculty(id: number) {
  const response = await api.delete(`/faculty/${id}/`);
  return response.data;
}