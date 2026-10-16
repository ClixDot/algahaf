'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Lock, Sparkles, Shield, Clock } from 'lucide-react';
import QuickEnquiryModal from './QuickEnquiryModal';

interface ProductComingSoonProps {
  productName: string;
  category?: string;
  tagline?: string;
  bgImage?: string;
  sizeRange?: string;
}

export default function ProductComingSoon({
  productName,
  category = 'Modular Architecture',
  tagline = 'Design Smarter. Build Precisely.',
  bgImage = '/assets/renders/MOVA_EXT_3D_img1.jpg',
  sizeRange = 'Curated Architecture',
}: ProductComingSoonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0E110D',
        color: '#FAF8F5',
        overflow: 'hidden',
        padding: '7rem 1.5rem 5rem 1.5rem',
      }}
    >
      {/* Background Image with Dark Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(to bottom, rgba(14, 17, 13, 0.82) 0%, rgba(14, 17, 13, 0.94) 100%), url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)',
          transform: 'scale(1.04)',
          opacity: 0.45,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '820px', textAlign: 'center' }}>
        {/* Curated Status Pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.75rem', padding: '0.45rem 1.15rem', backgroundColor: 'rgba(201, 167, 121, 0.15)', border: '1px solid rgba(201, 167, 121, 0.35)', borderRadius: '999px' }}>
          <Lock size={14} color="var(--color-sand)" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sand)' }}>
            Curated Collection &bull; Private Launch In Progress
          </span>
        </div>

        {/* Product Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: '#FAF8F5',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}
        >
          {productName}
        </h1>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-sand)', marginBottom: '1.5rem', fontWeight: 500 }}>
          {category} {sizeRange ? `(${sizeRange})` : ''}
        </div>

        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
            lineHeight: '1.75',
            color: '#C7C2B8',
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
          }}
        >
          {tagline}
        </p>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '1.5rem 2rem',
            marginBottom: '2.5rem',
            backdropFilter: 'blur(8px)',
            maxWidth: '640px',
            margin: '0 auto 2.5rem auto',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <Clock size={20} color="var(--color-sand)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: '1.65', color: '#FAF8F5' }}>
              Full architectural floor plans, high-resolution 3D renders, and turnkey engineering matrices for{' '}
              <strong>{productName}</strong> are currently reserved for private consultations ahead of public launch.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => setModalOpen(true)} className="btn btn-sand btn-lg">
            Request Private Brochure & Specs <ArrowRight size={18} />
          </button>
          <Link href="/products" className="btn btn-outline-light btn-lg">
            <ArrowLeft size={16} /> All Collections
          </Link>
        </div>
      </div>

      <QuickEnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialProduct={productName}
      />
    </main>
  );
}
