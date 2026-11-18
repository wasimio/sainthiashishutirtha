'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';

interface CmsVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  caption?: string;
  className?: string;
  autoPlay?: boolean;
}

export default function CmsVideoPlayer({
  src,
  poster,
  title,
  caption,
  className = '',
  autoPlay = false,
}: CmsVideoPlayerProps) {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = resolvePublicMediaUrl(src);
  const resolvedPoster = poster ? resolvePublicMediaUrl(poster) : undefined;

  if (hasError || !resolvedSrc) {
    return (
      <div className={`rounded-2xl border border-amber-200 bg-amber-50/60 p-6 text-center space-y-2 ${className}`}>
        <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
        <h4 className="text-xs font-bold text-amber-900">Video Unavailable</h4>
        <p className="text-[11px] text-amber-700 max-w-sm mx-auto">
          {title ? `"${title}"` : 'This video'} cannot be played directly in your browser. Please check back later or contact the school office.
        </p>
      </div>
    );
  }

  return (
    <figure className={`overflow-hidden rounded-2xl bg-black border border-slate-200 shadow-xs ${className}`}>
      <div className="relative aspect-video w-full bg-zinc-950 flex items-center justify-center">
        <video
          controls
          playsInline
          autoPlay={autoPlay}
          preload="metadata"
          poster={resolvedPoster}
          onError={() => setHasError(true)}
          className="h-full w-full object-contain"
          aria-label={title || 'School Video'}
        >
          <source src={resolvedSrc} type={resolvedSrc.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
          Your browser does not support the HTML5 video element.
        </video>
      </div>

      {(title || caption) && (
        <figcaption className="p-3 bg-white border-t border-slate-100 text-slate-700">
          {title && <h4 className="text-xs font-bold text-[#243B43]">{title}</h4>}
          {caption && <p className="text-[11px] text-slate-500 mt-0.5">{caption}</p>}
        </figcaption>
      )}
    </figure>
  );
}
