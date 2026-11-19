'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type Phase = 'idle' | 'loading' | 'done';

/**
 * Thin top progress bar for page navigation. The current page stays fully
 * visible while the next one loads (no blank screen); the bar starts the moment
 * an internal link is clicked and completes when the new route renders.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');

  // Start on internal link clicks
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page / hash link
      setPhase('loading');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Complete when the route changes
  useEffect(() => {
    setPhase((p) => (p === 'loading' ? 'done' : p));
  }, [pathname]);

  // Hide after the completion animation; safety reset if navigation never lands
  useEffect(() => {
    if (phase === 'done') {
      const t = setTimeout(() => setPhase('idle'), 400);
      return () => clearTimeout(t);
    }
    if (phase === 'loading') {
      const t = setTimeout(() => setPhase('idle'), 15000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === 'idle') return null;
  return <span className={`nav-progress nav-progress--${phase}`} aria-hidden="true" />;
}
