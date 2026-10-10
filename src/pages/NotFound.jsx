import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '6rem', paddingBottom: '6rem' }} className="bg-ivory">
      <div className="container" style={{ textAlign: 'center', maxWidth: '640px' }}>
        <span className="eyebrow eyebrow-forest">404 &bull; Page Not Found</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 800, color: 'var(--color-forest-dark)', lineHeight: 1, marginBottom: '1rem' }}>
          404
        </h1>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-charcoal)', marginBottom: '1rem' }}>
          The Requested Space Does Not Exist
        </h2>
        <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '1.0625rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
          The page or architectural configuration you are seeking may have been relocated or updated. Explore our modular collections or return to the homepage.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary btn-lg">
            <Home size={18} /> Return to Homepage
          </Link>
          <Link to="/products" className="btn btn-outline-dark btn-lg">
            <Compass size={18} /> Explore Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
