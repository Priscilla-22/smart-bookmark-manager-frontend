
import { useState, useEffect, useCallback, useRef } from 'react';
import { bookmarkService } from '@/services/bookmarkService';
import { Bookmark, BookmarkCreate, BookmarkUpdate, BookmarkFilters } from '@/types';

export function useBookmarks(initialFilters: BookmarkFilters = {}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanFilters = useCallback((filters: BookmarkFilters) => {
    const { _refresh, ...cleanedFilters } = filters;
    return cleanedFilters;
  }, []);

  const fetchBookmarks = useCallback(async (searchFilters: BookmarkFilters) => {
    setLoading(true);
    setError(null);
    
    const response = await bookmarkService.getBookmarks(cleanFilters(searchFilters));
    
    if (response.error) {
      setError(response.error);
    } else {
      setBookmarks(response.data || []);
    }
    
    setLoading(false);
  }, []);

  const prevFiltersRef = useRef<string>();
  
  useEffect(() => {
    const filtersKey = JSON.stringify(initialFilters);
    if (prevFiltersRef.current !== filtersKey) {
      prevFiltersRef.current = filtersKey;
      fetchBookmarks(initialFilters);
    }
  }, [fetchBookmarks, initialFilters]);

  const createBookmark = useCallback(async (bookmarkData: BookmarkCreate) => {
    setError(null);
    const response = await bookmarkService.createBookmark(bookmarkData);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchBookmarks(initialFilters);
    return true;
  }, [fetchBookmarks]);

  const updateBookmark = useCallback(async (id: number, bookmarkData: BookmarkUpdate) => {
    setError(null);
    const response = await bookmarkService.updateBookmark(id, bookmarkData);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchBookmarks(initialFilters);
    return true;
  }, [fetchBookmarks]);

  const deleteBookmark = useCallback(async (id: number) => {
    setError(null);
    const response = await bookmarkService.deleteBookmark(id);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchBookmarks(initialFilters);
    return true;
  }, [fetchBookmarks]);

  const search = useCallback((searchTerm: string) => {
    const newFilters = { ...initialFilters, search: searchTerm, skip: 0 };
    fetchBookmarks(newFilters);
  }, [initialFilters, fetchBookmarks]);

  return {
    bookmarks,
    loading,
    error,
    filters: initialFilters,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    search,
    refetch: () => fetchBookmarks(initialFilters),
  };
}