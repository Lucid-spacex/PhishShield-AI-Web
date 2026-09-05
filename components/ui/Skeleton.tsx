import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', ...props }, ref) => {
    const variantStyles = {
      text: 'h-4 rounded-md',
      circular: 'rounded-full',
      rectangular: 'rounded-md',
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-muted',
          variantStyles[variant],
          className
        )}
        {...props}
        aria-hidden="true"
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';