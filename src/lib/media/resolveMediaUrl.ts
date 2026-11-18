/**
 * Pure client-safe and server-safe public media URL resolver.
 * Free of Next.js 'use cache' or server-only dependencies.
 */

export interface MediaAssetReference {
  id?: string;
  storage_provider?: string | null;
  file_path?: string;
  public_url?: string | null;
  url?: string;
}

export interface NoticeAttachmentItem {
  id?: string | null;
  url: string;
  title: string;
  fileSize?: number | null;
  mimeType?: string;
  storageProvider?: string;
}

/**
 * Robust parser for notice attachments stored as structured JSON arrays or legacy plain paths.
 */
export function parseNoticeAttachments(raw?: string | null): NoticeAttachmentItem[] {
  if (!raw || !raw.trim()) return [];
  const trimmed = raw.trim();
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Legacy attachment JSON has no enforced historical schema.
          .map((item: any) => ({
            id: item.id || item.assetId || null,
            url: item.url || item.path || item.file_path || '',
            title: item.title || item.name || item.file_name || 'Document.pdf',
            fileSize:
              typeof item.fileSize === 'number'
                ? item.fileSize
                : typeof item.file_size === 'number'
                ? item.file_size
                : typeof item.size === 'number'
                ? item.size
                : null,
            mimeType: item.mimeType || item.mime_type || 'application/pdf',
            storageProvider: item.storageProvider || item.storage_provider || 'supabase',
          }))
          .filter((a: NoticeAttachmentItem) => Boolean(a.url));
      } else if (parsed && typeof parsed === 'object') {
        const item = parsed;
        const url = item.url || item.path || item.file_path || '';
        if (url) {
          return [
            {
              id: item.id || item.assetId || null,
              url,
              title: item.title || item.name || item.file_name || 'Document.pdf',
              fileSize:
                typeof item.fileSize === 'number'
                  ? item.fileSize
                  : typeof item.file_size === 'number'
                  ? item.file_size
                  : typeof item.size === 'number'
                  ? item.size
                  : null,
              mimeType: item.mimeType || item.mime_type || 'application/pdf',
              storageProvider: item.storageProvider || item.storage_provider || 'supabase',
            },
          ];
        }
      }
    } catch {
      // not valid JSON, treat as legacy single string
    }
  }

  // Single string fallback
  const clean = trimmed.split('?')[0];
  const name = clean.split('/').pop() || 'Notice Document.pdf';
  return [
    {
      id: null,
      url: trimmed,
      title: decodeURIComponent(name),
      fileSize: null,
      mimeType: 'application/pdf',
      storageProvider: 'supabase',
    },
  ];
}

/**
 * Resolves any media path or asset object to an absolute public URL.
 * Handles:
 * 1. Absolute URLs (e.g. https://... or http://...)
 * 2. Supabase storage absolute/relative paths (e.g. /storage/v1/object/public/...)
 * 3. Supabase prefixed paths (supabase:uploads/...)
 * 4. Hostinger-hosted media assets (resolved via NEXT_PUBLIC_HOSTINGER_MEDIA_URL / HOSTINGER_MEDIA_PUBLIC_URL)
 * 5. Supabase-hosted media assets (resolved via NEXT_PUBLIC_SUPABASE_URL/storage/v1/object/public/public-media/...)
 */
export function resolvePublicMediaUrl(
  media: string | MediaAssetReference | null | undefined
): string {
  if (!media) return '';

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '');
  const hostingerBase = (
    process.env.NEXT_PUBLIC_HOSTINGER_MEDIA_URL ||
    process.env.HOSTINGER_MEDIA_PUBLIC_URL ||
    ''
  ).replace(/\/+$/, '');

  if (typeof media === 'string') {
    const trimmed = media.trim();
    if (!trimmed) return '';

    // 0. JSON attachment array handling
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      const parsed = parseNoticeAttachments(trimmed);
      if (parsed.length > 0) {
        return resolvePublicMediaUrl(parsed[0].url);
      }
      return '';
    }

    // 1. Absolute URLs (Supabase, Unsplash, Hostinger, CDN) remain exactly as recorded
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    // 2. Relative Supabase storage path already specifying bucket
    if (trimmed.startsWith('/storage/v1/object/public/')) {
      return supabaseUrl ? `${supabaseUrl}${trimmed}` : trimmed;
    }

    // 3. Supabase explicit prefix: supabase:uploads/...
    if (trimmed.startsWith('supabase:')) {
      const cleanPath = trimmed.replace(/^supabase:/, '').replace(/^\/+/, '');
      return `${supabaseUrl}/storage/v1/object/public/public-media/${cleanPath}`;
    }

    // 4. Supabase public-media bucket path: public-media/...
    if (trimmed.startsWith('public-media/')) {
      const cleanPath = trimmed.replace(/^\/+/, '');
      return `${supabaseUrl}/storage/v1/object/public/${cleanPath}`;
    }

    // 5. Hostinger prefix or designated upload path: hostinger:uploads/... or uploads/...
    if (trimmed.startsWith('hostinger:') || trimmed.startsWith('uploads/')) {
      let cleanPath = trimmed.replace(/^hostinger:/, '').replace(/^\/+/, '');
      if (hostingerBase.endsWith('/uploads') && cleanPath.startsWith('uploads/')) {
        cleanPath = cleanPath.slice('uploads/'.length);
      }
      return hostingerBase ? `${hostingerBase}/${cleanPath}` : `/${cleanPath}`;
    }

    // 6. Default to Supabase Storage public-media bucket
    const cleanPath = trimmed.replace(/^\/+/, '');
    return `${supabaseUrl}/storage/v1/object/public/public-media/${cleanPath}`;
  }

  // Object reference: Always prioritize recorded public_url if available
  if (media.public_url && (media.public_url.startsWith('http://') || media.public_url.startsWith('https://'))) {
    return media.public_url;
  }

  // Object reference: Respect recorded storage_provider
  if (media.storage_provider === 'hostinger') {
    let cleanPath = (media.file_path || '').replace(/^\/+/, '');
    if (hostingerBase.endsWith('/uploads') && cleanPath.startsWith('uploads/')) {
      cleanPath = cleanPath.slice('uploads/'.length);
    }
    return hostingerBase ? `${hostingerBase}/${cleanPath}` : `/${cleanPath}`;
  }

  if (media.storage_provider === 'supabase') {
    const cleanPath = (media.file_path || '').replace(/^\/+/, '');
    return `${supabaseUrl}/storage/v1/object/public/public-media/${cleanPath}`;
  }

  // Default fallback for unstated provider
  const cleanPath = (media.file_path || '').replace(/^\/+/, '');
  return `${supabaseUrl}/storage/v1/object/public/public-media/${cleanPath}`;
}
