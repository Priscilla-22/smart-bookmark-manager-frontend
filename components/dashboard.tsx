"use client"

import { useState, useRef } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { BookmarkGrid } from "./bookmark-grid"
import { AddBookmarkModal } from "./modals/add-bookmark-modal"
import { BookmarkProvider, useBookmarkContext } from "@/contexts/BookmarkContext"
import { ErrorBoundary } from "./error-boundary"

function DashboardContent() {
  const [showAddModal, setShowAddModal] = useState(false)
  const { viewMode, setViewMode, triggerRefresh } = useBookmarkContext()
  
  const handleBookmarkCreated = () => {
    triggerRefresh()
  }

  return (
    <div className="flex h-screen flex-col bg-background lg:flex-row">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          onAddBookmark={() => setShowAddModal(true)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="flex-1 overflow-auto">
          <BookmarkGrid viewMode={viewMode} />
        </div>
      </main>

      {showAddModal && (
        <AddBookmarkModal 
          onClose={() => setShowAddModal(false)}
          onBookmarkCreated={handleBookmarkCreated}
        />
      )}
    </div>
  )
}

export function Dashboard() {
  return (
    <ErrorBoundary>
      <BookmarkProvider>
        <DashboardContent />
      </BookmarkProvider>
    </ErrorBoundary>
  )
}
