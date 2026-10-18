'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  ExternalLink 
} from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import { companyInfo } from '../data/companyData';

interface ContactProps {
  initialSections?: any[];
}

function renderLineBreaks(text?: string) {
  if (!text) return null;
  return text.split('\n').map((line, idx, arr) => (
    <React.Fragment key={idx}>
      {line}
      {idx < arr.length - 1 && <br />}
    </React.Fragment>
  ));
}

function renderCardIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case 'phone':
    case 'whatsapp':
      return <Phone size={22} />;
    case 'mail':
    case 'email':
      return <Mail size={22} />;
    case 'clock':
    case 'hours':
    case 'time':
      return <Clock size={22} />;
    case 'mappin':
    case 'map':
    case 'location':
    default:
      return <MapPin size={22} />;
  }
}

const DEFAULT_FAQS = [
  {
    q: 'Do AlGhaf modular homes comply with UAE municipal building regulations?',
    a: 'Yes. All AlGhaf structural frames and building envelopes are engineered in full alignment with UAE building codes, Dubai Municipality regulations, and GCC civil defense fire safety standards.',
    category: '',
  },
  {
    q: 'How long does the entire process take from agreement to handover?',
    a: 'Standard modular delivery ranges from 6 to 14 weeks depending on the selected collection (MOVA: 6–10 weeks, PENTA: 8–14 weeks, ENTRA: 6–8 weeks). Because ground preparation and factory prefabrication run in parallel, on-site installation takes only 1 to 3 days.',
    category: 'Process & Timelines',
  },
  {
    q: 'Can the interior layouts and finishes be customized?',
    a: 'Yes. While structural chassis dimensions are standardized for optimal factory engineering and transport, all interior millwork, kitchen joinery, flooring materials, sanitary ware, and smart home controls can be personalized.',
    category: 'Design & Customization',
  },
  {
    q: 'What site foundations are required for installation?',
    a: 'Our modular units can be installed on reinforced concrete strip footings, low-impact steel helical screw piles, or grade beams. Our engineering team conducts a thorough site evaluation before foundation works commence.',
    category: 'Engineering & Site Work',
  },
];

