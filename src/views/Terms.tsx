import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { companyInfo } from '../data/companyData';

export default function Terms() {
  return (
    <main style={{ paddingTop: '7rem', paddingBottom: '6rem' }} className="bg-ivory">
      <div className="container-narrow">
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-forest)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Homepage
        </Link>

        <span className="eyebrow eyebrow-forest">Contractual Notice</span>
        <h1 className="section-title" style={{ color: 'var(--color-forest-dark)', marginBottom: '1.5rem' }}>
          Terms of Service
        </h1>
        <div style={{ fontSize: '0.875rem', color: 'var(--color-charcoal-muted)', marginBottom: '2.5rem' }}>
          Last Updated: January 1, 2026 &bull; {companyInfo.legalName}
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: 'clamp(2rem, 4vw, 3.5rem)', borderRadius: '8px', border: '1px solid rgba(82, 105, 75, 0.12)', boxShadow: 'var(--shadow-sm)', color: 'var(--color-charcoal)', lineHeight: '1.8' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-forest-dark)', marginBottom: '0.75rem' }}>
            1. Agreement & Acceptance
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            By accessing or using this website, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our digital platform and services.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-forest-dark)', marginBottom: '0.75rem' }}>
            2. Intellectual Property Rights
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            All content, including 3D architectural renders, modular product designs (MOVA, PENTA, ENTRA), structural diagrams, photography, trademarks, and typography, are the exclusive intellectual property of {companyInfo.legalName} and CK Living Concepts. No materials may be copied, reproduced, or redistributed without prior written consent.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-forest-dark)', marginBottom: '0.75rem' }}>
            3. Project Proposals & Feasibility Estimates
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Any sizes, timelines, or specifications provided on this website or in preliminary enquiry correspondence represent indicative engineering profiles. Binding agreements, technical scopes, and contractual milestones are governed exclusively by executed formal Construction & Prefabrication Master Agreements signed by authorized corporate signatories.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-forest-dark)', marginBottom: '0.75rem' }}>
            4. Governing Law & Jurisdiction
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            These terms are governed by and construed in accordance with the laws of the Emirate of Dubai and the Federal Laws of the United Arab Emirates. Any dispute arising in connection with these terms shall be subject to the exclusive jurisdiction of the Courts of Dubai.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-forest-dark)', marginBottom: '0.75rem' }}>
            5. Contact
          </h2>
          <p>
            For corporate inquiries regarding these terms, please reach out to:<br />
            <strong>Legal Department:</strong> legal@alghafcollective.ae<br />
            <strong>Corporate Address:</strong> {companyInfo.contact.address}
          </p>
        </div>
      </div>
    </main>
  );
}
