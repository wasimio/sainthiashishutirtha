import React from 'react';
import { normalizeContentToHtml, sanitizeBlogHtml } from '@/lib/blog/contentProcessor';

interface BlogContentRendererProps {
  content: string;
  className?: string;
}

export default function BlogContentRenderer({
  content,
  className = '',
}: BlogContentRendererProps) {
  if (!content || !content.trim()) {
    return (
      <div className="text-slate-400 italic text-sm py-4">
        No content has been published yet.
      </div>
    );
  }

  // 1. Normalize legacy Markdown or raw string to HTML
  const rawHtml = normalizeContentToHtml(content);

  // 2. Pass through strict HTML sanitization boundary
  const sanitizedHtml = sanitizeBlogHtml(rawHtml);

  return (
    <div
      className={`public-blog-content prose prose-slate max-w-none text-fluid-body text-slate-800 leading-relaxed space-y-4 ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
