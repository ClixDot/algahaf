'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import SmoothScrollProvider from '../common/SmoothScrollProvider';
import ScrollToTop from '../common/ScrollToTop';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingActions from './FloatingActions';

interface WebsiteShellProps {
  children: React.ReactNode;
}

export default function WebsiteShell({ children }: WebsiteShellProps) {
  const pathname = usePathname();
  const [transitionKey, setTransitionKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathname = useRef(pathname);

  // Trigger transition class whenever pathname changes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setTransitionKey((k) => k + 1);
      setIsTransitioning(true);

      // Remove class after animation completes so it can re-trigger next nav
      const timer = setTimeout(() => setIsTransitioning(false), 400);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SmoothScrollProvider>
      <div
        className="alghaf-app"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '100%',
          overflowX: 'clip',
        }}
      >
        <ScrollToTop />
        <Navbar />
        <div
          key={transitionKey}
          className={isTransitioning ? 'page-transition-enter' : undefined}
          style={{ flex: 1, width: '100%', maxWidth: '100%', overflowX: 'clip' }}
        >
          {children}
        </div>
        <FloatingActions />
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
