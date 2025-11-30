"use client"

import { Plus, Search, LayoutGrid, List, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBookmarkContext } from "@/contexts/BookmarkContext"

interface HeaderProps {
  onAddBookmark?: () => void
  viewMode: "grid" | "table"
  onViewModeChange: (mode: "grid" | "table") => void
  isUsersPage?: boolean
}

export function Header({ onAddBookmark, viewMode, onViewModeChange, isUsersPage = false }: HeaderProps) {
  const { searchTerm, setSearchTerm, selectedUser, selectedCollection, selectedTags } = useBookmarkContext()
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchTerm(localSearchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [localSearchTerm, setSearchTerm])

  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  const clearSearch = () => {
    setLocalSearchTerm('')
    setSearchTerm('')
  }

  const getHeaderTitle = () => {
    if (isUsersPage) {
      return 'User Management'
    }
    if (selectedCollection) {
      if (selectedCollection.id === -1) {
        return 'Uncategorized Bookmarks'
      }
      return `${selectedCollection.name} Collection`
    }
    if (selectedUser) {
      return `${selectedUser.username}'s Bookmarks`
    }
    return 'All Bookmarks'
  }

  const getSubtitle = () => {
    if (isUsersPage) {
      return 'Manage users and their accounts'
    }
    
    const filters = []
    if (selectedCollection) {
      if (selectedCollection.id === -1) {
        filters.push('Bookmarks without a collection')
      } else {
        filters.push(`Collection: ${selectedCollection.name}`)
        if (selectedCollection.description) {
          filters.push(selectedCollection.description)
        }
      }
    }
    if (selectedUser) filters.push(`User: ${selectedUser.username}`)
    if (selectedTags.length > 0) filters.push(`Tags: ${selectedTags.map(t => t.name).join(', ')}`)
    if (searchTerm) filters.push(`Search: "${searchTerm}"`)
    
    return filters.length > 0 ? filters.join(' • ') : 'Manage and organize your links'
  }

  return (
    <header className="border-b border-border bg-card p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{getHeaderTitle()}</h1>
          <p className="text-sm text-muted-foreground">{getSubtitle()}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder={isUsersPage ? "Search users..." : "Search bookmarks..."} 
              className="w-full pl-10 pr-10 sm:w-64" 
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
            {localSearchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
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

          {!isUsersPage && onAddBookmark && (
            <Button
              onClick={onAddBookmark}
              className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Bookmark
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
