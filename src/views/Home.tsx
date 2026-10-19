'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Compass, 
  ChevronRight, 
  Maximize2 
} from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import QuickEnquiryModal from '../components/common/QuickEnquiryModal';
import Lightbox from '../components/common/Lightbox';
import { products } from '../data/productsData';
import { companyInfo } from '../data/companyData';
import { applicationsData } from '../data/applicationsData';
import HowWeBuildSection from '../components/home/HowWeBuildSection';

interface HomeProps {
  initialSections?: any[];
  initialDetailsOpen?: boolean;
}

export default function Home({ initialSections = [], initialDetailsOpen = false }: HomeProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(initialDetailsOpen);

  // Dynamic CMS sections state
  const [sections, setSections] = useState<any[]>(initialSections);

  useEffect(() => {
    // Only fetch client-side if server didn't provide sections (rare fallback)
    if (initialSections && initialSections.length > 0) return;
    fetch('/api/sections?pageSlug=home')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.sections) && data.sections.length > 0) {
          setSections(data.sections);
        }
      })
      .catch((err) => console.warn('Live sections check notice:', err));

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings && typeof data.settings.productDetailsAccess === 'boolean') {
          setDetailsOpen(data.settings.productDetailsAccess);
        }
      })
      .catch((err) => console.warn('Home settings sync notice:', err));
  }, []);

  const getSec = (id: string) => sections.find((s) => s.sectionId === id);

  const heroSec = getSec('home-hero');
  const originSec = getSec('home-origin');
  const philoSec = getSec('home-philosophy');
  const procSec = getSec('home-process');
  const prodSec = getSec('home-products');
  const appSec = getSec('home-applications');
  const closeSec = getSec('home-closing');

  const openEnquiry = (prod = '') => {
    setModalProduct(prod);
    setModalOpen(true);
  };

  const openLightbox = (imgs: string[], index = 0) => {
    setLightboxImages(imgs);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const defaultHeroScenes = [
    { id: 'hero1', url: '/assets/images/hero1.jpeg', label: 'Palm Residence', position: 'center 42%' },
    { id: 'hero2', url: '/assets/images/hero 2.png', label: 'Twilight Villa', position: 'center 42%' },
    { id: 'hero3', url: '/assets/images/hero3.jpeg', label: 'AlGhaf Tree Pavilion', position: '65% 50%' },
  ];

  const activeHeroItems = (heroSec?.items && heroSec.items.length > 0)
    ? heroSec.items.filter((item: any) => item.isVisible !== false)
    : [];

  const heroScenes = activeHeroItems.length > 0
    ? activeHeroItems.map((item: any, idx: number) => ({
        id: item.id || `scene-${idx}`,
        url: item.url || item.image || defaultHeroScenes[idx % defaultHeroScenes.length].url,
        label: item.label || item.title || defaultHeroScenes[idx % defaultHeroScenes.length].label,
        position: item.position || 'center 42%',
      }))
    : defaultHeroScenes;

  const [activeHeroScene, setActiveHeroScene] = useState(0);
  const homeRef = useRef<HTMLDivElement>(null);

  // Preload hero scene images on mount to ensure instant transitions without lag
  useEffect(() => {
    heroScenes.forEach((scene: any) => {
      const img = new Image();
      img.src = scene.url;
    });
  }, [heroScenes]);

  // Automatic hero slider with smooth timed transitions
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroScene(prev => (prev + 1) % heroScenes.length);
    }, 3400);
    return () => clearInterval(timer);
  }, [activeHeroScene, heroScenes.length]);

  // Refined architectural GSAP scroll-triggered entrance animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Origin text reveal
      const originItems = document.querySelectorAll('.home-origin-reveal');
      if (originItems.length) {
        gsap.from(originItems, {
          y: 26,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-section',
            start: 'top 78%',
            toggleActions: 'play none none none'
          }
        });
      }

      // 5. Applications Bento Cards reveal
      const bentoCardWraps = document.querySelectorAll('.app-bento-card-wrap');
      if (bentoCardWraps.length) {
        gsap.from(bentoCardWraps, {
          y: 26,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: '.applications-bento-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      }

      // 6. Closing Hero Content Reveal
      const closingItems = document.querySelectorAll('.home-closing-reveal');
      if (closingItems.length) {
        gsap.from(closingItems, {
          y: 24,
          opacity: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.home-closing-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      }
    }, homeRef);

    return () => ctx.revert();
  }, []);

  const heroHeadlineLines = heroSec?.title
    ? heroSec.title.split('\n')
    : ['Design Smarter.', 'Build Precisely.'];

  const originHeadlineLines = originSec?.title
    ? originSec.title.split('\n')
    : ['Rooted', 'in the UAE.'];

  const originBg = originSec?.mediaUrl || '/assets/images/bg%20img%20alghaf%201.jpg.jpeg';

  return (
    <main ref={homeRef}>
      {/* =========================================================================
          HERO SECTION — Clean Native Hero with Automatic Smooth Slider
          ========================================================================= */}
      {heroSec?.isVisible !== false && (
        <section className="hero-section">
          {/* Layered Architectural Background Slider for Seamless Crossfade & Subtle Zoom */}
          {heroScenes.map((scene: any, idx: number) => {
            const isActive = activeHeroScene === idx;
            return (
              <div 
                key={scene.id}
                aria-hidden={!isActive}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.3) 45%, transparent 75%), linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, transparent 35%), url('${scene.url}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: scene.position || 'center 42%',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'scale(1.025)' : 'scale(1.07)',
                  transition: 'opacity 0.85s cubic-bezier(0.4, 0, 0.2, 1), transform 3.8s cubic-bezier(0.25, 1, 0.5, 1)',
                  zIndex: isActive ? 2 : 1,
                  pointerEvents: 'none',
                  willChange: 'opacity, transform'
                }}
              />
            );
          })}

          {/* Hero Main Content Area */}
          <div 
            className="container home-hero-main-area" 
            style={{ 
              position: 'relative', 
              zIndex: 3, 
              width: '100%', 
              paddingTop: 0,
              paddingBottom: 0
            }}
          >
            <div style={{ maxWidth: '760px' }}>
              {/* Main Headline in Brand Aftika Font: font-weight 500 */}
              <h1 className="home-hero-headline">
                {heroHeadlineLines.map((line: string, i: number) => (
                  <span key={i} style={{ display: 'block' }}>{line}</span>
                ))}
              </h1>

              {/* Subtitle / Description directly under the heading matching reference */}
              <p
                className="home-hero-statement"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.875rem, 1.05vw, 0.95rem)',
                  lineHeight: 1.55,
                  color: '#D8D1C4',
                  maxWidth: '460px',
                  marginTop: '1rem',
                  marginBottom: 0
                }}
              >
                {heroSec?.subtitle || 'Designing buildings that respond to real needs and real environments, with a focus on the function.'}
              </p>
            </div>
          </div>

          {/* Hero Bottom Bar / SCENE Switcher matching reference */}
          <div 
            className="home-hero-bottom-bar"
            style={{ 
              position: 'relative', 
              zIndex: 3, 
              width: '100%'
            }}
          >
            {/* Interactive Scene Switcher Indicator */}
            <div 
              className="container home-hero-scene-bar"
              style={{
                display: 'flex',
                alignItems: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <span style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase', color: '#B5AC9E', marginRight: '0.45rem' }}>
                {heroSec?.eyebrow || 'SCENE:'}
              </span>
              {heroScenes.map((scene: any, idx: number) => {
                const isActive = activeHeroScene === idx;
                return (
                  <button
                    key={scene.id}
                    onClick={() => setActiveHeroScene(idx)}
                    aria-label={`Switch to ${scene.label}`}
                    title={scene.label}
                    style={{
                      height: '4px',
                      width: isActive ? '38px' : '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.22)',
                      borderRadius: '2px',
                      position: 'relative',
                      overflow: 'hidden',
                      padding: 0,
                      cursor: 'pointer',
                      border: 'none',
                      outline: 'none',
                      transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {isActive && (
                      <span 
                        key={`progress-${idx}-${activeHeroScene}`}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'var(--color-sand)',
                          borderRadius: '2px',
                          transformOrigin: 'left',
                          animation: 'heroSceneProgress 3.4s linear forwards'
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}
 
      {/* =========================================================================
          SLIDING CONTENT WRAPPER — Slides over the sticky hero on scroll
          ========================================================================= */}
      <div style={{ position: 'relative', zIndex: 10, backgroundColor: 'var(--color-ivory-light)' }}>
        {/* =========================================================================
            SECTION 1 — OUR ORIGIN / ROOTED IN THE UAE (Matching Reference Design)
            ========================================================================= */}
        {originSec?.isVisible !== false && (
          <section 
            className="about-section"
            style={{
              position: 'relative',
              zIndex: 2,
              minHeight: '800px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F3EDE2',
              backgroundImage: `linear-gradient(to right, rgba(243, 237, 226, 0.98) 0%, rgba(243, 237, 226, 0.94) 38%, rgba(243, 237, 226, 0.32) 58%, transparent 74%), url('${originBg}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat',
              paddingTop: '6.5rem',
              paddingBottom: '5.5rem',
              overflow: 'hidden'
            }}
          >
            <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
              <div style={{ maxWidth: '660px' }}>
                {/* Eyebrow with extending divider line */}
                <div className="home-origin-reveal" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.25rem' }}>
                  <span 
                    style={{ 
                      fontFamily: 'var(--font-body)', 
                      fontSize: '0.875rem', 
                      fontWeight: 600, 
                      letterSpacing: '0.24em', 
                      textTransform: 'uppercase', 
                      color: '#7D7565' 
                    }}
                  >
                    {originSec?.eyebrow || 'OUR ORIGIN / 01'}
                  </span>
                  <span style={{ height: '1px', width: '80px', backgroundColor: 'rgba(125, 117, 101, 0.35)' }}></span>
                </div>

                {/* Main Headline in Hero Brand Font Family (Aftika): Enriched editorial scale */}
                <h2 
                  className="home-origin-reveal"
                  style={{ 
                    fontFamily: 'var(--font-display)',
                    fontWeight: 400,
                    fontSize: 'clamp(2.75rem, 5vw, 64px)',
                    lineHeight: 1.12,
                    letterSpacing: '-0.02em',
                    color: '#52694B',
                    marginBottom: '2rem'
                  }}
                >
                  {originHeadlineLines.map((line: string, i: number) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < originHeadlineLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h2>

                {/* Body Description - Enhanced editorial size and legibility */}
                <p 
                  className="home-origin-reveal"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(1.0625rem, 1.25vw, 1.2rem)',
                    fontWeight: 400,
                    lineHeight: 1.75,
                    color: '#3A3E39',
                    maxWidth: '620px',
                    marginBottom: '2.75rem'
                  }}
                >
                  {originSec?.content || 'Inspired by the resilience of the UAE’s Ghaf tree, two Emirati women envisioned smarter, more sustainable homes. Combining their vision with the design, prefabrication, and modular construction expertise of CK Living Concepts, Al Ghaf Collective was born.'}
                </p>

                {/* Dark Forest Green About Us Button */}
                <Link
                  href={originSec?.ctaUrl || '/about'}
                  className="home-origin-reveal"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2.75rem',
                    backgroundColor: '#52694B',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: '1rem',
                    letterSpacing: '0.04em',
                    padding: '1.05rem 2rem',
                    borderRadius: '3px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(82, 105, 75, 0.25)',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#42553B';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(82, 105, 75, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#52694B';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(82, 105, 75, 0.25)';
                  }}
                >
                  <span>{originSec?.ctaText || 'About Us'}</span>
                  <ArrowRight size={19} />
                </Link>

                {/* Bottom Accent Line & Philosophy Words */}
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '4rem' }}>
                  <span style={{ height: '1px', width: '44px', backgroundColor: '#8A8272', flexShrink: 0 }}></span>
                  <span 
                    style={{ 
                      fontFamily: 'var(--font-body)', 
                      fontSize: '0.78rem', 
                      fontWeight: 600, 
                      letterSpacing: '0.16em', 
                      textTransform: 'uppercase', 
                      color: '#7D7565',
                      lineHeight: 1.5
                    }}
                  >
                    {originSec?.subtitle || 'PEOPLE • PLACE • A BRIGHTER TOMORROW'}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 2 — CORE IDEA: FROM PROJECT TO PRODUCT & CORE STRENGTHS
            ========================================================================= */}
        {philoSec?.isVisible !== false && (
          <section id="core-idea" className="section-padding bg-ivory-light">
            <div className="container">
              {/* Section Header: FROM PROJECT TO PRODUCT */}
              <div 
                style={{
                  maxWidth: '860px',
                  margin: '0 auto clamp(2.5rem, 4.5vw, 3.75rem) auto',
                  textAlign: 'center'
                }}
              >
                {/* Section Label */}
                <div 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '1rem', 
                    marginBottom: '1.25rem' 
                  }}
                >
                  <span style={{ height: '1px', width: '48px', backgroundColor: 'rgba(125, 117, 101, 0.35)' }}></span>
                  <span 
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#7D7565'
                    }}
                  >
                    {philoSec?.eyebrow || 'Core Idea'}
                  </span>
                  <span style={{ height: '1px', width: '48px', backgroundColor: 'rgba(125, 117, 101, 0.35)' }}></span>
                </div>

                {/* Headline */}
                <h2 
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 500,
                    fontSize: 'clamp(2.2rem, 3.8vw, 46px)',
                    lineHeight: 1.15,
                    letterSpacing: '-0.015em',
                    color: '#52694B',
                    margin: '0 0 1.25rem 0'
                  }}
                >
                  {philoSec?.title || 'FROM PROJECT TO PRODUCT.'}
                </h2>

                {/* Main Description */}
                <p 
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.15rem, 1.45vw, 1.35rem)',
                    fontWeight: 400,
                    lineHeight: 1.55,
                    color: '#20231F',
                    maxWidth: '780px',
                    margin: '0 auto 1.15rem auto',
                    letterSpacing: '-0.005em'
                  }}
                >
                  {philoSec?.subtitle || 'We are transforming housing from a fragmented project into a designed, engineered, and continuously refined product.'}
                </p>

                {/* Supporting Text */}
                <p 
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)',
                    fontWeight: 400,
                    lineHeight: 1.65,
                    color: '#4A504B',
                    maxWidth: '680px',
                    margin: '0 auto'
                  }}
                >
                  {philoSec?.content || 'Instead of starting from zero every time, we design for manufacturing and assembly from day one.'}
                </p>
              </div>

              {/* Four Pillar Cards */}
              <div className="grid-4 home-pillars-grid">
                {((philoSec?.items && philoSec.items.length > 0) ? philoSec.items : companyInfo.pillars).map((pillar: any, idx: number) => {
                  const icons = [<Sparkles key="1" size={28} />, <ShieldCheck key="2" size={28} />, <Zap key="3" size={28} />, <Compass key="4" size={28} />];
                  return (
                    <div
                      key={pillar.title || idx}
                      className="home-pillar-card"
                    >
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(82, 105, 75, 0.1)',
                        color: 'var(--color-forest)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                      }}>
                        {icons[idx % icons.length]}
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-sand-dark)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        {pillar.number || `0${idx + 1}`}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-forest-dark)', marginBottom: '0.5rem' }}>
                        {pillar.title}
                      </h3>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.75rem' }}>
                        {pillar.subtitle}
                      </div>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--color-charcoal-muted)', lineHeight: '1.6', marginTop: 'auto' }}>
                        {pillar.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 3 — HOW WE BUILD / OUR PROCESS (Exact Architectural Reference)
            ========================================================================= */}
        {procSec?.isVisible !== false && (
          <HowWeBuildSection
            title={procSec?.title}
            subtitle={procSec?.subtitle}
            videoUrl={procSec?.videoUrl}
            posterUrl={procSec?.mediaUrl}
            steps={procSec?.items}
          />
        )}

        {/* =========================================================================
            SECTION 4 — PRODUCTS PREVIEW (MOVA, PENTA, ENTRA)
            ========================================================================= */}
        {prodSec?.isVisible !== false && (
          <section className="section-padding bg-ivory-light">
            <div className="container">
              <SectionHeader
                eyebrow={prodSec?.eyebrow || 'OUR PRODUCTS'}
                title={prodSec?.title || 'DESIGNED AS A PRODUCT. BUILT FOR LIVING.'}
                subtitle={prodSec?.subtitle || 'Not just a better way to build. A new way to think about housing.'}
                centered
                style={{ maxWidth: '840px' }}
              />

              <div className="grid-3 home-products-grid">
                {((prodSec?.items && prodSec.items.length > 0) ? prodSec.items : products).map((prod: any) => {
                  const pSlug = prod.slug || prod.id;
                  const matchedProduct = products.find((p) => p.id === prod.id || p.slug === pSlug);
                  const heroImg = prod.heroImage || prod.image || matchedProduct?.heroImage || '/assets/renders/MOVA_EXT_3D_img1.jpg';
                  const pName = prod.name || prod.title || matchedProduct?.name || 'Product';
                  const category = prod.category || matchedProduct?.category;
                  const tagline = prod.tagline || prod.subtitle || matchedProduct?.tagline;
                  const desc = prod.shortDescription || prod.description || matchedProduct?.shortDescription;

                  return (
                    <div
                      key={prod.id || pName}
                      className="home-product-card"
                    >
                      {/* Product Image */}
                      <div style={{ height: '260px', position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={heroImg}
                          alt={pName}
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                          onError={(e) => {
                            if (matchedProduct?.heroImage && !e.currentTarget.src.includes(matchedProduct.heroImage)) {
                              e.currentTarget.src = matchedProduct.heroImage;
                            }
                          }}
                        />
                        <button
                          onClick={() => openLightbox([heroImg, ...(prod.gallery?.exterior || matchedProduct?.gallery?.exterior || [])])}
                          aria-label={`View ${pName} gallery`}
                          style={{
                            position: 'absolute',
                            bottom: '0.75rem',
                            right: '0.75rem',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: '#FFF',
                            padding: '0.4rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Maximize2 size={16} />
                        </button>
                      </div>

                      {/* Product Content */}
                      <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 500, color: 'var(--color-forest-dark)' }}>
                            {pName}
                          </h3>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--color-sand-dark)', fontWeight: 600 }}>
                            {category}
                          </span>
                        </div>

                        <p style={{ fontStyle: 'italic', color: 'var(--color-forest)', fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                          {tagline}
                        </p>

                        <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                          {desc}
                        </p>

                        {/* Highlights */}
                        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(82, 105, 75, 0.1)', paddingTop: '1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {detailsOpen ? (
                              <Link
                                href={`/products/${pSlug}`}
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  fontWeight: 600,
                                  fontSize: '0.9375rem',
                                  color: 'var(--color-forest)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  textDecoration: 'none'
                                }}
                              >
                                Explore {pName} <ArrowRight size={16} />
                              </Link>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  fontFamily: 'var(--font-body)',
                                  fontWeight: 600,
                                  fontSize: '0.9375rem',
                                  color: 'var(--color-forest)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  cursor: 'default'
                                }}
                              >
                                Explore {pName} <ArrowRight size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
                <Link href={prodSec?.ctaUrl || '/products'} className="btn btn-outline-forest btn-lg">
                  {prodSec?.ctaText || 'View All Product Specifications'} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 5 — APPLICATIONS OVERVIEW
            ========================================================================= */}
        {appSec?.isVisible !== false && (
          <section className="section-padding bg-ivory">
            <div className="container">
              <SectionHeader
                eyebrow={appSec?.eyebrow}
                title={appSec?.title || 'Built For More Than Homes.'}
                subtitle={appSec?.subtitle || 'Engineered for private residences, luxury eco-resorts, farm estates, and wellness pavilions.'}
                centered
              />

              <div className="applications-bento-grid">
                {((appSec?.items && appSec.items.length > 0) ? appSec.items : applicationsData.slice(0, 4)).map((app: any, index: number) => {
                  const fallbackAppImages = [
                    '/assets/images/built_more_than_homes_01_web.jpg',
                    '/assets/images/built_more_than_homes_02_web.jpg',
                    '/assets/images/built_more_than_homes_03_web.jpg',
                    '/assets/images/built_more_than_homes_04_web.jpg',
                  ];
                  let rawImg = app.image || app.url;
                  if (!rawImg || rawImg.includes('/assets/images/app2.jpg') || rawImg.includes('/assets/images/app3.jpg') || rawImg.includes('/assets/images/app4.jpg')) {
                    rawImg = fallbackAppImages[index % fallbackAppImages.length];
                  }
                  const appImg = rawImg;
                  const appHref = app.link || `/applications/${app.id}`;
                  return (
                    <div key={app.id || index} className="app-bento-card-wrap">
                      <Link
                        href={appHref}
                        className={`app-bento-card app-bento-card-${index}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          src={appImg}
                          alt={app.title}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = fallbackAppImages[index % fallbackAppImages.length];
                          }}
                        />
                        <div className="app-bento-overlay">
                          <div className="app-bento-text-group">
                            <span className="app-bento-category">
                              {app.category}
                            </span>
                            <h3 
                              className="app-bento-title"
                              style={{
                                fontWeight: 350,
                                lineHeight: 1.38,
                                letterSpacing: '0.015em'
                              }}
                            >
                              {app.title}
                            </h3>
                          </div>

                          <div className="app-bento-btn-wrapper">
                            <span className="app-bento-explore-btn">
                              Explore Now
                              <ArrowRight size={14} className="app-bento-btn-arrow" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 6 — LIVE BETTER CLOSING HERO & CTA (FULL-WIDTH)
            ========================================================================= */}
        {closeSec?.isVisible !== false && (
          <section 
            className="home-closing-section"
            style={{
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
              padding: 'clamp(5.5rem, 10vw, 8.5rem) 1.5rem',
              backgroundColor: '#141713',
              color: '#FAF8F5',
              textAlign: 'center',
              borderTop: '1px solid rgba(82, 105, 75, 0.12)'
            }}
          >
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(to bottom, rgba(14, 16, 14, 0.72) 0%, rgba(14, 16, 14, 0.48) 45%, rgba(14, 16, 14, 0.82) 100%), url('${closeSec?.mediaUrl || '/assets/images/imgupscaler-enhanced-4.jpg'}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 48%',
                opacity: 1
              }}
            />

            <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '860px', margin: '0 auto' }}>
              <span className="eyebrow home-closing-reveal" style={{ color: 'var(--color-sand)', marginBottom: '1rem', display: 'inline-block' }}>
                {closeSec?.eyebrow || 'Closing Statement'}
              </span>
              <h2 
                className="home-closing-reveal"
                style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: 'clamp(2.5rem, 4.5vw, 56px)', 
                  fontWeight: 700, 
                  color: '#FAF8F5', 
                  marginBottom: '1.5rem',
                  letterSpacing: '-0.02em'
                }}
              >
                {closeSec?.title || 'Live Better.'}
              </h2>

              <p 
                className="home-closing-reveal"
                style={{ 
                  fontSize: 'clamp(1.125rem, 1.8vw, 1.375rem)', 
                  color: '#E5DFD4', 
                  lineHeight: '1.75', 
                  marginBottom: 0 
                }}
              >
                {closeSec?.content || 'Everything we design and build begins with one purpose — to improve the way people live. We bring architecture, technology, nature, and human experience together to create spaces that are smarter, more comfortable, and more sustainable.'}
              </p>
            </div>
          </section>
        )}
      </div>

      {/* Quick Enquiry Modal */}
      <QuickEnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialProduct={modalProduct}
      />

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </main>
  );
}
