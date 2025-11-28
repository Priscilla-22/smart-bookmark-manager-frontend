/**
 * User service for API operations
 */

import { apiClient } from '@/lib/api-client';
import { User, UserCreate } from '@/types';

export const userService = {
  async getUsers() {
    return apiClient.get<User[]>('/api/users/');
  },

  async getUser(id: number) {
    return apiClient.get<User>(`/api/users/${id}`);
  },

  async createUser(userData: UserCreate) {
    return apiClient.post<User>('/api/users/', userData);
  },

  async updateUser(id: number, userData: UserCreate) {
    return apiClient.put<User>(`/api/users/${id}`, userData);
  },

  async deleteUser(id: number) {
    return apiClient.delete(`/api/users/${id}`);
  },
};