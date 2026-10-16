'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  ExternalLink,
  Edit3,
  Layers,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  LayoutGrid,
  List,
} from 'lucide-react';

interface PageItem {
  _id?: string;
  slug: string;
  title: string;
  path: string;
  description?: string;
  sectionCount?: number;
  status: 'published' | 'draft';
  updatedAt?: string;
}

const DEFAULT_PAGES: PageItem[] = [
  {
    slug: 'home',
    title: 'Home',
    path: '/',
    description: 'Hero, brand origin, product highlights, applications, process overview, and enquiry trigger.',
    sectionCount: 8,
    status: 'published',
  },
  {
    slug: 'about',
    title: 'About',
    path: '/about',
    description: 'Heritage, modular philosophy, technical team, precision engineering, and sustainable vision.',
    sectionCount: 6,
    status: 'published',
  },
  {
    slug: 'products',
    title: 'Products',
    path: '/products',
    description: 'Architectural portfolio overview, category filters, and quick specifications.',
    sectionCount: 6,
    status: 'published',
  },
  {
    slug: 'mova',
    title: 'MOVA',
    path: '/products/mova',
    description: 'Complete MOVA product page: gallery, 35 sqm dimensions, specs, floor plans, and features.',
    sectionCount: 7,
    status: 'published',
  },
  {
    slug: 'penta',
    title: 'PENTA',
    path: '/products/penta',
    description: 'Complete PENTA product page: 120 sqm dimensions, layout configurations, and technical specs.',
    sectionCount: 7,
    status: 'published',
  },
  {
    slug: 'entra',
    title: 'ENTRA',
    path: '/products/entra',
    description: 'Complete ENTRA product page: 55 sqm dimensions, commercial adaptability, and technical highlights.',
    sectionCount: 7,
    status: 'published',
  },
  {
    slug: 'applications',
    title: 'Applications',
    path: '/applications',
    description: 'Private residences, luxury resorts, commercial offices, and educational pavilions.',
    sectionCount: 4,
    status: 'published',
  },
  {
    slug: 'contact',
    title: 'Contact',
    path: '/contact',
    description: 'Dubai Design District office, phone, direct WhatsApp, and consultation request form.',
    sectionCount: 4,
    status: 'published',
  },
];

// Helper to guarantee clean, simple page titles without extra suffixes (e.g. "Home", "About", "Products")
export const getCleanPageTitle = (page: { slug?: string; title?: string }) => {
  const s = (page.slug || '').toLowerCase();
  if (s === 'home') return 'Home';
  if (s === 'about') return 'About';
  if (s === 'products') return 'Products';
  if (s === 'applications') return 'Applications';
  if (s === 'contact') return 'Contact';
  if (s === 'mova') return 'MOVA';
  if (s === 'penta') return 'PENTA';
  if (s === 'entra') return 'ENTRA';
  if (page.title) {
    return page.title.split(/ [—–-] /)[0].trim();
  }
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Page';
};

