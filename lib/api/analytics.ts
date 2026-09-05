import axios from 'axios';
import axiosInstance from '../axios';
import {
  AnalyticsSummary,
  AnalyticsTrendsResponse,
  AnalyticsTrendsParams,
  RiskDistributionResponse,
  ApiError,
} from '@/types';

export const analyticsApi = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    const response = await axiosInstance.get<AnalyticsSummary>('/api/analytics/summary');
    return response.data;
  },

  getTrends: async (params: AnalyticsTrendsParams = {}): Promise<AnalyticsTrendsResponse> => {
    const { period = 'daily', days = 30 } = params;
    const response = await axiosInstance.get<AnalyticsTrendsResponse>('/api/analytics/trends', {
      params: { period, days },
    });
    return response.data;
  },

  getRiskDistribution: async (): Promise<RiskDistributionResponse> => {
    const response = await axiosInstance.get<RiskDistributionResponse>('/api/analytics/risk-distribution');
    return response.data;
  },
};

export const handleAnalyticsError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string; error?: string };
    
    return {
      message: data?.message || data?.error || 'Analytics data fetch failed',
      status,
      code: status === 403 ? 'FORBIDDEN' : 'ERROR',
    };
  }
  
  return {
    message: 'An unexpected error occurred while fetching analytics',
    code: 'UNKNOWN_ERROR',
  };
};