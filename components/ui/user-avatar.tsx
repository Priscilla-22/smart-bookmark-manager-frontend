/**
 * User Avatar Component with gender-based default avatars
 */

'use client';

import { UserCheck, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  gender?: 'male' | 'female';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ gender = 'male', size = 'md', className }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  const avatarStyle = gender === 'female' 
    ? 'bg-pink-100 text-pink-600' 
    : 'bg-blue-100 text-blue-600';

  const Icon = gender === 'female' ? UserCheck : UserX;

  return (
    <div className={cn(
      'rounded-full flex items-center justify-center',
      sizeClasses[size],
      avatarStyle,
      className
    )}>
      <Icon className={iconSizes[size]} />
    </div>
  );
}

// Emoji-based alternative
export function UserEmojiAvatar({ gender = 'male', size = 'md', className }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base'
  };

  const emoji = gender === 'female' ? '👩' : '👨';

  return (
    <div className={cn(
      'rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center border border-primary/20',
      sizeClasses[size],
      className
    )}>
      <span>{emoji}</span>
    </div>
  );
}