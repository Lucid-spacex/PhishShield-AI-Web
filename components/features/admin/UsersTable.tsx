'use client';

import React, { useState } from 'react';
import { AdminUser } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useUpdateUser, useDeleteUser } from '@/hooks/useAdmin';

interface UsersTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  onPageChange,
  currentPage,
  totalPages,
}) => {
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AdminUser | null>(null);
  
  const handleRoleToggle = async (user: AdminUser) => {
    try {
      await updateUser.mutateAsync({
        userId: user.user_id,
        data: { role: user.role === 'admin' ? 'user' : 'admin' },
      });
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };
  
  const handleActiveToggle = async (user: AdminUser) => {
    try {
      await updateUser.mutateAsync({
        userId: user.user_id,
        data: { is_active: !user.is_active },
      });
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };
  
  const handleDelete = async () => {
    if (deleteConfirmUser) {
      try {
        await deleteUser.mutateAsync(deleteConfirmUser.user_id);
        setDeleteConfirmUser(null);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p className="text-gray-600">No users are registered in the system yet.</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scans
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={user.role === 'admin' ? 'info' : 'neutral'} size="sm">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={user.is_active ? 'success' : 'danger'} size="sm">
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.scan_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRoleToggle(user)}
                        disabled={updateUser.isPending}
                        title={`Change to ${user.role === 'admin' ? 'user' : 'admin'}`}
                      >
                        {user.role === 'admin' ? '↓ User' : '↑ Admin'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleActiveToggle(user)}
                        disabled={updateUser.isPending}
                        title={user.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {user.is_active ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmUser(user)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete user"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmUser}
        onClose={() => setDeleteConfirmUser(null)}
        title="Confirm Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete user <strong>{deleteConfirmUser?.username}</strong>? 
            This action cannot be undone and will also delete all their scan history.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirmUser(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteUser.isPending}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};