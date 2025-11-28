/**
 * Context provider for bookmark management
 */

'use client';

import React, { createContext, useContext, useState } from 'react';
import { User, Tag, Bookmark } from '@/types';

interface BookmarkContextType {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  return (
    <BookmarkContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        searchTerm,
        setSearchTerm,
        selectedTags,
        setSelectedTags,
        viewMode,
        setViewMode,
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