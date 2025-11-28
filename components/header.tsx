"use client"

import { Plus, Search, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  onAddBookmark: () => void
  activeUser: string | null
  viewMode: "grid" | "table"
  onViewModeChange: (mode: "grid" | "table") => void
}

export function Header({ onAddBookmark, activeUser, viewMode, onViewModeChange }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookmarks</h1>
          <p className="text-sm text-muted-foreground">Manage and organize your links</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="text" placeholder="Search bookmarks..." className="w-full pl-10 sm:w-64" />
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => onViewModeChange("grid")}
              className={viewMode === "grid" ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => onViewModeChange("table")}
              className={viewMode === "table" ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={onAddBookmark}
            className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Bookmark
          </Button>
        </div>
      </div>
    </header>
  )
}