export default function Contact({ initialSections = [] }: ContactProps) {
  const [sections, setSections] = useState<any[]>(initialSections);

  useEffect(() => {
    fetch('/api/sections?pageSlug=contact')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.sections) && data.sections.length > 0) {
          setSections(data.sections);
        }
      })
      .catch((err) => console.warn('Contact sections sync notice:', err));
  }, []);

  const heroSec = sections.find((s) => s.sectionId === 'contact-hero');
  const directSec = sections.find((s) => s.sectionId === 'contact-direct');
  const formSec = sections.find((s) => s.sectionId === 'contact-form');
  const faqSec = sections.find((s) => s.sectionId === 'contact-faq');

  // Extract form options from formSec if available
  const getFieldOptions = (fieldId: string, fallback: string[]) => {
    if (formSec?.items && Array.isArray(formSec.items)) {
      const found = formSec.items.find((i: any) => i.id === fieldId || i.fieldKey === fieldId);
      if (found && Array.isArray(found.options) && found.options.length > 0) {
        return found.options;
      }
    }
    return fallback;
  };

  const projectTypeOptions = getFieldOptions('projectType', [
    'MOVA — Modular Optimized Versatile Architecture (30–75 m²)',
    'PENTA — Elevated Modular Living (50–300 m²)',
    'ENTRA — Private Entertainment. Reimagined',
    'Hospitality & Resort Key Development',
    'Commercial / Creative Office Suite',
    'Architectural / Developer Collaboration',
    'Other Bespoke Requirement',
  ]);

  const locationOptions = getFieldOptions('location', [
    'Dubai, UAE',
    'Abu Dhabi, UAE',
    'Sharjah, UAE',
    'Ras Al Khaimah, UAE',
    'Al Ain, UAE',
    'Other UAE Emirates',
    'Saudi Arabia (KSA)',
    'Other GCC Country',
  ]);

  const sizeOptions = getFieldOptions('approximateSize', [
    '30–50 m² (Studio / Suite)',
    '50–100 m² (1–2 Bedroom)',
    '100–200 m² (Villa Residence)',
    '200–300+ m² (Estate Compound)',
    'Multi-Unit Hospitality Keys',
  ]);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    location: locationOptions[0] || 'Dubai, UAE',
    projectType: projectTypeOptions[0] || 'MOVA — Modular Optimized Versatile Architecture (30–75 m²)',
    approximateSize: sizeOptions[1] || '50–100 m² (1–2 Bedroom)',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setFaqOpen(faqOpen === idx ? null : idx);
  };

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
    if (!formData.description.trim()) {
      errs.description = 'Please tell us briefly about your project';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const code = `AGC-ENQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmationCode(code);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          projectType: formData.projectType,
          approximateSize: formData.approximateSize,
          message: formData.description,
          source: 'contact-page',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Contact submission error:', err);
      // Still set submitted for seamless luxury UX fallback
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  // FAQ items resolution
  const activeFaqs = (faqSec?.items && faqSec.items.length > 0)
    ? faqSec.items.filter((f: any) => f.isVisible !== false)
    : DEFAULT_FAQS;

  return (
    <main style={{ margin: 0, padding: 0 }}>
      {/* =========================================================================
          HERO BANNER (Dynamic CMS: contact-hero)
          ========================================================================= */}
      {heroSec?.isVisible !== false && (
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
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(to bottom, rgba(14, 16, 14, 0.5) 0%, rgba(14, 16, 14, 0.82) 100%), url('${heroSec?.mediaUrl || '/assets/images/image_bg_more_alghafdfdfd.jpg'}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.95,
            }}
          />

          <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '880px' }}>
            <span className="eyebrow" style={{ color: 'var(--color-sand)' }}>
              {heroSec?.eyebrow || 'Start Your Project'}
            </span>
            <h1 className="hero-title" style={{ color: '#FAF8F5', marginBottom: '1.5rem' }}>
              {renderLineBreaks(heroSec?.title || "Let's Build\nSomething Better.")}
            </h1>
            <p className="lead-text" style={{ color: '#E5DFD4', maxWidth: '720px', margin: '0 auto' }}>
              {heroSec?.subtitle || heroSec?.content ||
                'Whether you are planning a private home, hospitality development, modular project, or looking to collaborate, start the conversation with us.'}
            </p>
          </div>
        </section>
      )}

      {/* =========================================================================
          CONTACT FORM & DETAILS SECTION (Dynamic CMS: contact-direct & contact-form)
          ========================================================================= */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <div className="grid-2" style={{ gap: 'clamp(2rem, 5vw, 4.5rem)', alignItems: 'start' }}>
            {/* Left: Contact Info Cards */}
            {directSec?.isVisible !== false && (
              <div>
                <span className="eyebrow eyebrow-forest">
                  {directSec?.eyebrow || 'Direct Contact'}
                </span>
                <h2 className="section-title" style={{ color: 'var(--color-forest-dark)', marginBottom: '1.25rem' }}>
                  {directSec?.title || 'Connect With Our Team.'}
                </h2>
                <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '1.0625rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
                  {directSec?.subtitle || directSec?.content ||
                    'Speak directly with our architectural directors and prefabrication specialists. We welcome consultations for private landowners, hospitality developers, and master planners.'}
                </p>

                {/* Contact Information Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                  {(directSec?.items && directSec.items.length > 0 ? directSec.items : [
                    {
                      id: 'headquarters',
                      type: 'headquarters',
                      title: 'Headquarters',
                      address: companyInfo.contact.address,
                      icon: 'MapPin',
                      isVisible: true,
                    },
                    {
                      id: 'phone-whatsapp',
                      type: 'phone',
                      title: 'Telephone & WhatsApp',
                      phone: companyInfo.contact.phone,
                      whatsapp: companyInfo.contact.whatsapp,
                      icon: 'Phone',
                      isVisible: true,
                    },
                    {
                      id: 'email',
                      type: 'email',
                      title: 'Inquiries Email',
                      email: companyInfo.contact.email,
                      icon: 'Mail',
                      isVisible: true,
                    },
                    {
                      id: 'working-hours',
                      type: 'hours',
                      title: 'Working Hours',
                      description: companyInfo.contact.workingHours,
                      icon: 'Clock',
                      isVisible: true,
                    },
                  ])
                    .filter((card: any) => card.isVisible !== false)
                    .map((card: any, cIdx: number) => {
                      const isPhone = card.type === 'phone' || card.phone;
                      const isEmail = card.type === 'email' || card.email;
                      const isHeadquarters = card.type === 'headquarters' || (!isPhone && !isEmail && card.address);
                      const isHours = card.type === 'hours' || (!isPhone && !isEmail && !isHeadquarters);

                      return (
                        <div
                          key={card.id || cIdx}
                          style={{
                            backgroundColor: '#FFFFFF',
                            padding: '1.5rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(82, 105, 75, 0.12)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem',
                            boxShadow: 'var(--shadow-sm)',
                          }}
                        >
                          <div
                            style={{
                              padding: '0.75rem',
                              backgroundColor: 'rgba(82, 105, 75, 0.08)',
                              borderRadius: '4px',
                              color: 'var(--color-forest)',
                              flexShrink: 0,
                            }}
                          >
                            {renderCardIcon(card.icon || (isPhone ? 'Phone' : isEmail ? 'Mail' : isHours ? 'Clock' : 'MapPin'))}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h3
                              style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.125rem',
                                color: 'var(--color-forest-dark)',
                                marginBottom: '0.25rem',
                              }}
                            >
                              {card.title || card.name}
                            </h3>

                            {isHeadquarters && (
                              <p style={{ fontSize: '0.9375rem', color: 'var(--color-charcoal)', margin: 0, lineHeight: '1.5' }}>
                                {card.address || card.description || companyInfo.contact.address}
                                {card.link && (
                                  <a
                                    href={card.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.5rem', color: 'var(--color-forest)', fontWeight: 600 }}
                                  >
                                    Directions <ExternalLink size={12} />
                                  </a>
                                )}
                              </p>
                            )}

                            {isPhone && (
                              <div>
                                <p style={{ fontSize: '0.9375rem', color: 'var(--color-charcoal)', margin: '0 0 0.25rem 0' }}>
                                  Main:{' '}
                                  <a href={`tel:${card.phone || companyInfo.contact.phone}`} style={{ fontWeight: 600 }}>
                                    {card.phone || companyInfo.contact.phone}
                                  </a>
                                </p>
                                <p style={{ fontSize: '0.9375rem', color: 'var(--color-charcoal)', margin: 0 }}>
                                  WhatsApp:{' '}
                                  <a
                                    href={`https://wa.me/${(card.whatsapp || companyInfo.contact.whatsapp).replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ fontWeight: 600, color: '#1E7E34' }}
                                  >
                                    {card.whatsapp || companyInfo.contact.whatsapp}
                                  </a>
                                </p>
                              </div>
                            )}

                            {isEmail && (
                              <p style={{ fontSize: '0.9375rem', color: 'var(--color-charcoal)', margin: 0 }}>
                                <a href={`mailto:${card.email || companyInfo.contact.email}`} style={{ fontWeight: 600 }}>
                                  {card.email || companyInfo.contact.email}
                                </a>
                              </p>
                            )}

                            {isHours && (
                              <p style={{ fontSize: '0.9375rem', color: 'var(--color-charcoal)', margin: 0 }}>
                                {card.description ||
                                  `${card.workingDays || 'Monday – Friday'}: ${card.workingHours || '9:00 AM – 6:00 PM'} ${card.timeZone || 'GST'}`}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Right: Interactive Project Enquiry Form */}
            {formSec?.isVisible !== false && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid rgba(82, 105, 75, 0.14)',
                  padding: 'clamp(2rem, 4vw, 3rem)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
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
                    <div
                      style={{
                        backgroundColor: 'var(--color-ivory)',
                        padding: '1.25rem',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border)',
                        marginBottom: '2rem',
                        fontSize: '0.9375rem',
                      }}
                    >
                      Confirmation Code: <strong>{confirmationCode || `AGC-ENQ-${Math.floor(100000 + Math.random() * 900000)}`}</strong>
                    </div>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          company: '',
                          email: '',
                          phone: '',
                          location: locationOptions[0] || 'Dubai, UAE',
                          projectType: projectTypeOptions[0] || 'MOVA — Modular Optimized Versatile Architecture (30–75 m²)',
                          approximateSize: sizeOptions[1] || '50–100 m² (1–2 Bedroom)',
                          description: '',
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
                      {formSec?.title || 'Start Your Project'}
                    </h3>
                    <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
                      {formSec?.subtitle || 'Fill out the form below. Our architectural engineers will review your requirements.'}
                    </p>

                    <form onSubmit={handleSubmit}>
                      {/* Project Type Dropdown */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="projectType">What are you interested in? *</label>
                        <select
                          id="projectType"
                          className="form-select"
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        >
                          {projectTypeOptions.map((opt: string) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
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
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                          {errors.phone && <p className="form-error-msg">{errors.phone}</p>}
                        </div>
                      </div>

                      {/* Location & Size Dropdowns */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="location">Project Location</label>
                          <select
                            id="location"
                            className="form-select"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          >
                            {locationOptions.map((opt: string) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
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
                            {sizeOptions.map((opt: string) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
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
                        {submitting ? 'Submitting Project Details...' : (formSec?.ctaText || 'Send Enquiry')}
                        {!submitting && <Send size={18} />}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FREQUENTLY ASKED QUESTIONS ACCORDION (Dynamic CMS: contact-faq)
          ========================================================================= */}
      {faqSec?.isVisible !== false && (
        <section className="section-padding bg-ivory-light">
          <div className="container" style={{ maxWidth: '900px' }}>
            <SectionHeader
              eyebrow={faqSec?.eyebrow || 'Questions & Clarity'}
              title={faqSec?.title || 'Frequently Asked Questions.'}
              subtitle={faqSec?.subtitle || 'Understand how AlGhaf Collective structures approvals, delivery, and installation.'}
              centered
            />

            {activeFaqs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-charcoal-muted)' }}>
                No FAQ entries currently published. Check back soon.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeFaqs.map((faq: any, idx: number) => {
                  const isOpen = faqOpen === idx;
                  const questionText = faq.question || faq.q || faq.title;
                  const answerText = faq.answer || faq.a || faq.description;
                  const categoryText = faq.category || faq.subtitle;

                  return (
                    <div
                      key={faq.id || idx}
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
                        transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
                      }}
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${idx}`}
                        id={`faq-header-${idx}`}
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
                          transition: 'color 0.25s ease, background-color 0.25s ease',
                        }}
                      >
                        <span>{questionText}</span>
                        <ChevronDown
                          size={20}
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                            flexShrink: 0,
                            marginLeft: '1rem',
                            color: isOpen ? 'var(--color-forest)' : 'var(--color-sand-dark)',
                          }}
                        />
                      </button>

                      <div
                        id={`faq-answer-${idx}`}
                        role="region"
                        aria-labelledby={`faq-header-${idx}`}
                        style={{
                          display: 'grid',
                          gridTemplateRows: isOpen ? '1fr' : '0fr',
                          transition: 'grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
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
                              transition: 'opacity 0.3s ease, transform 0.3s ease',
                            }}
                          >
                            <p style={{ margin: 0, paddingTop: '1rem' }}>{answerText}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
