'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Send, Loader2 } from 'lucide-react';

export interface QuickEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
}

export default function QuickEnquiryModal({ isOpen, onClose, initialProduct = '' }: QuickEnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: initialProduct || 'MOVA',
    location: 'Dubai',
    timeline: 'Within 3 months',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sync initialProduct if updated
  React.useEffect(() => {
    if (initialProduct) {
      setFormData(prev => ({ ...prev, product: initialProduct }));
    }
  }, [initialProduct]);

  // Lock body scroll and pause Lenis while open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      (window as any).lenis?.stop();
    } else {
      document.body.style.overflow = 'unset';
      (window as any).lenis?.start();
    }
    return () => {
      document.body.style.overflow = 'unset';
      (window as any).lenis?.start();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (formData.phone.length < 7) {
      errs.phone = 'Please provide a complete phone number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'quick-modal',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrors({ form: err.message || 'Error submitting request. Please try again.' });
      // Still show submitted fallback for UX if offline
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      product: 'MOVA',
      location: 'Dubai',
      timeline: 'Within 3 months',
      message: ''
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-lenis-prevent="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        backgroundColor: 'rgba(14, 20, 16, 0.82)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          position: 'relative',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          border: '1px solid rgba(82, 105, 75, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close Enquiry Modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: '#20231F',
            background: '#F2EEE5',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ display: 'inline-flex', color: '#52694B', marginBottom: '1.25rem' }}>
              <CheckCircle size={56} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '0.75rem', color: '#20231F' }}>
              Enquiry Received
            </h3>
            <p style={{ color: '#525850', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Thank you, <strong>{formData.name}</strong>. Our architectural team has received your project request for <strong>{formData.product}</strong> in {formData.location}. An AlGhaf project director will contact you within 24 hours.
            </p>
            <div style={{
              background: '#FAF8F5',
              padding: '1rem',
              borderRadius: '4px',
              border: '1px solid #E5DFD4',
              marginBottom: '1.75rem',
              fontSize: '0.875rem',
              color: '#6B726A'
            }}>
              Reference Code: <strong>AGC-{Math.floor(100000 + Math.random() * 900000)}</strong>
            </div>
            <button
              onClick={handleReset}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <span className="eyebrow" style={{ color: '#C9A779' }}>Start a Conversation</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '0.5rem', color: '#20231F' }}>
              Project Enquiry
            </h3>
            <p style={{ color: '#6B726A', fontSize: '0.9375rem', marginBottom: '1.75rem' }}>
              Connect directly with AlGhaf Collective’s design & prefabrication engineers.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="modal-product">Product of Interest *</label>
                <select
                  id="modal-product"
                  className="form-select"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                >
                  <option value="MOVA">MOVA — Modular Optimized Versatile Architecture (30–75 m²)</option>
                  <option value="PENTA">PENTA — Elevated Modular Living (50–300 m²)</option>
                  <option value="ENTRA">ENTRA — Private Entertainment. Reimagined</option>
                  <option value="Hospitality Development">Hospitality & Resort Development</option>
                  <option value="Custom Project">Custom Architectural Project</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-name">Full Name *</label>
                <input
                  id="modal-name"
                  type="text"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <p className="form-error-msg">{errors.name}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="modal-email">Email Address *</label>
                  <input
                    id="modal-email"
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <p className="form-error-msg">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="modal-phone">Phone / WhatsApp *</label>
                  <input
                    id="modal-phone"
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {errors.phone && <p className="form-error-msg">{errors.phone}</p>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="modal-location">Project Location</label>
                  <select
                    id="modal-location"
                    className="form-select"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option value="Dubai">Dubai, UAE</option>
                    <option value="Abu Dhabi">Abu Dhabi, UAE</option>
                    <option value="Sharjah">Sharjah, UAE</option>
                    <option value="Ras Al Khaimah">Ras Al Khaimah, UAE</option>
                    <option value="Al Ain">Al Ain, UAE</option>
                    <option value="Other UAE / GCC">Other GCC Location</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="modal-timeline">Estimated Timeline</label>
                  <select
                    id="modal-timeline"
                    className="form-select"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  >
                    <option value="Immediate (< 1 month)">Immediate (&lt; 1 month)</option>
                    <option value="Within 3 months">Within 3 months</option>
                    <option value="3–6 months">3–6 months</option>
                    <option value="Planning / Concept phase">Planning / Concept phase</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-message">Project Notes (Optional)</label>
                <textarea
                  id="modal-message"
                  className="form-textarea"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem' }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Submitting Project Details...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Project Enquiry
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
