import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'width' | 'height'> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', width, height, style, ...props }, ref) => {
    const variantStyles = {
      text: 'h-4 rounded-md',
      circular: 'rounded-full',
      rectangular: 'rounded-md',
    };

    const inlineStyle: React.CSSProperties = {
      ...(width !== undefined && { width: typeof width === 'number' ? `${width}px` : width }),
      ...(height !== undefined && { height: typeof height === 'number' ? `${height}px` : height }),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-muted',
          variantStyles[variant],
          className
        )}
        style={inlineStyle}
        {...props}
        aria-hidden="true"
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';