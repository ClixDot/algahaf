import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function FromProjectToProduct() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  // Register ScrollTrigger and setup subtle editorial entrance animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Respect user's motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        const animItems = contentRef.current.querySelectorAll('.fptp-anim-item');
        gsap.from(animItems, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none'
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="core-idea"
      ref={sectionRef}
      aria-label="Core Idea — From Project to Product"
      style={{
        backgroundColor: '#F7F4EE',
        position: 'relative',
        zIndex: 2,
        padding: 'clamp(4rem, 6vw, 5.5rem) 0',
        overflow: 'hidden'
      }}
    >
      <div 
        className="container"
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 3.5vw, 2.5rem)'
        }}
      >
        {/* Editorial Content */}
        <div 
          ref={contentRef} 
          className="fptp-content-wrap"
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          
          {/* Section Label */}
          <div 
            className="fptp-anim-item" 
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
              Core Idea
            </span>
            <span style={{ height: '1px', width: '48px', backgroundColor: 'rgba(125, 117, 101, 0.35)' }}></span>
          </div>

          {/* Headline */}
          <h2 
            className="fptp-anim-item"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 'clamp(2.2rem, 3.8vw, 46px)',
              lineHeight: 1.15,
              letterSpacing: '-0.015em',
              color: '#52694B',
              margin: '0 0 1.5rem 0'
            }}
          >
            FROM PROJECT TO PRODUCT.
          </h2>

          {/* Main Description */}
          <p 
            className="fptp-anim-item"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.15rem, 1.45vw, 1.35rem)',
              fontWeight: 400,
              lineHeight: 1.55,
              color: '#20231F',
              maxWidth: '780px',
              margin: '0 auto 1.25rem auto',
              letterSpacing: '-0.005em'
            }}
          >
            We are transforming housing from a fragmented project into a designed, engineered, and continuously refined product.
          </p>

          {/* Supporting Text */}
          <p 
            className="fptp-anim-item"
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
            Instead of starting from zero every time, we design for manufacturing and assembly from day one.
          </p>

        </div>
      </div>
    </section>
  );
}

