/**
 * User Management Dashboard Component
 */

'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, User, Mail, Calendar, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserEmojiAvatar } from '@/components/ui/user-avatar';
import { useUsers } from '@/hooks/useUsers';
import { AddUserModal } from './add-user-modal';
import { EditUserModal } from './edit-user-modal';
import { DeleteUserModal } from './delete-user-modal';
import { User as UserType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useBookmarkContext } from '@/contexts/BookmarkContext';

export function UserManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserType | null>(null);
  
  const { users, loading, error, refetch } = useUsers();
  const { toast } = useToast();
  const { searchTerm, viewMode } = useBookmarkContext();

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAdded = () => {
    toast({
      title: "Success",
      description: "User added successfully",
    });
    refetch();
  };

  const handleUserUpdated = () => {
    toast({
      title: "Success", 
      description: "User updated successfully",
    });
    refetch();
  };

  const handleUserDeleted = () => {
    toast({
      title: "Success",
      description: "User deleted successfully",
    });
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Error loading users</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={refetch} className="mt-4">Try Again</Button>
        </div>
      </div>
    );
  }

  const renderTableView = () => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">#</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <UserEmojiAvatar gender={user.gender} size="md" />
                  <span className="font-medium">{user.username}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{user.email}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingUser(user)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingUser(user)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderGridView = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredUsers.map((user) => (
        <Card key={user.id} className="relative group hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <UserEmojiAvatar gender={user.gender} size="lg" />
                <div>
                  <CardTitle className="text-lg">{user.username}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </CardDescription>
                </div>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingUser(user)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingUser(user)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Created {new Date(user.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <Badge variant="secondary" className="px-3 py-1">
            Total: {users.length}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Filtered: {filteredUsers.length}
          </Badge>
        </div>
        
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Users Display */}
      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "No users match your search criteria" : "Get started by adding your first user"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          )}
        </div>
      ) : (
        viewMode === 'table' ? renderTableView() : renderGridView()
      )}

      {/* Modals */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onUserAdded={handleUserAdded}
        />
      )}
      
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}
      
      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </div>
  );
}