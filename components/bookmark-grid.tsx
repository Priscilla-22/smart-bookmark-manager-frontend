"use client"

import { useMemo } from "react"
import { Loader2 } from "lucide-react"
import { BookmarkCard } from "./bookmark-card"
import { BookmarkTable } from "./bookmark-table"
import { useBookmarks } from "@/hooks/useBookmarks"
import { useBookmarkContext } from "@/contexts/BookmarkContext"

interface BookmarkGridProps {
  viewMode: "grid" | "table"
}

export function BookmarkGrid({ viewMode }: BookmarkGridProps) {
  const { selectedUser, selectedTags, searchTerm } = useBookmarkContext()
  
  const filters = useMemo(() => ({
    user_id: selectedUser?.id,
    search: searchTerm || undefined,
  }), [selectedUser, searchTerm])
  
  const { bookmarks, loading, error } = useBookmarks(filters)
  
  const filteredBookmarks = useMemo(() => {
    if (selectedTags.length === 0) return bookmarks
    
    return bookmarks.filter(bookmark =>
      bookmark.tags.some(tag =>
        selectedTags.some(selectedTag => selectedTag.id === tag.id)
      )
    )
  }, [bookmarks, selectedTags])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center p-4">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Error loading bookmarks</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (filteredBookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center p-4">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No bookmarks found</h3>
        <p className="text-muted-foreground">
          {selectedTags.length > 0 || searchTerm 
            ? "No bookmarks match your current filters" 
            : "Start adding bookmarks to get organized"}
        </p>
      </div>
    )
  }

  return viewMode === "grid" ? (
    <div className="p-4 md:p-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </div>
  ) : (
    <BookmarkTable bookmarks={filteredBookmarks} />
  )
}
