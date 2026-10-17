/** One post as published in Vital.news' news.json (html is sanitized at build time). */
export interface NewsPost {
  slug:        string;
  title:       string;
  description: string;
  date:        string;
  author:      string;
  tags:        string[];
  cover:       string | null;
  path:        string;
  html:        string;
}

export interface NewsIndex {
  generated_at: string;
  commit:       string;
  count:        number;
  posts:        NewsPost[];
}

export type NewsLoadState = 'loading' | 'error' | 'done';

/** Short date label (fixed locale/timezone so server and client always match). */
export function fmt_post_date(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month:    'short',
    day:      'numeric',
    year:     'numeric',
    timeZone: 'UTC'
  });
}
