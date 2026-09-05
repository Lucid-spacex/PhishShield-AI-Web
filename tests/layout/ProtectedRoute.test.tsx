import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Mock the useAuthStore
vi.mock('@/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('ProtectedRoute Component', () => {
  it('renders children when authenticated', () => {
    const { useAuthStore } = require('@/store/authStore');
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'user' },
      isLoading: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects when not authenticated', () => {
    const { useAuthStore } = require('@/store/authStore');
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects non-admin users from admin routes', () => {
    const { useAuthStore } = require('@/store/authStore');
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'user' },
      isLoading: false,
    });

    render(
      <ProtectedRoute requireAdmin>
        <div>Admin Content</div>
      </ProtectedRoute>
    );
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});