'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Layers,
  Image as ImageIcon,
  Box,
  Compass,
  Footprints,
  MessageSquare,
  Globe,
  Settings,
  Users,
  History,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import './admin.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on login page, skip layout shell
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // If session is already verified, do not re-fetch and freeze UI on every route change
    if (currentUser) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        if (data.authenticated) {
          setCurrentUser(data.user);
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [isLoginPage, currentUser, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--admin-bg)',
          color: 'var(--admin-text-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--admin-font)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img
            src="/assets/logos/AlGhaf_logo_-05.png"
            alt="AlGhaf"
            style={{ height: '42px', margin: '0 auto 1.25rem auto' }}
          />
          <p style={{ color: 'var(--admin-forest)', fontSize: '0.92rem', fontWeight: 600, letterSpacing: '0.04em' }}>
            Loading AlGhaf Console...
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Website Pages', path: '/admin/pages', icon: FileText },
    { label: 'Product Details CMS', path: '/admin/products', icon: Box },
    { label: 'Media Library', path: '/admin/media', icon: ImageIcon },
    { label: 'Footer Management', path: '/admin/footer', icon: Footprints },
    { label: 'Contact & Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { label: 'Admin Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="admin-body" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--admin-bg)' }}>
      {/* Sidebar */}
      <aside
        className="admin-sidebar"
        style={{
          display: 'flex',
          ...(mobileSidebarOpen
            ? { position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 999 }
            : {}),
        }}
      >
        <div className="admin-sidebar-header">
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
            <img src="/assets/logos/AlGhaf_logo_-05.png" alt="AlGhaf" style={{ height: '36px', width: 'auto' }} />
            <div>
              <div style={{ color: 'var(--admin-text-main)', fontWeight: 700, fontSize: '0.98rem', letterSpacing: '0.03em', fontFamily: 'var(--admin-font-display)' }}>
                ALGHAF
              </div>
              <div style={{ color: 'var(--admin-forest)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em' }}>
                ADMIN CONSOLE
              </div>
            </div>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="desktop-hidden"
            style={{ background: 'none', border: 'none', color: 'var(--admin-text-main)', display: 'none', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon size={18} color={isActive ? 'var(--admin-forest)' : 'currentColor'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User bar at bottom */}
        <div
          style={{
            padding: '1.25rem 1.4rem',
            borderTop: '1px solid var(--admin-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--admin-surface-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--admin-forest)',
                color: '#FAF8F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
                {currentUser?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--admin-forest)', fontWeight: 600, textTransform: 'capitalize' }}>
                {currentUser?.role || 'Super Admin'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--admin-text-muted)',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--admin-danger)';
              e.currentTarget.style.backgroundColor = 'var(--admin-danger-tint)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--admin-text-muted)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: 'var(--admin-bg)' }}>
        {/* Top Header */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--admin-text-main)',
                cursor: 'pointer',
                display: 'none',
              }}
              className="mobile-nav-toggle-admin"
            >
              <Menu size={22} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
              <span>Console</span>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--admin-forest)', fontWeight: 600, textTransform: 'capitalize' }}>
                {pathname.replace('/admin', '').replace('/', '') || 'Overview'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
            >
              <ExternalLink size={14} color="var(--admin-forest)" />
              <span>Live Website</span>
            </a>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.85rem',
                backgroundColor: 'var(--admin-forest-tint)',
                border: '1px solid var(--admin-forest-border)',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--admin-forest)',
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--admin-forest)' }} />
              MongoDB Connected
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
