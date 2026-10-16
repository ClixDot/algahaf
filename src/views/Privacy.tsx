import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { companyInfo } from '../data/companyData';

export default function Privacy() {
  return (
    <main style={{ paddingTop: '7rem', paddingBottom: '6rem' }} className="bg-ivory">
      <div className="container-narrow">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-forest)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Homepage
        </Link>

        <span className="eyebrow eyebrow-forest">Legal & Compliance</span>
        <h1 className="section-title" style={{ color: 'var(--color-forest-dark)', marginBottom: '1.5rem' }}>
          Privacy Policy
        </h1>
        <div style={{ fontSize: '0.875rem', color: 'var(--color-charcoal-muted)', marginBottom: '2.5rem' }}>
          Effective Date: January 1, 2026 &bull; {companyInfo.legalName}
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: 'clamp(2rem, 4vw, 3.5rem)', borderRadius: '8px', border: '1px solid rgba(82, 105, 75, 0.12)', boxShadow: 'var(--shadow-sm)', color: 'var(--color-charcoal)', lineHeight: '1.8' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-forest-dark)', marginBottom: '0.75rem' }}>
            1. Introduction & Scope
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            {companyInfo.legalName} (&ldquo;AlGhaf Collective&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to respecting your privacy in compliance with UAE Federal Decree-Law No. 45 of 2021 regarding the Protection of Personal Data (PDPL) and international privacy frameworks. This policy describes how we collect, handle, protect, and process data when you visit our website or submit project inquiries.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-forest-dark)', marginBottom: '0.75rem' }}>
            2. Information We Collect
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We only collect personal information that you voluntarily provide to us when submitting consultation requests, such as:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.75rem' }}>
            <li>Full Name and Company or Family Office affiliation</li>
            <li>Direct contact details including Email Address and Phone / WhatsApp number</li>
            <li>Project specifics including plot location, approximate square meters, and architectural requirements</li>
            <li>Technical metadata such as IP address and browser type for security and optimization</li>
          </ul>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-forest-dark)', marginBottom: '0.75rem' }}>
            3. How We Use Your Data
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Information collected is strictly utilized to evaluate your project inquiry, prepare preliminary architectural feasibility studies, coordinate site visits, and communicate official updates from our engineering directors. We never sell, rent, or lease client data to third-party marketing companies.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-forest-dark)', marginBottom: '0.75rem' }}>
            4. Data Security & Retention
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            We implement industry-standard cryptographic protocols (TLS/SSL) and strict access controls to prevent unauthorized access or disclosure. Personal data is retained solely for the duration required to complete project evaluations or fulfill statutory requirements under UAE law.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-forest-dark)', marginBottom: '0.75rem' }}>
            5. Contact Information
          </h2>
          <p>
            For any questions or data access requests regarding this Privacy Policy, please contact our legal and compliance office at:<br />
            <strong>Email:</strong> {companyInfo.contact.email}<br />
            <strong>Address:</strong> {companyInfo.contact.address}
          </p>
        </div>
      </div>
    </main>
  );
}
