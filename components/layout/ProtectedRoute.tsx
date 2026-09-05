'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (requireAdmin && user?.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, isLoading, requireAdmin, router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  if (requireAdmin && user?.role !== 'admin') {
    return null;
  }
  
  return <>{children}</>;
};