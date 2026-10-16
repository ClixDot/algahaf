'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Layers,
  Box,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  UploadCloud,
  Eye,
  EyeOff,
  Compass,
  RefreshCw,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>({
    totalPages: 6,
    totalSections: 14,
    totalProducts: 3,
    totalMedia: 0,
    totalEnquiries: 0,
    newEnquiriesCount: 0,
    recentUpdates: [],
    recentEnquiries: [],
  });
  const [showApplicationsNav, setShowApplicationsNav] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTogglingNav, setIsTogglingNav] = useState(false);
  const [navAlert, setNavAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      const [res, sRes] = await Promise.all([
        fetch('/api/admin/overview').catch(() => null),
        fetch('/api/settings').catch(() => null),
      ]);

      if (res && res.ok) {
        const data = await res.json();
        setStats(data);
      }

      if (sRes && sRes.ok) {
        const sData = await sRes.json();
        if (sData?.settings && typeof sData.settings.showApplicationsNav === 'boolean') {
          setShowApplicationsNav(sData.settings.showApplicationsNav);
        } else if (sData?.settings && typeof sData.settings.applicationsComingSoon === 'boolean') {
          setShowApplicationsNav(!sData.settings.applicationsComingSoon);
        }
      }
    } catch (e) {
      console.error('Error fetching stats:', e);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  const handleToggleNav = async () => {
    const nextVal = !showApplicationsNav;
    setIsTogglingNav(true);
    setShowApplicationsNav(nextVal);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showApplicationsNav: nextVal,
          applicationsComingSoon: false,
        }),
      });
      if (res.ok) {
        setNavAlert({
          type: 'success',
          message: nextVal
            ? 'Applications navlink is now ACTIVE (Visible in website navbar & footer).'
            : 'Applications navlink has been REMOVED (Hidden from website navbar & footer).'
        });
        setTimeout(() => setNavAlert(null), 4000);
      } else {
        setShowApplicationsNav(!nextVal);
        const err = await res.json();
        setNavAlert({ type: 'error', message: err.error || 'Failed to update navlink setting' });
      }
    } catch (e: any) {
      setShowApplicationsNav(!nextVal);
      setNavAlert({ type: 'error', message: e.message || 'Error updating navlink' });
    } finally {
      setIsTogglingNav(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Website Pages', value: stats.totalPages, icon: FileText, link: '/admin/pages', color: '#C9A779' },
    { label: 'Active Sections', value: stats.totalSections, icon: Layers, link: '/admin/pages', color: '#88AB7F' },
    { label: 'Architectural Products', value: stats.totalProducts, icon: Box, link: '/admin/pages/products', color: '#C9A779' },
    { label: 'Media Library Assets', value: stats.totalMedia, icon: ImageIcon, link: '/admin/media', color: '#68B39B' },
    { label: 'New Enquiries', value: stats.newEnquiriesCount, icon: MessageSquare, link: '/admin/enquiries', color: '#7AAFFF', highlight: true },
    { label: 'Total Consultations', value: stats.totalEnquiries, icon: Sparkles, link: '/admin/enquiries', color: '#D9C5A0' },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Title & Quick Refresh */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--admin-font-display)',
              fontSize: '1.85rem',
              fontWeight: 700,
              color: 'var(--admin-text-main)',
              marginBottom: '0.25rem',
            }}
          >
            Dashboard Overview
          </h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>
            Live content management, architectural assets, and client project inquiries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchStats}
            className="admin-btn admin-btn-secondary"
            title="Refresh Data"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <Link href="/admin/media" className="admin-btn admin-btn-primary">
            <UploadCloud size={16} />
            <span>Upload Media</span>
          </Link>
        </div>
      </div>

      {/* Applications Navlink Visibility Toggle Banner */}
      <div
        className="admin-card"
        style={{
          marginBottom: '1.75rem',
          padding: '1.15rem 1.5rem',
          border: showApplicationsNav
            ? '1px solid rgba(62, 126, 78, 0.3)'
            : '1px solid rgba(192, 57, 43, 0.3)',
          backgroundColor: showApplicationsNav
            ? 'rgba(62, 126, 78, 0.04)'
            : 'rgba(192, 57, 43, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: showApplicationsNav ? 'rgba(62, 126, 78, 0.12)' : 'rgba(192, 57, 43, 0.12)',
              color: showApplicationsNav ? 'var(--admin-forest)' : '#C0392B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Compass size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--admin-text-main)' }}>
                Applications Navigation Link:
              </span>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  backgroundColor: showApplicationsNav ? 'rgba(62, 126, 78, 0.15)' : 'rgba(192, 57, 43, 0.15)',
                  color: showApplicationsNav ? '#3E7E4E' : '#C0392B',
                  border: showApplicationsNav ? '1px solid rgba(62, 126, 78, 0.3)' : '1px solid rgba(192, 57, 43, 0.3)',
                }}
              >
                {showApplicationsNav ? 'NAVLINK ACTIVE (SHOWN IN NAVBAR)' : 'NAVLINK HIDDEN (REMOVED FROM NAVBAR)'}
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>
              {showApplicationsNav
                ? "The 'Applications' link is currently active and visible in the website navbar and footer."
                : "The 'Applications' link is currently removed and hidden from all website navigation."}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            href="/admin/navigation"
            className="admin-btn admin-btn-secondary"
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
          >
            Navigation
          </Link>
          <button
            type="button"
            onClick={handleToggleNav}
            disabled={isTogglingNav}
            className="admin-btn"
            style={{
              backgroundColor: showApplicationsNav ? '#C0392B' : 'var(--admin-forest)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.82rem',
              padding: '0.45rem 1rem',
              cursor: isTogglingNav ? 'not-allowed' : 'pointer',
              opacity: isTogglingNav ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
            }}
          >
            {isTogglingNav ? (
              <span>Updating...</span>
            ) : showApplicationsNav ? (
              <>
                <EyeOff size={14} /> Remove Navlink
              </>
            ) : (
              <>
                <Eye size={14} /> Show Navlink
              </>
            )}
          </button>
        </div>
      </div>

      {/* Nav Alert Message */}
      {navAlert && (
        <div
          style={{
            marginBottom: '1.25rem',
            padding: '0.75rem 1.25rem',
            borderRadius: '6px',
            backgroundColor: navAlert.type === 'success' ? 'rgba(62, 126, 78, 0.12)' : 'rgba(192, 57, 43, 0.12)',
            color: navAlert.type === 'success' ? '#2E6E3E' : '#C0392B',
            border: navAlert.type === 'success' ? '1px solid rgba(62, 126, 78, 0.3)' : '1px solid rgba(192, 57, 43, 0.3)',
            fontSize: '0.875rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{navAlert.message}</span>
          <button
            onClick={() => setNavAlert(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.link}
              className="admin-card"
              style={{
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: card.highlight ? `4px solid var(--admin-forest)` : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', fontWeight: 600 }}>
                  {card.label}
                </span>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--admin-forest-tint)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--admin-forest)',
                  }}
                >
                  <Icon size={17} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: '2.1rem',
                    fontWeight: 700,
                    fontFamily: 'var(--admin-font-display)',
                    color: 'var(--admin-text-main)',
                  }}
                >
                  {card.value}
                </span>
                <ArrowUpRight size={15} color="var(--admin-text-muted)" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Section: Recent Enquiries & Activity Log */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '1.75rem',
        }}
      >
        {/* Recent Enquiries Card */}
        <div className="admin-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--admin-border-light)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} color="var(--admin-forest)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--admin-text-main)', margin: 0, fontFamily: 'var(--admin-font-display)' }}>
                Recent Client Enquiries
              </h3>
            </div>
            <Link
              href="/admin/enquiries"
              style={{ fontSize: '0.8rem', color: 'var(--admin-forest)', fontWeight: 600, textDecoration: 'none' }}
            >
              View All &rarr;
            </Link>
          </div>

          {stats.recentEnquiries && stats.recentEnquiries.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Product</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentEnquiries.map((enq: any) => (
                    <tr key={enq._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>{enq.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{enq.email}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-main)', fontWeight: 500 }}>{enq.product || 'General'}</span>
                      </td>
                      <td>
                        <span
                          className={`admin-badge ${
                            enq.status === 'new' ? 'admin-badge-new' : 'admin-badge-published'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--admin-text-muted)' }}>
              <CheckCircle2 size={32} color="var(--admin-forest)" style={{ margin: '0 auto 0.75rem auto' }} />
              <p style={{ margin: 0, fontSize: '0.875rem' }}>No pending enquiries. All leads are up to date.</p>
            </div>
          )}
        </div>

        {/* Recent Activity Log Card */}
        <div className="admin-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--admin-border-light)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--admin-forest)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--admin-text-main)', margin: 0, fontFamily: 'var(--admin-font-display)' }}>
                Recent Content Updates
              </h3>
            </div>
          </div>

          {stats.recentUpdates && stats.recentUpdates.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {stats.recentUpdates.map((log: any) => (
                <div
                  key={log._id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.65rem 0',
                    borderBottom: '1px solid var(--admin-border-light)',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor:
                        log.action === 'publish'
                          ? 'var(--admin-forest)'
                          : log.action === 'create'
                          ? 'var(--admin-info)'
                          : 'var(--admin-accent-gold)',
                      marginTop: '6px',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-main)', fontWeight: 500 }}>
                      {log.details || `${log.action} ${log.entityType}`}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: '2px' }}>
                      By {log.userName || log.userEmail} &bull; {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--admin-text-muted)' }}>
              <Clock size={32} color="var(--admin-forest)" style={{ margin: '0 auto 0.75rem auto' }} />
              <p style={{ margin: 0, fontSize: '0.875rem' }}>No recent activity records found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
