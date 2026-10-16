'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Maximize2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '../components/common/SectionHeader';
import QuickEnquiryModal from '../components/common/QuickEnquiryModal';
import Lightbox from '../components/common/Lightbox';
import { products as fallbackProducts } from '../data/productsData';

interface ProductsProps {
  initialSections?: any[];
  initialDetailsOpen?: boolean;
}

function renderLineBreaks(text: string) {
  if (!text) return null;
  return text.split('\n').map((line, idx, arr) => (
    <React.Fragment key={idx}>
      {line}
      {idx < arr.length - 1 && <br />}
    </React.Fragment>
  ));
}

function getProductHighlights(sec: any, defaultFeatures: any[] = []) {
  if (sec?.items && sec.items.length > 0) {
    const highlights = sec.items.filter(
      (item: any) =>
        item.id?.startsWith('h') ||
        (!item.attr &&
          item.title &&
          !item.title.toLowerCase().includes('lead') &&
          !item.title.toLowerCase().includes('tagline'))
    );
    if (highlights.length > 0) {
      return highlights.map((h: any) => ({ title: h.title }));
    }
  }
  return defaultFeatures.slice(0, 4);
}

function getProductItemField(sec: any, fieldKey: string, defaultValue: string) {
  if (sec?.items && sec.items.length > 0) {
    const found = sec.items.find(
      (item: any) =>
        item.id === fieldKey ||
        (item.title && item.title.toLowerCase().includes(fieldKey.toLowerCase())) ||
        (item.label && item.label.toLowerCase().includes(fieldKey.toLowerCase()))
    );
    if (found) {
      return found.subtitle || found.value || found.title || defaultValue;
    }
  }
  return defaultValue;
}

