import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { companyInfo } from '../../data/companyData';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#52694B', color: '#FAF8F5', paddingTop: '5rem', paddingBottom: '2.5rem' }}>
      <div className="container">
        {/* Top Section with Brand Statement */}
        <div className="footer-grid">
          {/* Col 1: Brand & Origin */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <img
                src="/assets/logos/AlGhaf_logo_-08.png"
                alt="AlGhaf Collective"
                style={{ height: '80px', width: 'auto', maxWidth: '260px', objectFit: 'contain' }}
              />
            </div>

            <p style={{ color: '#C5BCAC', fontSize: '0.9375rem', lineHeight: '1.7', marginBottom: '1.5rem', maxWidth: '340px' }}>
              Transforming housing from a fragmented project into a designed, engineered, and continuously refined product.
            </p>

            <div style={{ display: 'inline-block', padding: '0.5rem 0.875rem', backgroundColor: 'rgba(201, 167, 121, 0.12)', borderRadius: '4px', border: '1px solid rgba(201, 167, 121, 0.25)' }}>
              <span style={{ color: 'var(--color-sand)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Rooted in Nature. Built for Tomorrow.
              </span>
            </div>
          </div>

          {/* Col 2: Modular Products */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#FAF8F5',
              marginBottom: '1.25rem',
              letterSpacing: '0.04em'
            }}>
              Modular Systems
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <li>
                <Link to="/products/mova" style={{ color: '#E5DFD4', fontSize: '0.9375rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>MOVA (30–75 m²)</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-sand)', opacity: 0.9 }}>Versatile Living</span>
                </Link>
              </li>
              <li>
                <Link to="/products/penta" style={{ color: '#E5DFD4', fontSize: '0.9375rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>PENTA (50–300 m²)</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-sand)', opacity: 0.9 }}>Elevated Living</span>
                </Link>
              </li>
              <li>
                <Link to="/products/entra" style={{ color: '#E5DFD4', fontSize: '0.9375rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>ENTRA</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-sand)', opacity: 0.9 }}>Private Entertainment</span>
                </Link>
              </li>
              <li>
                <Link to="/products" style={{ color: 'var(--color-sand)', fontSize: '0.875rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                  View All Product Catalog <ArrowUpRight size={14} />
                </Link>
              </li>
            </ul>
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
                <Link to="/about" style={{ color: '#E5DFD4', fontSize: '0.9375rem' }}>
                  About AlGhaf & The Ghaf Tree
                </Link>
              </li>
              <li>
                <Link to="/process" style={{ color: '#E5DFD4', fontSize: '0.9375rem' }}>
                  Our Process: Design · Prefab · Build
                </Link>
              </li>
              <li>
                <Link to="/applications" style={{ color: '#E5DFD4', fontSize: '0.9375rem' }}>
                  Applications & Typologies
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#E5DFD4', fontSize: '0.9375rem' }}>
                  Project Enquiry & Consultations
                </Link>
              </li>
              <li>
                <Link to="/privacy" style={{ color: '#9DA39B', fontSize: '0.875rem' }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" style={{ color: '#9DA39B', fontSize: '0.875rem' }}>
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
                <span>{companyInfo.contact.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} color="var(--color-sand)" style={{ flexShrink: 0 }} />
                <a href={`tel:${companyInfo.contact.phone}`} style={{ color: '#FAF8F5' }}>
                  {companyInfo.contact.phone}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="var(--color-sand)" style={{ flexShrink: 0 }} />
                <a href={`mailto:${companyInfo.contact.email}`} style={{ color: '#FAF8F5' }}>
                  {companyInfo.contact.email}
                </a>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <Link to="/contact" className="btn btn-sand btn-sm" style={{ width: '100%' }}>
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
            &copy; {currentYear} {companyInfo.legalName}. All rights reserved. United Arab Emirates.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>Design Smarter. Build Precisely.</span>
            <span>&bull;</span>
            <Link to="/privacy" style={{ color: '#8A9287' }}>Privacy</Link>
            <Link to="/terms" style={{ color: '#8A9287' }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
