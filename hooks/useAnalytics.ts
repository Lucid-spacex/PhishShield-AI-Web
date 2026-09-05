import { useQuery } from '@tanstack/react-query';
import { analyticsApi, handleAnalyticsError } from '@/lib/api/analytics';
import { AnalyticsTrendsParams } from '@/types';

export const useAnalyticsSummary = () => {
  return useQuery({
    queryKey: ['analyticsSummary'],
    queryFn: () => analyticsApi.getSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useAnalyticsTrends = (params: AnalyticsTrendsParams = {}) => {
  const { period = 'daily', days = 30 } = params;
  
  return useQuery({
    queryKey: ['analyticsTrends', period, days],
    queryFn: () => analyticsApi.getTrends({ period, days }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useRiskDistribution = () => {
  return useQuery({
    queryKey: ['riskDistribution'],
    queryFn: () => analyticsApi.getRiskDistribution(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};