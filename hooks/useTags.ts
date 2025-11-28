/**
 * React hooks for tag operations
 */

import { useState, useEffect, useCallback } from 'react';
import { tagService } from '@/services/tagService';
import { Tag, TagCreate } from '@/types';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await tagService.getTags();
    
    if (response.error) {
      setError(response.error);
    } else {
      setTags(response.data || []);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const createTag = useCallback(async (tagData: TagCreate) => {
    setError(null);
    const response = await tagService.createTag(tagData);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchTags();
    return true;
  }, [fetchTags]);

  const updateTag = useCallback(async (id: number, tagData: TagCreate) => {
    setError(null);
    const response = await tagService.updateTag(id, tagData);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchTags();
    return true;
  }, [fetchTags]);

  const deleteTag = useCallback(async (id: number) => {
    setError(null);
    const response = await tagService.deleteTag(id);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchTags();
    return true;
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    createTag,
    updateTag,
    deleteTag,
    refetch: fetchTags,
  };
}