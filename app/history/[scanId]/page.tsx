'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { ScanResultCard } from '@/components/features/scan/ScanResultCard';
import { useScanById } from '@/hooks/useScans';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ScanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scanId = parseInt(params.scanId as string);
  
  const { data: scan, isLoading, error } = useScanById(scanId);
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              ← Back to History
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Scan Details</h1>
          </div>
          
          {isLoading && (
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <Skeleton variant="text" width="100%" height={32} className="mb-4" />
              <Skeleton variant="text" width="60%" height={24} className="mb-4" />
              <Skeleton variant="rectangular" width="100%" height={200} />
            </div>
          )}
          
          {error && (
            <div className="bg-danger-light border border-danger text-danger px-4 py-3 rounded-lg">
              Failed to load scan details. The scan may have been deleted or doesn't exist.
            </div>
          )}
          
          {scan && <ScanResultCard result={scan} />}
        </main>
      </div>
    </ProtectedRoute>
  );
}