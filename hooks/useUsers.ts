/**
 * React hooks for user operations
 */

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/userService';
import { User, UserCreate } from '@/types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await userService.getUsers();
    
    if (response.error) {
      setError(response.error);
    } else {
      setUsers(response.data || []);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(async (userData: UserCreate) => {
    setError(null);
    const response = await userService.createUser(userData);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchUsers();
    return true;
  }, [fetchUsers]);

  const updateUser = useCallback(async (id: number, userData: UserCreate) => {
    setError(null);
    const response = await userService.updateUser(id, userData);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchUsers();
    return true;
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id: number) => {
    setError(null);
    const response = await userService.deleteUser(id);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchUsers();
    return true;
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers,
  };
}