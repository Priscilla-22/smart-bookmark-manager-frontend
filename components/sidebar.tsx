"use client"

import { ChevronDown, Users, Tag, Folder, Loader2 } from "lucide-react"
import { useState } from "react"
import { useUsers } from "@/hooks/useUsers"
import { useTags } from "@/hooks/useTags"
import { useBookmarkContext } from "@/contexts/BookmarkContext"

export function Sidebar() {
  const { users, loading: usersLoading } = useUsers()
  const { tags, loading: tagsLoading } = useTags()
  const { selectedUser, setSelectedUser, selectedTags, setSelectedTags } = useBookmarkContext()
  const [expandedSections, setExpandedSections] = useState({
    users: true,
    tags: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
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
            <div>
              <button
                onClick={() => toggleSection("users")}
                className="flex w-full items-center justify-between text-sm font-semibold text-foreground mb-3 hover:text-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.users ? "" : "-rotate-90"}`} />
              </button>

              {expandedSections.users && (
                <div className="space-y-2 pl-6">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className={`block w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                      selectedUser === null
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    All Users
                  </button>
                  
                  {usersLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`block w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                          selectedUser?.id === user.id
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {user.username}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleSection("tags")}
                className="flex w-full items-center justify-between text-sm font-semibold text-foreground mb-3 hover:text-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.tags ? "" : "-rotate-90"}`} />
              </button>

              {expandedSections.tags && (
                <div className="space-y-2 pl-6">
                  {tagsLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    tags.map((tag) => {
                      const isSelected = selectedTags.some(t => t.id === tag.id);
                      return (
                        <button
                          key={tag.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
                            } else {
                              setSelectedTags([...selectedTags, tag]);
                            }
                          }}
                          className={`flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                            isSelected
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <div 
                            className="w-3 h-3 rounded-full border-2"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </aside>
  )
}
