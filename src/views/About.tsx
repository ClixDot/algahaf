'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquare, MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import QuickEnquiryModal from '../components/common/QuickEnquiryModal';

interface AboutProps {
  initialSections?: any[];
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

function renderOriginHighlights(text: string) {
  if (!text) return null;
  const parts = text.split(/(CK Living Concepts|AlGhaf Collective)/g);
  return parts.map((part, i) => {
    if (part === 'CK Living Concepts' || part === 'AlGhaf Collective') {
      return (
        <span key={i} className="origin-story-highlight">
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function About({ initialSections = [] }: AboutProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const aboutRef = useRef(null);

  // Dynamic CMS sections state
  const [sections, setSections] = useState<any[]>(initialSections);

  useEffect(() => {
    fetch('/api/sections?pageSlug=about')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.sections) && data.sections.length > 0) {
          setSections(data.sections);
        }
      })
      .catch((err) => console.warn('About sections sync notice:', err));
  }, []);

  const getSec = (id: string) => sections.find((s) => s.sectionId === id);

  const heroSec = getSec('about-hero');
  const originSec = getSec('about-origin');
  const statsSec = getSec('about-stats');
  const philSec = getSec('about-philosophy');
  const officeSec = getSec('about-office');
  const closingSec = getSec('about-closing');

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Hero Reveal
      const heroItems = document.querySelectorAll('.hero-anim-item');
      if (heroItems.length) {
        gsap.from(heroItems, {
          y: 24,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power2.out',
          delay: 0.15,
        });
      }

      // 2. Origin Section Reveal
      const originItems = document.querySelectorAll('.origin-anim-item');
      if (originItems.length) {
        gsap.from(originItems, {
          y: 28,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.origin-section',
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        });
      }

      // 3. Origin Metrics Cards
      const originCards = document.querySelectorAll('.origin-card');
      if (originCards.length) {
        gsap.from(originCards, {
          y: 32,
          opacity: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.origin-cards-grid',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // 4. Philosophy Section Reveal & Restrained Image Parallax
      const philItems = document.querySelectorAll('.philosophy-anim-item');
      if (philItems.length) {
        gsap.from(philItems, {
          y: 28,
          opacity: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.philosophy-section',
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        });
      }

      const philImg = document.querySelector('.philosophy-img-main img');
      if (philImg) {
        gsap.fromTo(
          philImg,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: '.philosophy-section',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }

      // 5. Office Section
      const officeItems = document.querySelectorAll('.office-anim-item');
      if (officeItems.length) {
        gsap.from(officeItems, {
          y: 26,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.office-location-section',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // 6. CTA Section
      const ctaItems = document.querySelectorAll('.cta-anim-item');
      if (ctaItems.length) {
        gsap.from(ctaItems, {
          y: 24,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-cta-section',
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, aboutRef);

    return () => ctx.revert();
  }, [sections]);

  // Origin Section Fallback Narrative Paragraphs
  const originParagraphs = originSec?.content
    ? originSec.content.split('\n\n').filter(Boolean)
    : [
        'The Ghaf tree has thrived in the UAE’s desert for generations — deeply rooted, resilient, and sustaining life in the harshest conditions.',
        'Inspired by that spirit, two Emirati women came together with a vision to rethink the way we build and create smarter, more sustainable homes.',
        'Bringing this vision together with the design, prefabrication, and modular construction expertise of CK Living Concepts, AlGhaf Collective was born.',
      ];

  // Origin Statistics Cards
  const statCards =
    statsSec?.items && statsSec.items.length > 0
      ? statsSec.items
      : [
          {
            id: 'stat-1',
            number: '50%',
            title: 'Faster Delivery',
            description:
              'Factory-controlled prefabrication compresses project timelines compared to conventional site construction.',
          },
          {
            id: 'stat-2',
            number: '1',
            title: 'Integrated System',
            description:
              'Design, engineering, materials, and assembly consolidated under one single accountable team.',
          },
          {
            id: 'stat-3',
            number: '30–300 m²',
            title: 'Scalable Architecture',
            description:
              'Versatile modular footprints engineered for enduring thermal comfort and desert durability.',
          },
        ];

  // Philosophy Value Drivers
  const philFeatures =
    philSec?.items && philSec.items.length > 0
      ? philSec.items
      : [
          {
            id: 'phil-1',
            title: 'Unified Accountability',
            description:
              'Single-source ownership from initial sketch through turnkey handover eliminates client disputes.',
          },
          {
            id: 'phil-2',
            title: 'Millimeter-Level Precision',
            description:
              'Industrial prefabrication in controlled factory conditions ensures flawless joinery and finishes.',
          },
          {
            id: 'phil-3',
            title: 'Schedule & Cost Certainty',
            description:
              'Fixed contracts and systematic engineering protect budgets against unpredictable site variations.',
          },
        ];

  // Office Card & Map
  const officeCard = officeSec?.items?.[0] || {
    title: 'Dubai Design District (d3)',
    subtitle: 'Building 7, Dubai\nUnited Arab Emirates',
    image: '/assets/images/imgupscaler-enhanced-7.jpg',
    link: '/contact',
  };
  const officeMapUrl =
    officeSec?.videoUrl ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14441.428489814526!2d55.2954752!3d25.1861054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f68307d896173%3A0xe54d924192b6a555!2sDubai%20Design%20District!5e0!3m2!1sen!2sae!4v1710000000000!5m2!1sen!2sae';

  return (
    <main ref={aboutRef} style={{ margin: 0, padding: 0 }}>
      {/* =========================================================================
          SECTION 01 — ABOUT HERO
          ========================================================================= */}
      {(!heroSec || heroSec.isVisible !== false) && (
        <section className="about-hero" aria-label="About AlGhaf Collective Hero">
          <img
            src={heroSec?.mediaUrl || '/assets/images/about_bg.png'}
            alt={heroSec?.mediaAlt || 'AlGhaf Collective Modern Architecture'}
            className="about-hero-bg"
            loading="eager"
          />
          <div className="about-hero-overlay" />

          <div className="container" style={{ position: 'relative', width: '100%' }}>
            <div className="about-hero-content">
              <span className="about-hero-eyebrow hero-anim-item">
                {heroSec?.eyebrow || 'ABOUT ALGHAF COLLECTIVE'}
              </span>
              <h1 className="about-hero-title hero-anim-item">
                {renderLineBreaks(heroSec?.title || 'Rooted in Nature.\nBuilt for Tomorrow.')}
              </h1>
              <p className="about-hero-desc hero-anim-item">
                {heroSec?.subtitle ||
                  heroSec?.content ||
                  'A UAE-rooted modular architecture and construction company reimagining residential living through precision engineering and sustainable design.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 02 — OUR ORIGIN
          ========================================================================= */}
      {(!originSec || originSec.isVisible !== false) && (
        <section className="origin-section" aria-label="Our Origin">
          <div className="container">
            {/* Editorial Split: Left Eyebrow / Right Story */}
            <div className="origin-editorial-grid">
              <div className="origin-eyebrow-wrapper">
                <span className="origin-eyebrow origin-anim-item">
                  {originSec?.eyebrow || 'OUR ORIGIN'}
                </span>
              </div>

              <div className="origin-story-content">
                <h2 className="origin-headline origin-anim-item">
                  {originSec?.title || 'Rooted in the UAE.'}
                </h2>
                <div className="origin-story-text origin-anim-item">
                  {originParagraphs.map((para: string, idx: number) => (
                    <p key={idx}>{renderOriginHighlights(para)}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* 3 Metric Showcase Cards Mirroring Reference Architecture & Data */}
            {(!statsSec || statsSec.isVisible !== false) && (
              <div className="origin-cards-grid">
                {statCards.map((card: any, idx: number) => (
                  <div key={card.id || idx} className="origin-card">
                    <div className="origin-card-body">
                      <div className="origin-card-val">{card.number || card.val || ''}</div>
                      <div className="origin-card-label">{card.title || card.label || ''}</div>
                      <p className="origin-card-desc">{card.description || card.desc || ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 03 — OUR PHILOSOPHY
          ========================================================================= */}
      {(!philSec || philSec.isVisible !== false) && (
        <section className="philosophy-section" aria-label="Our Philosophy">
          <div className="container">
            <div className="philosophy-grid">
              {/* Left Column: Editorial Philosophy & Problem Statement */}
              <div className="philosophy-text-col">
                <span className="philosophy-eyebrow philosophy-anim-item">
                  {philSec?.eyebrow || 'OUR PHILOSOPHY'}
                </span>
                <h2 className="philosophy-headline philosophy-anim-item">
                  {renderLineBreaks(philSec?.title || 'One Vision. One System.\nOne Accountable Team.')}
                </h2>
                <div className="philosophy-desc philosophy-anim-item">
                  <p>
                    {philSec?.subtitle ||
                      'Traditional construction is fragmented. Between architects, engineers, contractors, suppliers and labour, designs change, costs shift, timelines move and the original vision can get lost.'}
                  </p>
                  <p>
                    {philSec?.content ||
                      'AlGhaf Collective brings design, engineering, materials, prefabrication, construction and installation together under one integrated system.'}
                  </p>
                </div>

                {/* Integrated Value Drivers */}
                <div className="philosophy-features philosophy-anim-item">
                  {philFeatures.map((feat: any, idx: number) => (
                    <div key={feat.id || idx} className="philosophy-feature-item">
                      <span className="philosophy-feature-bullet" />
                      <div className="philosophy-feature-text">
                        <strong>{feat.title || ''}</strong>
                        <p>{feat.description || feat.desc || ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Layered Asymmetrical Architectural Composition */}
              <div className="philosophy-visual-col">
                <div className="philosophy-visual-wrap">
                  <div className="philosophy-img-main">
                    <img
                      src={philSec?.mediaUrl || '/assets/images/about us.png'}
                      alt={philSec?.mediaAlt || 'AlGhaf Modular Architecture and Construction'}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 04 — COME VISIT OUR OFFICE (LOCATION MAP)
          ========================================================================= */}
      {(!officeSec || officeSec.isVisible !== false) && (
        <section className="office-location-section" aria-label="Come visit our office">
          <div className="container">
            <div className="office-location-header">
              <span className="office-eyebrow office-anim-item">
                {officeSec?.eyebrow || 'Main office'}
              </span>
              <h2 className="office-headline office-anim-item">
                {officeSec?.title || 'Come visit our office'}
              </h2>
              <p className="office-desc office-anim-item">
                {officeSec?.content ||
                  "Stop by our office to meet the team, discuss your plans, and explore the best modular architecture solutions. We'll be happy to answer your questions and help you find the right place to call home."}
              </p>
            </div>

            <div className="office-map-container office-anim-item">
              {/* Top-Left Location Badge */}
              <div
                className="office-map-badge"
                style={{ cursor: officeSec?.ctaUrl || officeCard.link ? 'pointer' : 'default' }}
                onClick={() => {
                  const targetUrl = officeSec?.ctaUrl || officeCard.link;
                  if (targetUrl) {
                    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
                      window.open(targetUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      window.location.href = targetUrl;
                    }
                  }
                }}
                title={officeSec?.ctaUrl || officeCard.link ? 'Click to open location in Google Maps' : undefined}
              >
                <MapPin size={18} color="var(--color-forest)" />
                <div>
                  <div className="office-map-badge-title">
                    {officeSec?.subtitle || 'Dubai Design District (d3)'}
                  </div>
                  <div className="office-map-badge-sub">Dubai, United Arab Emirates</div>
                </div>
              </div>

              {/* Google Maps Embed iframe */}
              <iframe
                title="AlGhaf Collective Office Location"
                src={officeMapUrl}
                className="office-map-iframe"
                loading="lazy"
                allowFullScreen
              />

              {/* Floating Office Card in Center matching reference screenshot */}
              <div className="office-floating-card">
                <img
                  src={officeCard.image || officeSec?.mediaUrl || '/assets/images/imgupscaler-enhanced-7.jpg'}
                  alt={officeCard.title || 'AlGhaf Headquarters Building'}
                  className="office-floating-img"
                />
                <div className="office-floating-address">
                  <strong>{officeCard.title || 'Dubai Design District (d3)'}</strong>
                  <br />
                  {renderLineBreaks(officeCard.subtitle || 'Building 7, Dubai\nUnited Arab Emirates')}
                </div>
                {(() => {
                  const targetUrl = officeSec?.ctaUrl || officeCard.link || '/contact';
                  const isExternal = targetUrl.startsWith('http://') || targetUrl.startsWith('https://');
                  return (
                    <a
                      href={targetUrl}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="office-floating-btn"
                    >
                      {officeSec?.ctaText || officeCard.linkText || 'Contacts'}
                    </a>
                  );
                })()}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 05 — CLOSING CTA
          ========================================================================= */}
      {(!closingSec || closingSec.isVisible !== false) && (
        <section className="about-cta-section" aria-label="Let's Build Something Better">
          <div className="container">
            <div className="about-cta-container">
              <span className="about-cta-eyebrow cta-anim-item">
                {closingSec?.eyebrow || "LET'S BUILD SOMETHING BETTER."}
              </span>
              <h2 className="about-cta-headline cta-anim-item">
                {closingSec?.title || 'Start a Conversation.'}
              </h2>
              <p className="about-cta-text cta-anim-item">
                {closingSec?.content ||
                  'Whether you are planning a private home, hospitality development, modular project, or looking to collaborate, start the conversation with us.'}
              </p>
              <div className="about-cta-actions cta-anim-item">
                <Link
                  href={closingSec?.ctaUrl || '/contact'}
                  className="btn-cta-primary"
                >
                  {closingSec?.ctaText || 'START YOUR PROJECT'} <ArrowRight size={18} />
                </Link>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="btn-cta-secondary"
                >
                  <MessageSquare size={17} /> QUICK ENQUIRY
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Shared Quick Enquiry Modal */}
      <QuickEnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
