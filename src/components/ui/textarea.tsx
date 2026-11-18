import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-xl border border-[#EADBCE] bg-white px-3 py-2 text-xs sm:text-sm text-[#243B43] shadow-2xs placeholder:text-slate-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D95D39] focus-visible:ring-offset-1 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
