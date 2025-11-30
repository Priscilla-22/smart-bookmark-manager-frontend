"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Tag as TagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal"
import { useTags } from "@/hooks/useTags"
import { tagService } from "@/services/tagService"
import { useToast } from "@/hooks/use-toast"
import { Tag } from "@/types"
import { BookmarkProvider } from "@/contexts/BookmarkContext"

function TagsPageContent() {
  const { tags, loading, createTag, updateTag, deleteTag } = useTags()
  const { toast } = useToast()
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null)
  const [formData, setFormData] = useState({ name: "", color: "#3B82F6" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const colors = [
    "#EF4444", "#F97316", "#F59E0B", "#EAB308", 
    "#84CC16", "#22C55E", "#10B981", "#06B6D4",
    "#0EA5E9", "#3B82F6", "#6366F1", "#8B5CF6",
    "#A855F7", "#D946EF", "#EC4899", "#F43F5E"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    
    setIsSubmitting(true)
    
    let success = false
    if (editingTag) {
      success = await updateTag(editingTag.id, formData)
      if (success) {
        toast({
          title: "Tag updated",
          description: `"${formData.name}" has been updated successfully.`,
        })
      }
    } else {
      success = await createTag(formData)
      if (success) {
        toast({
          title: "Tag created",
          description: `"${formData.name}" has been created successfully.`,
        })
      }
    }
    
    if (!success) {
      toast({
        title: "Error",
        description: "Failed to save tag. Please try again.",
        variant: "destructive",
      })
    }
    
    if (success) {
      setFormData({ name: "", color: "#3B82F6" })
      setShowCreateForm(false)
      setEditingTag(null)
    }
    
    setIsSubmitting(false)
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setFormData({ name: tag.name, color: tag.color })
    setShowCreateForm(true)
  }

  const handleDeleteClick = (tag: Tag) => {
    setTagToDelete(tag)
  }

  const handleDeleteConfirm = async () => {
    if (!tagToDelete) return
    
    setIsDeleting(true)
    const success = await deleteTag(tagToDelete.id)
    
    if (success) {
      toast({
        title: "Tag deleted",
        description: `"${tagToDelete.name}" has been removed.`,
      })
      setTagToDelete(null)
    } else {
      toast({
        title: "Cannot delete tag",
        description: `Tag "${tagToDelete.name}" is currently being used by bookmarks. Remove it from all bookmarks first.`,
        variant: "destructive",
      })
    }
    
    setIsDeleting(false)
  }

  const handleDeleteCancel = () => {
    setTagToDelete(null)
  }

  const cancelEdit = () => {
    setEditingTag(null)
    setShowCreateForm(false)
    setFormData({ name: "", color: "#3B82F6" })
  }

  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tag Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage tags for organizing your bookmarks</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="gap-2"
          disabled={loading}
        >
          <Plus className="h-4 w-4" />
          Add Tag
        </Button>
      </div>

      {showCreateForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingTag ? "Edit Tag" : "Create New Tag"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tag Name *
              </label>
              <Input
                type="text"
                placeholder="e.g., Development, Design, Reading"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Color
              </label>
              <div className="flex items-center gap-4">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-border"
                  style={{ backgroundColor: formData.color }}
                />
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                        formData.color === color ? "border-foreground" : "border-border"
                      }`}
                      style={{ backgroundColor: color }}
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
              >
                {isSubmitting ? "Saving..." : editingTag ? "Update Tag" : "Create Tag"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TagIcon className="h-5 w-5" />
            All Tags ({tags.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            <p className="mt-4 text-muted-foreground">Loading tags...</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="p-8 text-center">
            <TagIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No tags yet</h3>
            <p className="text-muted-foreground mb-4">Start by creating your first tag to organize bookmarks</p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create First Tag
            </Button>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid gap-3">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="font-medium text-foreground">{tag.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(tag)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(tag)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {tagToDelete && (
        <DeleteConfirmationModal
          title="Delete Tag"
          message="Are you sure you want to delete this tag?"
          itemName={tagToDelete.name}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
          warningMessage="This will remove the tag from all bookmarks."
        />
      )}
    </main>
  )
}

export default function TagsPage() {
  return (
    <BookmarkProvider>
      <div className="min-h-screen bg-background">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <TagsPageContent />
          </div>
        </div>
      </div>
    </BookmarkProvider>
  )
}