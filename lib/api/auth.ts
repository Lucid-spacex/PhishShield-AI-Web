import axios, { AxiosError } from 'axios';
import axiosInstance from '../axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  ApiError,
} from '@/types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/api/auth/login', data);
    console.log('Login API response:', response.data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/api/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/api/auth/me');
    return response.data;
  },
};

export const handleAuthError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string; error?: string };
    
    return {
      message: data?.message || data?.error || 'Authentication failed',
      status,
      code: status === 401 ? 'UNAUTHORIZED' : status === 409 ? 'CONFLICT' : 'ERROR',
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};