export interface VisitorStats {
  total: number;
  today: number;
  yesterday?: number;
  month: number;
  pageViews?: number;
}

const VISITOR_ID_KEY = 'mahamahiti_visitor_id';

/**
 * Returns a persistent anonymous visitor ID stored in localStorage.
 * Creates one if not present.
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'server_render';
  
  try {
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid || vid.trim().length === 0) {
      vid = `v_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    return vid;
  } catch (e) {
    return `v_temp_${Date.now()}`;
  }
}

/**
 * Tracks a page visit persistently on the backend
 */
export async function trackPageView(path?: string): Promise<VisitorStats | null> {
  try {
    const visitorId = getOrCreateVisitorId();
    const res = await fetch('/api/visitors/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        visitorId,
        path: path || (typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '/')
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.stats) {
        return data.stats;
      }
    }
  } catch (err) {
    console.warn('Analytics tracking warning:', err);
  }
  return null;
}

/**
 * Fetches current genuine visitor statistics without registering a new page view
 */
export async function getVisitorStats(): Promise<VisitorStats | null> {
  try {
    const res = await fetch('/api/visitors/stats');
    if (res.ok) {
      const data = await res.json();
      if (data.stats) {
        return data.stats;
      }
    }
  } catch (err) {
    console.warn('Analytics stats fetch warning:', err);
  }
  return null;
}
