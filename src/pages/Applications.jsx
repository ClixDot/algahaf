import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Maximize2 } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import QuickEnquiryModal from '../components/common/QuickEnquiryModal';
import Lightbox from '../components/common/Lightbox';
import { applicationsData } from '../data/applicationsData';

export default function Applications() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories = ['All', 'Residential', 'Hospitality', 'Wellness', 'Specialized'];

  const filteredApps = selectedCategory === 'All'
    ? applicationsData
    : applicationsData.filter(app => app.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const openLightbox = (img) => {
    setLightboxImages([img]);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  const handleEnquiry = (title) => {
    setModalProduct(title);
    setModalOpen(true);
  };

  return (
    <main style={{ margin: 0, padding: 0 }}>
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
            backgroundImage: `linear-gradient(to bottom, rgba(14, 16, 14, 0.5) 0%, rgba(14, 16, 14, 0.82) 100%), url('/assets/images/image_bg_alghaf222.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.95
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '880px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', backgroundColor: 'rgba(201, 167, 121, 0.15)', border: '1px solid rgba(201, 167, 121, 0.35)', borderRadius: '999px', padding: '0.35rem 0.95rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C9A779' }} />
            <span style={{ color: 'var(--color-sand)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              COMING SOON — ACTIVE CURATION
            </span>
          </div>
          <h1 className="hero-title" style={{ color: '#FAF8F5', marginBottom: '1.5rem' }}>
            Built For More Than Homes.
          </h1>
          <p className="lead-text" style={{ color: '#E5DFD4', maxWidth: '720px', margin: '0 auto' }}>
            From private desert residences and luxury eco-resorts to agricultural farm retreats, wellness pavilions, and entertainment suites.
          </p>
        </div>
      </section>

      {/* =========================================================================
          APPLICATIONS CATALOG WITH CATEGORY FILTER
          ========================================================================= */}
      <section className="section-padding bg-ivory">
        <div className="container">
          {/* Category Filter Buttons with smooth transitions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center', marginBottom: '3.5rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Applications Grid — 3 per row with smooth staggered cascade animation on filter switch */}
          <div 
            key={selectedCategory}
            className="grid-3" 
            style={{ gap: 'clamp(1.5rem, 2vw, 2.25rem)' }}
          >
            {filteredApps.map((app, index) => (
              <div
                key={app.id}
                className="application-catalog-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid rgba(82, 105, 75, 0.12)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                  animationDelay: `${index * 65}ms`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 36px rgba(82, 105, 75, 0.14)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.05)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                {/* Image Banner with increased height */}
                <div style={{ height: '245px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={app.image}
                    alt={app.title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
                    }}
                  />

                  <button
                    onClick={() => openLightbox(app.image)}
                    aria-label="Enlarge application image"
                    style={{
                      position: 'absolute',
                      bottom: '0.85rem',
                      right: '0.85rem',
                      backgroundColor: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFF',
                      padding: '0.45rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.85)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.65)'}
                  >
                    <Maximize2 size={15} />
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: '1.4rem 1.4rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: '1.2rem', 
                    fontWeight: 350, 
                    color: 'var(--color-forest-dark)', 
                    marginBottom: '0.35rem',
                    lineHeight: 1.35,
                    letterSpacing: '0.015em',
                    minHeight: '3.1rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {app.title}
                  </h3>
                  <p style={{ fontStyle: 'italic', color: 'var(--color-sand-dark)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.65rem' }}>
                    “{app.tagline}”
                  </p>
                  <p style={{ 
                    color: 'var(--color-charcoal-muted)', 
                    fontSize: '0.875rem', 
                    lineHeight: '1.55', 
                    marginBottom: '1.15rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {app.description}
                  </p>

                  {/* Recommended Products & Action */}
                  <div style={{ 
                    marginTop: 'auto', 
                    borderTop: '1px solid rgba(82, 105, 75, 0.08)', 
                    paddingTop: '0.95rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    flexWrap: 'wrap', 
                    gap: '0.5rem' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-charcoal-muted)' }}>Compatible:</span>
                      {app.recommendedProducts.map(p => (
                        <Link
                          key={p}
                          to={`/products/${p.toLowerCase()}`}
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.45rem',
                            backgroundColor: 'rgba(82, 105, 75, 0.08)',
                            color: 'var(--color-forest)',
                            borderRadius: '3px',
                            textDecoration: 'none'
                          }}
                        >
                          {p}
                        </Link>
                      ))}
                    </div>

                    <button
                      onClick={() => handleEnquiry(app.title)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
                    >
                      Enquire For This Use <ArrowRight size={13} />
                    </button>
                  </div>
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
        initialProduct={modalProduct}
      />
    </main>
  );
}
