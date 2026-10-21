'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Footprints,
  Save,
  CheckCircle,
  Eye,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

function formatSocialUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^\/\//.test(trimmed)) return `https:${trimmed}`;
  return `https://${trimmed}`;
}

function formatWhatsAppUrl(val?: string): string {
  if (!val) return '';
  const trimmed = val.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/[^0-9]/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits}`;
}

interface FooterSettings {
  footerLogo: string;
  footerTagline: string;
  footerDescription: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  facebook: string;
  copyrightText: string;
}

export default function FooterEditorPage() {
  const [footerLogo, setFooterLogo] = useState('/assets/logos/AlGhaf_logo_-08.png');
  const [footerTagline, setFooterTagline] = useState('Rooted in Nature. Built for Tomorrow.');
  const [footerDescription, setFooterDescription] = useState(
    'Transforming housing from a fragmented project into a designed, engineered, and continuously refined product.'
  );
  const [phone, setPhone] = useState('+971 4 000 0000');
  const [email, setEmail] = useState('info@alghafcollective.ae');
  const [address, setAddress] = useState('Building 7, Dubai Design District (d3)');
  const [city, setCity] = useState('Dubai');
  const [country, setCountry] = useState('United Arab Emirates');
  const [whatsapp, setWhatsapp] = useState('+971500000000');
  const [instagram, setInstagram] = useState('https://www.instagram.com/alghafcollective');
  const [linkedin, setLinkedin] = useState('https://www.linkedin.com/company/alghafcollective');
  const [facebook, setFacebook] = useState('https://www.facebook.com/alghafcollective');

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
            const s = data.settings;
            if (s.footerLogo !== undefined && s.footerLogo !== null) setFooterLogo(s.footerLogo);
            if (s.footerTagline !== undefined && s.footerTagline !== null) setFooterTagline(s.footerTagline);
            if (s.footerDescription !== undefined && s.footerDescription !== null) setFooterDescription(s.footerDescription);
            if (s.phone !== undefined && s.phone !== null) setPhone(s.phone);
            if (s.email !== undefined && s.email !== null) setEmail(s.email);
            if (s.address !== undefined && s.address !== null) setAddress(s.address);
            if (s.city !== undefined && s.city !== null) setCity(s.city);
            if (s.country !== undefined && s.country !== null) setCountry(s.country);
            if (s.whatsapp !== undefined && s.whatsapp !== null) setWhatsapp(s.whatsapp);
            if (s.instagram !== undefined && s.instagram !== null) setInstagram(s.instagram);
            if (s.linkedin !== undefined && s.linkedin !== null) setLinkedin(s.linkedin);
            if (s.facebook !== undefined && s.facebook !== null) setFacebook(s.facebook);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setAlert(null);

      const cleanWhatsapp = (whatsapp || '').trim();
      const cleanInstagram = formatSocialUrl(instagram);
      const cleanLinkedin = formatSocialUrl(linkedin);
      const cleanFacebook = formatSocialUrl(facebook);

      // Keep local input fields clean and normalized
      setWhatsapp(cleanWhatsapp);
      setInstagram(cleanInstagram);
      setLinkedin(cleanLinkedin);
      setFacebook(cleanFacebook);

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          footerLogo: footerLogo.trim(),
          footerTagline: footerTagline.trim(),
          footerDescription: footerDescription.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          city: city.trim(),
          country: country.trim(),
          whatsapp: cleanWhatsapp,
          instagram: cleanInstagram,
          linkedin: cleanLinkedin,
          facebook: cleanFacebook,
        }),
      });

      if (res.ok) {
        setAlert({
          type: 'success',
          message: 'Footer content & social channels saved successfully! Changes are live across the website.',
        });
        setTimeout(() => setAlert(null), 6000);
      } else {
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to update footer' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error updating footer' });
    } finally {
      setSaving(false);
    }
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
            <Footprints style={{ color: 'var(--admin-accent-gold)', width: 24, height: 24 }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0 }}>
              Footer Management
            </h1>
          </div>
          <p style={{ color: 'var(--admin-text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Customize global footer narrative, office locations, official contact channels, and social media links.
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
            Preview Footer
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
        {/* Brand Narrative */}
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            Footer Identity & Philosophy
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="admin-label">Footer Brand Mark Logo URL</label>
              <input
                type="text"
                className="admin-input"
                value={footerLogo}
                onChange={(e) => setFooterLogo(e.target.value)}
              />
              <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#0a0d0a', borderRadius: '4px', display: 'inline-block' }}>
                <img src={footerLogo} alt="Footer Logo" style={{ height: '36px' }} />
              </div>
            </div>

            <div>
              <label className="admin-label">Footer Tagline</label>
              <input
                type="text"
                className="admin-input"
                value={footerTagline}
                onChange={(e) => setFooterTagline(e.target.value)}
              />
              <div style={{ marginTop: '0.75rem' }}>
                <label className="admin-label">Brand Narrative / Mission Paragraph</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={footerDescription}
                  onChange={(e) => setFooterDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            Official Headquarters & Communication
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="admin-label">Contact Telephone</label>
              <input
                type="text"
                className="admin-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">General Enquiries Email</label>
              <input
                type="email"
                className="admin-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="admin-label">Physical Street Address</label>
              <input
                type="text"
                className="admin-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Emirate / City</label>
              <input
                type="text"
                className="admin-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Country</label>
              <input
                type="text"
                className="admin-input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Social Channels & WhatsApp */}
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 0.25rem 0' }}>
              Social Channels & Instant Messaging
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
              Configure official links. These dynamically power website footer social icons, header Instagram link, floating actions, and contact points.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>WhatsApp Number / Direct Link</label>
                {whatsapp && (
                  <a
                    href={formatWhatsAppUrl(whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.78rem', color: 'var(--admin-forest)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontWeight: 600 }}
                  >
                    Test Link <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <input
                type="text"
                className="admin-input"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+971 582793399"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block', marginTop: '0.35rem' }}>
                Accepts international phone number (+971...) or direct wa.me link.
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Instagram Profile URL</label>
                {instagram && (
                  <a
                    href={formatSocialUrl(instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.78rem', color: 'var(--admin-forest)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontWeight: 600 }}
                  >
                    Test Profile <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <input
                type="text"
                className="admin-input"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://www.instagram.com/alghafcollective"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block', marginTop: '0.35rem' }}>
                Direct Instagram URL. Updates header, footer, and mobile drawer.
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>LinkedIn Company Page</label>
                {linkedin && (
                  <a
                    href={formatSocialUrl(linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.78rem', color: 'var(--admin-forest)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontWeight: 600 }}
                  >
                    Test Page <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <input
                type="text"
                className="admin-input"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://www.linkedin.com/company/alghaf-collective/home/"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block', marginTop: '0.35rem' }}>
                LinkedIn company page link. Updates footer social icon.
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Facebook Page URL</label>
                {facebook && (
                  <a
                    href={formatSocialUrl(facebook)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.78rem', color: 'var(--admin-forest)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontWeight: 600 }}
                  >
                    Test Page <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <input
                type="text"
                className="admin-input"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://www.facebook.com/alghafcollective"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block', marginTop: '0.35rem' }}>
                Official Facebook page link. Updates footer social icon.
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
