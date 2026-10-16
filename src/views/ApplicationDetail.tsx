'use client';

import React, { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { applicationsData } from '../data/applicationsData';

export default function ApplicationDetail() {
  const { id } = useParams();
  const detailRef = useRef(null);

  // Match application by id or fallback to modular-homes (Residential)
  const app = applicationsData.find(item => item.id === id) || applicationsData[0];

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
          delay: 0.15
        });
      }

      // 2. Origin / Story Section Reveal
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
            toggleActions: 'play none none none'
          }
        });
      }
    }, detailRef);

    return () => ctx.revert();
  }, [id]);

  return (
    <main ref={detailRef} style={{ margin: 0, padding: 0 }}>
      {/* =========================================================================
          SECTION 01 — HERO BANNER
          Cinematic full-bleed architectural hero mirroring reference
          ========================================================================= */}
      <section 
        className="about-hero" 
        aria-label={`${app.title} Hero`}
        style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'flex-end',
          paddingTop: 'clamp(8rem, 14vh, 11rem)',
          paddingBottom: 'clamp(4rem, 7vw, 6rem)',
          overflow: 'hidden'
        }}
      >
        <img
          src={app.image}
          alt={app.title}
          className="about-hero-bg"
          style={{ objectPosition: 'center center' }}
          loading="eager"
        />
        <div 
          className="about-hero-overlay" 
          style={{
            background: 'linear-gradient(to bottom, rgba(14, 18, 14, 0.78) 0%, rgba(14, 18, 14, 0.42) 35%, rgba(14, 18, 14, 0.68) 75%, rgba(14, 18, 14, 0.94) 100%)'
          }}
        />

        <div className="container" style={{ position: 'relative', width: '100%', zIndex: 3 }}>
          <div className="about-hero-content">
            <span className="about-hero-eyebrow hero-anim-item">
              {app.heroEyebrow || `APPLICATIONS — ${app.category?.toUpperCase() || 'RESIDENTIAL'}`}
            </span>
            <h1 className="about-hero-title hero-anim-item" style={{ whiteSpace: 'pre-line' }}>
              {app.heroTitle || app.title}
            </h1>
            <p className="about-hero-desc hero-anim-item">
              {app.heroDesc || app.description}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 — EDITORIAL STORY / ORIGIN SECTION
          Asymmetrical 2-column editorial layout matching second image reference
          ========================================================================= */}
      <section className="origin-section" aria-label={`${app.title} Overview`}>
        <div className="container">
          <div className="origin-editorial-grid">
            {/* Left Column: Eyebrow Anchor */}
            <div className="origin-eyebrow-wrapper">
              <span className="origin-eyebrow origin-anim-item">
                {app.originEyebrow || 'OUR RESIDENTIAL VISION'}
              </span>
            </div>

            {/* Right Column: Narrative Content */}
            <div className="origin-story-content">
              <h2 className="origin-headline origin-anim-item">
                {app.originHeadline || 'Harmonious Living. Built for the UAE.'}
              </h2>
              <div className="origin-story-text origin-anim-item">
                {app.storyParagraphs && app.storyParagraphs.length > 0 ? (
                  app.storyParagraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))
                ) : (
                  <>
                    <p>{app.description}</p>
                    <p>{app.tagline}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
