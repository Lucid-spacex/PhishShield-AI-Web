'use client';

import React from 'react';
import { ScanResult } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  HelpCircle,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ScanResultCardProps {
  result: ScanResult;
}

export const ScanResultCardLite: React.FC<ScanResultCardProps> = ({ result }) => {
  const getLabelInfo = (label: string) => {
    switch (label) {
      case 'safe':
        return {
          icon: ShieldCheck,
          text: 'Safe',
          variant: 'success' as const,
          description: 'This URL appears to be legitimate',
          bgColor: 'bg-success-light',
          textColor: 'text-success-text',
        };
      case 'phishing':
        return {
          icon: ShieldAlert,
          text: 'Phishing Detected',
          variant: 'danger' as const,
          description: 'High risk phishing detected',
          bgColor: 'bg-danger-light',
          textColor: 'text-danger-text',
        };
      case 'suspicious':
        return {
          icon: AlertTriangle,
          text: 'Suspicious',
          variant: 'warning' as const,
          description: 'Proceed with caution',
          bgColor: 'bg-warning-light',
          textColor: 'text-warning-text',
        };
      default:
        return {
          icon: HelpCircle,
          text: 'Unknown',
          variant: 'neutral' as const,
          description: 'Unable to determine risk level',
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
        };
    }
  };
  
  const labelInfo = getLabelInfo(result.label);
  const confidencePercentage = Math.round(result.confidence_score * 100);
  const Icon = labelInfo.icon;
  
  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Scan Results</CardTitle>
          <Badge variant={labelInfo.variant} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium">
            <Icon className="w-4 h-4" />
            <span>{labelInfo.text}</span>
          </Badge>
        </div>
        <CardDescription className="text-base">
          {labelInfo.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hero Status Indicator */}
        <div className={`${labelInfo.bgColor} rounded-xl p-6 text-center`}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-4">
            <Icon className={`w-10 h-10 ${labelInfo.textColor}`} />
          </div>
          <div className="space-y-2">
            <h3 className={`text-3xl font-bold ${labelInfo.textColor}`}>
              {confidencePercentage}%
            </h3>
            <p className="text-sm text-muted-foreground">Confidence Score</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Risk Level</span>
            <span className={`font-bold ${labelInfo.textColor}`}>
              {result.label === 'safe' ? 'Low' : result.label === 'phishing' ? 'High' : 'Medium'}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                result.label === 'safe'
                  ? 'bg-success'
                  : result.label === 'phishing'
                  ? 'bg-danger'
                  : 'bg-warning'
              }`}
              style={{ width: `${confidencePercentage}%` }}
            />
          </div>
        </div>
        
        {/* URL Display */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Analyzed URL</p>
          <div className="bg-muted rounded-lg p-3 border border-border">
            <p className="text-sm text-foreground break-all font-mono">
              {result.url}
            </p>
          </div>
        </div>
        
        {/* Risk Indicators */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Risk Indicators</p>
          {result.risk_indicators && result.risk_indicators.length > 0 ? (
            <div className="space-y-2">
              {result.risk_indicators.map((indicator, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-sm bg-muted rounded-lg p-3 border border-border"
                >
                  <ArrowRight className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{indicator}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg p-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>No specific risk indicators detected</span>
            </div>
          )}
        </div>
        
        {/* Scan Time */}
        <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Scanned at {new Date(result.scan_time).toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};