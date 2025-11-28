"use client"

import { useState } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { BookmarkGrid } from "./bookmark-grid"
import { AddBookmarkModal } from "./modals/add-bookmark-modal"

export function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeUser, setActiveUser] = useState<string | null>("user-1")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  return (
    <div className="flex h-screen flex-col bg-background lg:flex-row">
      <Sidebar
        activeUser={activeUser}
        onUserChange={setActiveUser}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          onAddBookmark={() => setShowAddModal(true)}
          activeUser={activeUser}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="flex-1 overflow-auto">
          <BookmarkGrid selectedTag={selectedTag} viewMode={viewMode} />
        </div>
      </main>

      {showAddModal && <AddBookmarkModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
