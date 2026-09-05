'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useSubmitScan } from '@/hooks/useScans';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Search, Shield, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

const urlSchema = z.object({
  url: z
    .string()
    .min(1, 'URL is required')
    .url('Invalid URL format')
    .max(2048, 'URL is too long'),
});

type UrlFormData = z.infer<typeof urlSchema>;

interface UrlSubmitFormProps {
  onScanComplete: (result: any) => void;
}

export const UrlSubmitForm: React.FC<UrlSubmitFormProps> = ({ onScanComplete }) => {
  const submitScan = useSubmitScan();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
  const [progress, setProgress] = useState(0);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
  });
  
  const analysisStages = [
    { text: 'Analyzing URL structure...', icon: Search },
    { text: 'Checking domain reputation...', icon: Shield },
    { text: 'Evaluating security indicators...', icon: AlertTriangle },
    { text: 'Running phishing detection models...', icon: Shield },
    { text: 'Generating confidence score...', icon: CheckCircle },
  ];
  
  const onSubmit = async (data: UrlFormData) => {
    setIsAnalyzing(true);
    setProgress(0);
    let stageIndex = 0;
    
    // Simulate staged analysis messages
    const stageInterval = setInterval(() => {
      if (stageIndex < analysisStages.length) {
        setAnalysisStage(analysisStages[stageIndex].text);
        setProgress((stageIndex + 1) / analysisStages.length * 100);
        stageIndex++;
      } else {
        clearInterval(stageInterval);
      }
    }, 800);
    
    try {
      const result = await submitScan.mutateAsync(data);
      clearInterval(stageInterval);
      onScanComplete(result);
      reset();
    } catch (err: any) {
      clearInterval(stageInterval);
      console.error('Scan failed:', err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStage('');
      setProgress(0);
    }
  };
  
  return (
    <Card className="shadow-lg border-2 border-border/50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Scan URL for Phishing</CardTitle>
        <CardDescription>
          Enter a URL to analyze for security threats and phishing indicators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Input
              label="URL to analyze"
              type="url"
              placeholder="https://example.com"
              error={errors.url?.message}
              {...register('url')}
              disabled={isAnalyzing}
              className="text-lg"
            />
          </div>
          
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span className="font-medium text-foreground">{analysisStage || 'Initializing analysis...'}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {analysisStages.map((stage, index) => {
                  const Icon = stage.icon;
                  const isActive = index <= Math.floor(progress / 20);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: isActive ? 1 : 0.3, scale: isActive ? 1 : 0.8 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isAnalyzing}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? 'Analyzing...' : 'Scan URL'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};