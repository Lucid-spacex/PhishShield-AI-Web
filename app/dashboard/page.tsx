'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { UrlSubmitForm } from '@/components/features/scan/UrlSubmitForm';
import { ScanResultCard } from '@/components/features/scan/ScanResultCard';
import { ScanResult } from '@/types';
import { 
  Clock, 
  BarChart3, 
  Lightbulb, 
  Shield,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  const [latestResult, setLatestResult] = useState<ScanResult | null>(null);
  
  const handleScanComplete = (result: ScanResult) => {
    setLatestResult(result);
  };
  
  const quickActions = [
    {
      title: 'Scan History',
      description: 'View past scans',
      icon: Clock,
      href: '/history',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Analytics',
      description: 'View statistics',
      icon: BarChart3,
      href: '/analytics',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Security Tips',
      description: 'Stay safe online',
      icon: Lightbulb,
      href: '#',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];
  
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
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Analyze URLs for phishing threats and security risks
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* URL Submission Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <UrlSubmitForm onScanComplete={handleScanComplete} />
            </motion.div>
            
            {/* Latest Scan Result */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              {latestResult ? (
                <ScanResultCard result={latestResult} />
              ) : (
                <Card className="shadow-lg border-2 border-dashed border-border/50 h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6"
                    >
                      <Sparkles className="w-10 h-10 text-muted-foreground" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Ready to scan
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Submit a URL to see detailed scan results here
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="w-4 h-4" />
                      <span>Enter a URL in the form to get started</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Link href={action.href}>
                      <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer h-full">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${action.bgColor}`}>
                              <Icon className={`w-6 h-6 ${action.color}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{action.title}</h3>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  );
}