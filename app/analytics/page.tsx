'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { SummaryCards } from '@/components/features/analytics/SummaryCards';
import { TrendsChart } from '@/components/features/analytics/TrendsChart';
import { RiskDistributionChart } from '@/components/features/analytics/RiskDistributionChart';
import { useAnalyticsSummary, useAnalyticsTrends, useRiskDistribution } from '@/hooks/useAnalytics';
import { BarChart3, ArrowRight, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useAnalyticsSummary();
  const { data: trends, isLoading: trendsLoading, error: trendsError } = useAnalyticsTrends({ period });
  const { data: distribution, isLoading: distributionLoading, error: distributionError } = useRiskDistribution();
  
  const hasNoData = !summaryLoading && !summaryError && summary && summary.total_scans === 0;
  const hasError = summaryError || trendsError || distributionError;
  
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
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              View your scanning statistics and trends
            </p>
          </motion.div>
          
          {hasError ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-danger/50 bg-danger-light/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-danger" />
                    <div>
                      <h3 className="font-semibold text-danger">Failed to load analytics data</h3>
                      <p className="text-sm text-danger-text mt-1">Please try again later</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : hasNoData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Card className="border-2 border-dashed border-border">
                <CardContent className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6"
                  >
                    <BarChart3 className="w-10 h-10 text-muted-foreground" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No analytics data yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start scanning URLs to see your analytics here
                  </p>
                  <Link href="/dashboard">
                    <Button variant="primary" className="gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Go to Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <SummaryCards 
                summary={summary || { total_scans: 0, phishing_detected: 0, safe_urls: 0, suspicious_urls: 0, avg_confidence: 0 }} 
                isLoading={summaryLoading} 
              />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <TrendsChart
                  data={trends}
                  isLoading={trendsLoading}
                  period={period}
                  onPeriodChange={setPeriod}
                />
                <RiskDistributionChart
                  data={distribution}
                  isLoading={distributionLoading}
                />
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}