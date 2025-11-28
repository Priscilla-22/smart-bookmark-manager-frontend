"use client"

import { Trash2, ExternalLink, Tag, Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useBookmarks } from "@/hooks/useBookmarks"
import { Bookmark } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface BookmarkCardProps {
  bookmark: Bookmark
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { deleteBookmark } = useBookmarks()
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsLoading(true)
    const success = await deleteBookmark(bookmark.id)
    
    if (success) {
      toast({
        title: "Bookmark deleted",
        description: `"${bookmark.title}" has been removed.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete bookmark. Please try again.",
        variant: "destructive",
      })
    }
    
    setIsLoading(false)
    setIsDeleting(false)
  }

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    } catch {
      return null
    }
  }

  return (
    <div className="group rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md hover:border-accent">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-muted">
          {getFaviconUrl(bookmark.url) ? (
            <img 
              src={getFaviconUrl(bookmark.url)!} 
              alt="" 
              className="w-4 h-4"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <Button
          onClick={() => setIsDeleting(true)}
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <h3 className="font-semibold text-foreground mb-1 line-clamp-2 pr-2">{bookmark.title}</h3>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
        {new URL(bookmark.url).hostname}
      </p>

      {bookmark.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{bookmark.description}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {bookmark.tags.slice(0, 2).map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
            style={{ 
              backgroundColor: tag.color + '20', 
              color: tag.color,
              border: `1px solid ${tag.color}40`
            }}
          >
            <Tag className="h-3 w-3" />
            {tag.name}
          </span>
        ))}
        {bookmark.tags.length > 2 && (
          <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs text-muted-foreground">
            +{bookmark.tags.length - 2}
          </span>
        )}
      </div>

      <Button asChild className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4" />
          Visit
        </a>
      </Button>

      {isDeleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-sm w-full border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">Delete bookmark?</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete "{bookmark.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsDeleting(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
