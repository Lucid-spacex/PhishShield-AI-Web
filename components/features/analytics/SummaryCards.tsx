'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnalyticsSummary } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SummaryCardsProps {
  summary: AnalyticsSummary | null | undefined;
  isLoading: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, isLoading }) => {
  const safeSummary = summary || {
    total_scans: 0,
    phishing_detected: 0,
    safe_urls: 0,
    suspicious_urls: 0,
    avg_confidence: 0,
  };

  const cards = [
    {
      title: 'Total Scans',
      value: safeSummary.total_scans,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Phishing Detected',
      value: safeSummary.phishing_detected,
      icon: ShieldAlert,
      color: 'text-danger',
      bgColor: 'bg-danger-light',
      iconBg: 'bg-danger-light',
    },
    {
      title: 'Safe URLs',
      value: safeSummary.safe_urls,
      icon: ShieldCheck,
      color: 'text-success',
      bgColor: 'bg-success-light',
      iconBg: 'bg-success-light',
    },
    {
      title: 'Suspicious URLs',
      value: safeSummary.suspicious_urls,
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning-light',
      iconBg: 'bg-warning-light',
    },
  ];
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-md">
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                    <motion.p
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                  className="text-3xl font-bold text-foreground"
                >
                  {card.value}
                </motion.p>
              </div>
                  <div className={`${card.iconBg} ${card.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};