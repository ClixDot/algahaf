'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Maximize2 } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import QuickEnquiryModal from '../components/common/QuickEnquiryModal';
import Lightbox from '../components/common/Lightbox';
import { applicationsData } from '../data/applicationsData';

const DEFAULT_CATEGORIES = ['All', 'Residential', 'Hospitality', 'Wellness', 'Specialized'];

export default function Applications() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Live CMS state
  const [heroData, setHeroData] = useState<any>({
    eyebrow: 'COMING SOON — ACTIVE CURATION',
    title: 'Built For More Than Homes.',
    subtitle: 'From private desert residences and luxury eco-resorts to agricultural farm retreats, wellness pavilions, and entertainment suites.',
    mediaUrl: '/assets/images/image_bg_alghaf222.jpg',
    mediaAlt: 'Built For More Than Homes - AlGhaf Applications',
    isVisible: true,
    overlayColor: '#0E100E',
    overlayOpacity: 0.82,
    textAlign: 'center',
    contentWidth: '880px',
  });
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [applications, setApplications] = useState<any[]>(applicationsData);
  const [closingSec, setClosingSec] = useState<any>(null);

  useEffect(() => {
    fetch('/api/sections?pageSlug=applications', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.sections) && data.sections.length > 0) {
          const hero = data.sections.find((s: any) => s.sectionId === 'applications-hero');
          if (hero) {
            const styling = hero.items?.[0] || {};
            setHeroData({
              eyebrow: hero.eyebrow || 'COMING SOON — ACTIVE CURATION',
              title: hero.title || 'Built For More Than Homes.',
              subtitle: hero.subtitle || hero.content || 'From private desert residences and luxury eco-resorts to agricultural farm retreats, wellness pavilions, and entertainment suites.',
              mediaUrl: hero.mediaUrl || '/assets/images/image_bg_alghaf222.jpg',
              mediaAlt: hero.mediaAlt || 'Built For More Than Homes - AlGhaf Applications',
              isVisible: hero.isVisible !== false,
              overlayColor: styling.overlayColor || '#0E100E',
              overlayOpacity: typeof styling.overlayOpacity === 'number' ? styling.overlayOpacity : 0.82,
              textAlign: styling.textAlign || 'center',
              contentWidth: styling.contentWidth || '880px',
            });
          }

          const catSec = data.sections.find((s: any) => s.sectionId === 'applications-categories');
          if (catSec && Array.isArray(catSec.items) && catSec.items.length > 0) {
            const catList = catSec.items
              .filter((c: any) => c.isVisible !== false)
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map((c: any) => c.name || c.title || c.slug)
              .filter(Boolean);
            if (catList.length > 0) {
              setCategories(catList);
            }
          }

          const cardsSec = data.sections.find((s: any) => s.sectionId === 'applications-cards');
          if (cardsSec && Array.isArray(cardsSec.items) && cardsSec.items.length > 0) {
            const validCards = cardsSec.items
              .filter((c: any) => c.isVisible !== false && c.status !== 'draft')
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            if (validCards.length > 0) {
              setApplications(validCards);
            }
          }

          const closing = data.sections.find((s: any) => s.sectionId === 'applications-closing');
          if (closing) {
            setClosingSec(closing);
          }
        }
      })
      .catch((err) => console.warn('Applications CMS sync notice:', err));
  }, []);

  const filteredApps = selectedCategory.toLowerCase() === 'all'
    ? applications
    : applications.filter((app) => {
        const cat = (app.category || '').toLowerCase();
        const cats = Array.isArray(app.categories) ? app.categories.map((c: string) => c.toLowerCase()) : [];
        const sel = selectedCategory.toLowerCase();
        return cat.includes(sel) || cats.includes(sel);
      });

  const openLightbox = (img: string) => {
    setLightboxImages([img]);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  const handleEnquiry = (title: string) => {
    setModalProduct(title);
    setModalOpen(true);
  };

  return (
    <main style={{ margin: 0, padding: 0 }}>
      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      {heroData.isVisible !== false && (
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
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(to bottom, rgba(14, 16, 14, ${
                typeof heroData.overlayOpacity === 'number' ? heroData.overlayOpacity * 0.6 : 0.5
              }) 0%, rgba(14, 16, 14, ${
                typeof heroData.overlayOpacity === 'number' ? heroData.overlayOpacity : 0.82
              }) 100%), url('${heroData.mediaUrl || '/assets/images/image_bg_alghaf222.jpg'}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.95,
            }}
          />

          <div
            className="container"
            style={{
              position: 'relative',
              zIndex: 2,
              textAlign: heroData.textAlign || 'center',
              maxWidth: heroData.contentWidth || '880px',
              margin: '0 auto',
            }}
          >
            {heroData.eyebrow && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  backgroundColor: 'rgba(201, 167, 121, 0.15)',
                  border: '1px solid rgba(201, 167, 121, 0.35)',
                  borderRadius: '999px',
                  padding: '0.35rem 0.95rem',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C9A779' }} />
                <span
                  style={{
                    color: 'var(--color-sand)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  {heroData.eyebrow}
                </span>
              </div>
            )}
            <h1 className="hero-title" style={{ color: '#FAF8F5', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
              {heroData.title || 'Built For More Than Homes.'}
            </h1>
            <p className="lead-text" style={{ color: '#E5DFD4', maxWidth: '720px', margin: heroData.textAlign === 'center' ? '0 auto' : '0' }}>
              {heroData.subtitle || heroData.content}
            </p>
          </div>
        </section>
      )}

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
            {filteredApps.map((app, index) => {
              const appImg = app.image || app.mediaUrl || '/assets/images/built_more_than_homes_01_web.jpg';
              const appAlt = app.imageAlt || app.title;
              const compatibleList = app.compatibility || app.recommendedProducts || [];
              const overviewHref = app.overviewUrl || `/applications/${app.id}`;
              const overviewLabel = app.overviewBtnText || 'Overview';
              const enquireLabel = app.enquireBtnText || 'Enquire';
              const showBtns = app.showButtons !== false;

              return (
                <div
                  key={app.id || index}
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
                    animationDelay: `${index * 65}ms`,
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
                  {/* Image Banner */}
                  <div style={{ height: '245px', position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={appImg}
                      alt={appAlt}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        objectPosition: app.imagePosition || 'center center',
                        display: 'block',
                        transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      }}
                    />

                    <button
                      onClick={() => openLightbox(appImg)}
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
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.85)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.65)')}
                    >
                      <Maximize2 size={15} />
                    </button>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1.4rem 1.4rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3
                      style={{ 
                        fontFamily: 'var(--font-display)', 
                        fontSize: '1.2rem', 
                        fontWeight: 350, 
                        color: 'var(--color-forest-dark)', 
                        marginBottom: '0.35rem',
                        lineHeight: 1.35,
                        letterSpacing: '0.015em',
                        minHeight: '3.1rem',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Link
                        href={overviewHref}
                        target={app.overviewOpenNewTab ? '_blank' : undefined}
                        rel={app.overviewOpenNewTab ? 'noopener noreferrer' : undefined}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {app.title}
                      </Link>
                    </h3>
                    {app.tagline && (
                      <p style={{ fontStyle: 'italic', color: 'var(--color-sand-dark)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.65rem' }}>
                        “{app.tagline}”
                      </p>
                    )}
                    <p
                      style={{ 
                        color: 'var(--color-charcoal-muted)', 
                        fontSize: '0.875rem', 
                        lineHeight: '1.55', 
                        marginBottom: '1.15rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {app.description}
                    </p>

                    {/* Compatible Products & Action Buttons */}
                    <div
                      style={{ 
                        marginTop: 'auto', 
                        borderTop: '1px solid rgba(82, 105, 75, 0.08)', 
                        paddingTop: '0.95rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        flexWrap: 'wrap', 
                        gap: '0.5rem', 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {compatibleList.length > 0 && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-charcoal-muted)' }}>Compatible:</span>
                        )}
                        {compatibleList.map((p: string) => (
                          <Link
                            key={p}
                            href={`/products/${p.toLowerCase()}`}
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.45rem',
                              backgroundColor: 'rgba(82, 105, 75, 0.08)',
                              color: 'var(--color-forest)',
                              borderRadius: '3px',
                              textDecoration: 'none',
                            }}
                          >
                            {p}
                          </Link>
                        ))}
                      </div>

                      {showBtns && (
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <Link
                            href={overviewHref}
                            target={app.overviewOpenNewTab ? '_blank' : undefined}
                            rel={app.overviewOpenNewTab ? 'noopener noreferrer' : undefined}
                            className="btn btn-outline-dark btn-sm"
                            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
                          >
                            {overviewLabel}
                          </Link>
                          {app.enquireUrl && app.enquireUrl !== '#enquiry' ? (
                            <Link
                              href={app.enquireUrl}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
                            >
                              {enquireLabel} <ArrowRight size={13} />
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleEnquiry(app.title)}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
                            >
                              {enquireLabel} <ArrowRight size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLOSING CTA SECTION
          ========================================================================= */}
      {closingSec && closingSec.isVisible !== false && (
        <section
          style={{
            position: 'relative',
            padding: 'clamp(4.5rem, 8vh, 6.5rem) 2rem',
            backgroundColor: '#1E231D',
            color: '#FAF8F5',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(to bottom, rgba(20, 23, 19, 0.85) 0%, rgba(20, 23, 19, 0.95) 100%), url(${
                closingSec.mediaUrl || '/assets/images/about_bg.png'
              })`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.5,
            }}
          />
          <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '760px', margin: '0 auto' }}>
            {closingSec.eyebrow && (
              <span className="eyebrow" style={{ color: 'var(--color-sand)', marginBottom: '0.75rem', display: 'block' }}>
                {closingSec.eyebrow}
              </span>
            )}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                fontWeight: 600,
                color: '#FAF8F5',
                marginBottom: '1.25rem',
                lineHeight: 1.25,
              }}
            >
              {closingSec.title || 'Have a Unique Architectural Requirement?'}
            </h2>
            <p style={{ color: '#E5DFD4', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              {closingSec.subtitle ||
                closingSec.content ||
                'Our prefabrication engineers collaborate with private landowners, hoteliers, and developers across the UAE and GCC.'}
            </p>
            <Link
              href={closingSec.ctaUrl || '/contact'}
              className="btn btn-primary"
              style={{ padding: '0.85rem 2rem', fontSize: '0.9rem', fontWeight: 700 }}
            >
              {closingSec.ctaText || 'Start a Consultation'} <ArrowRight size={15} />
            </Link>
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
        initialProduct={modalProduct}
      />
    </main>
  );
}
