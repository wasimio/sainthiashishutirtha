'use client';

import React from 'react';
import {
  Calendar,
  Pin,
  Info
} from 'lucide-react';
import { ADMIN_CMS_NOTICES } from '@/data/portalAdminData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ParentNoticesPage() {
  const publishedNotices = ADMIN_CMS_NOTICES.filter((n) => n.status === 'Published');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              School Communication
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Official Campus Noticeboard
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            School Notices & Administrative Circulars
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Important announcements, holiday schedules, examination notices, and parent meeting circulars.
          </p>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="p-3.5 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-start gap-3">
        <Info className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-700 space-y-0.5">
          <span className="font-semibold text-zinc-950 block">Synchronized Noticeboard</span>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            All circulars published here are official notifications issued by the Principal and Governing Council of Sainthia Shishutirtha.
          </p>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {publishedNotices.map((notice) => (
          <Card key={notice.id} className="border-zinc-200/90 shadow-xs hover:border-zinc-300 transition-colors">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {notice.pinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                      <Pin className="w-3 h-3 fill-zinc-900" />
                      <span>Pinned</span>
                    </span>
                  )}
                  <Badge variant="zinc" className="text-[10px]">
                    {notice.category}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Published: {notice.publishDate}</span>
                </div>
              </div>

              <CardTitle className="text-base font-bold text-zinc-950 mt-1">
                {notice.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-3 space-y-3">
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed bg-zinc-50/70 p-3.5 rounded-xl border border-zinc-200/60">
                {notice.content}
              </p>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                <span>Issued by: <strong className="text-zinc-800">{notice.author}</strong></span>
                <span className="text-zinc-400">Sainthia Shishutirtha Office</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
