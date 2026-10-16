'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Sparkles,
  ExternalLink,
  Eye,
  EyeOff,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  isComingSoon?: boolean;
  order: number;
}

interface HeaderSettings {
  headerLogo: string;
  headerCtaText: string;
  headerCtaUrl: string;
  phone: string;
  headerNav: NavItem[];
}

const DEFAULT_NAV: NavItem[] = [
  { label: 'ABOUT', path: '/about', isComingSoon: false, order: 0 },
  { label: 'MODELS', path: '/products', isComingSoon: false, order: 1 },
  { label: 'APPLICATIONS', path: '/applications', isComingSoon: false, order: 2 },
  { label: 'CONTACT', path: '/contact', isComingSoon: false, order: 3 },
];

export default function NavigationEditorPage() {
  const [headerLogo, setHeaderLogo] = useState('/assets/logos/AlGhaf_logo_-10.png');
  const [headerCtaText, setHeaderCtaText] = useState('ENQUIRY');
  const [headerCtaUrl, setHeaderCtaUrl] = useState('#enquiry');
  const [phone, setPhone] = useState('+971 4 000 0000');
  const [showApplicationsNav, setShowApplicationsNav] = useState(true);
  const [applicationsComingSoon, setApplicationsComingSoon] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            if (data.settings.headerLogo) setHeaderLogo(data.settings.headerLogo);
            if (data.settings.headerCtaText) setHeaderCtaText(data.settings.headerCtaText);
            if (data.settings.headerCtaUrl) setHeaderCtaUrl(data.settings.headerCtaUrl);
            if (data.settings.phone) setPhone(data.settings.phone);
            if (typeof data.settings.showApplicationsNav === 'boolean') {
              setShowApplicationsNav(data.settings.showApplicationsNav);
            }
            if (typeof data.settings.applicationsComingSoon === 'boolean') {
              setApplicationsComingSoon(data.settings.applicationsComingSoon);
            }
            if (data.settings.headerNav && data.settings.headerNav.length > 0) {
              setNavItems(data.settings.headerNav);
            }
          }
        }
      } catch (e: any) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleToggleNav = async (newValue: boolean) => {
    setShowApplicationsNav(newValue);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showApplicationsNav: newValue,
          applicationsComingSoon: false,
        }),
      });

      if (res.ok) {
        setAlert({
          type: 'success',
          message: newValue
            ? 'Applications navlink is now ACTIVE (Visible in website header & footer).'
            : 'Applications navlink has been REMOVED (Hidden from website header & footer).',
        });
      } else {
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to update toggle' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error updating toggle' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headerLogo,
          headerCtaText,
          headerCtaUrl,
          phone,
          showApplicationsNav,
          applicationsComingSoon: false,
          headerNav: navItems,
        }),
      });

      if (res.ok) {
        setAlert({
          type: 'success',
          message: 'Navigation and Header settings updated successfully!',
        });
      } else {
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to save navigation' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error updating navigation' });
    } finally {
      setSaving(false);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= navItems.length) return;

    const list = [...navItems];
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;

    setNavItems(list.map((item, i) => ({ ...item, order: i })));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
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
            <Compass style={{ color: 'var(--admin-accent-gold)', width: 24, height: 24 }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0 }}>
              Navigation & Header Management
            </h1>
          </div>
          <p style={{ color: 'var(--admin-text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Control the top luxury header bar, brand mark logo, menu links, coming soon tags, and primary CTA trigger.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-secondary"
          >
            <Eye size={16} />
            Preview Header
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="admin-btn admin-btn-primary"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
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

      <form onSubmit={handleSave}>
        {/* Applications Navigation Link Visibility Control */}
        <div
          className="admin-card"
          style={{
            marginBottom: '1.75rem',
            border: showApplicationsNav
              ? '1px solid rgba(62, 126, 78, 0.35)'
              : '1px solid rgba(192, 57, 43, 0.35)',
            background: showApplicationsNav
              ? 'rgba(62, 126, 78, 0.03)'
              : 'rgba(192, 57, 43, 0.03)',
            borderRadius: '8px',
            boxShadow: 'var(--admin-shadow-sm)',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: showApplicationsNav ? 'rgba(62, 126, 78, 0.12)' : 'rgba(192, 57, 43, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: showApplicationsNav ? 'var(--admin-forest)' : '#C0392B',
                  flexShrink: 0,
                }}
              >
                <Compass size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.18rem', fontWeight: 600, margin: 0, color: 'var(--admin-text-main)' }}>
                  Applications Navigation Link Visibility
                </h2>
                <p style={{ color: 'var(--admin-text-muted)', margin: 0, fontSize: '0.85rem' }}>
                  Turn ON or OFF the &quot;Applications&quot; link in the website navigation bar and footer.
                </p>
              </div>
            </div>

            {/* Quick 1-Click Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href="/applications"
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem' }}
              >
                <ExternalLink size={14} />
                Preview /applications
              </a>

              {showApplicationsNav ? (
                <button
                  type="button"
                  onClick={() => handleToggleNav(false)}
                  className="admin-btn"
                  style={{
                    backgroundColor: '#C0392B',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    padding: '0.55rem 1.15rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <EyeOff size={15} />
                  Remove Navlink from Navbar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleToggleNav(true)}
                  className="admin-btn"
                  style={{
                    backgroundColor: 'var(--admin-forest)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    padding: '0.55rem 1.15rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <Eye size={15} />
                  Show Navlink in Navbar
                </button>
              )}
            </div>
          </div>

          {/* Status Display Card */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '6px',
              backgroundColor: showApplicationsNav ? 'rgba(62, 126, 78, 0.08)' : 'rgba(192, 57, 43, 0.08)',
              border: showApplicationsNav ? '1px solid rgba(62, 126, 78, 0.25)' : '1px solid rgba(192, 57, 43, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: showApplicationsNav ? '#3E7E4E' : '#C0392B',
                  boxShadow: showApplicationsNav ? '0 0 0 3px rgba(62, 126, 78, 0.2)' : '0 0 0 3px rgba(192, 57, 43, 0.2)',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--admin-text-main)' }}>
                  Current Status:{' '}
                  {showApplicationsNav ? (
                    <span style={{ color: '#3E7E4E' }}>NAVLINK ACTIVE (SHOWN IN WEBSITE NAVBAR)</span>
                  ) : (
                    <span style={{ color: '#C0392B' }}>NAVLINK HIDDEN (REMOVED FROM WEBSITE NAVBAR &amp; FOOTER)</span>
                  )}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--admin-text-muted)', marginTop: '0.15rem' }}>
                  {showApplicationsNav
                    ? 'The "Applications" link is currently active and visible in the website navigation header and footer.'
                    : 'The "Applications" link is currently completely removed from website navigation.'}
                </div>
              </div>
            </div>

            {/* Switch Toggle */}
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                cursor: 'pointer',
                userSelect: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                color: 'var(--admin-text-main)',
              }}
            >
              <span>{showApplicationsNav ? 'Navlink Active' : 'Navlink Removed'}</span>
              <input
                type="checkbox"
                checked={showApplicationsNav}
                onChange={(e) => handleToggleNav(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--admin-forest)' }}
              />
            </label>
          </div>
        </div>

        {/* Header Elements */}
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            Header Identity & Call-to-Action
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="admin-label">Header Logo URL</label>
              <input
                type="text"
                className="admin-input"
                value={headerLogo}
                onChange={(e) => setHeaderLogo(e.target.value)}
              />
              <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#0a0d0a', borderRadius: '4px', display: 'inline-block' }}>
                <img src={headerLogo} alt="Logo Preview" style={{ height: '32px' }} />
              </div>
            </div>

            <div>
              <label className="admin-label">Direct Contact Phone</label>
              <input
                type="text"
                className="admin-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="admin-label">Header Action Button Label</label>
              <input
                type="text"
                className="admin-input"
                value={headerCtaText}
                onChange={(e) => setHeaderCtaText(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Action Button Destination URL</label>
              <input
                type="text"
                className="admin-input"
                value={headerCtaUrl}
                onChange={(e) => setHeaderCtaUrl(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Navigation Menu Items */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>
                Navigation Menu Links ({navItems.length})
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', margin: 0 }}>
                Rendered on both the desktop floating header and the full-screen mobile menu.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setNavItems([
                  ...navItems,
                  { label: 'NEW LINK', path: '/', isComingSoon: false, order: navItems.length },
                ])
              }
              className="admin-btn admin-btn-secondary"
            >
              <Plus size={16} />
              Add Navigation Item
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {navItems.map((item, idx) => {
              const isApplications = item.path === '/applications';
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--admin-surface-muted)',
                    border: '1px solid var(--admin-border-light)',
                    borderRadius: '8px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  {/* Reorder Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: idx === 0 ? 'var(--admin-border)' : 'var(--admin-text-muted)',
                        cursor: idx === 0 ? 'not-allowed' : 'pointer',
                      }}
                      title="Move up"
                    >
                      <MoveUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === navItems.length - 1}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: idx === navItems.length - 1 ? 'var(--admin-border)' : 'var(--admin-text-muted)',
                        cursor: idx === navItems.length - 1 ? 'not-allowed' : 'pointer',
                      }}
                      title="Move down"
                    >
                      <MoveDown size={16} />
                    </button>
                  </div>

                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.5fr auto', gap: '1rem', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <label className="admin-label" style={{ fontSize: '0.75rem', margin: 0 }}>Menu Label</label>
                        {isApplications && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              letterSpacing: '0.03em',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '999px',
                              backgroundColor: showApplicationsNav ? 'rgba(62, 126, 78, 0.12)' : 'rgba(192, 57, 43, 0.12)',
                              color: showApplicationsNav ? '#3E7E4E' : '#C0392B',
                              border: showApplicationsNav ? '1px solid rgba(62, 126, 78, 0.3)' : '1px solid rgba(192, 57, 43, 0.3)',
                            }}
                          >
                            {showApplicationsNav ? 'ACTIVE IN NAVBAR' : 'REMOVED FROM NAVBAR'}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        className="admin-input"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...navItems];
                          updated[idx].label = e.target.value;
                          setNavItems(updated);
                        }}
                      />
                    </div>

                    <div>
                      <label className="admin-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Destination Route</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={item.path}
                        onChange={(e) => {
                          const updated = [...navItems];
                          updated[idx].path = e.target.value;
                          setNavItems(updated);
                        }}
                      />
                    </div>

                    <div style={{ paddingTop: '1.25rem' }}>
                      {isApplications ? (
                        <button
                          type="button"
                          onClick={() => handleToggleNav(!showApplicationsNav)}
                          className="admin-btn"
                          style={{
                            fontSize: '0.78rem',
                            padding: '0.35rem 0.75rem',
                            backgroundColor: showApplicationsNav ? '#C0392B' : 'var(--admin-forest)',
                            color: '#FFFFFF',
                            border: 'none',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {showApplicationsNav ? 'Hide Navlink' : 'Show Navlink'}
                        </button>
                      ) : (
                        <div style={{ width: '80px' }} />
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNavItems(navItems.filter((_, i) => i !== idx))}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--admin-danger)',
                      cursor: 'pointer',
                      padding: '0.5rem',
                    }}
                    title="Remove Link"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}
