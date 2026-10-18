'use client';

import React, { useEffect, useState } from 'react';
import {
  Phone,
  MessageCircle,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  HelpCircle,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

export default function FloatingActionsSettingsPage() {
  const [phone, setPhone] = useState('+971 4 288 9412');
  const [whatsapp, setWhatsapp] = useState('+971 50 892 4110');
  const [whatsappMessage, setWhatsappMessage] = useState(
    'Hello AlGhaf Collective, I would like to enquire about your modular living systems.'
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch current settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data?.settings) {
            if (data.settings.phone) setPhone(data.settings.phone);
            if (data.settings.whatsapp) setWhatsapp(data.settings.whatsapp);
            if (data.settings.whatsappMessage) setWhatsappMessage(data.settings.whatsappMessage);
          }
        }
      } catch (err: any) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setAlert(null);

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          whatsapp: whatsapp.trim(),
          whatsappMessage: whatsappMessage.trim(),
        }),
      });

      if (res.ok) {
        setAlert({
          type: 'success',
          message: 'WhatsApp and Calling phone numbers updated successfully! Live website buttons updated.',
        });
        setTimeout(() => setAlert(null), 6000);
      } else {
        const err = await res.json();
        setAlert({
          type: 'error',
          message: err.error || 'Failed to update contact numbers. Please try again.',
        });
      }
    } catch (err: any) {
      setAlert({
        type: 'error',
        message: err.message || 'Network error while updating numbers.',
      });
    } finally {
      setSaving(false);
    }
  };

  const cleanPhone = phone.trim();
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');
  const testWhatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    whatsappMessage || 'Hello AlGhaf Collective, I would like to enquire about your modular living systems.'
  )}`;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Page Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(82, 105, 75, 0.12)',
                color: 'var(--admin-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Phone size={20} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--admin-font-display)',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--admin-text-main)',
                margin: 0,
              }}
            >
              Floating WhatsApp & Call Numbers
            </h1>
          </div>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.92rem', margin: 0 }}>
            Change the direct calling phone number and WhatsApp floating action buttons shown at the bottom right of the website.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={15} />
            <span>View Website</span>
          </a>
          <button
            onClick={() => handleSave()}
            disabled={saving || loading}
            className="admin-btn admin-btn-primary"
            style={{ minWidth: '140px' }}
          >
            {saving ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alert && (
        <div
          style={{
            marginBottom: '1.75rem',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            backgroundColor: alert.type === 'success' ? 'rgba(62, 126, 78, 0.12)' : 'rgba(192, 57, 43, 0.12)',
            border: alert.type === 'success' ? '1px solid rgba(62, 126, 78, 0.3)' : '1px solid rgba(192, 57, 43, 0.3)',
            color: alert.type === 'success' ? '#2A6635' : '#C0392B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.92rem',
            fontWeight: 500,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{alert.message}</span>
          </div>
          <button
            onClick={() => setAlert(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '1.1rem',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Interactive Visual Preview Card */}
      <div
        className="admin-card"
        style={{
          marginBottom: '2rem',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--admin-border)',
          overflow: 'hidden',
          padding: 0,
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--admin-border)',
            backgroundColor: 'var(--admin-surface-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--admin-text-main)' }}>
              Live Website Floating Buttons Preview
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
              This is how the floating buttons appear at the bottom-right corner of the website.
            </div>
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(62, 126, 78, 0.12)',
              color: 'var(--admin-forest)',
              border: '1px solid rgba(62, 126, 78, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <ShieldCheck size={12} /> Live Active
          </span>
        </div>

        <div
          style={{
            padding: '2rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.75rem',
            backgroundColor: '#FAF8F5',
          }}
        >
          {/* Floating Buttons Mockup */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '1.25rem 2rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #ECE7DD',
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            }}
          >
            {/* Direct Call Button Mockup */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#52694B',
                  color: '#FAF8F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem auto',
                  boxShadow: '0 6px 18px rgba(82, 105, 75, 0.35)',
                }}
              >
                <Phone size={22} />
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
                Call Button
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--admin-forest)', fontWeight: 600 }}>
                {phone || 'Not Set'}
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '50px', backgroundColor: '#E5DFD4' }} />

            {/* WhatsApp Button Mockup */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem auto',
                  boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
                }}
              >
                <MessageCircle size={28} />
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
                WhatsApp Button
              </div>
              <div style={{ fontSize: '0.72rem', color: '#25D366', fontWeight: 600 }}>
                {whatsapp || 'Not Set'}
              </div>
            </div>
          </div>

          {/* Test Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '240px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text-muted)' }}>
              Test Button Functionality:
            </div>
            <a
              href={`tel:${cleanPhone}`}
              className="admin-btn admin-btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                textDecoration: 'none',
              }}
            >
              <Phone size={15} color="#52694B" />
              <span>Test Call ({phone})</span>
              <ArrowUpRight size={13} style={{ marginLeft: 'auto' }} />
            </a>

            <a
              href={testWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                textDecoration: 'none',
                color: '#128C7E',
              }}
            >
              <MessageCircle size={15} color="#25D366" />
              <span>Test WhatsApp ({whatsapp})</span>
              <ExternalLink size={13} style={{ marginLeft: 'auto' }} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave}>
        {/* Calling Phone Number Card */}
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(82, 105, 75, 0.1)',
                color: 'var(--admin-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Phone size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--admin-text-main)', margin: 0 }}>
                Calling Phone Number
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', margin: 0 }}>
                This is the number dialed when a customer taps the floating Call icon.
              </p>
            </div>
          </div>

          <div>
            <label className="admin-label" htmlFor="phone-input">
              Direct Phone Number <span style={{ color: 'var(--admin-danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="phone-input"
                type="text"
                className="admin-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 4 288 9412"
                style={{ paddingLeft: '2.5rem', fontSize: '1rem', fontWeight: 500 }}
                required
              />
              <Phone
                size={17}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--admin-text-muted)',
                }}
              />
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem' }}>
              Include international format with country code (e.g. <code>+971 4 288 9412</code> or <code>+971 50 123 4567</code>).
            </div>
          </div>
        </div>

        {/* WhatsApp Settings Card */}
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(37, 211, 102, 0.12)',
                color: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageCircle size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--admin-text-main)', margin: 0 }}>
                WhatsApp Number & Enquiry Message
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', margin: 0 }}>
                This number opens WhatsApp directly when visitors click the floating WhatsApp button.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* WhatsApp Number Field */}
            <div>
              <label className="admin-label" htmlFor="whatsapp-input">
                WhatsApp Phone Number <span style={{ color: 'var(--admin-danger)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="whatsapp-input"
                  type="text"
                  className="admin-input"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+971 50 892 4110"
                  style={{ paddingLeft: '2.5rem', fontSize: '1rem', fontWeight: 500 }}
                  required
                />
                <MessageCircle
                  size={17}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#25D366',
                  }}
                />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem' }}>
                Include country code without leading zero (e.g. <code>+971 50 892 4110</code>). Non-numeric characters will be automatically parsed for WhatsApp wa.me link generation.
              </div>
            </div>

            {/* WhatsApp Default Greeting Message */}
            <div>
              <label className="admin-label" htmlFor="whatsapp-message">
                Pre-filled Chat Message (Greeting Text)
              </label>
              <textarea
                id="whatsapp-message"
                className="admin-textarea"
                rows={3}
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                placeholder="Hello AlGhaf Collective, I would like to enquire about your modular living systems."
                style={{ fontSize: '0.92rem' }}
              />
              <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem' }}>
                When a user clicks the WhatsApp button, this message is pre-typed into their WhatsApp chat box so they can send it with a single tap.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            backgroundColor: 'var(--admin-surface)',
            border: '1px solid var(--admin-border)',
            borderRadius: '12px',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
            Changes take effect immediately on the live website upon saving.
          </div>
          <button
            type="submit"
            disabled={saving || loading}
            className="admin-btn admin-btn-primary"
            style={{ minWidth: '150px' }}
          >
            {saving ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
