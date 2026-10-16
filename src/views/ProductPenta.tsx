'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Check, 
  Maximize2, 
  Home, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  Maximize 
} from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import QuickEnquiryModal from '../components/common/QuickEnquiryModal';
import Lightbox from '../components/common/Lightbox';
import { products } from '../data/productsData';

interface ProductPentaProps {
  initialProduct?: any;
}

export default function ProductPenta({ initialProduct }: ProductPentaProps) {
  const penta = initialProduct || products.find(p => p.id === 'penta');
  const [activeTab, setActiveTab] = useState('interior');
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (imgs: string[], idx = 0) => {
    setLightboxImages(imgs);
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const related = penta?.relatedProducts && Array.isArray(penta.relatedProducts) && penta.relatedProducts.length > 0
    ? penta.relatedProducts.map((relId: string) => products.find((p) => p.id.toLowerCase() === relId.toLowerCase())).filter(Boolean)
    : products.filter(p => p.id !== 'penta');

  const technicalProfileRows = (penta?.technicalProfile && Array.isArray(penta.technicalProfile) && penta.technicalProfile.length > 0)
    ? penta.technicalProfile
    : [
        { label: 'Footprint Range', val: '50 m² to 300 m² (Expandable Modules)' },
        { label: 'Living Room Void', val: 'Double-Height Volume up to 5.6m' },
        { label: 'Mezzanine Level', val: 'Elevated Private Master Sanctuary' },
        { label: 'Integrated Kitchen', val: 'Designer Joinery & Island Countertop' },
        { label: 'Sanitary Ware', val: 'Contemporary Spa En-Suite Bathroom' },
        { label: 'Lead Time', val: '8 to 14 Weeks Turnkey Completion' }
      ];

  const paragraphs = (penta?.overviewParagraphs && Array.isArray(penta.overviewParagraphs) && penta.overviewParagraphs.length > 0)
    ? penta.overviewParagraphs
    : [
        "PENTA is AlGhaf Collective’s signature premium living collection, where distinctive architecture, intelligent spatial design, and refined interiors come together in a precision-built modular home.",
        "Defined by its dramatic double-height living space and mezzanine bedroom, PENTA creates an expansive architectural volume that connects naturally with surrounding vistas while maintaining intimate personal sanctuaries.",
        "Available from 50 m² to 300 m², it is engineered for private architectural residences, luxury holiday villas, desert retreats, and boutique hospitality developments."
      ];

  const exteriorImages = penta?.gallery?.exterior || [];
  const interiorImages = penta?.gallery?.interior || [];
  const totalRenders = exteriorImages.length + interiorImages.length;
  const floorplans = penta?.floorplans || [];
  const specifications = Array.isArray(penta?.specifications) ? penta.specifications : [];

  return (
    <main>
      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'flex-end',
          paddingTop: '6.5rem',
          paddingBottom: '5rem',
          backgroundColor: '#0a0a0a',
          color: '#FAF8F5',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.5) 100%), url('${penta.heroImage || '/assets/images/imgupscaler-enhanced-7.jpg'}')`,
            backgroundSize: 'cover',
            backgroundPosition: penta.heroImagePosition || 'center',
            opacity: 1
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '840px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.35rem 0.85rem', backgroundColor: 'rgba(201, 167, 121, 0.2)', border: '1px solid rgba(201, 167, 121, 0.4)', borderRadius: '4px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-sand)' }}>
                {penta.heroEyebrow || `${penta.sizeRange} • ${penta.sizeRangeImperial || ''}`}
              </span>
            </div>

            <h1 className="hero-title" style={{ color: '#FAF8F5', marginBottom: '0.5rem' }}>
              {penta.heroHeading || penta.name}
            </h1>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-sand)', marginBottom: '1.25rem' }}>
              {penta.heroSubtitle || penta.fullName}
            </div>

            <p style={{ fontSize: 'clamp(1.125rem, 1.8vw, 1.35rem)', fontStyle: 'italic', color: '#E5DFD4', marginBottom: '2rem', lineHeight: '1.6' }}>
              {penta.heroTagline || `“${penta.tagline}”`}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {penta.heroCtaVisible !== false && (
                <button onClick={() => setModalOpen(true)} className="btn btn-sand btn-lg">
                  {penta.heroCtaText || `Enquire About ${penta.name}`} <ArrowRight size={18} />
                </button>
              )}
              <button 
                onClick={() => openLightbox(interiorImages.length > 0 ? interiorImages : exteriorImages)} 
                className="btn btn-outline-light btn-lg"
              >
                {penta.heroSecondaryCtaText || 'View Renders'} ({totalRenders})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SIGNATURE ARCHITECTURAL CHARACTERISTICS
          ========================================================================= */}
      {penta.overviewVisible !== false && (
        <section className="section-padding bg-ivory">
          <div className="container">
            <div className="grid-2" style={{ alignItems: 'start', gap: 'clamp(2rem, 5vw, 5rem)' }}>
              <div>
                <span className="eyebrow eyebrow-forest">{penta.overviewEyebrow || 'Signature Architecture'}</span>
                <h2 className="section-title" style={{ marginBottom: '1.5rem', color: 'var(--color-forest-dark)' }}>
                  {penta.overviewHeading || 'Elevated Modular Living.'}
                </h2>
                <div style={{ fontSize: '1.0625rem', lineHeight: '1.75', color: 'var(--color-charcoal)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {paragraphs.map((para: string, idx: number) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {/* Supported Applications Badges */}
                {penta.applications && penta.applications.length > 0 && (
                  <div style={{ marginTop: '2.5rem' }}>
                    <h4 style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-forest-dark)', marginBottom: '1rem', fontWeight: 700 }}>
                      Supported Typologies:
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {penta.applications.map((app: string) => (
                        <span key={app} style={{
                          padding: '0.4rem 0.85rem',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(82, 105, 75, 0.15)',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'var(--color-forest)'
                        }}>
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats Panel */}
              {penta.technicalProfileVisible !== false && (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid rgba(82, 105, 75, 0.14)',
                  padding: '2.5rem',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-forest-dark)', marginBottom: '1.5rem', borderBottom: '1px solid rgba(82, 105, 75, 0.1)', paddingBottom: '0.75rem' }}>
                    {penta.technicalProfileTitle || 'PENTA Spatial Attributes'}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {technicalProfileRows.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(82, 105, 75, 0.08)', paddingBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-charcoal-muted)' }}>{item.label}</span>
                        <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-forest)' }}>{item.val || item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '2rem' }}>
                    <button onClick={() => setModalOpen(true)} className="btn btn-primary" style={{ width: '100%' }}>
                      {penta.technicalProfileButtonText || 'Request PENTA Brochure & CAD Plans'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          GALLERY — 9 EXTRACTED 3D RENDERS
          ========================================================================= */}
      {penta.galleryVisible !== false && (
        <section className="section-padding bg-ivory-light">
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', gap: '1rem' }}>
              <div>
                <span className="eyebrow eyebrow-forest">{penta.galleryEyebrow || 'Architectural Showcase'}</span>
                <h2 className="section-title" style={{ color: 'var(--color-forest-dark)', margin: 0 }}>
                  {penta.galleryTitle || 'PENTA Interior & Exterior Renders'}
                </h2>
              </div>

              {/* Tab Filter */}
              <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#FFFFFF', padding: '0.25rem', borderRadius: '4px', border: '1px solid rgba(82, 105, 75, 0.15)' }}>
                <button
                  onClick={() => setActiveTab('interior')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '3px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    backgroundColor: activeTab === 'interior' ? 'var(--color-forest)' : 'transparent',
                    color: activeTab === 'interior' ? '#FAF8F5' : 'var(--color-charcoal)'
                  }}
                >
                  Interior Living & Mezzanine ({interiorImages.length})
                </button>
                <button
                  onClick={() => setActiveTab('exterior')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '3px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    backgroundColor: activeTab === 'exterior' ? 'var(--color-forest)' : 'transparent',
                    color: activeTab === 'exterior' ? '#FAF8F5' : 'var(--color-charcoal)'
                  }}
                >
                  Exterior Context ({exteriorImages.length})
                </button>
              </div>
            </div>

            {/* Grid of Renders */}
            <div className="grid-3" style={{ gap: '1.5rem' }}>
              {(activeTab === 'interior' ? interiorImages : exteriorImages).map((img: string, idx: number) => (
                <div
                  key={idx}
                  className="img-zoom-wrapper"
                  style={{
                    height: '280px',
                    borderRadius: '6px',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer'
                  }}
                  onClick={() => openLightbox(activeTab === 'interior' ? interiorImages : exteriorImages, idx)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`PENTA View ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(82, 105, 75, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.25s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  >
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: 'var(--color-charcoal)', padding: '0.5rem 0.85rem', borderRadius: '4px', fontSize: '0.8125rem', fontWeight: 600 }}>
                      Enlarge High-Res Render
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          PLANS & SPECIFICATIONS TABLE
          ========================================================================= */}
      {penta.specsVisible !== false && (
        <section className="section-padding bg-ivory">
          <div className="container">
            <SectionHeader
              eyebrow={penta.plansEyebrow || 'Architectural Integrity'}
              title={penta.plansTitle || 'PENTA Configurations & Specifications.'}
              subtitle={penta.plansSubtitle || 'Engineered for endurance in harsh desert environments while delivering ultra-luxury residential comfort.'}
            />

            <div className="grid-2" style={{ gap: '3.5rem', alignItems: 'start' }}>
              {/* Floor Plan Configurations */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-forest-dark)', marginBottom: '1.25rem' }}>
                  {penta.floorplansTitle || 'Modular Layout Typologies'}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {floorplans.map((plan: any, i: number) => (
                    <div key={i} style={{
                      backgroundColor: '#FFFFFF',
                      padding: '1.5rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(82, 105, 75, 0.12)',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--color-forest-dark)' }}>
                          {plan.name}
                        </h4>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-sand-dark)' }}>
                          {plan.dimensions || plan.size}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--color-charcoal-muted)', margin: 0, lineHeight: '1.6' }}>
                        {plan.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete Specifications Table */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-forest-dark)', marginBottom: '1.25rem' }}>
                  {penta.specificationsTitle || 'Engineering & Material Matrix'}
                </h3>

                <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '6px', border: '1px solid rgba(82, 105, 75, 0.12)', boxShadow: 'var(--shadow-sm)' }}>
                  <table className="spec-table">
                    <tbody>
                      {specifications.map((spec: any, i: number) => (
                        <tr key={i}>
                          <td>{spec.label}</td>
                          <td>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          RELATED PRODUCTS
          ========================================================================= */}
      {penta.relatedVisible !== false && (
        <section className="section-padding bg-ivory-light">
          <div className="container">
            <SectionHeader
              eyebrow={penta.relatedEyebrow || 'Explore Other Systems'}
              title={penta.relatedTitle || 'Complementary AlGhaf Collections.'}
              centered
            />

            <div className="grid-2" style={{ maxWidth: '960px', margin: '0 auto', gap: '2rem' }}>
              {related.map((prod: any) => (
                <div key={prod.id} style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid rgba(82, 105, 75, 0.12)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ height: '220px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={prod.heroImage} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '1.75rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-forest-dark)', marginBottom: '0.25rem' }}>
                      {prod.name}
                    </h3>
                    <p style={{ color: 'var(--color-sand-dark)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                      {prod.fullName} ({prod.sizeRange})
                    </p>
                    <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.9375rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                      {prod.shortDescription}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="btn btn-outline-dark btn-sm"
                      style={{ cursor: 'default' }}
                    >
                      View {prod.name} Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
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
        initialProduct="PENTA"
      />
    </main>
  );
}
