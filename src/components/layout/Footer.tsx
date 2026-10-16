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

function FacebookIcon({ size = 18, color = 'currentColor', ...props }) {
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
                <a href={`tel:${settings?.phone || companyInfo.contact.phone}`} style={{ color: '#FAF8F5' }}>
                  {settings?.phone || companyInfo.contact.phone}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="var(--color-sand)" style={{ flexShrink: 0 }} />
                <a href={`mailto:${settings?.email || companyInfo.contact.email}`} style={{ color: '#FAF8F5' }}>
                  {settings?.email || companyInfo.contact.email}
                </a>
              </div>
              {/* Social Media Channels */}
              <div style={{ marginTop: '0.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C5BCAC', marginBottom: '0.65rem' }}>
                  Connect With Us
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {/* Instagram */}
                  <a
                    href={companyInfo.contact.instagram || 'https://www.instagram.com/alghafcollective'}
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
                      flexShrink: 0
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

                  {/* LinkedIn */}
                  <a
                    href={companyInfo.contact.linkedin || 'https://www.linkedin.com/company/alghafcollective'}
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
                      flexShrink: 0
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

                  {/* Facebook */}
                  <a
                    href={companyInfo.contact.facebook || 'https://www.facebook.com/alghafcollective'}
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
                      flexShrink: 0
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
