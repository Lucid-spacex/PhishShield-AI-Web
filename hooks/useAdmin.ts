import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, handleAdminError } from '@/lib/api/admin';
import { useToast } from '@/components/ui/ToastProvider';
import { UpdateUserRequest } from '@/types';

export const useAdminActivity = () => {
  return useQuery({
    queryKey: ['adminActivity'],
    queryFn: () => adminApi.getActivity(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export const useAdminAllScans = (page: number = 1, per_page: number = 20) => {
  return useQuery({
    queryKey: ['adminScans', page, per_page],
    queryFn: () => adminApi.getAllScans(page, per_page),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export const useAdminAllUsers = (page: number = 1, per_page: number = 20) => {
  return useQuery({
    queryKey: ['adminUsers', page, per_page],
    queryFn: () => adminApi.getAllUsers(page, per_page),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UpdateUserRequest }) => {
      await adminApi.updateUser(userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      addToast('User updated successfully', 'success');
    },
    onError: (error: unknown) => {
      const apiError = handleAdminError(error);
      addToast(apiError.message, 'error');
      throw apiError;
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      await adminApi.deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      addToast('User deleted successfully', 'success');
    },
    onError: (error: unknown) => {
      const apiError = handleAdminError(error);
      addToast(apiError.message, 'error');
      throw apiError;
    },
  });
};