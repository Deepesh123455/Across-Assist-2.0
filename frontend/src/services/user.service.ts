import api from './api';

export const userService = {
  getMe: () => api.get('/users/me'),
  getById: (id: string) => api.get(`/users/${id}`),
  getAll: (params?: Record<string, unknown>) => api.get('/users', { params }),
  update: (id: string, data: Partial<{ name: string; email: string }>) =>
    api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};
