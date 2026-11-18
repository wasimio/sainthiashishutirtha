import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#D95D39] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#1A535C] text-white shadow-2xs',
        secondary:
          'border-[#EADBCE] bg-[#FDFBF7] text-[#1A535C]',
        terracotta:
          'border-transparent bg-[#D95D39] text-white shadow-2xs',
        teal:
          'border-transparent bg-[#1A535C] text-white shadow-2xs',
        mustard:
          'border-[#F39C12]/40 bg-[#FEF5E7] text-[#B87004]',
        green:
          'border-[#4E8752]/30 bg-[#EDF5EE] text-[#3E6D41]',
        important:
          'border-[#D97706]/40 bg-[#FEF3C7] text-[#B45309]',
        emergency:
          'border-[#C62828]/40 bg-[#FEE2E2] text-[#B91C1C] animate-pulse',
        dark:
          'border-transparent bg-zinc-900 text-white shadow-2xs',
        zinc:
          'border-zinc-200 bg-zinc-100 text-zinc-900',
        destructive:
          'border-red-200 bg-red-50 text-red-700',
        outline:
          'border-[#EADBCE] text-[#14383F] bg-white',
        success:
          'border-[#4E8752]/30 bg-[#EDF5EE] text-[#3E6D41]',
        warning:
          'border-amber-200 bg-amber-50 text-amber-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
