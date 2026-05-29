import axiosClient from './axiosClient';
export const analyticsApi = {
  getProjectAnalytics: (projectId) => axiosClient.get(`/projects/${projectId}/analytics`),
  getWorkspaceAnalytics: (wsId) => axiosClient.get(`/workspaces/${wsId}/analytics`),
};
