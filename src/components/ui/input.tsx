import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl border border-[#EADBCE] bg-white px-3 py-2 text-xs sm:text-sm text-[#243B43] shadow-2xs transition-colors file:border-0 file:bg-transparent file:text-xs file:font-semibold placeholder:text-slate-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D95D39] focus-visible:ring-offset-1 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
