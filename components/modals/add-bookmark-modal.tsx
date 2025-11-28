"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBookmarks } from "@/hooks/useBookmarks"
import { useTags } from "@/hooks/useTags"
import { useUsers } from "@/hooks/useUsers"
import { useToast } from "@/hooks/use-toast"
import { Tag } from "@/types"

interface AddBookmarkModalProps {
  onClose: () => void
}

export function AddBookmarkModal({ onClose }: AddBookmarkModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    user_id: "",
  })
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { createBookmark } = useBookmarks()
  const { tags } = useTags()
  const { users } = useUsers()
  const { toast } = useToast()

  useEffect(() => {
    if (users.length > 0) {
      setFormData(prev => ({ ...prev, user_id: users[0].id.toString() }))
    }
  }, [users])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const success = await createBookmark({
      title: formData.title,
      url: formData.url,
      description: formData.description || undefined,
      user_id: parseInt(formData.user_id),
      tag_ids: selectedTags.map(tag => tag.id),
    })

    if (success) {
      toast({
        title: "Bookmark created",
        description: `"${formData.title}" has been added to your bookmarks.`,
      })
      onClose()
    } else {
      toast({
        title: "Error",
        description: "Failed to create bookmark. Please try again.",
        variant: "destructive",
      })
    }

    setIsSubmitting(false)
  }

  const toggleTag = (tag: Tag) => {
    setSelectedTags((prev) => 
      prev.some(t => t.id === tag.id) 
        ? prev.filter((t) => t.id !== tag.id) 
        : [...prev, tag]
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between p-6">
          <h2 className="text-xl font-bold text-foreground">Add Bookmark</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">User *</label>
            <Select value={formData.user_id} onValueChange={(value) => setFormData({ ...formData, user_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
            <Input
              type="text"
              placeholder="e.g., React Documentation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">URL *</label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              placeholder="Add a brief description of this bookmark..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Tags</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedTags.some(t => t.id === tag.id)
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isSubmitting || !formData.title || !formData.url || !formData.user_id}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Bookmark
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
