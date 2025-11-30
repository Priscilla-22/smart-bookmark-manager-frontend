/**
 * Delete User Modal Component
 */

'use client';

import { useState } from 'react';
import { X, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';

interface DeleteUserModalProps {
  user: User;
  onClose: () => void;
  onUserDeleted: () => void;
}

export function DeleteUserModal({ user, onClose, onUserDeleted }: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const { deleteUser } = useUsers();
  const { toast } = useToast();

  const expectedConfirmation = user.username;
  const isConfirmed = confirmationText === expectedConfirmation;

  const handleDelete = async () => {
    if (!isConfirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const success = await deleteUser(user.id);

      if (success) {
        toast({
          title: "User deleted",
          description: `"${user.username}" has been permanently deleted.`,
        });
        onUserDeleted();
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete user. Please try again.",
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
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Delete User</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
            disabled={isDeleting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive mb-1">
                  This action cannot be undone
                </h3>
                <p className="text-sm text-muted-foreground">
                  Deleting this user will permanently remove:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• User account and profile</li>
                  <li>• All bookmarks owned by this user</li>
                  <li>• User activity and history</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h4 className="font-semibold">{user.username}</h4>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              User ID: #{user.id} • Created: {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Type <span className="font-mono bg-muted px-1 rounded">{expectedConfirmation}</span> to confirm deletion:
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Type "${expectedConfirmation}" here`}
              className="w-full px-3 py-2 border rounded-md bg-background"
              disabled={isDeleting}
              autoComplete="off"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="flex-1 gap-2"
              disabled={isDeleting || !isConfirmed}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete User
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}