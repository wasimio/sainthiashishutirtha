'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { ImageIcon } from 'lucide-react';
import { resolvePublicMediaUrl, type MediaAssetReference } from '@/lib/media/resolveMediaUrl';

export interface CmsImageProps extends Omit<ImageProps, 'src'> {
  src: string | MediaAssetReference | null | undefined;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  placeholderText?: string;
}

/**
 * Checks whether a URL is a trusted direct-delivery media asset (e.g. Supabase Storage public CDN).
 * Direct browser delivery avoids server-side image optimizer SSRF risks and DNS64 private-IP translation
 * while preserving Next.js Image layout, responsive sizing, and fallback behavior.
 */
function isDirectDeliveryUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith('.supabase.co') || parsed.hostname === 'supabase.co';
  } catch {
    return url.includes('.supabase.co');
  }
}

export default function CmsImage({
  src,
  alt,
  className = '',
  fallbackSrc,
  placeholderText = 'Image not available',
  fill,
  sizes,
  priority,
  loading,
  onError,
  unoptimized,
  ...rest
}: CmsImageProps) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const primarySrc = resolvePublicMediaUrl(src);
  const resolvedFallback = fallbackSrc ? resolvePublicMediaUrl(fallbackSrc) : '';
  const currentSrc = [primarySrc, resolvedFallback].find((candidate) => candidate && !failedSources.includes(candidate)) || '';

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setFailedSources((failed) => failed.includes(currentSrc) ? failed : [...failed, currentSrc]);
    if (onError) {
      onError(e);
    }
  };

  if (!currentSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 ${
          fill ? 'absolute inset-0 w-full h-full' : ''
        } ${className}`}
        role="img"
        aria-label={alt || placeholderText}
      >
        <ImageIcon className="w-8 h-8 text-slate-300 mb-1" />
        <span className="text-[10px] text-slate-500 font-medium text-center">{placeholderText}</span>
      </div>
    );
  }

  // Use direct browser delivery for trusted Supabase images, standard optimizer otherwise
  const shouldBypassOptimizer = unoptimized ?? isDirectDeliveryUrl(currentSrc);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : loading || 'lazy'}
      onError={handleError}
      className={className}
      unoptimized={shouldBypassOptimizer}
      {...rest}
    />
  );
}
