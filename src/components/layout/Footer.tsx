'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { companyInfo } from '../../data/companyData';

function InstagramIcon({ size = 18, color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ size = 18, color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function FacebookIcon({ size = 18, color = 'currentColor', ...props }: any) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 18, color = 'currentColor', ...props }: any) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function formatSocialUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^\/\//.test(trimmed)) return `https:${trimmed}`;
  return `https://${trimmed}`;
}

function formatWhatsAppUrl(val?: string, defaultMsg?: string): string {
  if (!val) return '';
  const trimmed = val.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/[^0-9]/g, '');
  if (!digits) return '';
  const msg = defaultMsg ? `?text=${encodeURIComponent(defaultMsg)}` : '';
  return `https://wa.me/${digits}${msg}`;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.warn('Footer settings sync notice:', err));
  }, []);

  return (
    <footer style={{ backgroundColor: '#52694B', color: '#FAF8F5', paddingTop: '5rem', paddingBottom: '2.5rem' }}>
      <div className="container">
        {/* Top Section with Brand Statement */}
        <div className="footer-grid">
          {/* Col 1: Brand & Origin */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <img
                src={settings?.footerLogo || '/assets/logos/AlGhaf_logo_-08.png'}
                alt={settings?.companyName || 'AlGhaf Collective'}
                style={{ height: '80px', width: 'auto', maxWidth: '260px', objectFit: 'contain' }}
              />
            </div>

            <p style={{ color: '#C5BCAC', fontSize: '0.9375rem', lineHeight: '1.7', marginBottom: '1.5rem', maxWidth: '340px' }}>
              {settings?.footerDescription ||
                'Transforming housing from a fragmented project into a designed, engineered, and continuously refined product.'}
            </p>

            <div style={{ display: 'inline-block', padding: '0.5rem 0.875rem', backgroundColor: 'rgba(201, 167, 121, 0.12)', borderRadius: '4px', border: '1px solid rgba(201, 167, 121, 0.25)' }}>
              <span style={{ color: 'var(--color-sand)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {settings?.footerTagline || 'Rooted in Nature. Built for Tomorrow.'}
              </span>
            </div>
          </div>


          {/* Col 3: Company & Approach */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#FAF8F5',
              marginBottom: '1.25rem',
              letterSpacing: '0.04em'
            }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <li>
                <Link href="/about" style={{ color: '#E5DFD4', fontSize: '0.9375rem' }}>
                  About AlGhaf & The Ghaf Tree
                </Link>
              </li>
              {settings?.showApplicationsNav === true && (
                <li>
                  {settings?.applicationsComingSoon ? (
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent('open-coming-soon'))}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        margin: 0,
                        color: '#E5DFD4',
                        fontSize: '0.9375rem',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-sand)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#E5DFD4'}
                    >
                      Applications & Typologies
                    </button>
                  ) : (
                    <Link href="/applications" style={{ color: '#E5DFD4', fontSize: '0.9375rem' }}>
                      Applications & Typologies
                    </Link>
                  )}
                </li>
              )}
              <li>
                <Link href="/contact" style={{ color: '#E5DFD4', fontSize: '0.9375rem' }}>
                  Project Enquiry & Consultations
                </Link>
              </li>
              <li>
                <Link href="/privacy" style={{ color: '#9DA39B', fontSize: '0.875rem' }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" style={{ color: '#9DA39B', fontSize: '0.875rem' }}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & UAE Headquarters */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#FAF8F5',
              marginBottom: '1.25rem',
              letterSpacing: '0.04em'
            }}>
              Connect
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#E5DFD4', fontSize: '0.9375rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={18} color="var(--color-sand)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{settings?.address || companyInfo.contact.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} color="var(--color-sand)" style={{ flexShrink: 0 }} />
                <a
                  href={`tel:${(settings?.phone || companyInfo.contact.phone || '').replace(/\s+/g, '')}`}
                  style={{ color: '#FAF8F5', textDecoration: 'none' }}
                >
                  {settings?.phone || companyInfo.contact.phone}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="var(--color-sand)" style={{ flexShrink: 0 }} />
                <a
                  href={`mailto:${settings?.email || companyInfo.contact.email}`}
                  style={{ color: '#FAF8F5', textDecoration: 'none' }}
                >
                  {settings?.email || companyInfo.contact.email}
                </a>
              </div>

              {/* Direct WhatsApp link */}
              {(settings?.whatsapp || companyInfo.contact.whatsapp) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <WhatsAppIcon size={18} color="var(--color-sand)" style={{ flexShrink: 0 }} />
                  <a
                    href={formatWhatsAppUrl(settings?.whatsapp || companyInfo.contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#FAF8F5', textDecoration: 'none' }}
                  >
                    WhatsApp: {settings?.whatsapp || companyInfo.contact.whatsapp}
                  </a>
                </div>
              )}

              {/* Social Media Channels */}
              <div style={{ marginTop: '0.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C5BCAC', marginBottom: '0.65rem' }}>
                  Connect With Us
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  {/* WhatsApp Button */}
                  {(settings?.whatsapp || companyInfo.contact.whatsapp) && (
                    <a
                      href={formatWhatsAppUrl(settings?.whatsapp || companyInfo.contact.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Chat on WhatsApp"
                      title="Chat on WhatsApp"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        color: '#FAF8F5',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.22s ease',
                        textDecoration: 'none',
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                        e.currentTarget.style.color = 'var(--color-sand)';
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.color = '#FAF8F5';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <WhatsAppIcon size={17} />
                    </a>
                  )}

                  {/* Instagram Button */}
                  {(settings?.instagram || companyInfo.contact.instagram) && (
                    <a
                      href={formatSocialUrl(settings?.instagram || companyInfo.contact.instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      title="Instagram"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        color: '#FAF8F5',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.22s ease',
                        textDecoration: 'none',
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                        e.currentTarget.style.color = 'var(--color-sand)';
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.color = '#FAF8F5';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <InstagramIcon size={17} />
                    </a>
                  )}

                  {/* LinkedIn Button */}
                  {(settings?.linkedin || companyInfo.contact.linkedin) && (
                    <a
                      href={formatSocialUrl(settings?.linkedin || companyInfo.contact.linkedin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      title="LinkedIn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        color: '#FAF8F5',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.22s ease',
                        textDecoration: 'none',
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                        e.currentTarget.style.color = 'var(--color-sand)';
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.color = '#FAF8F5';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <LinkedinIcon size={17} />
                    </a>
                  )}

                  {/* Facebook Button */}
                  {(settings?.facebook || companyInfo.contact.facebook) && (
                    <a
                      href={formatSocialUrl(settings?.facebook || companyInfo.contact.facebook)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      title="Facebook"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        color: '#FAF8F5',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.22s ease',
                        textDecoration: 'none',
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                        e.currentTarget.style.color = 'var(--color-sand)';
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.color = '#FAF8F5';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <FacebookIcon size={17} />
                    </a>
                  )}
                </div>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <Link href="/contact" className="btn btn-sand btn-sm" style={{ width: '100%' }}>
                  Start Your Project
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8125rem',
          color: '#8A9287'
        }}>
          <div>
            &copy; {currentYear} {settings?.copyrightText || 'AlGhaf Collective. All rights reserved. | Powered by Clixdot'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>Design Smarter. Build Precisely.</span>
            <span>&bull;</span>
            <Link href="/privacy" style={{ color: '#8A9287' }}>Privacy</Link>
            <Link href="/terms" style={{ color: '#8A9287' }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
