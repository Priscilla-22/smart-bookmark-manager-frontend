/**
 * API configuration and constants
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const API_BASE_URL = `${API_BASE}/api`;

// API endpoints
export const API_ENDPOINTS = {
  users: `${API_BASE_URL}/users`,
  collections: `${API_BASE_URL}/collections`,
  bookmarks: `${API_BASE_URL}/bookmarks`,
  tags: `${API_BASE_URL}/tags`,
} as const;