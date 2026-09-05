'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { UsersTable } from '@/components/features/admin/UsersTable';
import { AllScansTable } from '@/components/features/admin/AllScansTable';
import { ActivityOverview } from '@/components/features/admin/ActivityOverview';
import { useAdminActivity, useAdminAllUsers, useAdminAllScans } from '@/hooks/useAdmin';

export default function AdminPage() {
  const [usersPage, setUsersPage] = useState(1);
  const [scansPage, setScansPage] = useState(1);
  const perPage = 20;
  
  const { data: activity, isLoading: activityLoading } = useAdminActivity();
  const { data: usersData, isLoading: usersLoading } = useAdminAllUsers(usersPage, perPage);
  const { data: scansData, isLoading: scansLoading } = useAdminAllScans(scansPage, perPage);
  
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage users, view system activity, and monitor all scans
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Overview */}
            <div className="lg:col-span-1">
              <ActivityOverview data={activity} isLoading={activityLoading} />
            </div>
            
            {/* Users Table */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Users</h2>
              </div>
              <UsersTable
                users={usersData?.users || []}
                isLoading={usersLoading}
                onPageChange={setUsersPage}
                currentPage={usersPage}
                totalPages={usersData?.total_pages || 1}
              />
            </div>
          </div>
          
          {/* All Scans Table */}
          <div className="mt-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">All Scans</h2>
            </div>
            <AllScansTable
              scans={scansData?.scans || []}
              isLoading={scansLoading}
              onPageChange={setScansPage}
              currentPage={scansPage}
              totalPages={scansData?.total_pages || 1}
            />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}