import api from "./api";

export async function getDepartments() {
  const response = await api.get("/departments/");
  return response.data;
}

export async function createDepartment(data: any) {
  const response = await api.post("/departments/", data);
  return response.data;
}

export async function updateDepartment(id: number, data: any) {
  const response = await api.put(`/departments/${id}/`, data);
  return response.data;
}

export async function deleteDepartment(id: number) {
  const response = await api.delete(`/departments/${id}/`);
  return response.data;
}