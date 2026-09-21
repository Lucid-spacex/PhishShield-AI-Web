'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ScanResult } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ScanResultCardLite as ScanResultCard } from '@/components/features/scan/ScanResultCardLite';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDeleteScan } from '@/hooks/useScans';
import { 
  Trash2, 
  Eye, 
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  Clock,
  FileText,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface ScanHistoryTableProps {
  scans: ScanResult[];
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

export const ScanHistoryTable: React.FC<ScanHistoryTableProps> = ({
  scans,
  isLoading,
  onPageChange,
  currentPage,
  totalPages,
}) => {
  const deleteScan = useDeleteScan();
  const [selectedScan, setSelectedScan] = React.useState<ScanResult | null>(null);
  const [deleteConfirmScan, setDeleteConfirmScan] = React.useState<ScanResult | null>(null);
  
  const getLabelVariant = (label: string) => {
    switch (label) {
      case 'legitimate':
      case 'safe':
        return 'success';
      case 'phishing':
        return 'danger';
      default:
        return 'neutral';
    }
  };
  
  const getLabelIcon = (label: string) => {
    switch (label) {
      case 'legitimate':
      case 'safe':
        return ShieldCheck;
      case 'phishing':
        return ShieldAlert;
      default:
        return HelpCircle;
    }
  };
  
  const handleDelete = async () => {
    if (deleteConfirmScan) {
      try {
        await deleteScan.mutateAsync(deleteConfirmScan.scan_id);
        setDeleteConfirmScan(null);
      } catch (error) {
        console.error('Failed to delete scan:', error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (scans.length === 0) {
    return (
      <div className="bg-card rounded-xl border-2 border-dashed border-border p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6"
        >
          <FileText className="w-10 h-10 text-muted-foreground" />
        </motion.div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No scan history</h3>
        <p className="text-muted-foreground mb-6">
          Start scanning URLs to build your history
        </p>
        <Link href="/dashboard">
          <Button variant="primary" className="gap-2">
            <ArrowRight className="w-4 h-4" />
            Go to Dashboard
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scans.map((scan, index) => {
                const LabelIcon = getLabelIcon(scan.label);
                return (
                  <tr
                    key={scan.scan_id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors animate-fade-in"
                    style={{ animationDelay: `${Math.min(index * 0.03, 0.3)}s` }}
                    onClick={() => setSelectedScan(scan)}
                  >
                    <TableCell className="font-medium">
                      <div className="max-w-xs truncate">{scan.url}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getLabelVariant(scan.label)} className="gap-1">
                        <LabelIcon className="w-3 h-3" />
                        {scan.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${
                              scan.label === 'legitimate' || scan.label === 'safe'
                                ? 'bg-success'
                                : scan.label === 'phishing'
                                ? 'bg-danger'
                                : 'bg-warning'
                            }`}
                            style={{ width: `${Math.round(scan.confidence_score * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{Math.round(scan.confidence_score * 100)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {new Date(scan.scan_time).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScan(scan);
                          }}
                          className="h-8 w-8"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmScan(scan);
                          }}
                          className="h-8 w-8 text-danger hover:text-danger hover:bg-danger-light"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-muted/50 px-6 py-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Scan Detail Modal */}
      <Modal
        isOpen={!!selectedScan}
        onClose={() => setSelectedScan(null)}
        title="Scan Details"
        size="lg"
      >
        {selectedScan && <ScanResultCard result={selectedScan} />}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmScan}
        onClose={() => setDeleteConfirmScan(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-foreground">
            Are you sure you want to delete this scan? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirmScan(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteScan.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};