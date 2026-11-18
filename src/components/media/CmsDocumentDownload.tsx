'use client';

import React from 'react';
import { FileText, Download } from 'lucide-react';
import { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';

interface CmsDocumentDownloadProps {
  filePathOrUrl: string;
  title: string;
  description?: string;
  fileSizeBytes?: number;
  className?: string;
}

export default function CmsDocumentDownload({
  filePathOrUrl,
  title,
  description,
  fileSizeBytes,
  className = '',
}: CmsDocumentDownloadProps) {
  const resolvedUrl = resolvePublicMediaUrl(filePathOrUrl);

  const formattedSize = fileSizeBytes
    ? fileSizeBytes > 1024 * 1024
      ? `${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
      : `${(fileSizeBytes / 1024).toFixed(0)} KB`
    : null;

  if (!resolvedUrl) return null;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#308599] transition-all group ${className}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-[#243B43] group-hover:text-[#308599] transition-colors truncate">
            {title}
          </h4>
          {description && <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{description}</p>}
          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
            <span>OFFICIAL PDF</span>
            {formattedSize && (
              <>
                <span>•</span>
                <span>{formattedSize}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <a
        href={resolvedUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="px-3 py-1.5 rounded-xl bg-[#EAF5F7] text-[#308599] hover:bg-[#308599] hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 shrink-0 ml-3"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Download</span>
      </a>
    </div>
  );
}
