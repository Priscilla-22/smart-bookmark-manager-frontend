"use client"

import { useState } from "react"
import { ExternalLink, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteBookmarkModal } from "@/components/modals/delete-bookmark-modal"
import { useBookmarks } from "@/hooks/useBookmarks"
import { useToast } from "@/hooks/use-toast"
import { Bookmark } from "@/types"

interface BookmarkTableProps {
  bookmarks: Bookmark[]
  onRefresh?: () => void
}

export function BookmarkTable({ bookmarks, onRefresh }: BookmarkTableProps) {
  const [bookmarkToDelete, setBookmarkToDelete] = useState<Bookmark | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteBookmark } = useBookmarks()
  const { toast } = useToast()

  const handleDeleteClick = (bookmark: Bookmark) => {
    setBookmarkToDelete(bookmark)
  }

  const handleDeleteConfirm = async () => {
    if (!bookmarkToDelete) return
    
    setIsDeleting(true)
    const success = await deleteBookmark(bookmarkToDelete.id)
    
    if (success) {
      toast({
        title: "Bookmark deleted",
        description: `"${bookmarkToDelete.title}" has been removed.`,
      })
      setBookmarkToDelete(null)
    } else {
      toast({
        title: "Bookmark not found",
        description: "This bookmark may have already been deleted. The list will be refreshed.",
        variant: "destructive",
      })
      setBookmarkToDelete(null)
      // Refresh the list to show current data
      if (onRefresh) {
        onRefresh()
      }
    }
    
    setIsDeleting(false)
  }

  const handleDeleteCancel = () => {
    setBookmarkToDelete(null)
  }
  return (
    <div className="p-4 md:p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">URL</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Tags</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookmarks.map((bookmark, index) => (
              <tr key={bookmark.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 text-sm">
                  <span className="text-muted-foreground font-mono">{index + 1}</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{bookmark.title}</p>
                    <p className="text-xs text-muted-foreground">{bookmark.description}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline flex items-center gap-1 truncate group relative"
                    title={bookmark.summary || bookmark.description || bookmark.title}
                  >
                    <span className="truncate">{new URL(bookmark.url).hostname}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    
                    {(bookmark.summary || bookmark.description) && (
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 bg-gray-900 text-white text-sm rounded-lg p-3 shadow-lg max-w-xs whitespace-normal">
                        <div className="font-semibold mb-1">{bookmark.title}</div>
                        <div className="text-gray-300 text-xs">
                          {bookmark.summary || bookmark.description}
                        </div>
                        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {bookmark.tags.map((tag) => (
                      <span 
                        key={tag.id} 
                        className="px-2 py-1 text-xs bg-muted text-muted-foreground border"
                        style={{ backgroundColor: tag.color + '05', color: tag.color, borderColor: tag.color + '30' }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(bookmark)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {bookmarkToDelete && (
        <DeleteBookmarkModal
          bookmark={bookmarkToDelete}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}
