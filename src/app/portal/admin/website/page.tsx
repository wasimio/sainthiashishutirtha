'use client';

import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Pin,
  Eye,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileText,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import Link from 'next/link';
import {
  getNotices,
  createNotice,
  deleteNotice,
  NoticeRow,
} from '@/lib/services/adminService';

export default function AdminWebsiteCmsPage() {
  const [notices, setNotices] = useState<NoticeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeRow | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Academic' | 'Holiday' | 'Admission' | 'Circular'>('Academic');
  const [newAudience, setNewAudience] = useState<'All' | 'Public' | 'Staff Only' | 'Parents Only'>('All');
  const [newContent, setNewContent] = useState('');
  const [newIsPinned, setNewIsPinned] = useState(false);
  const [newStatus, setNewStatus] = useState<'Published' | 'Draft'>('Published');

  const refreshData = () => {
    getNotices()
      .then((data) => {
        setNotices(data);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to query CMS notices.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getNotices()
      .then((data) => {
        if (isMounted) {
          setNotices(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error('Failed to load notices:', err);
          setError(err instanceof Error ? err.message : 'Failed to query CMS notices.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please fill out notice title and content.');
      return;
    }

    try {
      setSubmitting(true);
      await createNotice({
        title: newTitle.trim(),
        category: newCategory,
        targetAudience: newAudience,
        content: newContent.trim(),
        isPinned: newIsPinned,
        status: newStatus,
      });

      showToast(`Notice "${newTitle}" created successfully.`);
      setIsCreateOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewIsPinned(false);
      refreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to publish notice.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete notice "${title}"?`)) return;

    try {
      await deleteNotice(id);
      showToast(`Notice "${title}" removed.`);
      refreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete notice.');
    }
  };

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || n.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Website CMS
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              {notices.length} Total Notices
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Website Notices & CMS Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Publish official school circulars, admission bulletins, academic announcements, and holiday schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="monochromeOutline"
            size="sm"
            asChild
            className="text-xs h-8 gap-1.5"
          >
            <Link href="/notices" target="_blank">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Noticeboard</span>
            </Link>
          </Button>

          <Button
            variant="dark"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="text-xs h-8 gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Publish New Notice</span>
          </Button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-zinc-950 text-white text-xs rounded-lg shadow-md flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="text-zinc-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-semibold block">CMS Sync Notice</span>
            <p className="text-amber-700 text-[11px] mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* CMS Module Navigation Tabs */}
      <div className="flex flex-wrap border-b border-zinc-200 gap-6 text-xs font-medium">
        <div className="pb-2.5 border-b-2 border-zinc-950 font-bold text-zinc-950 flex items-center gap-1.5 cursor-pointer">
          <FileText className="w-3.5 h-3.5" />
          <span>Notices & Circulars ({notices.length})</span>
        </div>

        <Link
          href="/portal/admin/website#pages"
          className="pb-2.5 text-zinc-500 hover:text-zinc-900 border-b-2 border-transparent flex items-center gap-1.5 transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Pages & Sections (Slice 3)</span>
        </Link>

        <Link
          href="/portal/admin/website#media"
          className="pb-2.5 text-zinc-500 hover:text-zinc-900 border-b-2 border-transparent flex items-center gap-1.5 transition-colors"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Media & Gallery (Slice 5)</span>
        </Link>

        <Link
          href="/portal/admin/settings"
          className="pb-2.5 text-zinc-500 hover:text-zinc-900 border-b-2 border-transparent flex items-center gap-1.5 transition-colors ml-auto"
        >
          <span>School Profile & Hours →</span>
        </Link>
      </div>

      {/* Real CMS Notice Telemetry Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white border border-zinc-200 rounded-lg shadow-2xs">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Total Notices</div>
          <div className="text-xl font-bold text-zinc-950 mt-0.5">{loading ? '...' : notices.length}</div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Authoritative records</p>
        </div>
        <div className="p-3 bg-white border border-zinc-200 rounded-lg shadow-2xs">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Published</div>
          <div className="text-xl font-bold text-emerald-700 mt-0.5">
            {loading ? '...' : notices.filter((n) => n.status === 'Published').length}
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Live on public noticeboard</p>
        </div>
        <div className="p-3 bg-white border border-zinc-200 rounded-lg shadow-2xs">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Drafts</div>
          <div className="text-xl font-bold text-amber-700 mt-0.5">
            {loading ? '...' : notices.filter((n) => n.status === 'Draft').length}
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Unpublished work-in-progress</p>
        </div>
        <div className="p-3 bg-white border border-zinc-200 rounded-lg shadow-2xs">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Pinned Bulletins</div>
          <div className="text-xl font-bold text-blue-700 mt-0.5">
            {loading ? '...' : notices.filter((n) => n.is_pinned).length}
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Priority top banners</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notices by title or content..."
            className="h-9 text-xs border-zinc-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['All', 'Academic', 'Holiday', 'Admission', 'Circular'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-zinc-950 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center gap-2 text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-900" />
          <p className="text-xs">Loading published circulars and bulletins...</p>
        </div>
      ) : notices.length === 0 ? (
        <Card className="border-dashed border-2 border-zinc-200">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">No Website Notices Published Yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
              The public noticeboard is currently empty. Use the Publish New Notice button to broadcast announcements, admission circulars, or holiday calendars.
            </p>
            <Button
              variant="dark"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="text-xs"
            >
              + Publish First Notice
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-zinc-200/90 shadow-xs">
          <CardHeader className="pb-3 border-b border-zinc-100">
            <CardTitle className="text-sm font-semibold text-zinc-950">
              Institutional Circulars & News Ledger
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Active bulletins synchronized to public noticeboard and user portal dashboards.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/70 border-b border-zinc-200">
                  <TableHead className="text-[11px]">Notice Details</TableHead>
                  <TableHead className="text-[11px]">Category</TableHead>
                  <TableHead className="text-[11px]">Audience</TableHead>
                  <TableHead className="text-[11px]">Published Date</TableHead>
                  <TableHead className="text-[11px]">Status</TableHead>
                  <TableHead className="text-right text-[11px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotices.map((n) => (
                  <TableRow key={n.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 text-xs">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {n.is_pinned && <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-500" />}
                        <span className="font-semibold text-zinc-950">{n.title}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{n.content}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="zinc" className="text-[10px]">
                        {n.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-600 text-[11px]">{n.target_audience}</TableCell>
                    <TableCell className="font-mono text-zinc-500 text-[11px]">
                      {n.published_at ? n.published_at.split('T')[0] : 'Draft'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={n.status === 'Published' ? 'dark' : 'zinc'}
                        className="text-[10px]"
                      >
                        {n.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="monochromeOutline"
                          size="sm"
                          onClick={() => setSelectedNotice(n)}
                          className="h-7 text-xs px-2 rounded-md"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          <span>View</span>
                        </Button>
                        <Button
                          variant="monochromeOutline"
                          size="sm"
                          onClick={() => handleDeleteNotice(n.id, n.title)}
                          className="h-7 text-xs px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* MODAL: Create Notice */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md border-zinc-200">
          <form onSubmit={handleCreateNotice}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-950">Publish Website Notice</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Post an official announcement to the school website and portal noticeboards.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 text-xs">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Notice Title *</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Admission Circular 2026–2027"
                  required
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as 'Academic' | 'Holiday' | 'Admission' | 'Circular')}
                    className="w-full h-8 text-xs rounded-md border border-zinc-200 bg-white px-2.5 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-950"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Admission">Admission</option>
                    <option value="Circular">Circular</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Target Audience</label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value as 'All' | 'Public' | 'Staff Only' | 'Parents Only')}
                    className="w-full h-8 text-xs rounded-md border border-zinc-200 bg-white px-2.5 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-950"
                  >
                    <option value="All">All Audiences</option>
                    <option value="Public">Public Only</option>
                    <option value="Parents Only">Parents Only</option>
                    <option value="Staff Only">Staff Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Content / Announcement Body *</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Official notice text, instructions, dates, or guidelines..."
                  required
                  className="w-full text-xs rounded-md border border-zinc-200 bg-white p-2.5 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as 'Published' | 'Draft')}
                    className="w-full h-8 text-xs rounded-md border border-zinc-200 bg-white px-2.5 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-950"
                  >
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsPinned}
                      onChange={(e) => setNewIsPinned(e.target.checked)}
                      className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                    />
                    <span className="text-xs text-zinc-700 font-medium">Pin to Top of Noticeboard</span>
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="monochromeOutline" size="sm" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="dark" size="sm" disabled={submitting}>
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Publish Circular
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: View Notice */}
      {selectedNotice && (
        <Dialog open={!!selectedNotice} onOpenChange={(open) => !open && setSelectedNotice(null)}>
          <DialogContent className="max-w-lg border-zinc-200">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="dark" className="text-[10px]">
                  {selectedNotice.category}
                </Badge>
                <span className="text-xs text-zinc-400 font-mono">
                  {selectedNotice.published_at ? selectedNotice.published_at.split('T')[0] : 'Draft'}
                </span>
                {selectedNotice.is_pinned && (
                  <Badge variant="zinc" className="text-[10px] text-amber-700 bg-amber-50">
                    Pinned
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-base font-bold text-zinc-950 mt-1">
                {selectedNotice.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Audience: {selectedNotice.target_audience}
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs text-zinc-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {selectedNotice.content}
            </div>

            <DialogFooter>
              <Button
                variant="dark"
                size="sm"
                onClick={() => setSelectedNotice(null)}
                className="text-xs"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
