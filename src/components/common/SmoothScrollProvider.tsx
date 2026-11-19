'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin once globally
gsap.registerPlugin(ScrollTrigger);

const SmoothScrollContext = createContext(null);

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Keep ScrollTrigger enabled for reduced motion without smoothing
      ScrollTrigger.refresh();
      return;
    }

    // Lerp-based smoothing: each frame closes 10% of the remaining distance.
    // Unlike a fixed `duration`, it stays responsive to fast/continuous wheel
    // input (no "laggy" feel) while still gliding smoothly to a stop.
    // Touch devices keep native momentum scrolling (syncTouch: false), which
    // is the fastest and most natural feel on phones.
    const lenis = new Lenis({
      lerp: 0.1,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      infinite: false,
      // Let modals/drawers/menus marked data-lenis-prevent scroll natively,
      // and allow nested scrollable areas to scroll without fighting Lenis.
      allowNestedScroll: true,
      // Clicking a Next.js <Link> mid-scroll stops leftover inertia so the
      // new page doesn't keep drifting.
      stopInertiaOnNavigate: true,
      autoRaf: false // Controlled strictly by GSAP ticker for 100% synchronicity
    });

    lenisRef.current = lenis;
    (window as any).lenis = lenis;

    // Synchronize Lenis scroll position with GSAP ScrollTrigger updates
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis frames via GSAP ticker to eliminate frame race conditions
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after web fonts finish rendering
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    // Refresh on window load (when all images are decoded)
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', handleLoad);

    // Handle internal anchor clicks smoothly via Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('a[href^="#"]');
      if (target) {
        const href = target.getAttribute('href');
        if (href && href !== '#' && href.startsWith('#')) {
          const el = document.querySelector<HTMLElement>(href);
          if (el) {
            e.preventDefault();
            lenis.scrollTo(el, { offset: -70, duration: 1.2 });
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('load', handleLoad);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as any).lenis;
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenisRef.current}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
