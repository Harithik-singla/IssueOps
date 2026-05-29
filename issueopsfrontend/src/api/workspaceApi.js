import axiosClient from './axiosClient';
export const workspaceApi = {
  getAll: () => axiosClient.get('/workspaces'),
  create: (data) => axiosClient.post('/workspaces', data),
  getById: (id) => axiosClient.get(`/workspaces/${id}`),
  update: (id, data) => axiosClient.patch(`/workspaces/${id}`, data),
  delete: (id) => axiosClient.delete(`/workspaces/${id}`),
  getMembers: (id) => axiosClient.get(`/workspaces/${id}/members`),
  inviteMember: (id, data) => axiosClient.post(`/workspaces/${id}/invite`, data),
  updateMemberRole: (wsId, memberId, data) => axiosClient.patch(`/workspaces/${wsId}/members/${memberId}/role`, data),
  removeMember: (wsId, memberId) => axiosClient.delete(`/workspaces/${wsId}/members/${memberId}`),
  getAnalytics: (id) => axiosClient.get(`/workspaces/${id}/analytics`),
};
