"use client"

import { ChevronDown, Users, Tag, Folder, Loader2, Settings, Home, BookmarkIcon, FolderOpen, ExternalLink } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTags } from "@/hooks/useTags"
import { useCollections } from "@/hooks/useCollections"
import { useBookmarks } from "@/hooks/useBookmarks"
import { useBookmarkContext } from "@/contexts/BookmarkContext"

export function Sidebar() {
  const { tags, loading: tagsLoading } = useTags()
  const { 
    selectedUser, 
    setSelectedUser, 
    selectedCollection, 
    setSelectedCollection, 
    selectedTags, 
    setSelectedTags,
    refreshTrigger
  } = useBookmarkContext()
  
  const { collections, loading: collectionsLoading, refetch: refetchCollections } = useCollections()
  const { bookmarks, loading: bookmarksLoading, refetch: refetchBookmarks } = useBookmarks({})

  useEffect(() => {
    if (refreshTrigger > 0) {
      refetchCollections()
      refetchBookmarks()
    }
  }, [refreshTrigger, refetchCollections, refetchBookmarks])
  const router = useRouter()
  const pathname = usePathname()
  
  const [expandedSections, setExpandedSections] = useState({
    dashboard: true,
    collections: true,
    tags: false,
  })

  const [expandedCollections, setExpandedCollections] = useState<{[key: number]: boolean}>({})

  const { collectionsWithBookmarks, uncategorizedBookmarks } = useMemo(() => {
    const collectionsWithBookmarks = collections
      .map(collection => ({
        ...collection,
        bookmarks: bookmarks.filter(bookmark => bookmark.collection_id === collection.id)
      }))
      .filter(collection => collection.bookmarks.length > 0)
    
    const uncategorizedBookmarks = bookmarks.filter(bookmark => bookmark.collection_id === null)
    
    return { collectionsWithBookmarks, uncategorizedBookmarks }
  }, [collections, bookmarks])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleCollection = (collectionId: number) => {
    setExpandedCollections((prev) => ({
      ...prev,
      [collectionId]: !prev[collectionId],
    }))
  }

  return (
    <aside className="w-full border-b border-border bg-card lg:border-b-0 lg:border-r lg:w-64 lg:overflow-y-auto">
      <nav className="flex flex-col">
        <div className="p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
              <Folder className="h-5 w-5 text-accent-foreground" />
            </div>
            <h1 className="font-bold text-lg text-foreground hidden lg:block">Bookmarks</h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground mb-3">Navigation</p>
              
              <div>
                <button
                  onClick={() => toggleSection("dashboard")}
                  className={`flex items-center justify-between w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                    pathname === '/' && !selectedCollection
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.dashboard ? "" : "-rotate-90"}`} />
                </button>

                {expandedSections.dashboard && (
                  <div className="ml-6 mt-2 space-y-4">
                        <div>
                      <button
                        onClick={() => toggleSection("collections")}
                        className="flex w-full items-center justify-between text-sm font-medium text-foreground mb-2 hover:text-accent transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-3 w-3" />
                          Collections
                        </div>
                        <ChevronDown className={`h-3 w-3 transition-transform ${expandedSections.collections ? "" : "-rotate-90"}`} />
                      </button>

                      {expandedSections.collections && (
                        <div className="space-y-1 pl-4">
                          {collectionsLoading || bookmarksLoading ? (
                            <div className="flex items-center justify-center py-2">
                              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                            </div>
                          ) : (
                            collectionsWithBookmarks.map((collection) => (
                              <div key={collection.id} className="space-y-1">
                                <div
                                  className={`flex items-center justify-between w-full text-left text-sm px-2 py-1 rounded transition-colors ${
                                    selectedCollection?.id === collection.id
                                      ? "bg-accent text-accent-foreground"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                  }`}
                                >
                                  <div 
                                    className="flex items-center gap-2 flex-1 cursor-pointer"
                                    onClick={() => {
                                      setSelectedCollection(collection);
                                      router.push('/');
                                    }}
                                  >
                                    <div 
                                      className="w-2 h-2 rounded-full border"
                                      style={{ backgroundColor: collection.color }}
                                    />
                                    {collection.name} ({collection.bookmarks.length})
                                  </div>
                                  <div
                                    onClick={() => toggleCollection(collection.id)}
                                    className="p-1 hover:bg-accent/50 rounded cursor-pointer"
                                  >
                                    <ChevronDown className={`h-3 w-3 transition-transform ${expandedCollections[collection.id] ? "" : "-rotate-90"}`} />
                                  </div>
                                </div>
                                
                                {expandedCollections[collection.id] && (
                                  <div className="space-y-1 pl-4">
                                    {collection.bookmarks.map((bookmark) => (
                                      <button
                                        key={bookmark.id}
                                        onClick={() => window.open(bookmark.url, '_blank')}
                                        className="flex items-center gap-2 w-full text-left text-xs px-2 py-1 rounded transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                                        title={bookmark.description || bookmark.title}
                                      >
                                        <ExternalLink className="h-2 w-2 flex-shrink-0" />
                                        <span className="truncate">{bookmark.title}</span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          setSelectedCollection({ id: -1 } as any);
                          router.push('/');
                        }}
                        className={`flex w-full items-center gap-2 text-sm font-medium mb-2 px-2 py-1 rounded transition-colors ${
                          selectedCollection?.id === -1
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground hover:text-accent hover:bg-muted"
                        }`}
                      >
                        <BookmarkIcon className="h-3 w-3" />
                        Other Bookmarks ({uncategorizedBookmarks.length})
                      </button>
                    </div>

                  </div>
                )}
              </div>
              
              <button
                onClick={() => router.push('/tags')}
                className={`flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                  pathname === '/tags'
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Tag className="h-4 w-4" />
                Tag Management
              </button>
              
              <button
                onClick={() => router.push('/users')}
                className={`flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                  pathname === '/users'
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Settings className="h-4 w-4" />
                User Management
              </button>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  )
}
