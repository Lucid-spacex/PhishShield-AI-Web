import axios from 'axios';
import axiosInstance from '../axios';
import {
  ScanRequest,
  ScanResult,
  ScanHistoryResponse,
  ScanHistoryParams,
  ApiError,
} from '@/types';

export const scansApi = {
  submitScan: async (data: ScanRequest): Promise<ScanResult> => {
    const response = await axiosInstance.post<ScanResult>('/api/scan/', data);
    return response.data;
  },

  getScanHistory: async (params: ScanHistoryParams = {}): Promise<ScanHistoryResponse> => {
    const { page = 1, per_page = 10 } = params;
    const response = await axiosInstance.get<ScanHistoryResponse>('/api/scan/history', {
      params: { page, per_page },
    });
    return response.data;
  },

  getScanById: async (scanId: string): Promise<ScanResult> => {
    const response = await axiosInstance.get<ScanResult>(`/api/scan/history/${scanId}`);
    return response.data;
  },

  deleteScan: async (scanId: string): Promise<void> => {
    await axiosInstance.delete(`/api/scan/history/${scanId}`);
  },
};

export const handleScanError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string; error?: string };
    
    return {
      message: data?.message || data?.error || 'Scan operation failed',
      status,
      code: status === 400 ? 'BAD_REQUEST' : status === 404 ? 'NOT_FOUND' : 'ERROR',
    };
  }
  
  return {
    message: 'An unexpected error occurred during scan',
    code: 'UNKNOWN_ERROR',
  };
};