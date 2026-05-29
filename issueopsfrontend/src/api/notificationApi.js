import axiosClient from './axiosClient';
export const notificationApi = {
  getAll: () => axiosClient.get('/notifications'),
  markRead: (id) => axiosClient.patch(`/notifications/${id}/read`),
  markAllRead: () => axiosClient.patch('/notifications/read-all'),
};
