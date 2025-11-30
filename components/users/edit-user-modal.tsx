/**
 * Edit User Modal Component
 */

'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onUserUpdated: () => void;
}

export function EditUserModal({ user, onClose, onUserUpdated }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    gender: 'male' as 'male' | 'female',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { updateUser } = useUsers();
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      username: user.username,
      email: user.email,
      gender: user.gender || 'male',
    });
  }, [user]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = () => {
    return (
      formData.username.trim() !== user.username ||
      formData.email.trim() !== user.email ||
      formData.gender !== (user.gender || 'male')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!hasChanges()) {
      toast({
        title: "No changes",
        description: "No changes were made to the user.",
      });
      onClose();
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await updateUser(user.id, {
        username: formData.username.trim(),
        email: formData.email.trim(),
        gender: formData.gender,
      });

      if (success) {
        toast({
          title: "User updated",
          description: `"${formData.username}" has been updated successfully.`,
        });
        onUserUpdated();
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to update user. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Edit User</h2>
            <p className="text-sm text-muted-foreground">User ID: #{user.id}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="edit-username"
                type="text"
                placeholder=" "
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={`peer ${errors.username ? 'border-destructive' : ''}`}
                disabled={isSubmitting}
              />
              <Label 
                htmlFor="edit-username" 
                className="absolute left-3 -top-2.5 bg-background px-1 text-sm font-medium text-muted-foreground transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-foreground"
              >
                Username *
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">e.g., alex_smith, maria_garcia, kwame_asante</p>
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                id="edit-email"
                type="email"
                placeholder=" "
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`peer ${errors.email ? 'border-destructive' : ''}`}
                disabled={isSubmitting}
              />
              <Label 
                htmlFor="edit-email" 
                className="absolute left-3 -top-2.5 bg-background px-1 text-sm font-medium text-muted-foreground transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-foreground"
              >
                Email Address *
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">e.g., alex@company.com, maria.garcia@example.org</p>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <select
                id="edit-gender"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female')}
                className="peer w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <Label 
                htmlFor="edit-gender" 
                className="absolute left-3 -top-2.5 bg-background px-1 text-sm font-medium text-muted-foreground"
              >
                Gender
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">Used for default avatar display</p>
          </div>

          <div className="bg-muted/50 p-3 rounded text-sm">
            <p className="text-muted-foreground">
              <strong>Created:</strong> {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2"
              disabled={
                isSubmitting || 
                !formData.username.trim() || 
                !formData.email.trim() || 
                !hasChanges()
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}