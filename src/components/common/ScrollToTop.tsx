'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    // Allow the DOM to settle then recalculate ScrollTrigger measurements
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
