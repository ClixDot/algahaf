import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Check, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '../components/common/SectionHeader';
import QuickEnquiryModal from '../components/common/QuickEnquiryModal';
import { processSteps, processComparison } from '../data/processData';

export default function Process() {
  const [modalOpen, setModalOpen] = useState(false);
  const processRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const sectionHeaders = document.querySelectorAll('.section-header-reveal');
      sectionHeaders.forEach((sh) => {
        gsap.from(sh, {
          y: 26,
          opacity: 0,
          duration: 0.85,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: sh,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      });

      // Reveal each process step card smoothly as it scrolls into view
      const stepCards = document.querySelectorAll('.process-step-card');
      stepCards.forEach((card) => {
        gsap.from(card, {
          y: 35,
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        });
      });

      // Comparison table reveal
      const comparisonCard = document.querySelector('.process-comparison-card');
      if (comparisonCard) {
        gsap.from(comparisonCard, {
          y: 30,
          opacity: 0,
          duration: 0.85,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: comparisonCard,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        });
      }
    }, processRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={processRef} style={{ margin: 0, padding: 0 }}>
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
            backgroundImage: `linear-gradient(to bottom, rgba(14, 16, 14, 0.55) 0%, rgba(14, 16, 14, 0.85) 100%), url('/assets/images/image_bg_more_alghafaxxxxa.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '880px' }}>
          <span className="eyebrow" style={{ color: 'var(--color-sand)' }}>
            Integrated Delivery System
          </span>
          <h1 className="hero-title" style={{ color: '#FAF8F5', marginBottom: '1.5rem' }}>
            One Integrated Process.<br />From Concept to Living.
          </h1>
          <p className="lead-text" style={{ color: '#E5DFD4', maxWidth: '720px', margin: '0 auto' }}>
            We bring architecture, BIM engineering, factory manufacturing, and site installation together under one accountable team.
          </p>
        </div>
      </section>

      {/* =========================================================================
          THE THREE STAGES IN DEPTH
          ========================================================================= */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <SectionHeader
            eyebrow="The Workflow"
            title="How We Deliver Precision."
            subtitle="Explore how our three synchronized stages transform complex architectural challenges into predictable, repeatable success."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            {processSteps.map((step, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={step.number}
                  className="process-step-card"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid rgba(82, 105, 75, 0.12)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-md)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                    alignItems: 'center'
                  }}
                >
                  {/* Text Column */}
                  <div
                    style={{
                      padding: 'clamp(2rem, 4vw, 3.5rem)',
                      order: isEven ? 2 : 1
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        color: 'var(--color-sand)',
                        lineHeight: 1
                      }}>
                        {step.number}
                      </span>
                      <span style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--color-forest)',
                        backgroundColor: 'rgba(82, 105, 75, 0.08)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '3px'
                      }}>
                        {step.focus}
                      </span>
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)', fontWeight: 700, color: 'var(--color-forest-dark)', marginBottom: '0.75rem' }}>
                      {step.phase}
                    </h2>

                    <p style={{ fontStyle: 'italic', color: 'var(--color-sand-dark)', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                      “{step.tagline}”
                    </p>

                    <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '1.0625rem', lineHeight: '1.75', marginBottom: '2rem' }}>
                      {step.description}
                    </p>

                    <div style={{ borderTop: '1px solid rgba(82, 105, 75, 0.1)', paddingTop: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-charcoal)', marginBottom: '1rem', fontWeight: 700 }}>
                        Deliverables & Checkpoints:
                      </h4>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {step.deliverables.map((item, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9375rem', color: 'var(--color-charcoal)' }}>
                            <CheckCircle2 size={18} color="var(--color-forest)" style={{ flexShrink: 0 }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Image Column */}
                  <div
                    style={{
                      height: '100%',
                      minHeight: '420px',
                      position: 'relative',
                      order: isEven ? 1 : 2
                    }}
                  >
                    <img
                      src={step.image}
                      alt={step.phase}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          PROCESS COMPARISON: TRADITIONAL VS ALGHAF
          ========================================================================= */}
      <section className="section-padding bg-ivory-light">
        <div className="container">
          <SectionHeader
            eyebrow="The Modular Advantage"
            title="Traditional vs. AlGhaf Integrated Delivery."
            subtitle="A clear contrast in schedule, financial certainty, quality control, and ecological impact."
            centered
          />

          <div 
            className="process-comparison-card"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid rgba(82, 105, 75, 0.14)',
              overflowX: 'auto',
              boxShadow: 'var(--shadow-md)',
              maxWidth: '1100px',
              margin: '0 auto'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-forest-dark)', color: '#FAF8F5' }}>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-display)', fontSize: '1rem', width: '22%' }}>Dimension</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-display)', fontSize: '1rem', width: '36%', color: '#E87A70' }}>Traditional On-Site</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-display)', fontSize: '1rem', width: '42%', color: 'var(--color-sand)' }}>AlGhaf Integrated Modular</th>
                </tr>
              </thead>
              <tbody>
                {processComparison.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(82, 105, 75, 0.08)', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : 'rgba(82, 105, 75, 0.02)' }}>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: 'var(--color-forest-dark)', verticalAlign: 'top' }}>
                      {row.aspect}
                      <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-sand-dark)', marginTop: '0.25rem' }}>
                        {row.gain}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: '#6B726A', fontSize: '0.9375rem', verticalAlign: 'top', lineHeight: '1.6' }}>
                      {row.traditional}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--color-charcoal)', fontSize: '0.9375rem', fontWeight: 500, verticalAlign: 'top', lineHeight: '1.6' }}>
                      {row.alghaf}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLOSING ENQUIRY CTA
          ========================================================================= */}
      <section className="section-padding bg-ivory" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <h2 className="section-title" style={{ marginBottom: '1.25rem', color: 'var(--color-forest-dark)' }}>
            Ready to Build Smarter?
          </h2>
          <p className="lead-text" style={{ marginBottom: '2.5rem' }}>
            Bring your architectural concept, plot coordinates, or vision to our team. We coordinate design, engineering, and manufacturing from day one.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-lg">
              Start Project Consultation <ArrowRight size={18} />
            </button>
            <Link to="/products" className="btn btn-outline-dark btn-lg">
              Explore Our Modular Homes
            </Link>
          </div>
        </div>
      </section>

      <QuickEnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
