import axiosClient from './axiosClient';
export const webhookApi = {
  getByWorkspace: (wsId) => axiosClient.get(`/workspaces/${wsId}/webhooks`),
  create: (wsId, data) => axiosClient.post(`/workspaces/${wsId}/webhooks`, data),
  update: (id, data) => axiosClient.patch(`/webhooks/${id}`, data),
  delete: (id) => axiosClient.delete(`/webhooks/${id}`),
  getDeliveries: (id) => axiosClient.get(`/webhooks/${id}/deliveries`),
};
