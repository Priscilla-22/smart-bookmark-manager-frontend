"use client"

import { BookmarkCard } from "./bookmark-card"
import { BookmarkTable } from "./bookmark-table"

const MOCK_BOOKMARKS = [
  {
    id: "1",
    title: "React Documentation",
    url: "https://react.dev",
    description: "Official React documentation and guides",
    tags: ["Learning", "Development"],
    favicon: "⚛️",
  },
  {
    id: "2",
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/",
    description: "Comprehensive TypeScript documentation",
    tags: ["Development", "Learning"],
    favicon: "📘",
  },
  {
    id: "3",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    description: "Utility-first CSS framework",
    tags: ["Design", "Development"],
    favicon: "🎨",
  },
  {
    id: "4",
    title: "GitHub",
    url: "https://github.com",
    description: "Where the world builds software",
    tags: ["Work", "Development"],
    favicon: "🐙",
  },
  {
    id: "5",
    title: "CSS-Tricks",
    url: "https://css-tricks.com",
    description: "Daily articles about CSS and web design",
    tags: ["Articles", "Design"],
    favicon: "🎯",
  },
  {
    id: "6",
    title: "Dev.to",
    url: "https://dev.to",
    description: "Community for developers",
    tags: ["Articles", "Learning"],
    favicon: "💻",
  },
]

interface BookmarkGridProps {
  selectedTag: string | null
  viewMode: "grid" | "table"
}

export function BookmarkGrid({ selectedTag, viewMode }: BookmarkGridProps) {
  const filteredBookmarks = selectedTag
    ? MOCK_BOOKMARKS.filter((bookmark) => bookmark.tags.includes(selectedTag))
    : MOCK_BOOKMARKS

  if (filteredBookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center p-4">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No bookmarks found</h3>
        <p className="text-muted-foreground">
          {selectedTag ? `No bookmarks with the "${selectedTag}" tag` : "Start adding bookmarks to get organized"}
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
