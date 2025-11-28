/**
 * Bookmark service for API operations
 */

import { apiClient } from '@/lib/api-client';
import { Bookmark, BookmarkCreate, BookmarkUpdate, BookmarkFilters } from '@/types';

export const bookmarkService = {
  async getBookmarks(filters: BookmarkFilters = {}) {
    const params = new URLSearchParams();
    
    if (filters.user_id) params.append('user_id', filters.user_id.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.skip) params.append('skip', filters.skip.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<Bookmark[]>(`/api/bookmarks/${query}`);
  },

  async getBookmark(id: number) {
    return apiClient.get<Bookmark>(`/api/bookmarks/${id}`);
  },

  async createBookmark(bookmarkData: BookmarkCreate) {
    return apiClient.post<Bookmark>('/api/bookmarks/', bookmarkData);
  },

  async updateBookmark(id: number, bookmarkData: BookmarkUpdate) {
    return apiClient.put<Bookmark>(`/api/bookmarks/${id}`, bookmarkData);
  },

  async deleteBookmark(id: number) {
    return apiClient.delete(`/api/bookmarks/${id}`);
  },
};