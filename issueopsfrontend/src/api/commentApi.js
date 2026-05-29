import axiosClient from './axiosClient';
export const commentApi = {
  getByIssue: (issueId) => axiosClient.get(`/issues/${issueId}/comments`),
  create: (issueId, data) => axiosClient.post(`/issues/${issueId}/comments`, data),
  update: (id, data) => axiosClient.patch(`/comments/${id}`, data),
  delete: (id) => axiosClient.delete(`/comments/${id}`),
};
