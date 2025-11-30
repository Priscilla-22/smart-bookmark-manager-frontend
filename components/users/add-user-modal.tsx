/**
 * Add User Modal Component
 */

'use client';

import { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/hooks/use-toast';

interface AddUserModalProps {
  onClose: () => void;
  onUserAdded: () => void;
}

export function AddUserModal({ onClose, onUserAdded }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    gender: 'male' as 'male' | 'female',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { createUser } = useUsers();
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await createUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        gender: formData.gender,
      });

      if (success) {
        toast({
          title: "User created",
          description: `"${formData.username}" has been added successfully.`,
        });
        onUserAdded();
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to create user. Please try again.",
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
          <h2 className="text-xl font-semibold">Add New User</h2>
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
                id="username"
                type="text"
                placeholder=" "
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={`peer ${errors.username ? 'border-destructive' : ''}`}
                disabled={isSubmitting}
              />
              <Label 
                htmlFor="username" 
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
                id="email"
                type="email"
                placeholder=" "
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`peer ${errors.email ? 'border-destructive' : ''}`}
                disabled={isSubmitting}
              />
              <Label 
                htmlFor="email" 
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
                id="gender"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female')}
                className="peer w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <Label 
                htmlFor="gender" 
                className="absolute left-3 -top-2.5 bg-background px-1 text-sm font-medium text-muted-foreground"
              >
                Gender
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">Used for default avatar display</p>
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
              disabled={isSubmitting || !formData.username.trim() || !formData.email.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add User
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}