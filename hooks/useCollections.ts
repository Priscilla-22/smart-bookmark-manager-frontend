
'use client';

import { useState, useEffect } from 'react';
import { Collection, CollectionCreate } from '@/types';
import { API_BASE_URL } from '@/lib/api';

export function useCollections(userId?: number) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const url = userId 
        ? `${API_BASE_URL}/collections/?user_id=${userId}`
        : `${API_BASE_URL}/collections/`;
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch collections: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCollections(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collections');
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async (collectionData: CollectionCreate): Promise<Collection | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create collection');
      }

      const newCollection = await response.json();
      await fetchCollections();
      return newCollection;
    } catch (err) {
      console.error('Error creating collection:', err);
      return null;
    }
  };

  const updateCollection = async (collectionId: number, collectionData: CollectionCreate): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/${collectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update collection');
      }

      await fetchCollections();
      return true;
    } catch (err) {
      console.error('Error updating collection:', err);
      return false;
    }
  };

  const deleteCollection = async (collectionId: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/${collectionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete collection');
      }

      await fetchCollections();
      return true;
    } catch (err) {
      console.error('Error deleting collection:', err);
      return false;
    }
  };

  const refetch = () => {
    fetchCollections();
  };

  useEffect(() => {
    fetchCollections();
  }, [userId]);

  return {
    collections,
    loading,
    error,
    createCollection,
    updateCollection,
    deleteCollection,
    refetch,
  };
}