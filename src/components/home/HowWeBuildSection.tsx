import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HowWeBuildSection() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const leftColRef = useRef(null);
  const videoCardRef = useRef(null);
  const isInteractingWithControls = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (leftColRef.current) {
        const items = leftColRef.current.querySelectorAll('.hwb-anim-item');
        gsap.from(items, {
          y: 28,
          opacity: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        });
      }

      if (videoCardRef.current) {
        gsap.from(videoCardRef.current, {
          scale: 0.95,
          opacity: 0,
          duration: 1,
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

  const handleStartPlay = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!videoRef.current) return;

    setHasStarted(true);
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
            setIsPlaying(true);
          }
        });
    }
  };

  const handlePointerDown = (e) => {
    if (!videoRef.current) return;
    const rect = videoRef.current.getBoundingClientRect();
    // Bottom ~60px represents the native video controls bar area
    if (rect.bottom - e.clientY <= 60) {
      isInteractingWithControls.current = true;
    } else {
      isInteractingWithControls.current = false;
    }
  };

  const handleVideoClick = (e) => {
    if (!hasStarted) return;
    if (isInteractingWithControls.current) {
      isInteractingWithControls.current = false;
      return;
    }
    if (!videoRef.current) return;
    const rect = videoRef.current.getBoundingClientRect();
    if (rect.bottom - e.clientY <= 60) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  };

  const steps = [
    {
      number: '01',
      title: 'Design Smarter.',
      description: 'Architecture, planning and BIM for spaces that are functional, beautiful and future-ready.',
      icon: (
        /* Blueprint / Architectural house drafting plan */
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="#253823" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="5" width="26" height="24" rx="2" />
          <path d="M11 20V15.5L17 11L23 15.5V20H11Z" />
          <line x1="8" y1="9" x2="10" y2="9" />
          <line x1="8" y1="12" x2="9" y2="12" />
          <line x1="8" y1="15" x2="9" y2="15" />
          <line x1="8" y1="25" x2="26" y2="25" />
          <line x1="15" y1="20" x2="15" y2="17" />
          <line x1="19" y1="20" x2="19" y2="17" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'Prefabricate Precisely.',
      description: 'Controlled manufacturing with rigorous quality standards, reducing waste and project time.',
      icon: (
        /* Modern factory with conveyor rollers & precision production */
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="#253823" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 24V14L11 18V14L17 18V10L27 10V24H5Z" />
          <line x1="3" y1="27" x2="31" y2="27" />
          <circle cx="9" cy="24" r="1.5" />
          <circle cx="15" cy="24" r="1.5" />
          <circle cx="21" cy="24" r="1.5" />
          <rect x="20" y="14" width="4" height="4" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'Build Modular.',
      description: 'On-site assembly with precision and minimal disruption, delivering spaces that last.',
      icon: (
        /* Construction tower crane hoisting a modular house block */
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="#253823" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="5" x2="7" y2="28" />
          <line x1="4" y1="28" x2="10" y2="28" />
          <line x1="5" y1="9" x2="9" y2="13" />
          <line x1="9" y1="9" x2="5" y2="13" />
          <line x1="5" y1="17" x2="9" y2="21" />
          <line x1="9" y1="17" x2="5" y2="21" />
          <line x1="4" y1="5" x2="28" y2="5" />
          <line x1="22" y1="5" x2="22" y2="13" />
          <rect x="16" y="13" width="12" height="12" rx="1.5" />
          <line x1="22" y1="13" x2="22" y2="25" />
          <line x1="16" y1="19" x2="28" y2="19" />
        </svg>
      )
    }
  ];


  return (
    <>
      <section 
        id="process"
        ref={sectionRef}
        aria-label="How We Build"
        className="hwb-ref-section"
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          
          {/* Top Heading & Introductory Subtitle */}
          <div className="hwb-ref-header">
            <h2 className="hwb-ref-title">
              How We <span className="hwb-ref-accent">Build</span>
            </h2>
            <p className="hwb-ref-lead">
              From ideas to installation, we follow a precise, integrated process to deliver exceptional spaces — faster, cleaner and better.
            </p>
          </div>

          {/* Main 2-Column Responsive Composition */}
          <div className="hwb-ref-grid">
            
            {/* Left Column: Vertical Process Sequence with Continuous Track Line */}
            <div ref={leftColRef} className="hwb-ref-steps-col">
              {/* Continuous vertical connecting line behind all badges */}
              <div className="hwb-ref-spine-line" aria-hidden="true" />

              {steps.map((step) => (
                <div key={step.number} className="hwb-ref-step-item hwb-anim-item">
                  
                  {/* Icon Badge */}
                  <div className="hwb-ref-badge-wrap">
                    <div className="hwb-ref-badge">
                      {step.icon}
                    </div>
                  </div>

                  {/* Step Editorial Details */}
                  <div className="hwb-ref-step-text">
                    <div className="hwb-ref-step-num-row">
                      <span className="hwb-ref-step-num">{step.number}</span>
                      <span className="hwb-ref-step-line" />
                    </div>
                    <h3 className="hwb-ref-step-title">{step.title}</h3>
                    <p className="hwb-ref-step-desc">{step.description}</p>
                  </div>

                </div>
              ))}
            </div>

            {/* Right Column: Architectural Video Card */}
            <div className="hwb-ref-video-col">
              <div 
                ref={videoCardRef}
                className={`hwb-ref-video-card ${hasStarted ? 'has-started' : ''} ${isPlaying ? 'is-playing' : ''}`}
                onClick={!hasStarted ? handleStartPlay : undefined}
                role={!hasStarted ? "button" : undefined}
                tabIndex={!hasStarted ? 0 : undefined}
                aria-label={!hasStarted ? "Play video: How We Build" : undefined}
                onKeyDown={(e) => {
                  if (!hasStarted && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleStartPlay(e);
                  }
                }}
              >
                {/* Reference Video Poster Image (only visible before first playback) */}
                <img
                  src="/assets/images/how_we_build_video_poster.jpg"
                  alt="How We Build — Modern Sustainable Prefabricated Living"
                  className="hwb-ref-poster"
                  loading="lazy"
                />

                {/* Embedded Video Element with continuous smooth controls once activated */}
                <video
                  ref={videoRef}
                  src="/assets/videos/core%20idea.mp4"
                  playsInline
                  preload="metadata"
                  controls={hasStarted}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onPointerDown={handlePointerDown}
                  onClick={handleVideoClick}
                  className="hwb-ref-video-tag"
                >
                  <source src="/assets/videos/core%20idea.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Centered Translucent Glass Play Button - only shown before starting */}
                {!hasStarted && (
                  <div className="hwb-ref-play-btn" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#202A1E" style={{ marginLeft: '4px' }}>
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Scoped CSS Matching Image 2 Exactly */}
      <style>{`
        .hwb-ref-section {
          background-color: var(--color-ivory-light);
          position: relative;
          overflow: hidden;
          padding: clamp(5rem, 7.5vw, 7.5rem) 0 clamp(4rem, 6vw, 5.5rem) 0;
        }

        /* Section Header */
        .hwb-ref-header {
          margin-bottom: clamp(2.5rem, 4vw, 3.5rem);
        }

        .hwb-ref-title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 5.5vw, 68px);
          font-weight: 400;
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: #151814;
          margin: 0 0 1rem 0;
        }

        .hwb-ref-accent {
          color: #273B25;
          font-weight: 500;
        }

        .hwb-ref-lead {
          font-family: var(--font-body);
          font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
          font-weight: 400;
          line-height: 1.6;
          color: #555C54;
          max-width: 560px;
          margin: 0;
        }

        /* 2-Column Responsive Grid */
        .hwb-ref-grid {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: clamp(2.5rem, 4.5vw, 5rem);
          align-items: center;
        }

        /* Left Column Steps */
        .hwb-ref-steps-col {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* Continuous Spine Line Behind Badges */
        .hwb-ref-spine-line {
          position: absolute;
          left: 35px;
          top: 35px;
          bottom: 35px;
          width: 1.5px;
          background-color: rgba(82, 105, 75, 0.28);
          transform: translateX(-50%);
          z-index: 1;
        }

        .hwb-ref-step-item {
          display: flex;
          align-items: flex-start;
          gap: 1.75rem;
          position: relative;
          padding-bottom: clamp(2.5rem, 4vw, 3.5rem);
          z-index: 2;
        }

        .hwb-ref-step-item:last-child {
          padding-bottom: 0;
        }

        /* Icon Badge */
        .hwb-ref-badge-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex-shrink: 0;
          z-index: 2;
        }

        .hwb-ref-badge {
          width: 70px;
          height: 70px;
          border-radius: 16px;
          background-color: #F1ECE2;
          border: 1px solid rgba(82, 105, 75, 0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(35, 45, 30, 0.04);
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .hwb-ref-step-item:hover .hwb-ref-badge {
          transform: translateY(-2px);
          background-color: #EDE7DC;
        }

        /* Step Details */
        .hwb-ref-step-text {
          padding-top: 0.15rem;
        }

        .hwb-ref-step-num-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.35rem;
        }

        .hwb-ref-step-num {
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 700;
          color: #6E6656;
          letter-spacing: 0.08em;
          line-height: 1;
        }

        .hwb-ref-step-line {
          display: inline-block;
          height: 1px;
          width: 44px;
          background-color: rgba(110, 102, 86, 0.35);
        }

        .hwb-ref-step-title {
          font-family: var(--font-display);
          font-size: clamp(1.55rem, 2vw, 1.85rem);
          font-weight: 500;
          color: #171A16;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .hwb-ref-step-desc {
          font-family: var(--font-body);
          font-size: clamp(0.9rem, 0.98vw, 0.975rem);
          line-height: 1.62;
          color: #555C54;
          margin: 0;
          max-width: 400px;
        }

        /* Right Column Video Card */
        .hwb-ref-video-col {
          width: 100%;
        }

        .hwb-ref-video-card {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9.8;
          border-radius: 20px;
          overflow: hidden;
          background-color: #1B221A;
          border: 3.5px solid #182017;
          box-shadow: 0 24px 60px -12px rgba(24, 34, 22, 0.25);
          outline: none;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .hwb-ref-video-card:not(.has-started) {
          cursor: pointer;
        }

        .hwb-ref-video-card:not(.has-started):hover {
          transform: translateY(-4px);
          box-shadow: 0 32px 70px -10px rgba(24, 34, 22, 0.32);
        }

        .hwb-ref-video-card.has-started {
          cursor: default;
          transform: none;
        }

        .hwb-ref-poster {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 1;
          transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 2;
        }

        .hwb-ref-video-card.has-started .hwb-ref-poster {
          opacity: 0;
          pointer-events: none;
          display: none;
        }

        .hwb-ref-video-card:not(.has-started):hover .hwb-ref-poster {
          transform: scale(1.025);
        }

        .hwb-ref-video-tag {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          position: relative;
          z-index: 1;
          background-color: #000000;
        }

        .hwb-ref-video-card.has-started .hwb-ref-video-tag {
          z-index: 3;
        }

        /* Circular Play Button */
        .hwb-ref-play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 78px;
          height: 78px;
          border-radius: 50%;
          background-color: rgba(235, 230, 220, 0.75);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.24);
          z-index: 3;
          pointer-events: none;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease;
        }

        .hwb-ref-video-card:hover .hwb-ref-play-btn {
          transform: translate(-50%, -50%) scale(1.08);
          background-color: rgba(245, 240, 232, 0.92);
        }

        /* Responsive Breakpoints */
        @media (max-width: 980px) {
          .hwb-ref-grid {
            grid-template-columns: 1fr;
            gap: 3.5rem;
          }

          .hwb-ref-video-col {
            max-width: 640px;
            margin: 0 auto;
          }
        }

        @media (max-width: 640px) {
          .hwb-ref-title {
            font-size: 2.5rem;
          }

          .hwb-ref-badge {
            width: 56px;
            height: 56px;
          }

          .hwb-ref-badge svg {
            width: 28px;
            height: 28px;
          }

          .hwb-ref-track-line {
            top: 56px;
          }

          .hwb-ref-play-btn {
            width: 64px;
            height: 64px;
          }
        }
      `}</style>
    </>
  );
}
