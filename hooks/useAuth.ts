import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, handleAuthError } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/ToastProvider';
import { LoginRequest, RegisterRequest, User, ApiError } from '@/types';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await authApi.login(data);
      return response;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      addToast('Login successful!', 'success');
    },
    onError: (error: unknown) => {
      const apiError = handleAuthError(error);
      addToast(apiError.message, 'error');
      throw apiError;
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await authApi.register(data);
      return response;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      addToast('Account created successfully!', 'success');
    },
    onError: (error: unknown) => {
      const apiError = handleAuthError(error);
      addToast(apiError.message, 'error');
      throw apiError;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      addToast('Logged out successfully', 'success');
    },
    onError: (error: unknown) => {
      // Even if logout fails on the server, clear local auth state
      clearAuth();
      queryClient.clear();
      addToast('Logged out', 'info');
      throw handleAuthError(error);
    },
  });
};

export const useCurrentUser = () => {
  const { isAuthenticated, token } = useAuthStore();
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<User> => {
      return await authApi.getCurrentUser();
    },
    enabled: isAuthenticated && !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};