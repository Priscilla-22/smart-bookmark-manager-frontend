"use client"

import { ChevronDown, Users, Tag, Folder } from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  activeUser: string | null
  onUserChange: (userId: string | null) => void
  selectedTag: string | null
  onTagChange: (tag: string | null) => void
}

const MOCK_USERS = [
  { id: "user-1", name: "John Doe" },
  { id: "user-2", name: "Jane Smith" },
  { id: "user-3", name: "Bob Johnson" },
]

const MOCK_TAGS = ["Work", "Personal", "Learning", "Design", "Development", "Articles"]

export function Sidebar({ activeUser, onUserChange, selectedTag, onTagChange }: SidebarProps) {
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
                    onClick={() => onUserChange(null)}
                    className={`block w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                      activeUser === null
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    All Users
                  </button>
                  {MOCK_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => onUserChange(user.id)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                        activeUser === user.id
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {user.name}
                    </button>
                  ))}
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
                  {MOCK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onTagChange(selectedTag === tag ? null : tag)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                        selectedTag === tag
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </aside>
  )
}
