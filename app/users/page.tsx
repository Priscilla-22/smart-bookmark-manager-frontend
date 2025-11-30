/**
 * Users Management Page
 */

"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { UserManagement } from "@/components/users/user-management"
import { BookmarkProvider, useBookmarkContext } from "@/contexts/BookmarkContext"
import { ErrorBoundary } from "@/components/error-boundary"

function UsersPageContent() {
  const { viewMode, setViewMode } = useBookmarkContext()

  return (
    <div className="flex h-screen flex-col bg-background lg:flex-row">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          onAddBookmark={() => {}} // Not used on users page
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isUsersPage={true}
        />

        <div className="flex-1 overflow-auto p-6">
          <UserManagement />
        </div>
      </main>
    </div>
  )
}

export default function UsersPage() {
  return (
    <ErrorBoundary>
      <BookmarkProvider>
        <UsersPageContent />
      </BookmarkProvider>
    </ErrorBoundary>
  )
}