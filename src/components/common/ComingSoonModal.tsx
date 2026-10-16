import React, { useEffect } from 'react';
import { X, Sparkles, ArrowRight, Building2, Trees, Compass } from 'lucide-react';

export default function ComingSoonModal({ 
  isOpen, 
  onClose, 
  onOpenEnquiry,
  title = "APPLICATIONS & TYPOLOGIES",
  subtitle = "Curated Architectural Portfolio"
}) {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll and pause Lenis while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.lenis?.stop();
    } else {
      document.body.style.overflow = 'unset';
      window.lenis?.start();
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.lenis?.start();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
      data-lenis-prevent="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(18, 22, 17, 0.78)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'csmBackdropFade 0.25s ease forwards'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FAF8F5',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '540px',
          padding: 'clamp(2rem, 5vw, 2.75rem)',
          position: 'relative',
          boxShadow: '0 28px 70px -10px rgba(18, 24, 18, 0.38)',
          border: '1px solid rgba(82, 105, 75, 0.18)',
          overflow: 'hidden',
          animation: 'csmCardScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative top architectural gradient strip */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #52694B 0%, #C9A779 50%, #52694B 100%)'
          }} 
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(82, 105, 75, 0.08)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#2E3A2B',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(82, 105, 75, 0.18)';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(82, 105, 75, 0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <X size={18} />
        </button>

        {/* Badge: Pulse Coming Soon */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(82, 105, 75, 0.1)',
              color: '#52694B',
              border: '1px solid rgba(82, 105, 75, 0.22)',
              borderRadius: '999px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase'
            }}
          >
            <span 
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#C9A779',
                boxShadow: '0 0 0 3px rgba(201, 167, 121, 0.25)',
                display: 'inline-block'
              }} 
            />
            COMING SOON
          </span>
        </div>

        {/* Modal Headline */}
        <h3
          id="coming-soon-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 3vw, 2rem)',
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: '-0.015em',
            color: '#20231F',
            margin: '0 0 0.5rem 0'
          }}
        >
          {title}
        </h3>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#7D7565',
            margin: '0 0 1.25rem 0'
          }}
        >
          {subtitle}
        </p>

        {/* Main Description */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.975rem',
            lineHeight: 1.65,
            color: '#424840',
            margin: '0 0 1.75rem 0'
          }}
        >
          We are currently preparing and curating our complete architectural catalog of modular residential typologies, desert retreats, and hospitality pavilions. Case studies and technical specifications will be published shortly.
        </p>

        {/* 3 Scope Highlights */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.65rem',
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid rgba(82, 105, 75, 0.12)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Building2 size={20} color="#52694B" style={{ margin: '0 auto 0.35rem' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 600, color: '#20231F' }}>
              Residential
            </div>
            <div style={{ fontSize: '0.7rem', color: '#7D7565' }}>30–300 m²</div>
          </div>

          <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(82, 105, 75, 0.1)', borderRight: '1px solid rgba(82, 105, 75, 0.1)' }}>
            <Trees size={20} color="#52694B" style={{ margin: '0 auto 0.35rem' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 600, color: '#20231F' }}>
              Hospitality
            </div>
            <div style={{ fontSize: '0.7rem', color: '#7D7565' }}>Desert Lodges</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Compass size={20} color="#52694B" style={{ margin: '0 auto 0.35rem' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 600, color: '#20231F' }}>
              Custom
            </div>
            <div style={{ fontSize: '0.7rem', color: '#7D7565' }}>Specialized</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {onOpenEnquiry && (
            <button
              onClick={() => {
                onClose();
                onOpenEnquiry();
              }}
              style={{
                flex: '1 1 200px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: '#52694B',
                color: '#FFFFFF',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.875rem',
                letterSpacing: '0.04em',
                padding: '0.85rem 1.4rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(82, 105, 75, 0.28)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#42553B';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#52694B';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Enquire About a Project</span>
              <ArrowRight size={15} />
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              flex: '0 0 auto',
              padding: '0.85rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#20231F',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderRadius: '6px',
              border: '1px solid rgba(82, 105, 75, 0.24)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(82, 105, 75, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Got It
          </button>
        </div>
      </div>

      <style>{`
        @keyframes csmBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes csmCardScale {
          from { 
            opacity: 0; 
            transform: scale(0.94) translateY(12px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}
