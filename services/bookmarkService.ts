/**
 * Bookmark service for API operations
 */

import { apiClient } from '@/lib/api-client';
import { Bookmark, BookmarkCreate, BookmarkUpdate, BookmarkFilters } from '@/types';

export const bookmarkService = {
  async getBookmarks(filters: BookmarkFilters = {}) {
    const params = new URLSearchParams();
    
    if (filters.user_id) params.append('user_id', filters.user_id.toString());
    if (filters.collection_id !== undefined) {
      if (filters.collection_id === null) {
        params.append('collection_id', 'null');
      } else {
        params.append('collection_id', filters.collection_id.toString());
      }
    }
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

  async suggestTags(url: string, title?: string, description?: string, existingTags?: string[]) {
    const data: any = { url };
    if (title) data.title = title;
    if (description) data.description = description;
    if (existingTags && existingTags.length > 0) data.existing_tags = existingTags;
    
    return apiClient.post<{suggestions: string[]}>('/api/bookmarks/suggest-tags', data);
  },

  async analyzeUrl(url: string) {
    return apiClient.post<{
      url: string;
      title?: string;
      description?: string;
      summary?: string;
      content_length: number;
    }>(`/api/bookmarks/analyze-url?url=${encodeURIComponent(url)}&use_ml=true`);
  },

  async getSimilarBookmarks(url: string, title?: string, description?: string, userId?: number) {
    const data: any = { url };
    if (title) data.title = title;
    if (description) data.description = description;
    if (userId) data.user_id = userId;
    
    return apiClient.post<{
      recommendations: Array<{
        id: number;
        title: string;
        url: string;
        description?: string;
        summary?: string;
        similarity_score: number;
        similarity_reasons: string[];
        tags: Array<{ name: string; color: string }>;
        created_at?: string;
      }>;
    }>('/api/bookmarks/recommend-similar', data);
  },
};