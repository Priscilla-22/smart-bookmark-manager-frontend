/**
 * Tag service for API operations
 */

import { apiClient } from '@/lib/api-client';
import { Tag, TagCreate } from '@/types';

export const tagService = {
  async getTags() {
    return apiClient.get<Tag[]>('/api/tags/');
  },

  async getTag(id: number) {
    return apiClient.get<Tag>(`/api/tags/${id}`);
  },

  async createTag(tagData: TagCreate) {
    return apiClient.post<Tag>('/api/tags/', tagData);
  },

  async updateTag(id: number, tagData: TagCreate) {
    return apiClient.put<Tag>(`/api/tags/${id}`, tagData);
  },

  async deleteTag(id: number) {
    return apiClient.delete(`/api/tags/${id}`);
  },
};