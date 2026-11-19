'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import SmoothScrollProvider from '../common/SmoothScrollProvider';
import ScrollToTop from '../common/ScrollToTop';
import NavigationProgress from '../common/NavigationProgress';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingActions from './FloatingActions';

interface WebsiteShellProps {
  children: React.ReactNode;
}

export default function WebsiteShell({ children }: WebsiteShellProps) {
  const pathname = usePathname();
  // Skip the enter animation on the very first paint (no flash on initial load);
  // every client-side navigation after that remounts the wrapper (key=pathname)
  // and plays it once. Keying directly on pathname avoids the old
  // render-then-remount cycle that mounted every new page twice.
  const [firstPath] = useState(pathname);
  const [hasNavigated, setHasNavigated] = useState(false);
  if (!hasNavigated && pathname !== firstPath) setHasNavigated(true);

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
        <NavigationProgress />
        <Navbar />
        <div
          key={pathname}
          className={hasNavigated ? 'page-transition-enter' : undefined}
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
