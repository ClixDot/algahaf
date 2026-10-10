import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Phone } from 'lucide-react';
import QuickEnquiryModal from '../common/QuickEnquiryModal';
import { companyInfo } from '../../data/companyData';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 30;
          setScrolled(prev => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
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
    { label: 'Applications', path: '/applications' },
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
          zIndex: 1000,
          pointerEvents: 'none',
          padding: scrolled ? '0.65rem 0' : '0.65rem 0',
          transition: 'none'
        }}
      >
        <div
          className="navbar-card"
          style={{
            pointerEvents: 'auto',
            width: scrolled 
              ? 'min(var(--container-max), calc(100% - 2rem))' 
              : 'min(var(--container-max), 100%)',
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            backgroundColor: scrolled 
              ? '#FFFFFF' 
              : isDarkHeroPage ? 'transparent' : '#FFFFFF',
            borderRadius: scrolled ? '4px' : '0px',
            border: 'none',
            boxShadow: scrolled ? '0 8px 24px rgba(0, 0, 0, 0.08)' : 'none',
            padding: '0.65rem 1.75rem',
            transition: 'background-color 0.25s ease, box-shadow 0.25s ease, border-radius 0.25s ease'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '100%',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
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
                style={{
                  height: '44px',
                  width: 'auto',
                  maxWidth: '200px',
                  objectFit: 'contain',
                  filter: scrolled || !isDarkHeroPage 
                    ? 'brightness(0)' 
                    : 'none',
                  transition: 'filter 0.2s ease'
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
                        color: scrolled || !isDarkHeroPage
                          ? (isActive ? '#52694B' : '#20231F')
                          : (isActive ? 'var(--color-sand)' : '#FAF8F5'),
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
                    style={({ isActive }) => ({
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      position: 'relative',
                      color: scrolled || !isDarkHeroPage 
                        ? (isActive ? '#52694B' : '#20231F') 
                        : (isActive ? 'var(--color-sand)' : '#FAF8F5'),
                      padding: '0.5rem 0',
                      transition: 'color 0.2s ease'
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
                              backgroundColor: scrolled || !isDarkHeroPage ? '#52694B' : 'var(--color-sand)',
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
              {/* Phone Box matching reference */}
              <a
                href={`tel:${companyInfo.contact.phone.replace(/[^0-9+]/g, '')}`}
                className="nav-phone-box"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  padding: '0.55rem 1rem',
                  borderRadius: '3px',
                  transition: 'all 0.2s ease',
                  border: scrolled || !isDarkHeroPage
                    ? '1px solid rgba(32, 35, 31, 0.25)'
                    : '1px solid rgba(255, 255, 255, 0.35)',
                  color: scrolled || !isDarkHeroPage
                    ? '#20231F'
                    : '#FAF8F5',
                  backgroundColor: 'transparent',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (scrolled || !isDarkHeroPage) {
                    e.currentTarget.style.borderColor = '#52694B';
                    e.currentTarget.style.color = '#52694B';
                    e.currentTarget.style.backgroundColor = 'rgba(82, 105, 75, 0.05)';
                  } else {
                    e.currentTarget.style.borderColor = '#FFFFFF';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (scrolled || !isDarkHeroPage) {
                    e.currentTarget.style.borderColor = 'rgba(32, 35, 31, 0.25)';
                    e.currentTarget.style.color = '#20231F';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  } else {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                    e.currentTarget.style.color = '#FAF8F5';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {companyInfo.contact.phone}
              </a>

              {/* Contact Button matching reference */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="desktop-only-btn nav-contact-btn"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: scrolled || !isDarkHeroPage ? '#20231F' : '#FFFFFF',
                  color: scrolled || !isDarkHeroPage ? '#FFFFFF' : '#20231F',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderRadius: '3px',
                  padding: '0.55rem 1.15rem',
                  border: 'none',
                  boxShadow: scrolled ? '0 2px 8px rgba(0, 0, 0, 0.12)' : '0 4px 16px rgba(0, 0, 0, 0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#52694B';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = scrolled || !isDarkHeroPage ? '#20231F' : '#FFFFFF';
                  e.currentTarget.style.color = scrolled || !isDarkHeroPage ? '#FFFFFF' : '#20231F';
                  e.currentTarget.style.transform = 'translateY(0)';
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
                  color: scrolled || !isDarkHeroPage 
                    ? '#20231F' 
                    : '#FAF8F5',
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
        </div>
      </header>

      {/* Mobile Fullscreen Navigation Overlay */}
      {mobileMenuOpen && (
        <div
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
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      color: '#FAF8F5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
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
              <Phone size={16} color="var(--color-sand)" />
              <span>+971 4 288 9412 &bull; Dubai, UAE</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Enquiry Modal */}
      <QuickEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
        @media (min-width: 1080px) {
          .nav-phone-box {
            display: inline-flex !important;
          }
        }
        @media (max-width: 640px) {
          .header-scrolled {
            padding: 0.65rem 0 !important;
          }
          .header-scrolled .navbar-card {
            width: calc(100% - 1.25rem) !important;
            padding: 0.5rem 0.85rem !important;
          }
        }
      `}</style>
    </>
  );
}
