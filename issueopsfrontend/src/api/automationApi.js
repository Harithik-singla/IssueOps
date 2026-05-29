import axiosClient from './axiosClient';
export const automationApi = {
  getByWorkspace: (wsId) => axiosClient.get(`/workspaces/${wsId}/automation-rules`),
  create: (wsId, data) => axiosClient.post(`/workspaces/${wsId}/automation-rules`, data),
  update: (id, data) => axiosClient.patch(`/automation-rules/${id}`, data),
  delete: (id) => axiosClient.delete(`/automation-rules/${id}`),
};
