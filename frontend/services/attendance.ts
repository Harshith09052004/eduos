import api from "./api";

export async function getAttendance() {
  const response = await api.get("/attendance/");
  return response.data;
}

export async function createAttendance(data: any) {
  const response = await api.post("/attendance/", data);
  return response.data;
}

export async function updateAttendance(id: number, data: any) {
  const response = await api.put(`/attendance/${id}/`, data);
  return response.data;
}

export async function deleteAttendance(id: number) {
  await api.delete(`/attendance/${id}/`);
}