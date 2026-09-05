import axios from 'axios';
import axiosInstance from '../axios';
import {
  AdminActivityResponse,
  AdminScansResponse,
  AdminUsersResponse,
  UpdateUserRequest,
  ApiError,
} from '@/types';

export const adminApi = {
  getActivity: async (): Promise<AdminActivityResponse> => {
    const response = await axiosInstance.get<AdminActivityResponse>('/api/admin/activity');
    return response.data;
  },

  getAllScans: async (page: number = 1, per_page: number = 20): Promise<AdminScansResponse> => {
    const response = await axiosInstance.get<AdminScansResponse>('/api/admin/scans', {
      params: { page, per_page },
    });
    return response.data;
  },

  getAllUsers: async (page: number = 1, per_page: number = 20): Promise<AdminUsersResponse> => {
    const response = await axiosInstance.get<AdminUsersResponse>('/api/admin/users', {
      params: { page, per_page },
    });
    return response.data;
  },

  updateUser: async (userId: string, data: UpdateUserRequest): Promise<void> => {
    await axiosInstance.patch(`/api/admin/users/${userId}`, data);
  },

  deleteUser: async (userId: string): Promise<void> => {
    await axiosInstance.delete(`/api/admin/users/${userId}`);
  },
};

export const handleAdminError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string; error?: string };
    
    return {
      message: data?.message || data?.error || 'Admin operation failed',
      status,
      code: status === 403 ? 'FORBIDDEN' : status === 404 ? 'NOT_FOUND' : 'ERROR',
    };
  }
  
  return {
    message: 'An unexpected error occurred during admin operation',
    code: 'UNKNOWN_ERROR',
  };
};