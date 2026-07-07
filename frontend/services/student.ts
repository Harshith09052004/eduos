import api from "./api";

export async function getStudents() {
  const response = await api.get("/students/");
  return response.data;
}

export async function createStudent(data: any) {
  const response = await api.post("/students/", data);
  return response.data;
}

export async function updateStudent(id: number, data: any) {
  const response = await api.put(`/students/${id}/`, data);
  return response.data;
}

export async function deleteStudent(id: number) {
  const response = await api.delete(`/students/${id}/`);
  return response.data;
}