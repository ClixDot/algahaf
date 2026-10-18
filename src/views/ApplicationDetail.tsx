'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { applicationsData } from '../data/applicationsData';

export default function ApplicationDetail() {
  const { id } = useParams();
  const detailRef = useRef(null);

  // Match initial fallback from static data
  const defaultApp = applicationsData.find(item =>
    item.id === id ||
    (id === 'hospitality-resorts' && item.id === 'hospitality') ||
    (id === 'farm-living-estates' && item.id === 'farm-living') ||
    (id === 'eco-developments' && item.id === 'eco-retreats')
  ) || applicationsData[0];

  const [app, setApp] = useState(defaultApp);

  useEffect(() => {
    // Reset to current id's default
    const currentDefault = applicationsData.find(item =>
      item.id === id ||
      (id === 'hospitality-resorts' && item.id === 'hospitality') ||
      (id === 'farm-living-estates' && item.id === 'farm-living') ||
      (id === 'eco-developments' && item.id === 'eco-retreats')
    ) || applicationsData[0];
    setApp(currentDefault);

    // Fetch dynamic live CMS data
    Promise.allSettled([
      fetch('/api/sections?pageSlug=applications', { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/sections?pageSlug=home', { cache: 'no-store' }).then(r => r.json()),
    ])
      .then(([appRes, homeRes]) => {
        let matchedCard: any = null;

        if (appRes.status === 'fulfilled' && Array.isArray(appRes.value?.sections)) {
          const cardsSec = appRes.value.sections.find((s: any) => s.sectionId === 'applications-cards');
          matchedCard = cardsSec?.items?.find((item: any) =>
            item.id === id ||
            item.slug === id ||
            (id === 'modular-homes' && (item.id === 'modular-homes' || item.category === 'Residential')) ||
            (id === 'hospitality' && (item.id === 'hospitality' || item.id === 'hospitality-resorts')) ||
            (id === 'hospitality-resorts' && (item.id === 'hospitality' || item.id === 'hospitality-resorts')) ||
            (id === 'farm-living' && (item.id === 'farm-living' || item.id === 'farm-living-estates')) ||
            (id === 'farm-living-estates' && (item.id === 'farm-living' || item.id === 'farm-living-estates')) ||
            (id === 'eco-retreats' && (item.id === 'eco-retreats' || item.id === 'eco-developments')) ||
            (id === 'eco-developments' && (item.id === 'eco-retreats' || item.id === 'eco-developments')) ||
            (id === 'entertainment-social' && item.id === 'entertainment-social') ||
            (id === 'wellness-retreat' && item.id === 'wellness-retreat') ||
            (item.overviewUrl && item.overviewUrl.endsWith(`/${id}`)) ||
            (item.link && item.link.endsWith(`/${id}`))
          );
        }

        if (!matchedCard && homeRes.status === 'fulfilled' && Array.isArray(homeRes.value?.sections)) {
          const bentoSec = homeRes.value.sections.find((s: any) => s.sectionId === 'home-applications');
          matchedCard = bentoSec?.items?.find((item: any) =>
            item.id === id ||
            item.slug === id ||
            (id === 'modular-homes' && (item.id === 'modular-homes' || item.category === 'Residential')) ||
            (id === 'hospitality' && (item.id === 'hospitality' || item.id === 'hospitality-resorts')) ||
            (id === 'hospitality-resorts' && (item.id === 'hospitality' || item.id === 'hospitality-resorts')) ||
            (id === 'farm-living' && (item.id === 'farm-living' || item.id === 'farm-living-estates')) ||
            (id === 'farm-living-estates' && (item.id === 'farm-living' || item.id === 'farm-living-estates')) ||
            (id === 'eco-retreats' && (item.id === 'eco-retreats' || item.id === 'eco-developments')) ||
            (id === 'eco-developments' && (item.id === 'eco-retreats' || item.id === 'eco-developments')) ||
            (item.link && item.link.endsWith(`/${id}`))
          );
        }

        if (matchedCard) {
          setApp(prev => ({
            ...prev,
            ...matchedCard,
            title: matchedCard.title || prev.title,
            image: matchedCard.detailHeroImage || matchedCard.heroImage || matchedCard.image || prev.image,
            heroEyebrow: matchedCard.heroEyebrow || prev.heroEyebrow,
            heroTitle: matchedCard.heroTitle || matchedCard.title || prev.heroTitle,
            heroDesc: matchedCard.heroDesc || matchedCard.description || prev.heroDesc,
            originEyebrow: matchedCard.originEyebrow || prev.originEyebrow,
            originHeadline: matchedCard.originHeadline || prev.originHeadline,
            storyParagraphs: Array.isArray(matchedCard.storyParagraphs) && matchedCard.storyParagraphs.length > 0
              ? matchedCard.storyParagraphs
              : typeof matchedCard.storyParagraphs === 'string' && matchedCard.storyParagraphs.trim()
              ? matchedCard.storyParagraphs.split('\n\n').filter(Boolean)
              : prev.storyParagraphs,
            features: Array.isArray(matchedCard.features) && matchedCard.features.length > 0
              ? matchedCard.features
              : prev.features,
          }));
        }
      })
      .catch(err => console.warn('ApplicationDetail dynamic CMS notice:', err));
  }, [id]);

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
                  app.storyParagraphs.map((para: string, idx: number) => (
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
