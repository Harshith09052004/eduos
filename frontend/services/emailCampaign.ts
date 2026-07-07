import api from "./api";

export async function getCampaigns() {
  const res = await api.get("/email-campaigns/campaigns/");
  return res.data;
}

export async function createCampaign(data: {
  purpose: string;
  subject: string;
  body: string;
  recipient_filter: Record<string, any>;
}) {
  const res = await api.post("/email-campaigns/campaigns/create/", data);
  return res.data;
}

export async function getCampaign(id: number) {
  const res = await api.get(`/email-campaigns/campaigns/${id}/`);
  return res.data;
}

export async function sendCampaign(id: number) {
  const res = await api.post(`/email-campaigns/campaigns/${id}/send/`);
  return res.data;
}

export async function generateEmailContent(purpose: string, details: string) {
  const res = await api.post("/email-campaigns/campaigns/generate-content/", {
    purpose,
    details,
  });
  return res.data;
}
