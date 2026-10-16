'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Check, 
  Maximize2, 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Thermometer, 
  Volume2, 
  Droplet 
} from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import QuickEnquiryModal from '../components/common/QuickEnquiryModal';
import Lightbox from '../components/common/Lightbox';
import { products } from '../data/productsData';

interface ProductMovaProps {
  initialProduct?: any;
}

export default function ProductMova({ initialProduct }: ProductMovaProps) {
  const mova = initialProduct || products.find(p => p.id === 'mova');
  const [activeTab, setActiveTab] = useState('exterior');
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (imgs: string[], idx = 0) => {
    setLightboxImages(imgs);
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const related = mova?.relatedProducts && Array.isArray(mova.relatedProducts) && mova.relatedProducts.length > 0
    ? mova.relatedProducts.map((relId: string) => products.find((p) => p.id.toLowerCase() === relId.toLowerCase())).filter(Boolean)
    : products.filter(p => p.id !== 'mova');

  const technicalProfileRows = (mova?.technicalProfile && Array.isArray(mova.technicalProfile) && mova.technicalProfile.length > 0)
    ? mova.technicalProfile
    : [
        { label: 'Available Sizes', val: '30 m² to 75 m² (323–807 sq ft)' },
        { label: 'Production Turnaround', val: '6 to 10 Weeks (Factory Built)' },
        { label: 'On-Site Installation', val: '1 to 2 Days (Crane Lift Assembly)' },
        { label: 'Climate Suitability', val: 'Engineered for extreme GCC desert climates' },
        { label: 'Structural Guarantee', val: '10-Year High-Tensile Steel Warranty' }
      ];

  const paragraphs = (mova?.overviewParagraphs && Array.isArray(mova.overviewParagraphs) && mova.overviewParagraphs.length > 0)
    ? mova.overviewParagraphs
    : [
        "MOVA is AlGhaf Collective’s versatile modular building system — designed to create high-quality, adaptable spaces with greater speed, efficiency, and control.",
        "Factory-built using advanced prefabrication, every MOVA is engineered for thermal performance, acoustic comfort, waterproofing, durability, and year-round living in the UAE's demanding climate.",
        "Available from 30 m² to 75 m², MOVA effortlessly serves as a private garden majlis, executive studio, one-bedroom luxury home, guest villa, home office, gym, private theatre, or bespoke wellness pavilion."
      ];

  const exteriorImages = mova?.gallery?.exterior || [];
  const interiorImages = mova?.gallery?.interior || [];
  const totalRenders = exteriorImages.length + interiorImages.length;
  const floorplans = mova?.floorplans || [];
  const specifications = Array.isArray(mova?.specifications) ? mova.specifications : [];

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
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.5) 100%), url('${mova.heroImage || '/assets/renders/MOVA_EXT_3D_img1.jpg'}')`,
            backgroundSize: 'cover',
            backgroundPosition: mova.heroImagePosition || 'center',
            opacity: 1
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.35rem 0.85rem', backgroundColor: 'rgba(201, 167, 121, 0.2)', border: '1px solid rgba(201, 167, 121, 0.4)', borderRadius: '4px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-sand)' }}>
                {mova.heroEyebrow || `${mova.sizeRange} • ${mova.sizeRangeImperial || ''}`}
              </span>
            </div>

            <h1 className="hero-title" style={{ color: '#FAF8F5', marginBottom: '0.5rem' }}>
              {mova.heroHeading || mova.name}
            </h1>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-sand)', marginBottom: '1.25rem' }}>
              {mova.heroSubtitle || mova.fullName}
            </div>

            <p style={{ fontSize: 'clamp(1.125rem, 1.8vw, 1.35rem)', fontStyle: 'italic', color: '#E5DFD4', marginBottom: '2rem', lineHeight: '1.6' }}>
              {mova.heroTagline || `“${mova.tagline}”`}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {mova.heroCtaVisible !== false && (
                <button onClick={() => setModalOpen(true)} className="btn btn-sand btn-lg">
                  {mova.heroCtaText || `Enquire About ${mova.name}`} <ArrowRight size={18} />
                </button>
              )}
              <button 
                onClick={() => openLightbox(exteriorImages.length > 0 ? exteriorImages : interiorImages)} 
                className="btn btn-outline-light btn-lg"
              >
                {mova.heroSecondaryCtaText || 'View 3D Renders'} ({totalRenders})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          OVERVIEW & EDITORIAL DESCRIPTION
          ========================================================================= */}
      {mova.overviewVisible !== false && (
        <section className="section-padding bg-ivory">
          <div className="container">
            <div className="grid-2" style={{ alignItems: 'start', gap: 'clamp(2rem, 5vw, 5rem)' }}>
              <div>
                <span className="eyebrow eyebrow-forest">{mova.overviewEyebrow || 'Architectural Overview'}</span>
                <h2 className="section-title" style={{ marginBottom: '1.5rem', color: 'var(--color-forest-dark)' }}>
                  {mova.overviewHeading || 'Versatile Living. Engineered Without Limits.'}
                </h2>
                <div style={{ fontSize: '1.0625rem', lineHeight: '1.75', color: 'var(--color-charcoal)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {paragraphs.map((para: string, idx: number) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {/* Supported Applications Badge Grid */}
                {mova.applications && mova.applications.length > 0 && (
                  <div style={{ marginTop: '2.5rem' }}>
                    <h4 style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-forest-dark)', marginBottom: '1rem', fontWeight: 700 }}>
                      Documented Applications:
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {mova.applications.map((app: string) => (
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
              {mova.technicalProfileVisible !== false && (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid rgba(82, 105, 75, 0.14)',
                  padding: '2.5rem',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-forest-dark)', marginBottom: '1.5rem', borderBottom: '1px solid rgba(82, 105, 75, 0.1)', paddingBottom: '0.75rem' }}>
                    {mova.technicalProfileTitle || 'Key Technical Profile'}
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
                      {mova.technicalProfileButtonText || 'Request Technical Floor Plans'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          GALLERY — EXTERIOR & INTERIOR (Extracted Renders)
          ========================================================================= */}
      {mova.galleryVisible !== false && (
        <section className="section-padding bg-ivory-light">
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', gap: '1rem' }}>
              <div>
                <span className="eyebrow eyebrow-forest">{mova.galleryEyebrow || 'Visual Showcase'}</span>
                <h2 className="section-title" style={{ color: 'var(--color-forest-dark)', margin: 0 }}>
                  {mova.galleryTitle || `${mova.name} Architectural Renders`}
                </h2>
              </div>

              {/* Tab Filter */}
              <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#FFFFFF', padding: '0.25rem', borderRadius: '4px', border: '1px solid rgba(82, 105, 75, 0.15)' }}>
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
                  Exterior Views ({exteriorImages.length})
                </button>
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
                  Interior Architecture ({interiorImages.length})
                </button>
              </div>
            </div>

            {/* Grid of Renders */}
            <div className="grid-3" style={{ gap: '1.5rem' }}>
              {(activeTab === 'exterior' ? exteriorImages : interiorImages).map((img: string, idx: number) => (
                <div
                  key={idx}
                  className="img-zoom-wrapper"
                  style={{
                    height: '280px',
                    borderRadius: '6px',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer'
                  }}
                  onClick={() => openLightbox(activeTab === 'exterior' ? exteriorImages : interiorImages, idx)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${mova.name} View ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(82, 105, 75, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.25s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  >
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--color-charcoal)', padding: '0.5rem 0.85rem', borderRadius: '4px', fontSize: '0.8125rem', fontWeight: 600 }}>
                      Click to View Full Resolution
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          FLOOR PLANS & TECHNICAL SPECIFICATIONS TABLE
          ========================================================================= */}
      {mova.specsVisible !== false && (
        <section className="section-padding bg-ivory">
          <div className="container">
            <SectionHeader
              eyebrow={mova.plansEyebrow || 'Precision Engineering'}
              title={mova.plansTitle || 'Specifications & Floor Configurations.'}
              subtitle={mova.plansSubtitle || 'Verified architectural tolerances and standard layout options.'}
            />

            <div className="grid-2" style={{ gap: '3.5rem', alignItems: 'start' }}>
              {/* Floor Plan Cards */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-forest-dark)', marginBottom: '1.25rem' }}>
                  {mova.floorplansTitle || 'Curated Layout Plans'}
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
                  {mova.specificationsTitle || 'Technical Specifications'}
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
          RELATED PRODUCTS PREVIEW
          ========================================================================= */}
      {mova.relatedVisible !== false && (
        <section className="section-padding bg-ivory-light">
          <div className="container">
            <SectionHeader
              eyebrow={mova.relatedEyebrow || 'Explore Other Systems'}
              title={mova.relatedTitle || 'Related AlGhaf Collections.'}
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
                    <Link href={`/products/${prod.slug}`} className="btn btn-outline-dark btn-sm">
                      View {prod.name} Details <ArrowRight size={14} />
                    </Link>
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
        initialProduct="MOVA"
      />
    </main>
  );
}
