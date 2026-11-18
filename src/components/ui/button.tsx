import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs sm:text-sm font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D95D39] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[#1A535C] text-white shadow-xs hover:bg-[#133E45] active:scale-[0.98]',
        terracotta:
          'bg-[#D95D39] text-white shadow-xs hover:bg-[#B84725] active:scale-[0.98]',
        secondary:
          'bg-[#FDFBF7] text-[#1A535C] border border-[#EADBCE] hover:bg-[#F7F3EB] active:scale-[0.98]',
        outline:
          'border border-[#EADBCE] bg-white hover:bg-[#FDFBF7] text-[#14383F] hover:border-[#1A535C] shadow-2xs',
        green:
          'bg-[#4E8752] text-white shadow-xs hover:bg-[#3E6D41] active:scale-[0.98]',
        dark:
          'bg-zinc-900 text-zinc-50 shadow-xs hover:bg-zinc-800 active:scale-[0.98]',
        destructive:
          'bg-[#C62828] text-white shadow-xs hover:bg-[#B71C1C] active:scale-[0.98]',
        monochromeOutline:
          'border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 text-zinc-700 shadow-2xs',
        monochromeSecondary:
          'bg-zinc-100 text-zinc-900 hover:bg-zinc-200/80 border border-zinc-200/60',
        ghost:
          'hover:bg-[#E8F2F3] text-[#14383F] hover:text-[#1A535C]',
        monochromeGhost:
          'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950',
        link:
          'text-[#1A535C] underline-offset-4 hover:underline hover:text-[#D95D39]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-11 rounded-xl px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
