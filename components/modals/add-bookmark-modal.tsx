"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CollectionSelector } from "@/components/ui/collection-selector"
import { useBookmarks } from "@/hooks/useBookmarks"
import { useTags } from "@/hooks/useTags"
import { useUsers } from "@/hooks/useUsers"
import { useCollections } from "@/hooks/useCollections"
import { useToast } from "@/hooks/use-toast"
import { bookmarkService } from "@/services/bookmarkService"
import { Tag } from "@/types"

interface AddBookmarkModalProps {
  onClose: () => void
  onBookmarkCreated?: () => void
}

export function AddBookmarkModal({ onClose, onBookmarkCreated }: AddBookmarkModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    user_id: "",
  })
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [analyzingUrl, setAnalyzingUrl] = useState(false)
  const [extractedSummary, setExtractedSummary] = useState<string>("")
  const [newTagName, setNewTagName] = useState<string>("")
  const [isCreatingTag, setIsCreatingTag] = useState(false)
  const [similarBookmarks, setSimilarBookmarks] = useState<any[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  
  const { createBookmark } = useBookmarks()
  const { tags, createTag } = useTags()
  const { users } = useUsers()
  const { collections, createCollection } = useCollections(
    formData.user_id ? parseInt(formData.user_id) : undefined
  )
  const { toast } = useToast()

  useEffect(() => {
    if (users.length > 0) {
      setFormData(prev => ({ ...prev, user_id: users[0].id.toString() }))
    }
  }, [users])

  const analyzeUrl = async () => {
    if (!formData.url) return

    setAnalyzingUrl(true)
    try {
      const response = await bookmarkService.analyzeUrl(formData.url)
      
      if (response.data) {
        const { title, description, summary } = response.data
        
        setFormData(prev => ({
          ...prev,
          title: title && !prev.title ? title : prev.title,
          description: description && !prev.description ? description : prev.description
        }))
        
        if (summary) {
          setExtractedSummary(summary)
        }
        
        await fetchSuggestions()
        await fetchSimilarBookmarks()
      }
    } catch (error) {
      console.error('Error analyzing URL:', error)
    } finally {
      setAnalyzingUrl(false)
    }
  }

  const fetchSuggestions = async () => {
    if (!formData.url) {
      setSuggestedTags([])
      return
    }

    setLoadingSuggestions(true)
    try {
      const existingTagNames = selectedTags.map(tag => tag.name)
      const response = await bookmarkService.suggestTags(
        formData.url,
        formData.title || undefined,
        formData.description || undefined,
        existingTagNames
      )
      
      if (response.data) {
        setSuggestedTags(response.data.suggestions)
      }
    } catch (error) {
      console.error('Error fetching tag suggestions:', error)
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const fetchSimilarBookmarks = async () => {
    if (!formData.url || !formData.user_id) {
      setSimilarBookmarks([])
      return
    }

    setLoadingRecommendations(true)
    try {
      const response = await bookmarkService.getSimilarBookmarks(
        formData.url,
        formData.title || undefined,
        formData.description || undefined,
        parseInt(formData.user_id)
      )
      
      if (response.data) {
        setSimilarBookmarks(response.data.recommendations)
      }
    } catch (error) {
      console.error('Error fetching similar bookmarks:', error)
    } finally {
      setLoadingRecommendations(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.url) {
        analyzeUrl()
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [formData.url])

  const getRandomTagColor = (): string => {
    const colors = [
      '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
      '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
      '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', 
      '#ec4899', '#f43f5e'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleCreateCustomTag = async () => {
    if (!newTagName.trim()) return
    
    const existingTag = tags.find(tag => tag.name.toLowerCase() === newTagName.trim().toLowerCase())
    if (existingTag) {
      if (!selectedTags.some(t => t.id === existingTag.id)) {
        setSelectedTags(prev => [...prev, existingTag])
      }
      setNewTagName("")
      return
    }
    
    setIsCreatingTag(true)
    const newTag = await createTag({
      name: newTagName.trim(),
      color: getRandomTagColor()
    })
    
    if (newTag) {
      setSelectedTags(prev => [...prev, newTag])
      setNewTagName("")
      toast({
        title: "Tag created",
        description: `"${newTagName.trim()}" tag has been created and added.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to create tag. Please try again.",
        variant: "destructive",
      })
    }
    setIsCreatingTag(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const success = await createBookmark({
      title: formData.title,
      url: formData.url,
      description: formData.description || undefined,
      summary: extractedSummary || undefined,
      user_id: parseInt(formData.user_id),
      collection_id: selectedCollectionId,
      tag_ids: selectedTags.map(tag => tag.id),
    })

    if (success) {
      toast({
        title: "Bookmark created",
        description: `"${formData.title}" has been added to your bookmarks.`,
      })
      
      if (onBookmarkCreated) {
        onBookmarkCreated()
      }
      
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

  const addSuggestedTag = async (suggestedTagName: string) => {
    const existingTag = tags.find(tag => tag.name.toLowerCase() === suggestedTagName.toLowerCase())
    if (existingTag && !selectedTags.some(t => t.id === existingTag.id)) {
      setSelectedTags(prev => [...prev, existingTag])
      setSuggestedTags(prev => prev.filter(t => t !== suggestedTagName))
    } else if (!existingTag) {
      setIsCreatingTag(true)
      const newTag = await createTag({
        name: suggestedTagName,
        color: getRandomTagColor()
      })
      
      if (newTag) {
        setSelectedTags(prev => [...prev, newTag])
        setSuggestedTags(prev => prev.filter(t => t !== suggestedTagName))
        toast({
          title: "Tag created",
          description: `"${suggestedTagName}" tag has been created and added.`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to create tag. Please try again.",
          variant: "destructive",
        })
      }
      setIsCreatingTag(false)
    }
  }

  const handleCreateCollection = async (name: string, description?: string, color?: string) => {
    if (!formData.user_id) return;
    
    const newCollection = await createCollection({
      name,
      description,
      color,
      user_id: parseInt(formData.user_id)
    });

    if (newCollection) {
      toast({
        title: "Collection created",
        description: `"${name}" has been created successfully.`,
      });
      
      setSelectedCollectionId(newCollection.id);
    } else {
      toast({
        title: "Error",
        description: "Failed to create collection. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between p-6">
          <h2 className="text-xl font-bold text-foreground">Add Bookmark</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="relative bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/50 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-orange-900">Quick Start:</span>
              <span className="text-orange-800">Enter the URL first and we'll auto-fill the title, description, and suggest relevant tags</span>
            </div>
          </div>
          
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">User Selection</h3>
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
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Basic Information</h3>
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
            <div className="relative">
              <Input
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
                className="w-full pr-20"
              />
              {formData.url && (
                <button
                  type="button"
                  onClick={analyzeUrl}
                  disabled={analyzingUrl}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
                >
                  {analyzingUrl ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Analyze"
                  )}
                </button>
              )}
            </div>
            {analyzingUrl && (
              <p className="text-xs text-muted-foreground mt-1">🔍 Analyzing page content...</p>
            )}
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
          </div>

          {(similarBookmarks.length > 0 || loadingRecommendations) && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">AI Recommendations</h3>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">
                  {loadingRecommendations ? "🔍 Finding similar bookmarks..." : "📚 Similar bookmarks you already have:"}
                </span>
                {loadingRecommendations && <Loader2 className="h-3 w-3 animate-spin" />}
              </div>
              {similarBookmarks.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {similarBookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {bookmark.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {bookmark.summary || bookmark.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-orange-600 font-medium">
                              {Math.round(bookmark.similarity_score * 100)}% similar
                            </span>
                            {bookmark.similarity_reasons.length > 0 && (
                              <span className="text-xs text-gray-500">
                                • {bookmark.similarity_reasons[0]}
                              </span>
                            )}
                          </div>
                          {bookmark.tags && bookmark.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {bookmark.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-gray-100"
                                >
                                  <div 
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: tag.color }}
                                  />
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline flex-shrink-0"
                        >
                          View →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
          )}

          {formData.user_id && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Organization</h3>
            <div className="relative">
              <CollectionSelector
                collections={collections.filter(c => c.user_id === parseInt(formData.user_id))}
                selectedCollectionId={selectedCollectionId}
                onCollectionSelect={setSelectedCollectionId}
                onCreateCollection={handleCreateCollection}
                userId={parseInt(formData.user_id)}
                disabled={isSubmitting}
              />
            </div>
            </div>
          )}

          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Tags & Categories</h3>
            <div>
            <label className="block text-sm font-medium text-foreground mb-3">Tags</label>
            
            {(suggestedTags.length > 0 || loadingSuggestions) && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">
                    {loadingSuggestions ? "🔍 Analyzing content for smart suggestions..." : "✨ AI suggested tags:"}
                  </span>
                  {loadingSuggestions && <Loader2 className="h-3 w-3 animate-spin" />}
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((suggestion) => {
                    const existingTag = tags.find(tag => tag.name.toLowerCase() === suggestion.toLowerCase())
                    return (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => addSuggestedTag(suggestion)}
                        className={`px-3 py-1 text-xs border rounded-full hover:opacity-80 transition-all duration-200 ${
                          existingTag
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                            : "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200"
                        }`}
                        disabled={isCreatingTag}
                      >
                        {existingTag ? "+" : "✨"} {suggestion}
                        {!existingTag && <span className="ml-1 text-xs opacity-60">(new)</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">Create custom tag:</span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter tag name..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCreateCustomTag()
                    }
                  }}
                  className="flex-1"
                  disabled={isCreatingTag}
                />
                <Button
                  type="button"
                  onClick={handleCreateCustomTag}
                  disabled={!newTagName.trim() || isCreatingTag}
                  className="px-4"
                >
                  {isCreatingTag ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
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
          </div>

          <div className="flex gap-3 pt-6 border-t border-border">
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
