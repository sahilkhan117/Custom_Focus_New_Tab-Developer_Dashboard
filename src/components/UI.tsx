import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generic Panel component matching the design system
 */
export function Panel({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-black border border-zinc-900 rounded-3xl p-6 shadow-2xl", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Label/Title for sections
 */
export function SectionLabel({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-[10px] uppercase tracking-[0.2em] text-sky-500/50 font-black mb-3", className)} {...props}>
      {children}
    </p>
  );
}

/**
 * JetBrains Mono Text
 */
export function DataText({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("mono", className)}>{children}</span>;
}
