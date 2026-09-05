'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { ScanHistoryTable } from '@/components/features/history/ScanHistoryTable';
import { useScanHistory } from '@/hooks/useScans';
import { FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const perPage = 10;
  
  const { data, isLoading, error, isFetching } = useScanHistory({ page, per_page: perPage });
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 space-y-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Scan Historys</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              View and manage your previous URL scans
            </p>
          </motion.div>
          
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-danger/50 bg-danger-light/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-danger" />
                    <div>
                      <h3 className="font-semibold text-danger">Failed to load scan history</h3>
                      <p className="text-sm text-danger-text mt-1">Please try again later</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <ScanHistoryTable
              scans={data?.scans || []}
              isLoading={isLoading || isFetching}
              onPageChange={handlePageChange}
              currentPage={page}
              totalPages={data?.total_pages || 1}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}