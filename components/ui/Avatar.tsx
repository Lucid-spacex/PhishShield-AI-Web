import React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    if (src && !imageError) {
      return (
        <div
          ref={ref}
          className={cn(
            'relative rounded-full overflow-hidden bg-muted flex items-center justify-center',
            sizeClasses[size],
            className
          )}
          {...props}
        >
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      );
    }

    const initials = fallback
      ? fallback
          .split(' ')
          .map((name) => name[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'U';

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {initials}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';