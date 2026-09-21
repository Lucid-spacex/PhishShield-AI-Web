import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scansApi, handleScanError } from '@/lib/api/scans';
import { useToast } from '@/components/ui/ToastProvider';
import { ScanRequest, ScanHistoryParams, ApiError } from '@/types';

export const useSubmitScan = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: ScanRequest) => {
      return await scansApi.submitScan(data);
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['scanHistory'] });
      queryClient.invalidateQueries({ queryKey: ['analyticsSummary'] });
      queryClient.invalidateQueries({ queryKey: ['analyticsTrends'] });
      queryClient.invalidateQueries({ queryKey: ['riskDistribution'] });
      addToast('Scan completed successfully', 'success');
    },
    onError: (error: unknown) => {
      const apiError = handleScanError(error);
      addToast(apiError.message, 'error');
      throw apiError;
    },
  });
};

export const useScanHistory = (params: ScanHistoryParams = {}) => {
  const { page = 1, per_page = 10 } = params;
  
  return useQuery({
    queryKey: ['scanHistory', page, per_page],
    queryFn: () => scansApi.getScanHistory({ page, per_page }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useScanById = (scanId: string) => {
  return useQuery({
    queryKey: ['scan', scanId],
    queryFn: () => scansApi.getScanById(scanId),
    enabled: !!scanId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useDeleteScan = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (scanId: string) => {
      await scansApi.deleteScan(scanId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scanHistory'] });
      queryClient.invalidateQueries({ queryKey: ['analyticsSummary'] });
      addToast('Scan deleted successfully', 'success');
    },
    onError: (error: unknown) => {
      const apiError = handleScanError(error);
      addToast(apiError.message, 'error');
      throw apiError;
    },
  });
};