import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

// Four process cards matching the architectural editorial layout
const howWeBuildCards = [
  {
    number: "01",
    title: "Design Smarter.",
    description: "Architecture, planning and BIM for spaces that are functional, beautiful and future-ready.",
    image: "/assets/images/imgupscaler-enhanced-7.jpg",
    link: "/process"
  },
  {
    number: "02",
    title: "Prefabricate Precisely.",
    description: "Controlled manufacturing with rigorous quality standards, reducing waste and project time.",
    image: "/assets/renders/MOVA_EXT_3D_img1.jpg",
    link: "/process"
  },
  {
    number: "03",
    title: "Build Modular.",
    description: "On-site assembly with precision and minimal disruption, delivering spaces that last.",
    image: "/assets/renders/CINE_EXT_3D_img4.jpg",
    link: "/process"
  },
  {
    number: "04",
    title: "Live Better.",
    description: "Sustainable, high-quality spaces designed for people and built for a brighter tomorrow.",
    image: "/assets/images/imgupscaler-enhanced-6.jpg",
    link: "/products"
  }
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openEnquiry = (prod = '') => {
    setModalProduct(prod);
    setModalOpen(true);
  };

  const openLightbox = (imgs, index = 0) => {
    setLightboxImages(imgs);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const heroScenes = [
    { id: 'twilight', url: '/assets/images/imgupscaler-enhanced-6.jpg', label: 'Twilight Villa' },
    { id: 'dune', url: '/assets/images/imgupscaler-enhanced-4.jpg', label: 'Desert Dune Residence' },
    { id: 'pool', url: '/assets/renders/MOVA_EXT_3D_img1.jpg', label: 'MOVA Pool Pavilion' },
  ];
  const [activeHeroScene, setActiveHeroScene] = useState(0);

  return (
    <main>
      {/* =========================================================================
          HERO SECTION — Clean Native Hero
          ========================================================================= */}
      <section 
        className="hero-section"
      >
        {/* Natural Architectural Background Image without green tint or grid lines */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.3) 45%, transparent 75%), linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, transparent 35%), url('${heroScenes[activeHeroScene].url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 42%',
            transform: 'scale(1.02)',
            transition: 'background-image 0.6s ease-in-out',
            zIndex: 1
          }}
        />

        {/* Hero Main Content Area (Positioned lower down towards bottom bar) */}
        <div 
          className="container" 
          style={{ 
            position: 'relative', 
            zIndex: 3, 
            width: '100%', 
            marginTop: 'auto', 
            marginBottom: '1.5rem',
            paddingTop: 0,
            paddingBottom: 0
          }}
        >
          <div style={{ maxWidth: '760px' }}>
            {/* Main Headline in Brand Aftika Font: font-weight 500 */}
            <h1 
              className="home-hero-headline"
            >
              <span style={{ display: 'block' }}>Where Vision</span>
              <span style={{ display: 'block' }}>Meets Structure</span>
            </h1>

            {/* CTA Action Buttons with reduced border radius */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={() => openEnquiry()} 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  backgroundColor: '#FFFFFF',
                  color: '#52694B',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  letterSpacing: '0.02em',
                  padding: '0.95rem 2.25rem',
                  borderRadius: '4px',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-sand)';
                  e.currentTarget.style.color = '#52694B';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#52694B';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Start Your Project
              </button>

              <Link 
                to="/products" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#FAF8F5',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  padding: '0.95rem 1.85rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s ease, transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Explore Collections <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Bottom Bar / Architectural Metrics Strip matching reference */}
        <div 
          style={{ 
            position: 'relative', 
            zIndex: 3, 
            width: '100%', 
            marginTop: 0,
            paddingTop: '0.5rem'
          }}
        >
          <div 
            className="container"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '2.5rem',
              paddingBottom: '0.5rem'
            }}
          >
            {/* Bottom Left Statement */}
            <div style={{ maxWidth: '440px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.875rem, 1.05vw, 0.95rem)',
                  lineHeight: 1.55,
                  color: '#D8D1C4',
                  margin: 0
                }}
              >
                Designing buildings that respond to real needs and real environments, with a focus on the function.
              </p>
            </div>

            {/* Bottom Right 3 Stats in a Row */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'flex-end', 
                gap: 'clamp(1.25rem, 3.5vw, 3.75rem)',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <div 
                  style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: 'clamp(2.25rem, 3.5vw, 3.5rem)', 
                    fontWeight: 300, 
                    color: '#FAF8F5', 
                    lineHeight: 1,
                    letterSpacing: '-0.01em'
                  }}
                >
                  10+
                </div>
                <div 
                  style={{ 
                    fontFamily: 'var(--font-body)', 
                    fontSize: '0.8125rem', 
                    fontWeight: 400,
                    color: '#BDB4A3', 
                    marginTop: '0.45rem',
                    letterSpacing: '0.02em'
                  }}
                >
                  Years of Innovation
                </div>
              </div>

              <div>
                <div 
                  style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: 'clamp(2.25rem, 3.5vw, 3.5rem)', 
                    fontWeight: 300, 
                    color: '#FAF8F5', 
                    lineHeight: 1,
                    letterSpacing: '-0.01em'
                  }}
                >
                  150+
                </div>
                <div 
                  style={{ 
                    fontFamily: 'var(--font-body)', 
                    fontSize: '0.8125rem', 
                    fontWeight: 400,
                    color: '#BDB4A3', 
                    marginTop: '0.45rem',
                    letterSpacing: '0.02em'
                  }}
                >
                  Concepts Evolved
                </div>
              </div>

              <div>
                <div 
                  style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: 'clamp(2.25rem, 3.5vw, 3.5rem)', 
                    fontWeight: 300, 
                    color: '#FAF8F5', 
                    lineHeight: 1,
                    letterSpacing: '-0.01em'
                  }}
                >
                  200+
                </div>
                <div 
                  style={{ 
                    fontFamily: 'var(--font-body)', 
                    fontSize: '0.8125rem', 
                    fontWeight: 400,
                    color: '#BDB4A3', 
                    marginTop: '0.45rem',
                    letterSpacing: '0.02em'
                  }}
                >
                  Ideas in Motion
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Scene Switcher Indicator */}
          <div 
            className="container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.5rem',
              marginTop: '1.25rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <span style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8F8677', marginRight: '0.5rem' }}>
              Scene:
            </span>
            {heroScenes.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => setActiveHeroScene(idx)}
                aria-label={`Switch to ${scene.label}`}
                title={scene.label}
                style={{
                  height: '4px',
                  width: activeHeroScene === idx ? '28px' : '14px',
                  backgroundColor: activeHeroScene === idx ? 'var(--color-sand)' : 'rgba(255, 255, 255, 0.25)',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  padding: 0,
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>
      </section>
 
      {/* =========================================================================
          SLIDING CONTENT WRAPPER — Slides over the sticky hero on scroll
          ========================================================================= */}
      <div style={{ position: 'relative', zIndex: 10, backgroundColor: 'var(--color-ivory-light)' }}>
        {/* =========================================================================
            SECTION 1 — OUR ORIGIN / ROOTED IN THE UAE (Matching Reference Design)
            ========================================================================= */}
        <section 
          className="about-section"
          style={{
            position: 'relative',
            zIndex: 2,
            minHeight: '760px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F3EDE2',
            backgroundImage: `linear-gradient(to right, rgba(243, 237, 226, 0.98) 0%, rgba(243, 237, 226, 0.94) 34%, rgba(243, 237, 226, 0.38) 52%, transparent 68%), url('/assets/images/about_bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
            paddingTop: '6rem',
            paddingBottom: '5rem',
            overflow: 'hidden'
          }}
        >
        <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ maxWidth: '580px' }}>
            {/* Eyebrow with extending divider line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
              <span 
                style={{ 
                  fontFamily: 'var(--font-body)', 
                  fontSize: '0.8125rem', 
                  fontWeight: 600, 
                  letterSpacing: '0.22em', 
                  textTransform: 'uppercase', 
                  color: '#7D7565' 
                }}
              >
                OUR ORIGIN / 01
              </span>
              <span style={{ height: '1px', width: '70px', backgroundColor: 'rgba(125, 117, 101, 0.35)' }}></span>
            </div>

            {/* Main Headline in Hero Brand Font Family (Aftika): 52px, reduced weight */}
            <h2 
              style={{ 
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 'clamp(2.25rem, 4.2vw, 52px)',
                lineHeight: 1.15,
                letterSpacing: '-0.015em',
                color: '#52694B',
                marginBottom: '1.75rem'
              }}
            >
              Rooted<br />
              in the UAE.
            </h2>

            {/* Body Description */}
            <p 
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.95rem, 1.15vw, 1.0625rem)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: '#3A3E39',
                maxWidth: '510px',
                marginBottom: '2.5rem'
              }}
            >
              Born from a region defined by resilience and vision, AlGhaf Collective draws inspiration from the UAE’s landscape, culture and ambition. We create modular living solutions that are rooted in place, designed for people and built for a better tomorrow.
            </p>

            {/* Dark Forest Green About Us Button */}
            <Link
              to="/about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2.5rem',
                backgroundColor: '#52694B',
                color: '#FFFFFF',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '0.9375rem',
                letterSpacing: '0.04em',
                padding: '0.95rem 1.75rem',
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
              <span>About Us</span>
              <ArrowRight size={18} />
            </Link>

            {/* Bottom Accent Line & Philosophy Words */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '3.5rem' }}>
              <span style={{ height: '1px', width: '38px', backgroundColor: '#8A8272', flexShrink: 0 }}></span>
              <span 
                style={{ 
                  fontFamily: 'var(--font-body)', 
                  fontSize: '0.72rem', 
                  fontWeight: 600, 
                  letterSpacing: '0.14em', 
                  textTransform: 'uppercase', 
                  color: '#7D7565',
                  lineHeight: 1.5
                }}
              >
                PEOPLE &bull; PLACE &bull; A BRIGHTER TOMORROW
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 3 — CORE STRENGTHS (Comfort, Quality, Speed, Value)
          ========================================================================= */}
      <section className="section-padding bg-ivory-light">
        <div className="container">
          <SectionHeader
            title="Built Around What Matters."
            subtitle="Four unwavering commitments engineered into every modular living system."
            centered
          />

          <div className="grid-4">
            {companyInfo.pillars.map((pillar, idx) => {
              const icons = [<Sparkles key="1" size={28} />, <ShieldCheck key="2" size={28} />, <Zap key="3" size={28} />, <Compass key="4" size={28} />];
              return (
                <div
                  key={pillar.title}
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '2.25rem 1.75rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(82, 105, 75, 0.14)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
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
                    {icons[idx]}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-sand-dark)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    0{idx + 1}
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

      {/* =========================================================================
          SECTION 4 — HOW WE BUILD / OUR PROCESS (Exact Architectural Reference)
          ========================================================================= */}
      <section id="process" className="how-we-build-section">
        <div className="container hwb-container">
          
          {/* Top Header: Left Title */}
          <div className="hwb-header">
            <div className="hwb-header-left hwb-intro-anim">
              <div className="hwb-eyebrow">
                <span className="hwb-eyebrow-text">OUR PROCESS</span>
                <span className="hwb-eyebrow-line"></span>
              </div>
              <h2 className="hwb-heading">How We Build</h2>
              <p className="hwb-lead">
                From idea to installation, we follow a precise, integrated process to deliver exceptional spaces — faster, cleaner and better.
              </p>
            </div>
          </div>

          {/* Four Process Stages Across Horizontal Flow */}
          <div className="hwb-stages-wrapper">
            
            {/* Architectural Connecting Graphic Behind Stages */}
            <div className="hwb-connecting-graphic" aria-hidden="true">
              <svg 
                className="hwb-connecting-svg" 
                viewBox="0 0 1200 400" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                {/* Horizontal Guide across Stage 1 to Stage 2 */}
                <path 
                  className="hwb-line-path"
                  d="M 50 260 L 480 260" 
                  stroke="#9D9886" 
                  strokeWidth="1" 
                  strokeOpacity="0.65" 
                />
                
                {/* Upward Arch from Stage 2 up through Stage 3 and down to Stage 4 */}
                <path 
                  className="hwb-line-path"
                  d="M 480 260 C 530 260 560 190 620 180 L 760 180 C 820 180 855 140 930 150 C 1000 160 1050 250 1140 370" 
                  stroke="#9D9886" 
                  strokeWidth="1" 
                  strokeOpacity="0.65" 
                />

                {/* Circular Nodes & Architectural Reference Points */}
                {/* Node 1: Between Stage 1 and 2 */}
                <circle className="hwb-node" cx="280" cy="260" r="5" stroke="#9D9886" strokeWidth="1" fill="#F5EFE3" />
                <circle className="hwb-node" cx="280" cy="260" r="1.8" fill="#9D9886" />

                {/* Node 2: Stage 2 backdrop intersection */}
                <circle className="hwb-node" cx="480" cy="260" r="3" fill="#9D9886" fillOpacity="0.8" />

                {/* Node 3: On ascending curve toward Stage 3 */}
                <circle className="hwb-node" cx="550" cy="220" r="2.2" fill="#9D9886" />

                {/* Node 4: Stage 3 center guide */}
                <circle className="hwb-node" cx="720" cy="180" r="4.5" stroke="#9D9886" strokeWidth="1" fill="#F5EFE3" />
                <circle className="hwb-node" cx="720" cy="180" r="1.5" fill="#9D9886" />

                {/* Node 5: Between Stage 3 and 4 peak */}
                <circle className="hwb-node" cx="890" cy="145" r="3.5" stroke="#9D9886" strokeWidth="1" fill="#F5EFE3" />

                {/* Node 6: Stage 4 entrance */}
                <circle className="hwb-node" cx="990" cy="195" r="3" fill="#9D9886" fillOpacity="0.8" />
              </svg>
            </div>

            {/* 4 Process Columns */}
            <div className="hwb-stages-row">
              {howWeBuildCards.map((card, idx) => (
                <article 
                  key={card.number} 
                  className={`hwb-stage-col hwb-col-${idx + 1}`}
                >
                  {/* Media Composition with Overlapping Backdrops */}
                  <div className="hwb-media-outer">
                    {/* Backdrop Panels */}
                    {idx === 0 && <div className="hwb-backdrop-panel panel-olive"></div>}
                    {idx === 1 && <div className="hwb-backdrop-panel panel-sand-1"></div>}
                    {idx === 2 && <div className="hwb-backdrop-panel panel-sand-2"></div>}
                    {idx === 3 && (
                      <>
                        <div className="hwb-backdrop-panel panel-forest"></div>
                        <div className="hwb-blueprint-badge" aria-hidden="true"></div>
                      </>
                    )}

                    {/* Image Frame */}
                    <div className="hwb-media-frame">
                      <div className="hwb-media-inner">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="hwb-stage-img"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stage Text & Details */}
                  <div className="hwb-stage-details">
                    <span className="hwb-stage-number">{card.number}</span>
                    
                    <h3 className="hwb-stage-title">
                      {card.title}
                    </h3>

                    <div className="hwb-stage-divider"></div>

                    <p className="hwb-stage-desc">
                      {card.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — PRODUCTS PREVIEW (MOVA, PENTA, ENTRA)
          ========================================================================= */}
      <section className="section-padding bg-ivory-light">
        <div className="container">
          <SectionHeader
            title="Homes, Engineered as Products."
            subtitle="Three distinct architectural systems. One unified standard of prefabrication."
            centered
          />

          <div className="grid-3">
            {products.map((prod) => (
              <div
                key={prod.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  border: '1px solid rgba(82, 105, 75, 0.14)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.35s ease, box-shadow 0.35s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                {/* Product Image */}
                <div style={{ height: '260px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={prod.heroImage}
                    alt={prod.name}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  />
                  <button
                    onClick={() => openLightbox([prod.heroImage, ...prod.gallery.exterior])}
                    aria-label={`View ${prod.name} gallery`}
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
                      {prod.name}
                    </h3>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-sand-dark)', fontWeight: 600 }}>
                      {prod.category}
                    </span>
                  </div>

                  <p style={{ fontStyle: 'italic', color: 'var(--color-forest)', fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    {prod.tagline}
                  </p>

                  <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {prod.shortDescription}
                  </p>

                  {/* Highlights */}
                  <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(82, 105, 75, 0.1)', paddingTop: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Link
                        to={`/products/${prod.slug}`}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          color: 'var(--color-forest)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        Explore {prod.name} <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/products" className="btn btn-outline-forest btn-lg">
              View All Product Specifications <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — APPLICATIONS OVERVIEW
          ========================================================================= */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <SectionHeader
            title="Built For More Than Homes."
            subtitle="Engineered for private residences, luxury eco-resorts, farm estates, and wellness pavilions."
            centered
          />

          <div className="applications-bento-grid">
            {applicationsData.slice(0, 6).map((app, index) => (
              <Link
                key={app.id}
                to="/applications"
                className={`app-bento-card app-bento-card-${index}`}
              >
                <img
                  src={app.image}
                  alt={app.title}
                  loading="lazy"
                />
                <div className="app-bento-overlay">
                  <span className="app-bento-category">
                    {app.category}
                  </span>
                  <h3 className="app-bento-title">
                    {app.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/applications" className="btn btn-outline-dark">
              Explore All Typologies & Project Applications <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — LIVE BETTER CLOSING HERO & CTA
          ========================================================================= */}
      <section 
        style={{
          backgroundColor: '#FAF8F5',
          paddingTop: '3rem',
          paddingBottom: '5.5rem',
        }}
      >
        <div className="container">
          <div
            style={{
              position: 'relative',
              borderRadius: 'clamp(14px, 2vw, 24px)',
              overflow: 'hidden',
              padding: 'clamp(4rem, 7vw, 6.5rem) clamp(1.5rem, 4vw, 3rem)',
              backgroundColor: '#141713',
              color: '#FAF8F5',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(20, 23, 19, 0.12)',
              border: '1px solid rgba(82, 105, 75, 0.12)'
            }}
          >
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(to bottom, rgba(14, 16, 14, 0.7) 0%, rgba(14, 16, 14, 0.45) 45%, rgba(14, 16, 14, 0.8) 100%), url('/assets/images/imgupscaler-enhanced-4.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 48%',
                opacity: 1
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '840px', margin: '0 auto' }}>
              <span className="eyebrow" style={{ color: 'var(--color-sand)' }}>
                Closing Statement
              </span>
              <h2 
                style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: 'clamp(2.25rem, 4vw, 52px)', 
                  fontWeight: 700, 
                  color: '#FAF8F5', 
                  marginBottom: '1.5rem',
                  letterSpacing: '-0.02em'
                }}
              >
                Live Better.
              </h2>

              <p 
                style={{ 
                  fontSize: 'clamp(1.125rem, 1.8vw, 1.375rem)', 
                  color: '#E5DFD4', 
                  lineHeight: '1.7', 
                  marginBottom: '2.5rem' 
                }}
              >
                Everything we design and build begins with one purpose — to improve the way people live. We bring architecture, technology, nature, and human experience together to create spaces that are smarter, more comfortable, and more sustainable.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <button
                  onClick={() => openEnquiry()}
                  className="btn btn-sand btn-lg"
                >
                  Start a Conversation <ArrowRight size={18} />
                </button>
                <Link to="/contact" className="btn btn-outline-light btn-lg">
                  Contact Our Engineers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
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
