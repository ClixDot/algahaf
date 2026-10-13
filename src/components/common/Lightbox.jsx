import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({ images = [], currentIndex = 0, isOpen, onClose, onNavigate }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && images.length > 1) onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight' && images.length > 1) onNavigate((currentIndex + 1) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images, onClose, onNavigate]);

  // Lock body scroll and pause Lenis while Lightbox is open
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

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const src = typeof currentImage === 'string' ? currentImage : currentImage?.src;
  const title = typeof currentImage === 'string' ? '' : currentImage?.title;

  return (
    <div 
      role="dialog" 
      aria-modal="true"
      data-lenis-prevent="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(14, 18, 15, 0.94)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close Lightbox"
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          color: '#FAF8F5',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        <X size={22} />
      </button>

      <div 
        style={{
          position: 'relative',
          maxWidth: '92vw',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={title || 'Architectural View'}
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
            borderRadius: '4px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
          }}
        />
        {title && (
          <p style={{
            color: '#E5DFD4',
            marginTop: '1rem',
            fontSize: '0.9375rem',
            textAlign: 'center',
            letterSpacing: '0.03em'
          }}>
            {title}
          </p>
        )}
        <span style={{
          color: '#C9A779',
          fontSize: '0.8125rem',
          marginTop: '0.35rem',
          letterSpacing: '0.1em'
        }}>
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex - 1 + images.length) % images.length);
            }}
            aria-label="Previous image"
            style={{
              position: 'absolute',
              left: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#FAF8F5',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={26} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex + 1) % images.length);
            }}
            aria-label="Next image"
            style={{
              position: 'absolute',
              right: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#FAF8F5',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ChevronRight size={26} />
          </button>
        </>
      )}
    </div>
  );
}
