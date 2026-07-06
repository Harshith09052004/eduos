import api from "./api";

export async function getPlacements() {
  const response = await api.get("/placements/");
  return response.data;
}

export async function createPlacement(data: any) {
  const response = await api.post("/placements/", data);
  return response.data;
}

export async function updatePlacement(id: number, data: any) {
  const response = await api.put(`/placements/${id}/`, data);
  return response.data;
}

export async function deletePlacement(id: number) {
  const response = await api.delete(`/placements/${id}/`);
  return response.data;
}