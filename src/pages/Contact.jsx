import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  MessageCircle, 
  AlertCircle, 
  HelpCircle, 
  ChevronDown 
} from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import { companyInfo } from '../data/companyData';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    location: 'Dubai',
    projectType: 'MOVA (30–75 m²)',
    approximateSize: '50–100 m²',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFaq = (idx) => {
    setFaqOpen(faqOpen === idx ? null : idx);
  };

  const validate = () => {
    const errs = {};
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
    if (!formData.description.trim()) {
      errs.description = 'Please tell us briefly about your project';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Real client simulation for frontend build
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const faqs = [
    {
      q: 'Do AlGhaf modular homes comply with UAE municipal building regulations?',
      a: 'Yes. All AlGhaf structural frames and building envelopes are engineered in full alignment with UAE building codes, Dubai Municipality regulations, and GCC civil defense fire safety standards.'
    },
    {
      q: 'How long does the entire process take from agreement to handover?',
      a: 'Standard modular delivery ranges from 6 to 14 weeks depending on the selected collection (MOVA: 6–10 weeks, PENTA: 8–14 weeks, ENTRA: 6–8 weeks). Because ground preparation and factory prefabrication run in parallel, on-site installation takes only 1 to 3 days.'
    },
    {
      q: 'Can the interior layouts and finishes be customized?',
      a: 'Yes. While structural chassis dimensions are standardized for optimal factory engineering and transport, all interior millwork, kitchen joinery, flooring materials, sanitary ware, and smart home controls can be personalized.'
    },
    {
      q: 'What site foundations are required for installation?',
      a: 'Our modular units can be installed on reinforced concrete strip footings, low-impact steel helical screw piles, or grade beams. Our engineering team conducts a thorough site evaluation before foundation works commence.'
    }
  ];

  return (
    <main style={{ margin: 0, padding: 0 }}>
      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          minHeight: 'clamp(520px, 62vh, 700px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 'clamp(8rem, 14vh, 10.5rem)',
          paddingBottom: 'clamp(5rem, 9vh, 7rem)',
          backgroundColor: '#141713',
          color: '#FAF8F5',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(to bottom, rgba(14, 16, 14, 0.5) 0%, rgba(14, 16, 14, 0.82) 100%), url('/assets/images/image_bg_more_alghafdfdfd.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.95
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '880px' }}>
          <span className="eyebrow" style={{ color: 'var(--color-sand)' }}>
            Start Your Project
          </span>
          <h1 className="hero-title" style={{ color: '#FAF8F5', marginBottom: '1.5rem' }}>
            Let's Build<br />Something Better.
          </h1>
          <p className="lead-text" style={{ color: '#E5DFD4', maxWidth: '720px', margin: '0 auto' }}>
            Whether you are planning a private home, hospitality development, modular project, or looking to collaborate, start the conversation with us.
          </p>
        </div>
      </section>

      {/* =========================================================================
          CONTACT FORM & DETAILS SECTION
          ========================================================================= */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <div className="grid-2" style={{ gap: 'clamp(2rem, 5vw, 4.5rem)', alignItems: 'start' }}>
            {/* Left: Contact Info Cards */}
            <div>
              <span className="eyebrow eyebrow-forest">Direct Contact</span>
              <h2 className="section-title" style={{ color: 'var(--color-forest-dark)', marginBottom: '1.25rem' }}>
                Connect With Our Team.
              </h2>
              <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '1.0625rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
                Speak directly with our architectural directors and prefabrication specialists. We welcome consultations for private landowners, hospitality developers, and master planners.
              </p>

              {/* Contact Information Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '1.5rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(82, 105, 75, 0.12)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(82, 105, 75, 0.08)', borderRadius: '4px', color: 'var(--color-forest)' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--color-forest-dark)', marginBottom: '0.25rem' }}>
                      Headquarters
                    </h3>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--color-charcoal)', margin: 0, lineHeight: '1.5' }}>
                      {companyInfo.contact.address}
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '1.5rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(82, 105, 75, 0.12)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(82, 105, 75, 0.08)', borderRadius: '4px', color: 'var(--color-forest)' }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--color-forest-dark)', marginBottom: '0.25rem' }}>
                      Telephone & WhatsApp
                    </h3>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--color-charcoal)', margin: '0 0 0.25rem 0' }}>
                      Main: <a href={`tel:${companyInfo.contact.phone}`} style={{ fontWeight: 600 }}>{companyInfo.contact.phone}</a>
                    </p>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--color-charcoal)', margin: 0 }}>
                      WhatsApp: <a href={`https://wa.me/${companyInfo.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: '#1E7E34' }}>{companyInfo.contact.whatsapp}</a>
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '1.5rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(82, 105, 75, 0.12)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(82, 105, 75, 0.08)', borderRadius: '4px', color: 'var(--color-forest)' }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--color-forest-dark)', marginBottom: '0.25rem' }}>
                      Inquiries Email
                    </h3>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--color-charcoal)', margin: 0 }}>
                      <a href={`mailto:${companyInfo.contact.email}`} style={{ fontWeight: 600 }}>{companyInfo.contact.email}</a>
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '1.5rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(82, 105, 75, 0.12)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(82, 105, 75, 0.08)', borderRadius: '4px', color: 'var(--color-forest)' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--color-forest-dark)', marginBottom: '0.25rem' }}>
                      Working Hours
                    </h3>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--color-charcoal)', margin: 0 }}>
                      {companyInfo.contact.workingHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Project Enquiry Form */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid rgba(82, 105, 75, 0.14)',
              padding: 'clamp(2rem, 4vw, 3rem)',
              boxShadow: 'var(--shadow-md)'
            }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ display: 'inline-flex', color: 'var(--color-forest)', marginBottom: '1.5rem' }}>
                    <CheckCircle size={64} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-forest-dark)', marginBottom: '1rem' }}>
                    Enquiry Successfully Sent
                  </h3>
                  <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '1.0625rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                    Thank you, <strong>{formData.name}</strong>. Your enquiry regarding <strong>{formData.projectType}</strong> has been logged. An AlGhaf project coordinator will be in touch within 24 business hours.
                  </p>
                  <div style={{
                    backgroundColor: 'var(--color-ivory)',
                    padding: '1.25rem',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border)',
                    marginBottom: '2rem',
                    fontSize: '0.9375rem'
                  }}>
                    Confirmation Code: <strong>AGC-ENQ-{Math.floor(100000 + Math.random() * 900000)}</strong>
                  </div>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        company: '',
                        email: '',
                        phone: '',
                        location: 'Dubai',
                        projectType: 'MOVA (30–75 m²)',
                        approximateSize: '50–100 m²',
                        description: ''
                      });
                    }}
                    className="btn btn-outline-dark"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-forest-dark)', marginBottom: '0.5rem' }}>
                    Start Your Project
                  </h3>
                  <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
                    Fill out the form below. Our architectural engineers will review your requirements.
                  </p>

                  <form onSubmit={handleSubmit}>
                    {/* Project Type */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="projectType">What are you interested in? *</label>
                      <select
                        id="projectType"
                        className="form-select"
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      >
                        <option value="MOVA (30–75 m²)">MOVA — Modular Optimized Versatile Architecture (30–75 m²)</option>
                        <option value="PENTA (50–300 m²)">PENTA — Elevated Modular Living (50–300 m²)</option>
                        <option value="ENTRA">ENTRA — Private Entertainment. Reimagined</option>
                        <option value="Hospitality Resort">Hospitality & Resort Key Development</option>
                        <option value="Commercial Development">Commercial / Creative Office Suite</option>
                        <option value="Collaboration">Architectural / Developer Collaboration</option>
                        <option value="Other">Other Bespoke Requirement</option>
                      </select>
                    </div>

                    {/* Name & Company */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="name">Full Name *</label>
                        <input
                          id="name"
                          type="text"
                          className={`form-input ${errors.name ? 'error' : ''}`}
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        {errors.name && <p className="form-error-msg">{errors.name}</p>}
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="company">Company (Optional)</label>
                        <input
                          id="company"
                          type="text"
                          className="form-input"
                          placeholder="Company or Family Office"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address *</label>
                        <input
                          id="email"
                          type="email"
                          className={`form-input ${errors.email ? 'error' : ''}`}
                          placeholder="name@domain.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && <p className="form-error-msg">{errors.email}</p>}
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="phone">Phone / WhatsApp *</label>
                        <input
                          id="phone"
                          type="tel"
                          className={`form-input ${errors.phone ? 'error' : ''}`}
                          placeholder="+971 50 000 0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        {errors.phone && <p className="form-error-msg">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Location & Size */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="location">Project Location</label>
                        <select
                          id="location"
                          className="form-select"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        >
                          <option value="Dubai">Dubai, UAE</option>
                          <option value="Abu Dhabi">Abu Dhabi, UAE</option>
                          <option value="Sharjah">Sharjah, UAE</option>
                          <option value="Ras Al Khaimah">Ras Al Khaimah, UAE</option>
                          <option value="Al Ain">Al Ain, UAE</option>
                          <option value="Fujairah / Ajman / UAQ">Other UAE Emirates</option>
                          <option value="Saudi Arabia (KSA)">Saudi Arabia (KSA)</option>
                          <option value="Other GCC Region">Other GCC Country</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="approximateSize">Approximate Size</label>
                        <select
                          id="approximateSize"
                          className="form-select"
                          value={formData.approximateSize}
                          onChange={(e) => setFormData({ ...formData, approximateSize: e.target.value })}
                        >
                          <option value="30–50 m²">30–50 m² (Studio / Suite)</option>
                          <option value="50–100 m²">50–100 m² (1–2 Bedroom)</option>
                          <option value="100–200 m²">100–200 m² (Villa Residence)</option>
                          <option value="200–300+ m²">200–300+ m² (Estate Compound)</option>
                          <option value="Multi-Unit Development">Multi-Unit Hospitality Keys</option>
                        </select>
                      </div>
                    </div>

                    {/* Tell Us About Your Project */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="description">Tell Us About Your Project *</label>
                      <textarea
                        id="description"
                        rows={4}
                        className={`form-textarea ${errors.description ? 'error' : ''}`}
                        placeholder="Plot status, intended purpose, timeline, or specific architectural questions..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                      {errors.description && <p className="form-error-msg">{errors.description}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', marginTop: '0.5rem' }}
                    >
                      {submitting ? 'Submitting Project Details...' : 'Send Enquiry'}
                      {!submitting && <Send size={18} />}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FREQUENTLY ASKED QUESTIONS ACCORDION
          ========================================================================= */}
      <section className="section-padding bg-ivory-light">
        <div className="container" style={{ maxWidth: '900px' }}>
          <SectionHeader
            eyebrow="Questions & Clarity"
            title="Frequently Asked Questions."
            subtitle="Understand how AlGhaf Collective structures approvals, delivery, and installation."
            centered
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: isOpen 
                      ? '1px solid rgba(82, 105, 75, 0.28)' 
                      : '1px solid rgba(82, 105, 75, 0.12)',
                    overflow: 'hidden',
                    boxShadow: isOpen 
                      ? '0 6px 20px rgba(82, 105, 75, 0.08)' 
                      : 'var(--shadow-sm)',
                    transition: 'border-color 0.35s ease, box-shadow 0.35s ease'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '1.35rem 1.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.0625rem',
                      fontWeight: 700,
                      color: isOpen ? 'var(--color-forest)' : 'var(--color-forest-dark)',
                      cursor: 'pointer',
                      backgroundColor: isOpen ? 'rgba(82, 105, 75, 0.02)' : 'transparent',
                      border: 'none',
                      transition: 'color 0.25s ease, background-color 0.25s ease'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={20}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                        flexShrink: 0,
                        marginLeft: '1rem',
                        color: isOpen ? 'var(--color-forest)' : 'var(--color-sand-dark)'
                      }}
                    />
                  </button>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      transition: 'grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div style={{ overflow: 'hidden' }}>
                      <div
                        style={{
                          padding: '0 1.75rem 1.5rem 1.75rem',
                          color: 'var(--color-charcoal-muted)',
                          fontSize: '0.9375rem',
                          lineHeight: '1.7',
                          borderTop: '1px solid rgba(82, 105, 75, 0.08)',
                          opacity: isOpen ? 1 : 0,
                          transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
                          transition: 'opacity 0.3s ease, transform 0.3s ease'
                        }}
                      >
                        <p style={{ margin: 0, paddingTop: '1rem' }}>{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
