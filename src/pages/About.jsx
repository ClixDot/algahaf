import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import QuickEnquiryModal from '../components/common/QuickEnquiryModal';

export default function About() {
  const [modalOpen, setModalOpen] = useState(false);
  const aboutRef = useRef(null);

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
            toggleActions: 'play none none none'
          }
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
            toggleActions: 'play none none none'
          }
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
            toggleActions: 'play none none none'
          }
        });
      }

      const philImg = document.querySelector('.philosophy-img-main img');
      if (philImg) {
        gsap.fromTo(philImg, 
          { yPercent: -4 },
          { 
            yPercent: 4, 
            ease: 'none', 
            scrollTrigger: {
              trigger: '.philosophy-section',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
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
            toggleActions: 'play none none none'
          }
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
            toggleActions: 'play none none none'
          }
        });
      }
    }, aboutRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={aboutRef} style={{ margin: 0, padding: 0 }}>
      {/* =========================================================================
          SECTION 01 — ABOUT HERO
          Full-width cinematic architectural hero with high-contrast editorial typography
          ========================================================================= */}
      <section className="about-hero" aria-label="About AlGhaf Collective Hero">
        <img
          src="/assets/images/about_bg.png"
          alt="AlGhaf Collective Modern Architecture"
          className="about-hero-bg"
          loading="eager"
        />
        <div className="about-hero-overlay" />

        <div className="container" style={{ position: 'relative', width: '100%' }}>
          <div className="about-hero-content">
            <span className="about-hero-eyebrow hero-anim-item">
              ABOUT ALGHAF COLLECTIVE
            </span>
            <h1 className="about-hero-title hero-anim-item">
              Rooted in Nature.<br />
              Built for Tomorrow.
            </h1>
            <p className="about-hero-desc hero-anim-item">
              A UAE-rooted modular architecture and construction company reimagining residential living through precision engineering and sustainable design.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 — OUR ORIGIN
          Editorial asymmetrical layout with 3-card metric showcase matching reference
          ========================================================================= */}
      <section className="origin-section" aria-label="Our Origin">
        <div className="container">
          {/* Editorial Split: Left Eyebrow / Right Story */}
          <div className="origin-editorial-grid">
            <div className="origin-eyebrow-wrapper">
              <span className="origin-eyebrow origin-anim-item">
                OUR ORIGIN
              </span>
            </div>

            <div className="origin-story-content">
              <h2 className="origin-headline origin-anim-item">
                Rooted in the UAE.
              </h2>
              <div className="origin-story-text origin-anim-item">
                <p>
                  The Ghaf tree has thrived in the UAE’s desert for generations — deeply rooted, resilient, and sustaining life in the harshest conditions.
                </p>
                <p>
                  Inspired by that spirit, two Emirati women came together with a vision to rethink the way we build and create smarter, more sustainable homes.
                </p>
                <p>
                  Bringing this vision together with the design, prefabrication, and modular construction expertise of{' '}
                  <span className="origin-story-highlight">CK Living Concepts</span>,{' '}
                  <span className="origin-story-highlight">AlGhaf Collective</span> was born.
                </p>
              </div>
            </div>
          </div>

          {/* 3 Metric Showcase Cards Mirroring Reference Architecture & Data */}
          <div className="origin-cards-grid">
            {/* Card 1: 50% Faster Delivery */}
            <div className="origin-card">
              <div className="origin-card-body">
                <div className="origin-card-val">50%</div>
                <div className="origin-card-label">Faster Delivery</div>
                <p className="origin-card-desc">
                  Factory-controlled prefabrication compresses project timelines compared to conventional site construction.
                </p>
              </div>
              <div className="origin-card-media">
                <img
                  src="/assets/renders/MOVA_EXT_3D_img1.jpg"
                  alt="MOVA Modular Architecture"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Card 2: 1 Integrated System */}
            <div className="origin-card">
              <div className="origin-card-body">
                <div className="origin-card-val">1</div>
                <div className="origin-card-label">Integrated System</div>
                <p className="origin-card-desc">
                  Design, engineering, materials, and assembly consolidated under one single accountable team.
                </p>
              </div>
              <div className="origin-card-media">
                <img
                  src="/assets/images/imgupscaler-enhanced-7.jpg"
                  alt="Precision Architectural Detailing"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Card 3: 30–300 m² Scalable Footprints */}
            <div className="origin-card">
              <div className="origin-card-body">
                <div className="origin-card-val">30–300 m²</div>
                <div className="origin-card-label">Scalable Architecture</div>
                <p className="origin-card-desc">
                  Versatile modular footprints engineered for enduring thermal comfort and desert durability.
                </p>
              </div>
              <div className="origin-card-media">
                <img
                  src="/assets/images/imgupscaler-enhanced-4.jpg"
                  alt="Desert Residence Architecture"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 — OUR PHILOSOPHY
          Asymmetrical 2-column composition with primary & secondary architectural imagery
          ========================================================================= */}
      <section className="philosophy-section" aria-label="Our Philosophy">
        <div className="container">
          <div className="philosophy-grid">
            {/* Left Column: Editorial Philosophy & Problem Statement */}
            <div className="philosophy-text-col">
              <span className="philosophy-eyebrow philosophy-anim-item">
                OUR PHILOSOPHY
              </span>
              <h2 className="philosophy-headline philosophy-anim-item">
                One Vision. One System.<br />
                One Accountable Team.
              </h2>
              <div className="philosophy-desc philosophy-anim-item">
                <p>
                  Traditional construction is fragmented. Between architects, engineers, contractors, suppliers and labour, designs change, costs shift, timelines move and the original vision can get lost.
                </p>
                <p>
                  AlGhaf Collective brings design, engineering, materials, prefabrication, construction and installation together under one integrated system.
                </p>
              </div>

              {/* Integrated Value Drivers */}
              <div className="philosophy-features philosophy-anim-item">
                <div className="philosophy-feature-item">
                  <span className="philosophy-feature-bullet" />
                  <div className="philosophy-feature-text">
                    <strong>Unified Accountability</strong>
                    <p>Single-source ownership from initial sketch through turnkey handover eliminates client disputes.</p>
                  </div>
                </div>
                <div className="philosophy-feature-item">
                  <span className="philosophy-feature-bullet" />
                  <div className="philosophy-feature-text">
                    <strong>Millimeter-Level Precision</strong>
                    <p>Industrial prefabrication in controlled factory conditions ensures flawless joinery and finishes.</p>
                  </div>
                </div>
                <div className="philosophy-feature-item">
                  <span className="philosophy-feature-bullet" />
                  <div className="philosophy-feature-text">
                    <strong>Schedule & Cost Certainty</strong>
                    <p>Fixed contracts and systematic engineering protect budgets against unpredictable site variations.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Layered Asymmetrical Architectural Composition */}
            <div className="philosophy-visual-col">
              <div className="philosophy-visual-wrap">
                <div className="philosophy-img-main">
                  <img
                    src="/assets/images/ax.jpg"
                    alt="AlGhaf Architectural Masterpiece"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 — COME VISIT OUR OFFICE (LOCATION MAP)
          Matching Reference Design with Interactive Map & Floating Location Card
          ========================================================================= */}
      <section className="office-location-section" aria-label="Come visit our office">
        <div className="container">
          <div className="office-location-header">
            <span className="office-eyebrow office-anim-item">
              Main office
            </span>
            <h2 className="office-headline office-anim-item">
              Come visit our office
            </h2>
            <p className="office-desc office-anim-item">
              Stop by our office to meet the team, discuss your plans, and explore the best modular architecture solutions. We'll be happy to answer your questions and help you find the right place to call home.
            </p>
          </div>

          <div className="office-map-container office-anim-item">
            {/* Top-Left Location Badge */}
            <div className="office-map-badge">
              <MapPin size={18} color="var(--color-forest)" />
              <div>
                <div className="office-map-badge-title">Dubai Design District (d3)</div>
                <div className="office-map-badge-sub">Dubai, United Arab Emirates</div>
              </div>
            </div>

            {/* Google Maps Embed iframe */}
            <iframe
              title="AlGhaf Collective Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14441.428489814526!2d55.2954752!3d25.1861054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f68307d896173%3A0xe54d924192b6a555!2sDubai%20Design%20District!5e0!3m2!1sen!2sae!4v1710000000000!5m2!1sen!2sae"
              className="office-map-iframe"
              loading="lazy"
              allowFullScreen
            />

            {/* Floating Office Card in Center matching reference screenshot */}
            <div className="office-floating-card">
              <img
                src="/assets/images/imgupscaler-enhanced-7.jpg"
                alt="AlGhaf Headquarters Building"
                className="office-floating-img"
              />
              <div className="office-floating-address">
                <strong>Dubai Design District (d3)</strong><br />
                Building 7, Dubai<br />
                United Arab Emirates
              </div>
              <Link to="/contact" className="office-floating-btn">
                Contacts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05 — CLOSING CTA
          Editorial closing CTA leading to Contact & Quick Enquiry
          ========================================================================= */}
      <section className="about-cta-section" aria-label="Let's Build Something Better">
        <div className="container">
          <div className="about-cta-container">
            <span className="about-cta-eyebrow cta-anim-item">
              LET'S BUILD SOMETHING BETTER.
            </span>
            <h2 className="about-cta-headline cta-anim-item">
              Start a Conversation.
            </h2>
            <p className="about-cta-text cta-anim-item">
              Whether you are planning a private home, hospitality development, modular project, or looking to collaborate, start the conversation with us.
            </p>
            <div className="about-cta-actions cta-anim-item">
              <Link to="/contact" className="btn-cta-primary">
                START YOUR PROJECT <ArrowRight size={18} />
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

      {/* Shared Quick Enquiry Modal */}
      <QuickEnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
