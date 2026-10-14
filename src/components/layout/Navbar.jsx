import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, MapPin } from 'lucide-react';
import { companyInfo } from '../../data/companyData';
import QuickEnquiryModal from '../common/QuickEnquiryModal';
import ComingSoonModal from '../common/ComingSoonModal';

function InstagramIcon({ size = 18, color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const location = useLocation();

  // Listen for global open-coming-soon events from Footer or other pages
  useEffect(() => {
    const handleOpenComingSoon = () => setIsComingSoonOpen(true);
    window.addEventListener('open-coming-soon', handleOpenComingSoon);
    return () => window.removeEventListener('open-coming-soon', handleOpenComingSoon);
  }, []);

  // Always sticky navbar: transparent over hero section, solid green only when scrolled past hero
  useEffect(() => {
    let ticking = false;

    const checkScrolledState = () => {
      const currentScrollY = window.scrollY;
      const isPlainLightPage = ['/privacy', '/terms'].some(path => location.pathname.startsWith(path));

      if (isPlainLightPage) {
        setScrolled(true);
        return;
      }

      // Transition to solid background as soon as user starts scrolling (past 30px)
      // This ensures scrolling content slides cleanly underneath the solid navbar
      const threshold = 30;
      setScrolled(currentScrollY >= threshold);
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScrolledState();
          ticking = false;
        });
        ticking = true;
      }
    };

    checkScrolledState();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkScrolledState, { passive: true });

    if (window.lenis) {
      window.lenis.on('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScrolledState);
      if (window.lenis) {
        window.lenis.off('scroll', handleScroll);
      }
    };
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
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
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Products', path: '/products' },
    // { label: 'Our Process', path: '/process' },
    { label: 'Applications', path: '/applications', isComingSoon: true },
    { label: 'Contact', path: '/contact' }
  ];

  const isDarkHeroPage = !['/privacy', '/terms'].some(path => location.pathname.startsWith(path));

  return (
    <>
      <header
        className={`site-header ${scrolled ? 'header-scrolled' : 'header-top'}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 1000,
          transform: 'translateY(0)',
          backgroundColor: scrolled 
            ? '#52694B' 
            : (isDarkHeroPage ? 'transparent' : '#52694B'),
          borderBottom: scrolled 
            ? '1px solid rgba(255, 255, 255, 0.14)' 
            : 'none',
          boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.16)' : 'none',
          padding: 0,
          transition: 'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease'
        }}
      >
        <div
          className="navbar-container"
          style={{
            width: '100%',
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            padding: scrolled ? '0.7rem 2rem' : '1.15rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'padding 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
            {/* Logo */}
            <Link 
              to="/" 
              aria-label="AlGhaf Collective Home"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                padding: '0.2rem 0'
              }}
            >
              <img
                src="/assets/logos/AlGhaf_logo_-10.png"
                alt="AlGhaf Collective"
                className="nav-logo-img"
                style={{
                  height: scrolled ? '46px' : '62px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  transition: 'height 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s ease'
                }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav 
              style={{ 
                display: 'none', 
                alignItems: 'center', 
                gap: 'clamp(1.25rem, 1.8vw, 2.25rem)' 
              }}
              className="desktop-nav"
            >
              {navLinks.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={true}
                  onClick={(e) => {
                    if (item.isComingSoon) {
                      e.preventDefault();
                      setIsComingSoonOpen(true);
                    }
                  }}
                  style={({ isActive }) => {
                    const active = !item.isComingSoon && isActive;
                    return {
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      position: 'relative',
                      color: active ? '#C9A779' : '#FAF8F5',
                      padding: '0.5rem 0',
                      transition: 'color 0.2s ease',
                      cursor: 'pointer'
                    };
                  }}
                >
                  {({ isActive }) => {
                    const active = !item.isComingSoon && isActive;
                    return (
                      <>
                        {item.label}
                        {active && (
                          <span 
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: '2px',
                              backgroundColor: '#C9A779',
                              borderRadius: '1px'
                            }} 
                          />
                        )}
                      </>
                    );
                  }}
                </NavLink>
              ))}
            </nav>

            {/* Right Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Instagram Icon Link (to the left of Contact button) */}
              <a
                href={companyInfo.contact.instagram || 'https://www.instagram.com/alghafcollective'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow AlGhaf Collective on Instagram"
                title="Follow on Instagram"
                className="desktop-only-btn nav-instagram-btn"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  color: '#FAF8F5',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.22s ease',
                  textDecoration: 'none',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.color = '#C9A779';
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.color = '#FAF8F5';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
              >
                <InstagramIcon size={18} />
              </a>

              {/* Enquiry Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="desktop-only-btn nav-contact-btn"
                aria-label="Make an enquiry"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#FAF8F5',
                  color: '#52694B',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  padding: '0.6rem 1.25rem',
                  border: 'none',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#384933';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAF8F5';
                  e.currentTarget.style.color = '#52694B';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.12)';
                }}
              >
                ENQUIRY
                <ArrowRight size={14} />
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
                style={{
                  color: '#FAF8F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  background: 'transparent'
                }}
                className="mobile-nav-toggle"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </header>

      {/* Mobile Fullscreen Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          data-lenis-prevent="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1002,
            backgroundColor: '#141713',
            color: '#FAF8F5',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          {/* Top Sticky Header Bar with Logo & Explicit Close Button */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              backgroundColor: '#141713',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(242, 238, 229, 0.12)'
            }}
          >
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              aria-label="AlGhaf Collective Home"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <img
                src="/assets/logos/AlGhaf_logo_-10.png"
                alt="AlGhaf Collective"
                style={{
                  height: '42px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Navigation Menu"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                color: '#FAF8F5',
                borderRadius: '999px',
                padding: '0.5rem 1rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
              }}
            >
              <span>CLOSE</span>
              <X size={18} />
            </button>
          </div>

          <div style={{ padding: '2rem 1.75rem 1.5rem 1.75rem', flex: 1 }}>
            <span className="eyebrow" style={{ color: 'var(--color-sand)' }}>Menu</span>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
              {navLinks.map((item) => (
                <div key={item.label}>
                  <NavLink
                    to={item.path}
                    onClick={(e) => {
                      if (item.isComingSoon) {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        setIsComingSoonOpen(true);
                      } else {
                        setMobileMenuOpen(false);
                      }
                    }}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      color: '#FAF8F5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                    <ArrowRight size={20} color="var(--color-sand)" />
                  </NavLink>
                </div>
              ))}
            </nav>
          </div>

          <div style={{ padding: '1.5rem 1.75rem 2.5rem 1.75rem', borderTop: '1px solid rgba(242, 238, 229, 0.12)' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsModalOpen(true);
              }}
              className="btn btn-sand"
              style={{ width: '100%', marginBottom: '1.25rem' }}
            >
              Start a Conversation
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#E5DFD4', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={16} color="var(--color-sand)" />
                <span>Dubai, United Arab Emirates</span>
              </div>
              <a
                href={companyInfo.contact.instagram || 'https://www.instagram.com/alghafcollective'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow AlGhaf Collective on Instagram"
                title="Follow on Instagram"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'var(--color-sand)',
                  textDecoration: 'none'
                }}
              >
                <InstagramIcon size={16} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Quick Enquiry Modal */}
      <QuickEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Applications Coming Soon Modal */}
      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        onOpenEnquiry={() => {
          setIsComingSoonOpen(false);
          setIsModalOpen(true);
        }}
        title="APPLICATIONS & TYPOLOGIES"
        subtitle="Curated Architectural Portfolio"
      />

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-only-btn {
            display: inline-flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .navbar-container {
            padding: 0.65rem 1.25rem !important;
          }
          .nav-logo-img {
            height: 44px !important;
          }
          .header-scrolled .nav-logo-img {
            height: 36px !important;
          }
        }
      `}</style>
    </>
  );
}
