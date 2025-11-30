/**
 * Collection Selector Component for choosing/creating collections
 */

'use client';

import { useState } from 'react';
import { Plus, Folder, ChevronDown } from 'lucide-react';
import { Button } from './button';
import { Label } from './label';
import { Input } from './input';
import { Collection } from '@/types';

interface CollectionSelectorProps {
  collections: Collection[];
  selectedCollectionId?: number | null;
  onCollectionSelect: (collectionId: number | null) => void;
  onCreateCollection?: (name: string, description?: string, color?: string) => Promise<void>;
  userId: number;
  disabled?: boolean;
}

export function CollectionSelector({
  collections,
  selectedCollectionId,
  onCollectionSelect,
  onCreateCollection,
  userId,
  disabled = false
}: CollectionSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });
  const [isCreating, setIsCreating] = useState(false);

  const selectedCollection = collections.find(c => c.id === selectedCollectionId);

  const handleCreateCollection = async () => {
    if (!newCollection.name.trim() || !onCreateCollection) return;
    
    setIsCreating(true);
    try {
      await onCreateCollection(
        newCollection.name.trim(),
        newCollection.description.trim() || undefined,
        newCollection.color
      );
      setNewCollection({ name: '', description: '', color: '#3B82F6' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating collection:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const predefinedColors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Orange
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ];

  return (
    <div className="space-y-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={disabled}
          className="w-full flex items-center justify-between px-3 py-2 border border-input rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-2">
            {selectedCollection ? (
              <>
                <div 
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: selectedCollection.color }}
                />
                <span className="font-medium">{selectedCollection.name}</span>
              </>
            ) : (
              <>
                <Folder className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Select collection (optional)</span>
              </>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {/* No Collection Option */}
            <button
              type="button"
              onClick={() => {
                onCollectionSelect(null);
                setIsExpanded(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent hover:text-accent-foreground text-left"
            >
              <div className="w-3 h-3 rounded-full border border-dashed border-muted-foreground" />
              <span className="text-muted-foreground">No collection</span>
            </button>

            {/* Existing Collections */}
            {collections.map((collection) => (
              <button
                key={collection.id}
                type="button"
                onClick={() => {
                  onCollectionSelect(collection.id);
                  setIsExpanded(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-accent hover:text-accent-foreground text-left ${
                  collection.id === selectedCollectionId ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <div 
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: collection.color }}
                />
                <div className="flex-1">
                  <div className="font-medium">{collection.name}</div>
                  {collection.description && (
                    <div className="text-xs text-muted-foreground">{collection.description}</div>
                  )}
                </div>
              </button>
            ))}

            {/* Create New Collection */}
            {onCreateCollection && (
              <div className="border-t border-border">
                {!showCreateForm ? (
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent hover:text-accent-foreground text-left"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create new collection</span>
                  </button>
                ) : (
                  <div className="p-3 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="collection-name">Collection name *</Label>
                      <Input
                        id="collection-name"
                        placeholder="My Collection"
                        value={newCollection.name}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                        disabled={isCreating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="collection-description">Description</Label>
                      <Input
                        id="collection-description"
                        placeholder="Optional description"
                        value={newCollection.description}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                        disabled={isCreating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Color</Label>
                      <div className="flex gap-1">
                        {predefinedColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setNewCollection(prev => ({ ...prev, color }))}
                            className={`w-6 h-6 rounded-full border-2 ${
                              newCollection.color === color ? 'border-foreground' : 'border-muted'
                            }`}
                            style={{ backgroundColor: color }}
                            disabled={isCreating}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowCreateForm(false);
                          setNewCollection({ name: '', description: '', color: '#3B82F6' });
                        }}
                        disabled={isCreating}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleCreateCollection}
                        disabled={isCreating || !newCollection.name.trim()}
                      >
                        {isCreating ? 'Creating...' : 'Create'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <Label 
        htmlFor="collection-selector" 
        className="absolute left-3 -top-2.5 bg-background px-1 text-sm font-medium text-muted-foreground"
      >
        Collection
      </Label>
    </div>
  );
}