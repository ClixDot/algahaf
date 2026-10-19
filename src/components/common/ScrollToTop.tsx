'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Immediately snap scroll position to top using both Lenis and native API
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Kill all active ScrollTriggers from the previous page so they don't
    // fire on the incoming page's DOM elements
    ScrollTrigger.getAll().forEach((st) => st.kill());

    // Let the new page DOM and CSS animations finish (pageEnter = 0.35s),
    // then recalculate ScrollTrigger positions
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
