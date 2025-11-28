/**
 * React hooks for bookmark operations
 */

import { useState, useEffect, useCallback } from 'react';
import { bookmarkService } from '@/services/bookmarkService';
import { Bookmark, BookmarkCreate, BookmarkUpdate, BookmarkFilters } from '@/types';

export function useBookmarks(initialFilters: BookmarkFilters = {}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookmarkFilters>(initialFilters);

  const fetchBookmarks = useCallback(async (currentFilters?: BookmarkFilters) => {
    setLoading(true);
    setError(null);
    
    const searchFilters = currentFilters || filters;
    const response = await bookmarkService.getBookmarks(searchFilters);
    
    if (response.error) {
      setError(response.error);
    } else {
      setBookmarks(response.data || []);
    }
    
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const createBookmark = useCallback(async (bookmarkData: BookmarkCreate) => {
    setError(null);
    const response = await bookmarkService.createBookmark(bookmarkData);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchBookmarks();
    return true;
  }, [fetchBookmarks]);

  const updateBookmark = useCallback(async (id: number, bookmarkData: BookmarkUpdate) => {
    setError(null);
    const response = await bookmarkService.updateBookmark(id, bookmarkData);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchBookmarks();
    return true;
  }, [fetchBookmarks]);

  const deleteBookmark = useCallback(async (id: number) => {
    setError(null);
    const response = await bookmarkService.deleteBookmark(id);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchBookmarks();
    return true;
  }, [fetchBookmarks]);

  const updateFilters = useCallback((newFilters: BookmarkFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const search = useCallback((searchTerm: string) => {
    const newFilters = { ...filters, search: searchTerm, skip: 0 };
    setFilters(newFilters);
    fetchBookmarks(newFilters);
  }, [filters, fetchBookmarks]);

  return {
    bookmarks,
    loading,
    error,
    filters,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    updateFilters,
    search,
    refetch: fetchBookmarks,
  };
}