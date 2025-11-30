"use client"

import { X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeleteConfirmationModalProps {
  title: string
  message: string
  itemName: string
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
  warningMessage?: string
}

export function DeleteConfirmationModal({ 
  title, 
  message, 
  itemName, 
  onClose, 
  onConfirm, 
  isDeleting,
  warningMessage 
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-md w-full">
        <div className="border-b border-border flex items-center justify-between p-6">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
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
                {message}
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Name:</strong> {itemName}</p>
                {warningMessage && (
                  <p className="text-destructive font-medium mt-3">{warningMessage}</p>
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
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
}