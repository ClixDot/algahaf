import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Check, 
  Maximize2, 
  Tv, 
  Gamepad2, 
  GlassWater, 
  VolumeX, 
  Sparkles, 
  Sliders 
} from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import QuickEnquiryModal from '../components/common/QuickEnquiryModal';
import Lightbox from '../components/common/Lightbox';
import { products } from '../data/productsData';

export default function ProductEntra() {
  const entra = products.find(p => p.id === 'entra');
  const [activeTab, setActiveTab] = useState('interior');
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (imgs, idx = 0) => {
    setLightboxImages(imgs);
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const related = products.filter(p => p.id !== 'entra');

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
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.5) 100%), url('${entra.heroImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 1
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '840px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.35rem 0.85rem', backgroundColor: 'rgba(201, 167, 121, 0.2)', border: '1px solid rgba(201, 167, 121, 0.4)', borderRadius: '4px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-sand)' }}>
                {entra.sizeRange} &bull; Optional Bar & Restroom
              </span>
            </div>

            <h1 className="hero-title" style={{ color: '#FAF8F5', marginBottom: '0.5rem' }}>
              {entra.name}
            </h1>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-sand)', marginBottom: '1.25rem' }}>
              {entra.fullName}
            </div>

            <p style={{ fontSize: 'clamp(1.125rem, 1.8vw, 1.35rem)', fontStyle: 'italic', color: '#E5DFD4', marginBottom: '2rem', lineHeight: '1.6' }}>
              “{entra.tagline}”
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button onClick={() => setModalOpen(true)} className="btn btn-sand btn-lg">
                Enquire About ENTRA <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => openLightbox(entra.gallery.interior)} 
                className="btn btn-outline-light btn-lg"
              >
                View Cinema & Bar Renders ({entra.gallery.interior.length})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          OVERVIEW & ACOUSTIC ENTERTAINMENT FOCUS
          ========================================================================= */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'start', gap: 'clamp(2rem, 5vw, 5rem)' }}>
            <div>
              <span className="eyebrow eyebrow-forest">Private Sanctuary</span>
              <h2 className="section-title" style={{ marginBottom: '1.5rem', color: 'var(--color-forest-dark)' }}>
                Your Private Immersive World.
              </h2>
              <div style={{ fontSize: '1.0625rem', lineHeight: '1.75', color: 'var(--color-charcoal)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p>
                  ENTRA is an immersive audio-visual entertainment space, designed for private cinema, esports gaming, and social experiences — all within your own standalone private environment.
                </p>
                <p>
                  Built to rigorous acoustic isolation specifications (STC 60+), ENTRA decouples high-output sound from the rest of your estate, providing reference-level acoustics without disturbing household members or neighbors.
                </p>
                <p>
                  Available in <strong>three distinct sizes</strong>, ENTRA can be configured with an optional integrated social cocktail bar and private luxury restroom module for an entirely self-contained leisure retreat.
                </p>
              </div>

              {/* Supported Entertainment Typologies */}
              <div style={{ marginTop: '2.5rem' }}>
                <h4 style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-forest-dark)', marginBottom: '1rem', fontWeight: 700 }}>
                  Tailored Applications:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {entra.applications.map((app) => (
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
            </div>

            {/* Quick Stats Panel */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid rgba(82, 105, 75, 0.14)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-forest-dark)', marginBottom: '1.5rem', borderBottom: '1px solid rgba(82, 105, 75, 0.1)', paddingBottom: '0.75rem' }}>
                ENTRA Acoustic Specifications
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: 'Available Sizes', val: '3 Configurations (Compact, Standard, Grand)' },
                  { label: 'Acoustic Rating', val: 'STC 60+ Sound Isolation Envelope' },
                  { label: 'Audio Conduits', val: 'Dolby Atmos 7.2.4 / 9.4.6 Spatial Pre-Wiring' },
                  { label: 'Visual Support', val: '4K Laser Projector or 120"–150" MicroLED' },
                  { label: 'Optional Modules', val: 'Integrated Cocktail Bar & Luxury Washroom' },
                  { label: 'Air & Ventilation', val: 'Silent NC-25 VRV Fresh Air Climate System' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(82, 105, 75, 0.08)', paddingBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-charcoal-muted)' }}>{item.label}</span>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-forest)' }}>{item.val}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button onClick={() => setModalOpen(true)} className="btn btn-primary" style={{ width: '100%' }}>
                  Enquire About ENTRA Options
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          GALLERY — CINEMA & INTERIOR RENDERS (Extracted)
          ========================================================================= */}
      <section className="section-padding bg-ivory-light">
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', gap: '1rem' }}>
            <div>
              <span className="eyebrow eyebrow-forest">Immersive Visuals</span>
              <h2 className="section-title" style={{ color: 'var(--color-forest-dark)', margin: 0 }}>
                ENTRA Architectural & Interior Views
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
                Cinema, Bar & Restroom ({entra.gallery.interior.length})
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
                Exterior Renders ({entra.gallery.exterior.length})
              </button>
            </div>
          </div>

          {/* Grid of Renders */}
          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {(activeTab === 'interior' ? entra.gallery.interior : entra.gallery.exterior).map((img, idx) => (
              <div
                key={idx}
                className="img-zoom-wrapper"
                style={{
                  height: '280px',
                  borderRadius: '6px',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer'
                }}
                onClick={() => openLightbox(activeTab === 'interior' ? entra.gallery.interior : entra.gallery.exterior, idx)}
              >
                <img src={img} alt={`ENTRA View ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                    Click to View Full Resolution
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          PLANS & SPECIFICATIONS TABLE
          ========================================================================= */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <SectionHeader
            eyebrow="Configuration & Engineering"
            title="ENTRA Configurations & Technical Matrix."
            subtitle="Customizable around your seating capacity, acoustic gear, and social preferences."
          />

          <div className="grid-2" style={{ gap: '3.5rem', alignItems: 'start' }}>
            {/* Size Configurations */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-forest-dark)', marginBottom: '1.25rem' }}>
                3 Size Configurations
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {entra.floorplans.map((plan, i) => (
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
                        {plan.dimensions}
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
                Technical Specifications
              </h3>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '6px', border: '1px solid rgba(82, 105, 75, 0.12)', boxShadow: 'var(--shadow-sm)' }}>
                <table className="spec-table">
                  <tbody>
                    {entra.specifications.map((spec, i) => (
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

      {/* =========================================================================
          RELATED PRODUCTS
          ========================================================================= */}
      <section className="section-padding bg-ivory-light">
        <div className="container">
          <SectionHeader
            eyebrow="Explore Other Systems"
            title="Explore Living Systems."
            centered
          />

          <div className="grid-2" style={{ maxWidth: '960px', margin: '0 auto', gap: '2rem' }}>
            {related.map(prod => (
              <div key={prod.id} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid rgba(82, 105, 75, 0.12)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ height: '220px' }}>
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
                  <Link to={`/products/${prod.slug}`} className="btn btn-outline-dark btn-sm">
                    View {prod.name} Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
        initialProduct="ENTRA"
      />
    </main>
  );
}
