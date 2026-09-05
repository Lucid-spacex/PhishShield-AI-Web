'use client';

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { RiskDistributionResponse } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { PieChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RiskDistributionChartProps {
  data: RiskDistributionResponse | undefined;
  isLoading: boolean;
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({
  data,
  isLoading,
}) => {
  const chartData = React.useMemo(() => {
    if (!data || !data.distribution || !Array.isArray(data.distribution)) return null;
    
    return {
      labels: data.distribution.map((d) => d.label),
      datasets: [
        {
          data: data.distribution.map((d) => d.count),
          backgroundColor: [
            '#22c55e', // safe - emerald
            '#ef4444', // phishing - red
            '#f59e0b', // suspicious - amber
          ],
          borderColor: [
            '#16a34a',
            '#dc2626',
            '#d97706',
          ],
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };
  }, [data]);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '65%',
  };
  
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    );
  }
  
  if (!chartData) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            No distribution data available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Risk Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '300px', position: 'relative' }}>
          <Doughnut data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};