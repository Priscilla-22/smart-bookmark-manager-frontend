/**
 * Context provider for bookmark management
 */

'use client';

import React, { createContext, useContext, useState } from 'react';
import { User, Tag, Collection } from '@/types';

interface BookmarkContextType {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  selectedCollection: Collection | null;
  setSelectedCollection: (collection: Collection | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <BookmarkContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        selectedCollection,
        setSelectedCollection,
        searchTerm,
        setSearchTerm,
        selectedTags,
        setSelectedTags,
        viewMode,
        setViewMode,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarkContext() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarkContext must be used within a BookmarkProvider');
  }
  return context;
}