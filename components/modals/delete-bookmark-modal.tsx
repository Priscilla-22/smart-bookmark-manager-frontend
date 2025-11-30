"use client"

import { X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Bookmark } from "@/types"

interface DeleteBookmarkModalProps {
  bookmark: Bookmark
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}

export function DeleteBookmarkModal({ bookmark, onClose, onConfirm, isDeleting }: DeleteBookmarkModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-md w-full">
        <div className="border-b border-border flex items-center justify-between p-6">
          <h2 className="text-lg font-semibold text-foreground">Delete Bookmark</h2>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors"
            disabled={isDeleting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Are you sure you want to delete this bookmark?
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Title:</strong> {bookmark.title}</p>
                <p><strong>URL:</strong> {bookmark.url}</p>
                {bookmark.description && (
                  <p><strong>Description:</strong> {bookmark.description}</p>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border p-6 flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Bookmark"}
          </Button>
        </div>
      </div>
    </div>
  )
}