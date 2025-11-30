/**
 * TypeScript interfaces for data models
 */

export interface User {
  id: number;
  username: string;
  email: string;
  gender?: 'male' | 'female';
  created_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  gender?: 'male' | 'female';
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface TagCreate {
  name: string;
  color?: string;
}

export interface Collection {
  id: number;
  name: string;
  description?: string;
  color?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CollectionCreate {
  name: string;
  description?: string;
  color?: string;
  user_id: number;
}

export interface Bookmark {
  id: number;
  url: string;
  title: string;
  description?: string;
  summary?: string;
  user_id: number;
  collection_id?: number;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

export interface BookmarkCreate {
  url: string;
  title: string;
  description?: string;
  summary?: string;
  user_id: number;
  collection_id?: number;
  tag_ids?: number[];
}

export interface BookmarkUpdate {
  url?: string;
  title?: string;
  description?: string;
  summary?: string;
  collection_id?: number;
  tag_ids?: number[];
}

export interface BookmarkFilters {
  user_id?: number;
  collection_id?: number | null;
  search?: string;
  skip?: number;
  limit?: number;
}

export interface ApiError {
  detail: string;
}