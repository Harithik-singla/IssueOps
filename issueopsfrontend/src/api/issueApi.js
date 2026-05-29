import axiosClient from './axiosClient';
export const issueApi = {
  getByProject: (projectId, params) => axiosClient.get(`/projects/${projectId}/issues`, { params }),
  create: (projectId, data) => axiosClient.post(`/projects/${projectId}/issues`, data),
  getById: (id) => axiosClient.get(`/issues/${id}`),
  update: (id, data) => axiosClient.patch(`/issues/${id}`, data),
  updateStatus: (id, status) => axiosClient.patch(`/issues/${id}/status`, { status }),
  delete: (id) => axiosClient.delete(`/issues/${id}`),
};
