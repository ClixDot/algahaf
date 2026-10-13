import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, MapPin } from 'lucide-react';
import QuickEnquiryModal from '../common/QuickEnquiryModal';
import ComingSoonModal from '../common/ComingSoonModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const location = useLocation();

  // Listen for global open-coming-soon events from Footer or other pages
  useEffect(() => {
    const handleOpenComingSoon = () => setIsComingSoonOpen(true);
    window.addEventListener('open-coming-soon', handleOpenComingSoon);
    return () => window.removeEventListener('open-coming-soon', handleOpenComingSoon);
  }, []);

  // Hide navbar on scroll down, reveal smoothly on scroll up
  useEffect(() => {
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let ticking = false;

    const updateNav = (currentScrollY) => {
      const isScrolled = currentScrollY > 30;
      setScrolled(isScrolled);

      if (currentScrollY <= 30) {
        // Always show navbar at the very top of the page
        setNavVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        // Scrolling down -> hide navbar
        setNavVisible(false);
        setProductsDropdownOpen(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> reveal navbar smoothly
        setNavVisible(true);
      }

      lastScrollY = Math.max(0, currentScrollY);
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateNav(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and reset visibility on route change
  useEffect(() => {
    setNavVisible(true);
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
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
    { 
      label: 'Products', 
      path: '/products',
      hasDropdown: true,
      children: [
        { name: 'MOVA (30–75 m²)', path: '/products/mova', desc: 'Versatile Modular Architecture' },
        { name: 'PENTA (50–300 m²)', path: '/products/penta', desc: 'Elevated Double-Height Living' },
        { name: 'ENTRA', path: '/products/entra', desc: 'Private Entertainment. Reimagined' }
      ]
    },
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
          transform: (navVisible || mobileMenuOpen) ? 'translateY(0)' : 'translateY(-100%)',
          backgroundColor: scrolled 
            ? '#52694B' 
            : (isDarkHeroPage ? 'transparent' : '#52694B'),
          borderBottom: scrolled 
            ? '1px solid rgba(255, 255, 255, 0.14)' 
            : 'none',
          boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.16)' : 'none',
          padding: 0,
          transition: 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
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
                src="/assets/logos/AlGhaf_logo_-08.png"
                alt="AlGhaf Collective"
                className="nav-logo-img"
                style={{
                  height: scrolled ? '48px' : '71px',
                  width: 'auto',
                  maxWidth: scrolled ? '200px' : '260px',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)',
                  transition: 'height 0.35s cubic-bezier(0.16, 1, 0.3, 1), max-width 0.35s ease, filter 0.2s ease'
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
                item.hasDropdown ? (
                  <div 
                    key={item.label}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setProductsDropdownOpen(true)}
                    onMouseLeave={() => setProductsDropdownOpen(false)}
                  >
                    <NavLink
                      to={item.path}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        color: isActive ? '#C9A779' : '#FAF8F5',
                        padding: '0.5rem 0',
                        transition: 'color 0.2s ease'
                      })}
                    >
                      {item.label}
                      <ChevronDown size={14} style={{ opacity: 0.7 }} />
                    </NavLink>

                    {/* Dropdown Menu */}
                    {productsDropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: '-1rem',
                          width: '280px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '4px',
                          boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                          border: '1px solid rgba(82, 105, 75, 0.14)',
                          padding: '0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem',
                          animation: 'fadeIn 0.2s ease',
                          zIndex: 100
                        }}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            style={{
                              padding: '0.625rem 0.875rem',
                              borderRadius: '4px',
                              display: 'flex',
                              flexDirection: 'column',
                              textDecoration: 'none',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-ivory)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <span style={{ 
                              fontFamily: 'var(--font-display)', 
                              fontSize: '0.9375rem', 
                              fontWeight: 500, 
                              letterSpacing: '0.01em',
                              color: 'var(--color-forest)' 
                            }}>
                              {child.name}
                            </span>
                            <span style={{ 
                              fontSize: '0.75rem', 
                              color: 'var(--color-charcoal-muted)' 
                            }}>
                              {child.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={(e) => {
                      if (item.isComingSoon) {
                        e.preventDefault();
                        setIsComingSoonOpen(true);
                      }
                    }}
                    style={({ isActive }) => ({
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      position: 'relative',
                      color: isActive ? '#C9A779' : '#FAF8F5',
                      padding: '0.5rem 0',
                      transition: 'color 0.2s ease',
                      cursor: 'pointer'
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && (
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
                    )}
                  </NavLink>
                )
              ))}
            </nav>

            {/* Right Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Contact Button matching reference */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="desktop-only-btn nav-contact-btn"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#FAF8F5',
                  color: '#52694B',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderRadius: '3px',
                  padding: '0.55rem 1.15rem',
                  border: 'none',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
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
                CONTACT
                <ArrowRight size={13} />
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
                src="/assets/logos/AlGhaf_logo_-08.png"
                alt="AlGhaf Collective"
                style={{
                  height: '38px',
                  width: 'auto',
                  maxWidth: '180px',
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
                  {item.hasDropdown && (
                    <div style={{ marginLeft: '1rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            fontSize: '1rem',
                            color: '#E5DFD4',
                            opacity: 0.85
                          }}
                        >
                          — {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#E5DFD4', fontSize: '0.875rem' }}>
              <MapPin size={16} color="var(--color-sand)" />
              <span>Dubai, United Arab Emirates</span>
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
            height: 54px !important;
            max-width: 180px !important;
          }
          .header-scrolled .nav-logo-img {
            height: 42px !important;
            max-width: 150px !important;
          }
        }
      `}</style>
    </>
  );
}
