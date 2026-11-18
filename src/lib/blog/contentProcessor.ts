import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';

/**
 * YouTube Embed & URL Validation
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;

    const host = parsed.hostname.toLowerCase();
    // youtu.be/ID
    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0]?.split('?')[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    // youtube.com, www.youtube.com, m.youtube.com, youtube-nocookie.com
    if (
      host === 'youtube.com' ||
      host === 'www.youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtube-nocookie.com' ||
      host === 'www.youtube-nocookie.com'
    ) {
      if (parsed.pathname === '/watch') {
        const id = parsed.searchParams.get('v');
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
      if (parsed.pathname.startsWith('/embed/')) {
        const id = parsed.pathname.replace('/embed/', '').split('/')[0]?.split('?')[0];
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.replace('/shorts/', '').split('/')[0]?.split('?')[0];
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function normalizeYouTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

/**
 * Validates a hyperlink URL. Blocks unsafe protocols (javascript:, data:, vbscript:).
 */
export function isValidHyperlink(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return true; // relative or anchor link
  try {
    const parsed = new URL(trimmed);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Checks if raw text is legacy Markdown rather than HTML.
 */
export function isMarkdownContent(raw: string): boolean {
  if (!raw || typeof raw !== 'string') return false;
  const trimmed = raw.trim();
  if (!trimmed) return false;

  // If it starts with common HTML container tags, treat as HTML
  if (/^<(!DOCTYPE|html|div|p|h[1-6]|figure|blockquote|ul|ol|table|section|article)/i.test(trimmed)) {
    return false;
  }

  // If it contains HTML block-level or paragraph tags, treat as HTML
  if (/<(p|h[1-6]|figure|blockquote|ul|ol|div|iframe)[\s>]/i.test(trimmed)) {
    return false;
  }

  // If it contains typical Markdown signatures: ###, **, -, 1., >
  const markdownTokens = /(^#{1,6}\s+|^\s*[-*+]\s+|^\s*\d+\.\s+|^\s*>\s+|\*\*[^*]+\*\*|_[^_]+_|\[.+\]\(.+\))/m;
  return markdownTokens.test(trimmed);
}

/**
 * Converts legacy Markdown or raw input to clean, semantic HTML.
 */
export function normalizeContentToHtml(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';

  if (isMarkdownContent(trimmed)) {
    try {
      const parsed = marked.parse(trimmed, { gfm: true, breaks: true });
      return typeof parsed === 'string' ? parsed : String(parsed);
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

/**
 * Sanitization configuration for blog posts.
 */
export const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr', 'blockquote',
    'ul', 'ol', 'li',
    'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'code', 'pre',
    'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'div', 'span', 'iframe',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel', 'title', 'class', 'className'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'data-asset-id', 'data-provider', 'data-caption', 'class', 'className'],
    figure: ['class', 'className', 'data-type'],
    figcaption: ['class', 'className'],
    table: ['class', 'className', 'style', 'data-type'],
    thead: ['class', 'className'],
    tbody: ['class', 'className'],
    tfoot: ['class', 'className'],
    tr: ['class', 'className', 'style'],
    th: ['colspan', 'rowspan', 'colwidth', 'scope', 'class', 'className', 'style'],
    td: ['colspan', 'rowspan', 'colwidth', 'class', 'className', 'style'],
    div: ['class', 'className', 'data-youtube-video', 'data-type', 'style'],
    span: ['class', 'className', 'style'],
    p: ['class', 'className', 'style'],
    h1: ['class', 'className'],
    h2: ['class', 'className'],
    h3: ['class', 'className'],
    h4: ['class', 'className'],
    h5: ['class', 'className'],
    h6: ['class', 'className'],
    blockquote: ['class', 'className'],
    ul: ['class', 'className'],
    ol: ['class', 'className'],
    li: ['class', 'className'],
    code: ['class', 'className'],
    pre: ['class', 'className'],
    iframe: [
      'src',
      'frameborder',
      'allow',
      'allowfullscreen',
      'title',
      'loading',
      'referrerpolicy',
      'sandbox',
      'class',
      'className',
    ],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: {
    img: ['http', 'https'],
    iframe: ['https'],
  },
  allowedIframeHostnames: [
    'www.youtube.com',
    'youtube.com',
    'www.youtube-nocookie.com',
    'youtube-nocookie.com',
  ],
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href || '';
      if (!isValidHyperlink(href)) {
        return { tagName: 'span', attribs: { class: 'text-slate-600' } };
      }
      const isExternal = href.startsWith('http://') || href.startsWith('https://');
      const updated: sanitizeHtml.Attributes = { ...attribs };
      if (isExternal) {
        updated.target = '_blank';
        updated.rel = 'noopener noreferrer';
      }
      return {
        tagName: 'a',
        attribs: updated,
      };
    },
    iframe: (tagName, attribs) => {
      const normalizedSrc = attribs.src ? normalizeYouTubeEmbedUrl(attribs.src) : null;
      if (!normalizedSrc) {
        return { tagName: 'div', attribs: { class: 'hidden' } };
      }
      const updated: sanitizeHtml.Attributes = {
        ...attribs,
        src: normalizedSrc,
        loading: 'lazy',
        referrerpolicy: 'strict-origin-when-cross-origin',
        sandbox: 'allow-scripts allow-same-origin allow-presentation',
        class: 'w-full h-full border-0 absolute top-0 left-0',
      };
      delete updated.width;
      delete updated.height;
      return {
        tagName: 'iframe',
        attribs: updated,
      };
    },
  },
};

/**
 * Sanitizes blog HTML according to strict whitelist rules.
 * Automatically wraps tables in responsive scrolling containers.
 */
export function sanitizeBlogHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  const sanitized = sanitizeHtml(html, SANITIZE_OPTIONS);

  // Wrap any top-level or unwrapped <table> tags in <div class="table-wrapper"> for mobile horizontal scrolling
  return sanitized.replace(
    /(?:<div class="table-wrapper[^"]*">)?\s*(<table[\s\S]*?<\/table>)\s*(?:<\/div>)?/gi,
    (match, table) => `<div class="table-wrapper">${table}</div>`
  );
}

/**
 * Extracts a plain text excerpt from HTML or Markdown, stripping all tags.
 */
export function extractPlainTextSnippet(content: string, maxLength = 160): string {
  if (!content || typeof content !== 'string') return '';
  const normalized = normalizeContentToHtml(content);
  const plainText = normalized
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).trim() + '...';
}

/**
 * Calculates estimated reading time in minutes (~200 words per minute).
 */
export function calculateReadingTimeMinutes(content: string): number {
  const plainText = extractPlainTextSnippet(content, 100000);
  const words = plainText.split(/\s+/).filter(Boolean);
  return Math.max(1, Math.ceil(words.length / 200));
}
