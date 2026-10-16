'use client';

import React, { useState, useEffect } from 'react';
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
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = pathname?.startsWith('/admin');

  // If in admin dashboard or admin login, do NOT render website navbar, footer, or public floating actions
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
        <div style={{ flex: 1, width: '100%', maxWidth: '100%', overflowX: 'clip' }}>
          {children}
        </div>
        <FloatingActions />
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
