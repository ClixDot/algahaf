'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--admin-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle architectural backdrop glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(82, 105, 75, 0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--admin-border)',
          borderRadius: '16px',
          padding: '2.75rem 2.25rem',
          boxShadow: 'var(--admin-shadow-lg)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <img
            src="/assets/logos/AlGhaf_logo_-05.png"
            alt="AlGhaf Collective"
            style={{ height: '54px', margin: '0 auto 1.25rem auto', objectFit: 'contain' }}
          />
          <h1
            style={{
              fontFamily: 'var(--admin-font-display)',
              fontSize: '1.65rem',
              fontWeight: 700,
              color: 'var(--admin-text-main)',
              marginBottom: '0.35rem',
              letterSpacing: '-0.01em',
            }}
          >
            Management Console
          </h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.88rem' }}>
            AlGhaf Collective &bull; Content Administration
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'var(--admin-danger-tint)',
              border: '1px solid var(--admin-danger-border)',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: 'var(--admin-danger)',
              fontSize: '0.88rem',
              marginBottom: '1.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          <div>
            <label className="admin-label">Admin Email or Username</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="Enter email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.6rem' }}
                autoCapitalize="none"
                autoCorrect="off"
              />
              <Mail
                size={16}
                color="var(--admin-forest)"
                style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Secure Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="admin-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.6rem' }}
              />
              <Lock
                size={16}
                color="var(--admin-forest)"
                style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.92rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                Sign In to Console <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--admin-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.78rem',
            color: 'var(--admin-text-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={15} color="var(--admin-forest)" />
            <span>Encrypted Session &bull; Authorized Personnel Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