export default function Products({ initialSections = [], initialDetailsOpen = false }: ProductsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(initialDetailsOpen);
  const productsRef = useRef(null);

  // Dynamic CMS sections state
  const [sections, setSections] = useState<any[]>(initialSections);

  useEffect(() => {
    fetch('/api/sections?pageSlug=products')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.sections) && data.sections.length > 0) {
          setSections(data.sections);
        }
      })
      .catch((err) => console.warn('Products sections sync notice:', err));

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings && typeof data.settings.productDetailsAccess === 'boolean') {
          setDetailsOpen(data.settings.productDetailsAccess);
        }
      })
      .catch((err) => console.warn('Products settings sync notice:', err));
  }, []);

  const getSec = (id: string) => sections.find((s) => s.sectionId === id);

  const heroSec = getSec('products-hero');
  const catalogSec = getSec('products-catalog');
  const movaSec = getSec('products-mova');
  const pentaSec = getSec('products-penta');
  const entraSec = getSec('products-entra');
  const comparisonSec = getSec('products-comparison');

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = document.querySelectorAll('.products-catalog-item');
      items.forEach((item) => {
        gsap.from(item, {
          y: 35,
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, productsRef);

    return () => ctx.revert();
  }, [sections]);

  const openEnquiry = (prod = '') => {
    setModalProduct(prod);
    setModalOpen(true);
  };

  const openLightbox = (imgs: string[], index = 0) => {
    setLightboxImages(imgs);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Build product list combining CMS sections and architectural fallback data
  const productSectionsConfig = [
    { id: 'mova', sec: movaSec, fallback: fallbackProducts.find((p) => p.id === 'mova'), isEven: false },
    { id: 'penta', sec: pentaSec, fallback: fallbackProducts.find((p) => p.id === 'penta'), isEven: true },
    { id: 'entra', sec: entraSec, fallback: fallbackProducts.find((p) => p.id === 'entra'), isEven: false },
  ];

  // System Comparison Rows
  const defaultComparisonRows = [
    { attr: 'Footprint Range', mova: '30 m² to 75 m²', penta: '50 m² to 300 m²', entra: '3 Standard Sizes' },
    { attr: 'Architectural Typology', mova: 'Single-Level Modular Studio / Villa', penta: 'Signature Double-Height & Mezzanine', entra: 'Private Immersive Acoustic Suite' },
    { attr: 'Clear Ceiling Height', mova: '2.8m – 3.2m', penta: 'Up to 5.6m Void / 2.7m Mezzanine', entra: '3.0m Acoustic Ceiling' },
    { attr: 'Primary Purpose', mova: 'Homes, Studios, Majlis, Offices', penta: 'Luxury Residences, Retreats, Villas', entra: 'Cinema, Gaming, Social, Bar' },
    { attr: 'Acoustic Insulation', mova: 'Desert Climate Acoustic Barrier', penta: 'STC 55+ Envelope Rating', entra: 'Laboratory-Tuned STC 60+' },
    { attr: 'Turnkey Lead Time', mova: '6–10 Weeks', penta: '8–14 Weeks', entra: '6–8 Weeks' },
  ];

  const comparisonRows =
    comparisonSec?.items && comparisonSec.items.length > 0
      ? comparisonSec.items
      : defaultComparisonRows;

  return (
    <main ref={productsRef}>
      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      {(!heroSec || heroSec.isVisible !== false) && (
        <section
          style={{
            position: 'relative',
            minHeight: 'clamp(540px, 64vh, 720px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 'clamp(8rem, 14vh, 11rem)',
            paddingBottom: 'clamp(5.5rem, 9vh, 7.5rem)',
            backgroundColor: '#141713',
            color: '#FAF8F5',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(to bottom, rgba(14, 18, 14, 0.7) 0%, rgba(14, 18, 14, 0.4) 36%, rgba(14, 18, 14, 0.6) 72%, rgba(14, 18, 14, 0.94) 100%), url('${
                heroSec?.mediaUrl || '/assets/images/products.png'
              }')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 46%',
              opacity: 1,
            }}
          />

          <div
            className="container"
            style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '880px' }}
          >
            <span
              className="eyebrow"
              style={{ color: 'var(--color-sand)', textShadow: '0 1px 8px rgba(0, 0, 0, 0.6)' }}
            >
              {heroSec?.eyebrow || 'Modular Product Systems'}
            </span>
            <h1
              className="hero-title"
              style={{
                color: '#FAF8F5',
                marginBottom: '1.5rem',
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.7)',
              }}
            >
              {renderLineBreaks(heroSec?.title || 'Not Just Modular.\nDesigned as Products.')}
            </h1>
            <p
              className="lead-text"
              style={{
                color: '#F0ECE1',
                maxWidth: '720px',
                margin: '0 auto',
                textShadow: '0 1px 10px rgba(0, 0, 0, 0.75)',
              }}
            >
              {heroSec?.subtitle ||
                heroSec?.content ||
                'A new generation of architectural spaces developed through integrated design, precision engineering, climate-controlled prefabrication, and rapid turnkey installation.'}
            </p>
          </div>
        </section>
      )}

      {/* =========================================================================
          EDITORIAL PRODUCT SHOWCASE
          ========================================================================= */}
      {(!catalogSec || catalogSec.isVisible !== false) && (
        <section className="section-padding bg-ivory">
          <div className="container">
            <SectionHeader
              eyebrow={catalogSec?.eyebrow || 'Architectural Catalog'}
              title={catalogSec?.title || 'Three Distinct Collections.'}
              subtitle={
                catalogSec?.subtitle ||
                catalogSec?.content ||
                'Engineered around human experience, structural permanence, and climate resilience.'
              }
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
              {productSectionsConfig.map(({ id, sec, fallback, isEven }) => {
                if (sec && sec.isVisible === false) return null;

                const prodName = sec?.title || fallback?.name || id.toUpperCase();
                const prodFullName = sec?.subtitle || fallback?.fullName || '';
                const prodCategory = sec?.eyebrow || fallback?.category || 'Modular Living';
                const prodLeadTime = getProductItemField(
                  sec,
                  'lead',
                  fallback?.leadTime ? `Lead Time: ${fallback.leadTime}` : 'Lead Time: 6–10 Weeks'
                );
                const prodTagline = getProductItemField(
                  sec,
                  'tagline',
                  fallback?.tagline || 'One System. Endless Possibilities.'
                );
                const prodDescription =
                  sec?.content ||
                  fallback?.shortDescription ||
                  'A versatile modular building system engineered to create adaptable, high-quality architectural spaces with greater speed, efficiency, and climate control.';
                const prodHeroImage = sec?.mediaUrl || fallback?.heroImage || '/assets/images/ax.jpg';
                const prodHighlights = getProductHighlights(sec, fallback?.features || []);
                const ctaText = sec?.ctaText || 'View Complete Details & Plans';
                const ctaUrl = sec?.ctaUrl || `/products/${fallback?.slug || id}`;

                const galleryImgs = [
                  prodHeroImage,
                  fallback?.previewImage || prodHeroImage,
                  ...(fallback?.gallery?.exterior || []),
                ].filter(Boolean);

                return (
                  <div
                    key={id}
                    id={id}
                    className="products-catalog-item"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid rgba(82, 105, 75, 0.12)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-md)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                      alignItems: 'stretch',
                    }}
                  >
                    {/* Visual Gallery Column */}
                    <div
                      style={{
                        position: 'relative',
                        minHeight: '440px',
                        order: isEven ? 2 : 1,
                      }}
                    >
                      <img
                        src={prodHeroImage}
                        alt={sec?.mediaAlt || prodName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          const fallbackSrc = fallback?.heroImage || (id === 'entra' ? '/assets/renders/CINE_EXT_3D_img1.jpg' : '/assets/renders/MOVA_EXT_3D_img1.jpg');
                          if (fallbackSrc && !e.currentTarget.src.includes(fallbackSrc)) {
                            e.currentTarget.src = fallbackSrc;
                          }
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => openLightbox(galleryImgs)}
                        aria-label={`Enlarge ${prodName} preview`}
                        style={{
                          position: 'absolute',
                          bottom: '1rem',
                          right: '1rem',
                          backgroundColor: 'rgba(82, 105, 75, 0.8)',
                          color: '#FAF8F5',
                          border: '1px solid rgba(255,255,255,0.2)',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        <Maximize2 size={18} />
                      </button>
                    </div>

                    {/* Content & Specs Column */}
                    <div
                      style={{
                        padding: 'clamp(2rem, 4vw, 3.5rem)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        order: isEven ? 1 : 2,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <span className="eyebrow eyebrow-forest" style={{ margin: 0 }}>
                            {prodCategory}
                          </span>
                          <span
                            style={{
                              fontSize: '0.8125rem',
                              color: 'var(--color-sand-dark)',
                              fontWeight: 600,
                            }}
                          >
                            {prodLeadTime.startsWith('Lead Time:') ? prodLeadTime : `Lead Time: ${prodLeadTime}`}
                          </span>
                        </div>

                        <h2
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                            fontWeight: 500,
                            color: 'var(--color-forest-dark)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {prodName}
                        </h2>
                        <div
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'var(--color-sand-dark)',
                            marginBottom: '1.25rem',
                          }}
                        >
                          {prodFullName}
                        </div>

                        <p
                          style={{
                            fontStyle: 'italic',
                            color: 'var(--color-forest)',
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginBottom: '1rem',
                          }}
                        >
                          &ldquo;{prodTagline.replace(/^["“”]|["“”]$/g, '')}&rdquo;
                        </p>

                        <p
                          style={{
                            color: 'var(--color-charcoal-muted)',
                            fontSize: '1rem',
                            lineHeight: '1.7',
                            marginBottom: '1.75rem',
                          }}
                        >
                          {prodDescription}
                        </p>

                        {/* Key Verified Features */}
                        <div style={{ marginBottom: '2rem' }}>
                          <h4
                            style={{
                              fontSize: '0.8125rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              color: 'var(--color-charcoal)',
                              marginBottom: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            Verified Highlights:
                          </h4>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                              gap: '0.5rem',
                            }}
                          >
                            {prodHighlights.map((f: any, i: number) => (
                              <div
                                key={i}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  fontSize: '0.875rem',
                                  color: 'var(--color-charcoal)',
                                }}
                              >
                                <Check size={16} color="var(--color-forest)" />
                                <span>{f.title || f.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        style={{
                          borderTop: '1px solid rgba(82, 105, 75, 0.1)',
                          paddingTop: '1.5rem',
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '1rem',
                        }}
                      >
                        {detailsOpen ? (
                          <Link
                            href={ctaUrl}
                            className="btn btn-primary"
                            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                          >
                            {ctaText} <ArrowRight size={16} />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="btn btn-primary"
                            style={{ cursor: 'default', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                          >
                            {ctaText} <ArrowRight size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openEnquiry(prodName)}
                          className="btn btn-sand"
                        >
                          Enquire About {prodName}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SPECIFICATIONS COMPARISON MATRIX
          ========================================================================= */}
      {(!comparisonSec || comparisonSec.isVisible !== false) && (
        <section className="section-padding bg-ivory-light">
          <div className="container">
            <SectionHeader
              eyebrow={comparisonSec?.eyebrow || 'System Comparison'}
              title={comparisonSec?.title || 'Compare AlGhaf Collections.'}
              subtitle={
                comparisonSec?.subtitle ||
                comparisonSec?.content ||
                'Understand dimensions, ceiling volumes, and structural attributes side by side.'
              }
              centered
            />

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid rgba(82, 105, 75, 0.14)',
                overflowX: 'auto',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  minWidth: '650px',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-forest-dark)', color: '#FAF8F5' }}>
                    <th
                      style={{
                        padding: '1.25rem 1.5rem',
                        fontFamily: 'var(--font-display)',
                        fontSize: '1rem',
                        width: '28%',
                      }}
                    >
                      Attributes
                    </th>
                    <th
                      style={{
                        padding: '1.25rem 1.5rem',
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.125rem',
                        fontWeight: 500,
                      }}
                    >
                      MOVA
                    </th>
                    <th
                      style={{
                        padding: '1.25rem 1.5rem',
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.125rem',
                        fontWeight: 500,
                      }}
                    >
                      PENTA
                    </th>
                    <th
                      style={{
                        padding: '1.25rem 1.5rem',
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.125rem',
                        fontWeight: 500,
                      }}
                    >
                      ENTRA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row: any, idx: number) => (
                    <tr
                      key={row.id || idx}
                      style={{
                        borderBottom: '1px solid rgba(82, 105, 75, 0.08)',
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : 'rgba(82, 105, 75, 0.02)',
                      }}
                    >
                      <td
                        style={{
                          padding: '1.125rem 1.5rem',
                          fontWeight: 600,
                          color: 'var(--color-forest-dark)',
                        }}
                      >
                        {row.attr || row.title || row.label || ''}
                      </td>
                      <td style={{ padding: '1.125rem 1.5rem', color: 'var(--color-charcoal)' }}>
                        {row.mova || row.val1 || ''}
                      </td>
                      <td style={{ padding: '1.125rem 1.5rem', color: 'var(--color-charcoal)' }}>
                        {row.penta || row.val2 || ''}
                      </td>
                      <td style={{ padding: '1.125rem 1.5rem', color: 'var(--color-charcoal)' }}>
                        {row.entra || row.val3 || ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />

      {/* Enquiry Modal */}
      <QuickEnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialProduct={modalProduct}
      />
    </main>
  );
}
