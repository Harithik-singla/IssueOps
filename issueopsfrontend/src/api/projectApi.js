import axiosClient from './axiosClient';
export const projectApi = {
  getByWorkspace: (wsId) => axiosClient.get(`/workspaces/${wsId}/projects`),
  create: (wsId, data) => axiosClient.post(`/workspaces/${wsId}/projects`, data),
  getById: (id) => axiosClient.get(`/projects/${id}`),
  update: (id, data) => axiosClient.patch(`/projects/${id}`, data),
  delete: (id) => axiosClient.delete(`/projects/${id}`),
  getAnalytics: (id) => axiosClient.get(`/projects/${id}/analytics`),
};
