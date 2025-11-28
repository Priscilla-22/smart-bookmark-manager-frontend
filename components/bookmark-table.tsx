"use client"

import { ExternalLink, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Bookmark {
  id: string
  title: string
  url: string
  description: string
  tags: string[]
  favicon: string
}

interface BookmarkTableProps {
  bookmarks: Bookmark[]
}

export function BookmarkTable({ bookmarks }: BookmarkTableProps) {
  return (
    <div className="p-4 md:p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">URL</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Tags</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookmarks.map((bookmark) => (
              <tr key={bookmark.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{bookmark.favicon}</span>
                    <div>
                      <p className="font-medium text-foreground">{bookmark.title}</p>
                      <p className="text-xs text-muted-foreground">{bookmark.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline flex items-center gap-1 truncate"
                  >
                    <span className="truncate">{new URL(bookmark.url).hostname}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {bookmark.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <Button
                    variant="ghost"
                    size="icon"
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
    </div>
  )
}
