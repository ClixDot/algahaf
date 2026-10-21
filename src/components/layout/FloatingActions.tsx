'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { companyInfo } from '../../data/companyData';

export default function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [phone, setPhone] = useState(companyInfo.contact.phone);
  const [whatsapp, setWhatsapp] = useState(companyInfo.contact.whatsapp);
  const [whatsappMessage, setWhatsappMessage] = useState(
    'Hello AlGhaf Collective, I would like to enquire about your modular living systems.'
  );

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          if (data.settings.phone) setPhone(data.settings.phone);
          if (data.settings.whatsapp) setWhatsapp(data.settings.whatsapp);
          if (data.settings.whatsappMessage) setWhatsappMessage(data.settings.whatsappMessage);
        }
      })
      .catch((err) => console.warn('Floating actions sync notice:', err));
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isPastThreshold = window.scrollY > 400;
          setShowBackToTop(prev => (prev !== isPastThreshold ? isPastThreshold : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cleanPhone = (phone || '').trim();
  const rawWhatsapp = (whatsapp || '').trim();
  const cleanWhatsappNumber = rawWhatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl =
    rawWhatsapp.startsWith('http://') || rawWhatsapp.startsWith('https://')
      ? rawWhatsapp
      : `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
          whatsappMessage || 'Hello AlGhaf Collective, I would like to enquire about your modular living systems.'
        )}`;

  return (
    <div
      className="floating-actions-container"
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        right: '1.75rem',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem'
      }}
    >
      {/* Scroll to Top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            color: 'var(--color-charcoal)',
            border: '1px solid rgba(82, 105, 75, 0.15)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.backgroundColor = 'var(--color-ivory)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* Direct Call Icon */}
      <a
        href={`tel:${cleanPhone}`}
        aria-label="Call AlGhaf Collective"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-forest)',
          color: '#FAF8F5',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 6px 18px rgba(82, 105, 75, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          transition: 'all 0.25s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.backgroundColor = 'var(--color-forest-dark)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = 'var(--color-forest)';
        }}
      >
        <Phone size={20} />
      </a>

      {/* WhatsApp Floating Chat */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          transition: 'all 0.25s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
