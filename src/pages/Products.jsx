import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Maximize2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '../components/common/SectionHeader';
import QuickEnquiryModal from '../components/common/QuickEnquiryModal';
import Lightbox from '../components/common/Lightbox';
import { products } from '../data/productsData';

export default function Products() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const productsRef = useRef(null);

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
            toggleActions: 'play none none none'
          }
        });
      });
    }, productsRef);

    return () => ctx.revert();
  }, []);

  const openEnquiry = (prod = '') => {
    setModalProduct(prod);
    setModalOpen(true);
  };

  const openLightbox = (imgs, index = 0) => {
    setLightboxImages(imgs);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <main ref={productsRef}>
      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          minHeight: 'clamp(520px, 62vh, 700px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 'clamp(8rem, 14vh, 10.5rem)',
          paddingBottom: 'clamp(5rem, 9vh, 7rem)',
          backgroundColor: '#141713',
          color: '#FAF8F5',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(to bottom, rgba(14, 16, 14, 0.55) 0%, rgba(14, 16, 14, 0.38) 45%, rgba(14, 16, 14, 0.88) 100%), url('/assets/images/image_bg_alghafxa.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            opacity: 1
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '880px' }}>
          <span className="eyebrow" style={{ color: 'var(--color-sand)' }}>
            Modular Product Systems
          </span>
          <h1 className="hero-title" style={{ color: '#FAF8F5', marginBottom: '1.5rem' }}>
            Not Just Modular.<br />Designed as Products.
          </h1>
          <p className="lead-text" style={{ color: '#E5DFD4', maxWidth: '720px', margin: '0 auto' }}>
            A new generation of architectural spaces developed through integrated design, precision engineering, climate-controlled prefabrication, and rapid turnkey installation.
          </p>
        </div>
      </section>

      {/* =========================================================================
          EDITORIAL PRODUCT SHOWCASE
          ========================================================================= */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <SectionHeader
            eyebrow="Architectural Catalog"
            title="Three Distinct Collections."
            subtitle="Engineered around human experience, structural permanence, and climate resilience."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            {products.map((prod, index) => {
              const isEven = index % 2 === 1;
              return (
                <div
                  key={prod.id}
                  id={prod.id}
                  className="products-catalog-item"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid rgba(82, 105, 75, 0.12)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-md)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                    alignItems: 'stretch'
                  }}
                >
                  {/* Visual Gallery Column */}
                  <div
                    style={{
                      position: 'relative',
                      minHeight: '440px',
                      order: isEven ? 2 : 1
                    }}
                  >
                    <img
                      src={prod.heroImage}
                      alt={prod.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    <button
                      onClick={() => openLightbox([prod.heroImage, prod.previewImage, ...prod.gallery.exterior])}
                      aria-label="Enlarge product preview"
                      style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem',
                        backgroundColor: 'rgba(82, 105, 75, 0.8)',
                        color: '#FAF8F5',
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
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
                      order: isEven ? 1 : 2
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span className="eyebrow eyebrow-forest" style={{ margin: 0 }}>
                          {prod.category}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--color-sand-dark)', fontWeight: 600 }}>
                          Lead Time: {prod.leadTime}
                        </span>
                      </div>

                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 500, color: 'var(--color-forest-dark)', marginBottom: '0.25rem' }}>
                        {prod.name}
                      </h2>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-sand-dark)', marginBottom: '1.25rem' }}>
                        {prod.fullName}
                      </div>

                      <p style={{ fontStyle: 'italic', color: 'var(--color-forest)', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                        “{prod.tagline}”
                      </p>

                      <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.75rem' }}>
                        {prod.shortDescription}
                      </p>

                      {/* Key Verified Features */}
                      <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-charcoal)', marginBottom: '0.75rem', fontWeight: 700 }}>
                          Verified Highlights:
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                          {prod.features.slice(0, 4).map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>
                              <Check size={16} color="var(--color-forest)" />
                              <span>{f.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ borderTop: '1px solid rgba(82, 105, 75, 0.1)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
                      <Link to={`/products/${prod.slug}`} className="btn btn-primary">
                        View Complete Details & Plans <ArrowRight size={16} />
                      </Link>
                      <button
                        onClick={() => openEnquiry(prod.name)}
                        className="btn btn-sand"
                      >
                        Enquire About {prod.name}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SPECIFICATIONS COMPARISON MATRIX
          ========================================================================= */}
      <section className="section-padding bg-ivory-light">
        <div className="container">
          <SectionHeader
            eyebrow="System Comparison"
            title="Compare AlGhaf Collections."
            subtitle="Understand dimensions, ceiling volumes, and structural attributes side by side."
            centered
          />

          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid rgba(82, 105, 75, 0.14)',
            overflowX: 'auto',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-forest-dark)', color: '#FAF8F5' }}>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-display)', fontSize: '1rem', width: '28%' }}>Attributes</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 500 }}>MOVA</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 500 }}>PENTA</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 500 }}>ENTRA</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { attr: 'Footprint Range', mova: '30 m² to 75 m²', penta: '50 m² to 300 m²', entra: '3 Standard Sizes' },
                  { attr: 'Architectural Typology', mova: 'Single-Level Modular Studio / Villa', penta: 'Signature Double-Height & Mezzanine', entra: 'Private Immersive Acoustic Suite' },
                  { attr: 'Clear Ceiling Height', mova: '2.8m – 3.2m', penta: 'Up to 5.6m Void / 2.7m Mezzanine', entra: '3.0m Acoustic Ceiling' },
                  { attr: 'Primary Purpose', mova: 'Homes, Studios, Majlis, Offices', penta: 'Luxury Residences, Retreats, Villas', entra: 'Cinema, Gaming, Social, Bar' },
                  { attr: 'Acoustic Insulation', mova: 'Desert Climate Acoustic Barrier', penta: 'STC 55+ Envelope Rating', entra: 'Laboratory-Tuned STC 60+' },
                  { attr: 'Turnkey Lead Time', mova: '6–10 Weeks', penta: '8–14 Weeks', entra: '6–8 Weeks' }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(82, 105, 75, 0.08)', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : 'rgba(82, 105, 75, 0.02)' }}>
                    <td style={{ padding: '1.125rem 1.5rem', fontWeight: 600, color: 'var(--color-forest-dark)' }}>{row.attr}</td>
                    <td style={{ padding: '1.125rem 1.5rem', color: 'var(--color-charcoal)' }}>{row.mova}</td>
                    <td style={{ padding: '1.125rem 1.5rem', color: 'var(--color-charcoal)' }}>{row.penta}</td>
                    <td style={{ padding: '1.125rem 1.5rem', color: 'var(--color-charcoal)' }}>{row.entra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

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
