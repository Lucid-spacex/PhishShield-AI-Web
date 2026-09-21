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
    const response = await axiosInstance.post<any>('/api/scan/', data);
    // Transform backend response to match frontend types
    return {
      scan_id: response.data.scan_id,
      label: response.data.label,
      confidence_score: response.data.confidence_score,
      risk_indicators: response.data.risk_indicators || [],
      scan_time: response.data.scan_time,
      url: response.data.url_scanned || data.url, // Use backend URL if available, otherwise original
    };
  },

  getScanHistory: async (params: ScanHistoryParams = {}): Promise<ScanHistoryResponse> => {
    const { page = 1, per_page = 10 } = params;
    const response = await axiosInstance.get<any>('/api/scan/history', {
      params: { page, per_page },
    });
    // Transform backend response to match frontend types
    return {
      scans: response.data.scans.map((scan: any) => ({
        scan_id: scan.scan_id,
        label: scan.label || scan.result, // Handle both label and result field names
        confidence_score: scan.confidence_score ?? scan.risk_score, // Handle both field names with proper null check
        risk_indicators: scan.risk_indicators || [],
        scan_time: scan.scan_time,
        url: scan.url_scanned || scan.url, // Handle both url_scanned and url field names
        user_id: scan.user_id,
      })),
      total: response.data.total,
      pages: response.data.pages,
      current_page: response.data.current_page,
    };
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