export default function AdminPagesList() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/pages');
      if (res.ok) {
        const data = await res.json();
        if (data.pages && data.pages.length > 0) {
          setPages(data.pages.filter((p: PageItem) => p.slug !== 'process'));
        } else {
          // Initialize defaults
          setPages(DEFAULT_PAGES.filter((p: PageItem) => p.slug !== 'process'));
        }
      } else {
        setPages(DEFAULT_PAGES.filter((p: PageItem) => p.slug !== 'process'));
      }
    } catch {
      setPages(DEFAULT_PAGES.filter((p: PageItem) => p.slug !== 'process'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleQuickPublish = async (slug: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          action: nextStatus === 'published' ? 'publish' : 'unpublish',
        }),
      });

      if (res.ok) {
        setAlert({
          type: 'success',
          message: `Page "${slug}" status updated to ${nextStatus.toUpperCase()}`,
        });
        setPages((prev) =>
          prev.map((p) => (p.slug === slug ? { ...p, status: nextStatus } : p))
        );
      } else {
        setAlert({ type: 'error', message: 'Failed to update page status' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error updating status' });
    }
  };

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(search.toLowerCase()) ||
      page.slug.toLowerCase().includes(search.toLowerCase()) ||
      (page.description && page.description.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <FileText style={{ color: 'var(--admin-accent-gold)', width: 24, height: 24 }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0, letterSpacing: '0.02em' }}>
              Website Pages
            </h1>
          </div>
          <p style={{ color: 'var(--admin-text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Manage full-page metadata, section structure, live publishing, and drafts across all routes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            href="/admin/sections"
            className="admin-btn admin-btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <Layers size={16} />
            Section Registry
          </Link>
        </div>
      </div>

      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          <span>{alert.message}</span>
          <button
            onClick={() => setAlert(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Filter, Search, and View Mode Toolbar */}
      <div
        className="admin-card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div className="admin-search-bar" style={{ minWidth: '320px', flex: 1 }}>
          <Search size={18} style={{ color: 'var(--admin-text-muted)' }} />
          <input
            type="text"
            placeholder="Search pages by title, slug, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--admin-forest)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Status:
            </span>
            <select
              className="admin-select"
              style={{ width: 'auto', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Pages ({pages.length})</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>

          {/* View Mode Toggle: Grid vs List Cards */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'var(--admin-surface-muted)',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              padding: '0.2rem',
              gap: '0.2rem',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              title="Grid Cards View"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: viewMode === 'grid' ? 'var(--admin-forest)' : 'transparent',
                color: viewMode === 'grid' ? '#FAF8F5' : 'var(--admin-text-muted)',
                transition: 'all 0.2s',
              }}
            >
              <LayoutGrid size={15} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List Cards View"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: viewMode === 'list' ? 'var(--admin-forest)' : 'transparent',
                color: viewMode === 'list' ? '#FAF8F5' : 'var(--admin-text-muted)',
                transition: 'all 0.2s',
              }}
            >
              <List size={15} />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pages Container: Individual Separate Cards */}
      {loading ? (
        <div className="admin-card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          <Sparkles size={26} color="var(--admin-forest)" style={{ animation: 'spin 1.2s infinite', margin: '0 auto 1rem auto' }} />
          <p style={{ margin: 0, fontSize: '0.92rem' }}>Synchronizing website pages with database...</p>
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="admin-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          No pages found matching &ldquo;{search}&rdquo;.
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID MODE: Responsive 3-Column Luxury Cards */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.35rem',
          }}
        >
          {filteredPages.map((page) => {
            const liveUrl = page.path || `/${page.slug === 'home' ? '' : page.slug}`;
            return (
              <div
                key={page.slug}
                className="admin-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.65rem',
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--admin-border)',
                  boxShadow: 'var(--admin-shadow-sm)',
                  position: 'relative',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div>
                  {/* Card Header: Icon & Heading in 1 Row Level + Status Toggle Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      marginBottom: '0.9rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '9px',
                          backgroundColor: 'var(--admin-forest-tint)',
                          border: '1px solid var(--admin-forest-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--admin-forest)',
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={18} />
                      </div>

                      <Link
                        href={`/admin/pages/${page.slug}`}
                        style={{
                          fontFamily: "'Aftika', var(--admin-font-display), sans-serif",
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          letterSpacing: '-0.02em',
                          color: 'var(--admin-text-main)',
                          textDecoration: 'none',
                          lineHeight: 1.25,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={getCleanPageTitle(page)}
                      >
                        {getCleanPageTitle(page)}
                      </Link>
                    </div>

                    <button
                      onClick={() => handleQuickPublish(page.slug, page.status)}
                      title="Click to toggle Draft / Published"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                    >
                      <span className={`admin-badge ${page.status === 'published' ? 'admin-badge-published' : 'admin-badge-draft'}`}>
                        {page.status === 'published' ? (
                          <>
                            <CheckCircle size={12} /> Published
                          </>
                        ) : (
                          <>
                            <Clock size={12} /> Draft
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      margin: '0 0 1.25rem 0',
                      fontSize: '0.87rem',
                      color: 'var(--admin-text-muted)',
                      lineHeight: 1.5,
                      minHeight: '44px',
                    }}
                  >
                    {page.description || 'Core AlGhaf architectural page with dedicated modular content.'}
                  </p>
                </div>

                <div>
                  {/* Section Count Pill */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: 'var(--admin-surface-muted)',
                      border: '1px solid var(--admin-border)',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      fontSize: '0.8rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--admin-text-main)', fontWeight: 600 }}>
                      <Layers size={15} color="var(--admin-forest)" />
                      <span>{page.sectionCount ?? 5} Sections Configured</span>
                    </div>
                    <span style={{ color: 'var(--admin-forest)', fontSize: '0.74rem', fontWeight: 600 }}>Modular CMS</span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <Link
                      href={`/admin/pages/${page.slug}`}
                      className="admin-btn admin-btn-primary"
                      style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.84rem' }}
                      title="Edit page sections and content"
                    >
                      <Edit3 size={14} />
                      <span>Edit Page</span>
                      <ArrowRight size={14} />
                    </Link>
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '0.65rem 0.85rem' }}
                      title="View live website page in new tab"
                    >
                      <ExternalLink size={15} color="var(--admin-forest)" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST MODE: Wide Horizontal Separate Cards */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredPages.map((page) => {
            const liveUrl = page.path || `/${page.slug === 'home' ? '' : page.slug}`;
            return (
              <div
                key={page.slug}
                className="admin-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  padding: '1.4rem 1.75rem',
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--admin-border)',
                  boxShadow: 'var(--admin-shadow-sm)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '320px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--admin-forest-tint)',
                      border: '1px solid var(--admin-forest-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--admin-forest)',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={22} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <Link
                        href={`/admin/pages/${page.slug}`}
                        style={{
                          fontFamily: "'Aftika', var(--admin-font-display), sans-serif",
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          letterSpacing: '-0.02em',
                          color: 'var(--admin-text-main)',
                          textDecoration: 'none',
                        }}
                      >
                        {getCleanPageTitle(page)}
                      </Link>
                    </div>
                    <p
                      style={{
                        margin: '0.35rem 0 0 0',
                        fontSize: '0.86rem',
                        color: 'var(--admin-text-muted)',
                        lineHeight: 1.4,
                      }}
                    >
                      {page.description || 'Core AlGhaf architectural page with dedicated modular content.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      backgroundColor: 'var(--admin-surface-muted)',
                      border: '1px solid var(--admin-border)',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--admin-text-main)',
                    }}
                  >
                    <Layers size={14} color="var(--admin-forest)" />
                    {page.sectionCount ?? 5} Sections
                  </span>

                  <button
                    onClick={() => handleQuickPublish(page.slug, page.status)}
                    title="Click to toggle Draft / Published"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <span className={`admin-badge ${page.status === 'published' ? 'admin-badge-published' : 'admin-badge-draft'}`}>
                      {page.status === 'published' ? (
                        <>
                          <CheckCircle size={12} /> Published
                        </>
                      ) : (
                        <>
                          <Clock size={12} /> Draft
                        </>
                      )}
                    </span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Link
                      href={`/admin/pages/${page.slug}`}
                      className="admin-btn admin-btn-primary"
                      style={{ padding: '0.55rem 1rem', fontSize: '0.84rem' }}
                      title="Edit page sections and content"
                    >
                      <Edit3 size={14} />
                      <span>Edit Page</span>
                    </Link>
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '0.55rem 0.85rem' }}
                      title="View live website page in new tab"
                    >
                      <ExternalLink size={14} color="var(--admin-forest)" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Helpful Info Notice */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.25rem',
          backgroundColor: 'rgba(82, 105, 75, 0.15)',
          border: '1px solid rgba(82, 105, 75, 0.3)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Sparkles size={24} style={{ color: 'var(--admin-accent-gold)', flexShrink: 0 }} />
        <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--admin-text-main)' }}>Publishing Workflow:</strong> Each
          page allows full editing of hero titles, section ordering, visibility, and direct Cloudinary
          media replacement. Saving as a <em>Draft</em> keeps changes in your admin workspace. Clicking{' '}
          <em>Publish</em> updates the public website without interrupting ongoing visitors.
        </div>
      </div>
    </div>
  );
}
