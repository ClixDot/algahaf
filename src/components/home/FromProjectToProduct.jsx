import React, { useState, useEffect, useRef } from 'react';
import { Play, ArrowUpRight, PencilRuler, Settings, Coins, Clock } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function FromProjectToProduct() {
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef(null);
  const leftColRef = useRef(null);
  const videoCardRef = useRef(null);
  const videoRef = useRef(null);

  // Register ScrollTrigger and setup subtle editorial entrance animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Respect user's motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Left content reveal
      if (leftColRef.current) {
        const animItems = leftColRef.current.querySelectorAll('.fptp-anim-item');
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

      // Right video card gentle reveal
      if (videoCardRef.current) {
        gsap.from(videoCardRef.current, {
          scale: 0.96,
          opacity: 0,
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleTogglePlay = (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        // Fallback for browsers with strict unmuted autoplay policy
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const fourBenefits = [
    { title: 'DESIGN', icon: PencilRuler },
    { title: 'QUALITY', icon: Settings },
    { title: 'COST', icon: Coins },
    { title: 'TIME', icon: Clock }
  ];

  return (
    <>
      <section 
        id="core-idea"
        ref={sectionRef}
        aria-label="Core Idea — From Project to Product"
        style={{
          backgroundColor: '#F7F4EE',
          position: 'relative',
          zIndex: 2,
          padding: 'clamp(5rem, 8vw, 7.5rem) 0',
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
          {/* Main 2-Column Responsive Layout */}
          <div className="fptp-grid">
            
            {/* =========================================================
                LEFT COLUMN — EDITORIAL CONTENT & 4 KEY BENEFITS
                ========================================================= */}
            <div ref={leftColRef} className="fptp-left-col">
              
              {/* Section Label */}
              <div className="fptp-anim-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
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
                <span style={{ height: '1px', width: '56px', backgroundColor: 'rgba(125, 117, 101, 0.35)' }}></span>
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
                  fontSize: 'clamp(1.1rem, 1.35vw, 1.275rem)',
                  fontWeight: 400,
                  lineHeight: 1.55,
                  color: '#20231F',
                  margin: '0 0 1.25rem 0',
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
                  fontSize: 'clamp(0.925rem, 1.05vw, 1rem)',
                  fontWeight: 400,
                  lineHeight: 1.65,
                  color: '#4A504B',
                  margin: '0 0 1.85rem 0'
                }}
              >
                Instead of starting from zero every time, we design for manufacturing and assembly from day one—creating greater control over:
              </p>

              {/* Four Benefits — Exactly Matching Reference in 1 Row */}
              <div 
                className="fptp-anim-item fptp-benefits-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  maxWidth: '520px',
                  width: '100%',
                  marginTop: '0.75rem',
                  marginBottom: '2.5rem',
                  borderLeft: '1px solid rgba(82, 105, 75, 0.22)'
                }}
              >
                {fourBenefits.map((b) => {
                  const Icon = b.icon;

                  return (
                    <div
                      key={b.title}
                      className="fptp-benefit-cell"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '0.4rem 0.65rem',
                        borderRight: '1px solid rgba(82, 105, 75, 0.22)'
                      }}
                    >
                      <div 
                        className="fptp-benefit-icon"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#20261E',
                          marginBottom: '0.65rem',
                          transition: 'transform 0.25s ease, color 0.25s ease'
                        }}
                      >
                        <Icon size={28} strokeWidth={1.6} />
                      </div>
                      <span 
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#1F261D',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {b.title}
                      </span>
                    </div>
                  );
                })}
              </div>



            </div>

            {/* =========================================================
                RIGHT COLUMN — LARGE ARCHITECTURAL VIDEO PREVIEW
                (Exact reference match: modular crane lift image,
                 architectural offset accent backdrop, animated pulse rings)
                ========================================================= */}
            <div className="fptp-right-col" style={{ position: 'relative' }}>
              
              {/* Architectural Offset Accent Backdrop (Top-Right Sage/Sand Block) */}
              <div 
                className="fptp-backdrop-accent"
                style={{
                  position: 'absolute',
                  top: '-1.75rem',
                  right: '-1.75rem',
                  width: '48%',
                  height: '54%',
                  backgroundColor: '#D8D6C3',
                  borderRadius: '10px',
                  zIndex: 0,
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease'
                }} 
              />

              {/* The Main Video Card with 18px rounded corners & exact reference proportions */}
              <div 
                ref={videoCardRef}
                className={`fptp-video-card ${isPlaying ? 'is-playing' : ''}`}
                onClick={handleTogglePlay}
                role="button"
                tabIndex={0}
                aria-label="Play video: From Project to Product"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTogglePlay(e);
                  }
                }}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  aspectRatio: '1.32 / 1',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  backgroundColor: 'transparent',
                  boxShadow: '0 24px 52px -12px rgba(32, 45, 30, 0.16)',
                  border: 'none',
                  outline: 'none',
                  cursor: isPlaying ? 'default' : 'pointer',
                  transition: 'box-shadow 0.35s ease, transform 0.35s ease'
                }}
              >
                {/* Reference Modular Crane-Lift Poster Image (Visible when not playing) */}
                <img
                  src="/assets/images/modular_crane_lift.png"
                  alt="AlGhaf Modular Architecture — From Project to Product"
                  className="fptp-poster-img"
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    opacity: isPlaying ? 0 : 1,
                    pointerEvents: isPlaying ? 'none' : 'auto',
                    transition: 'opacity 0.4s ease, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 1
                  }}
                />

                {/* Embedded Video Element — Plays directly right in this card */}
                <video
                  ref={videoRef}
                  src="/assets/videos/core%20idea.mp4"
                  playsInline
                  preload="metadata"
                  controls={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    backgroundColor: '#000000',
                    border: 'none',
                    outline: 'none',
                    position: 'relative',
                    zIndex: isPlaying ? 2 : 0
                  }}
                >
                  <source src="/assets/videos/core%20idea.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Centered Circular Play Button with Concentric Animated Pulse Waves */}
                {!isPlaying && (
                  <div 
                    className="fptp-play-btn-wrap"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 3,
                      pointerEvents: 'none'
                    }}
                  >
                    {/* Concentric Animated Pulse Ripple Rings */}
                    <div className="fptp-pulse-ring fptp-pulse-ring-1" />
                    <div className="fptp-pulse-ring fptp-pulse-ring-2" />
                    <div className="fptp-pulse-ring fptp-pulse-ring-3" />

                    {/* Circular Play Button */}
                    <div 
                      className="fptp-play-btn"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(250, 248, 245, 0.96)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.22)',
                        position: 'relative',
                        zIndex: 2,
                        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, box-shadow 0.35s ease'
                      }}
                    >
                      <Play 
                        size={28} 
                        color="#2E3D2A" 
                        fill="#2E3D2A" 
                        style={{ marginLeft: '4px' }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Responsive Styles & Concentric Pulse Ring Keyframes */}
      <style>{`
        .fptp-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: clamp(2.5rem, 5vw, 5.5rem);
          align-items: center;
        }

        /* Animated Concentric Pulse Ripple Waves */
        .fptp-pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.75);
          pointer-events: none;
        }

        .fptp-pulse-ring-1 {
          animation: fptpPulseRing 3.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        }

        .fptp-pulse-ring-2 {
          animation: fptpPulseRing 3.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
          animation-delay: 1.05s;
        }

        .fptp-pulse-ring-3 {
          animation: fptpPulseRingWide 3.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
          animation-delay: 2.1s;
        }

        @keyframes fptpPulseRing {
          0% {
            transform: translate(-50%, -50%) scale(0.95);
            opacity: 0.75;
          }
          50% {
            opacity: 0.35;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.9);
            opacity: 0;
          }
        }

        @keyframes fptpPulseRingWide {
          0% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.55;
          }
          60% {
            opacity: 0.2;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.65);
            opacity: 0;
          }
        }

        /* Hover Interactions */
        .fptp-right-col:hover .fptp-backdrop-accent {
          transform: translate(4px, -4px);
        }

        .fptp-video-card:not(.is-playing):hover {
          transform: translateY(-4px);
          box-shadow: 0 28px 60px -10px rgba(32, 45, 30, 0.24) !important;
        }

        .fptp-video-card:not(.is-playing):hover .fptp-poster-img {
          transform: scale(1.03);
        }

        .fptp-video-card:not(.is-playing):hover .fptp-play-btn {
          transform: scale(1.08);
          background-color: #FFFFFF !important;
          box-shadow: 0 16px 42px rgba(0, 0, 0, 0.3) !important;
        }

        .fptp-benefit-cell:hover .fptp-benefit-icon {
          transform: translateY(-2px);
          color: #52694B !important;
        }

        @media (max-width: 960px) {
          .fptp-grid {
            grid-template-columns: 1fr;
            gap: 3.5rem;
          }
          .fptp-right-col {
            max-width: 640px;
            margin: 0 auto;
            width: 100%;
          }
          .fptp-backdrop-accent {
            top: -1.25rem !important;
            right: -1.25rem !important;
          }
        }

        @media (max-width: 480px) {
          .fptp-benefit-cell {
            padding: 0.35rem 0.25rem !important;
          }
          .fptp-benefit-cell span {
            font-size: 0.6875rem !important;
            letter-spacing: 0.05em !important;
          }
          .fptp-backdrop-accent {
            top: -0.85rem !important;
            right: -0.85rem !important;
          }
          .fptp-video-card {
            border-radius: 14px !important;
          }
          .fptp-play-btn {
            width: 66px !important;
            height: 66px !important;
          }
          .fptp-pulse-ring {
            width: 66px !important;
            height: 66px !important;
          }
        }
      `}</style>
    </>
  );
}
