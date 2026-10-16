'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Check,
  AlertCircle,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface SectionItem {
  _id?: string;
  pageSlug: string;
  sectionId: string;
  sectionName: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  mediaAlt?: string;
  videoUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  isVisible: boolean;
  displayOrder: number;
  status?: 'published' | 'draft';
}

const PAGE_OPTIONS = [
  { slug: 'all', name: 'All Pages' },
  { slug: 'home', name: 'Home (/)' },
  { slug: 'about', name: 'About (/about)' },
  { slug: 'products', name: 'Products (/products)' },
  { slug: 'mova', name: 'MOVA (/products/mova)' },
  { slug: 'penta', name: 'PENTA (/products/penta)' },
  { slug: 'entra', name: 'ENTRA (/products/entra)' },
  { slug: 'applications', name: 'Applications (/applications)' },
  { slug: 'contact', name: 'Contact (/contact)' },
];

export default function SectionManagerPage() {
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('all');
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const url =
        selectedPage === 'all'
          ? '/api/admin/sections'
          : `/api/admin/sections?pageSlug=${selectedPage}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSections(data.sections || []);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [selectedPage]);

  const handleToggleVisibility = async (sec: SectionItem) => {
    try {
      const updated = { ...sec, isVisible: !sec.isVisible };
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        setSections((prev) =>
          prev.map((s) => (s._id === sec._id ? updated : s))
        );
        setAlert({
          type: 'success',
          message: `Section "${sec.sectionName}" visibility changed to ${
            updated.isVisible ? 'Visible' : 'Hidden'
          }`,
        });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Failed to toggle visibility' });
    }
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSection) return;

    try {
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSection),
      });

      if (res.ok) {
        setModalOpen(false);
        setAlert({
          type: 'success',
          message: `Section "${currentSection.sectionName}" saved successfully!`,
        });
        fetchSections();
      } else {
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to save section' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error saving section' });
    }
  };

  const handleDeleteSection = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this section?')) return;

    try {
      const res = await fetch(`/api/admin/sections?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSections((prev) => prev.filter((s) => s._id !== id));
        setAlert({ type: 'success', message: 'Section removed successfully.' });
      } else {
        setAlert({ type: 'error', message: 'Failed to delete section' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error deleting section' });
    }
  };

  const handleDuplicate = (sec: SectionItem) => {
    const copy: SectionItem = {
      ...sec,
      _id: undefined,
      sectionId: `${sec.sectionId}-copy-${Date.now().toString().slice(-4)}`,
      sectionName: `${sec.sectionName} (Copy)`,
      displayOrder: sec.displayOrder + 1,
    };
    setCurrentSection(copy);
    setModalOpen(true);
  };

  const filteredSections = sections.filter((s) => {
    const matchesSearch =
      s.sectionName.toLowerCase().includes(search.toLowerCase()) ||
      s.sectionId.toLowerCase().includes(search.toLowerCase()) ||
      (s.title && s.title.toLowerCase().includes(search.toLowerCase())) ||
      (s.content && s.content.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <Layers style={{ color: 'var(--admin-accent-gold)', width: 24, height: 24 }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0 }}>
              Section Manager
            </h1>
          </div>
          <p style={{ color: 'var(--admin-text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Configure individual headings, narratives, media URLs, CTA actions, and visibility for every section across all pages.
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentSection({
              pageSlug: selectedPage === 'all' ? 'home' : selectedPage,
              sectionId: `sec-${Date.now().toString().slice(-6)}`,
              sectionName: 'New Architectural Section',
              eyebrow: '',
              title: '',
              subtitle: '',
              content: '',
              mediaUrl: '',
              mediaType: 'image',
              ctaText: '',
              ctaUrl: '',
              isVisible: true,
              displayOrder: sections.length,
            });
            setModalOpen(true);
          }}
          className="admin-btn admin-btn-primary"
        >
          <Plus size={16} />
          Create New Section
        </button>
      </div>

      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          <span>{alert.message}</span>
          <button
            onClick={() => setAlert(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="admin-card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div className="admin-search-bar" style={{ minWidth: '320px', flex: 1 }}>
          <Search size={18} style={{ color: 'var(--admin-text-muted)' }} />
          <input
            type="text"
            placeholder="Search sections by name, ID, title, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: 'var(--admin-accent-gold)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
            Filter by Page:
          </span>
          <select
            className="admin-select"
            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
          >
            {PAGE_OPTIONS.map((opt) => (
              <option key={opt.slug} value={opt.slug}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sections Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            <Sparkles size={24} style={{ color: 'var(--admin-accent-gold)', animation: 'spin 1s infinite' }} />
            <p style={{ marginTop: '1rem' }}>Loading registered sections...</p>
          </div>
        ) : filteredSections.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            No sections registered for this criteria. Click &ldquo;Create New Section&rdquo; or seed initial data.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Section & Identifier</th>
                <th style={{ width: '15%' }}>Page Route</th>
                <th style={{ width: '30%' }}>Headline / Text Preview</th>
                <th style={{ width: '13%' }}>Media Asset</th>
                <th style={{ width: '8%', textAlign: 'center' }}>Visible</th>
                <th style={{ width: '12%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.map((sec) => (
                <tr key={sec._id || sec.sectionId}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>
                      {sec.sectionName}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--admin-accent-gold)',
                        fontFamily: 'monospace',
                        marginTop: '0.2rem',
                      }}
                    >
                      ID: {sec.sectionId}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.25rem 0.6rem',
                        backgroundColor: 'rgba(201, 167, 121, 0.1)',
                        color: 'var(--admin-accent-gold)',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {sec.pageSlug}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        color: 'var(--admin-text-main)',
                        marginBottom: '0.2rem',
                      }}
                    >
                      {sec.title || <em style={{ color: '#666' }}>No title configured</em>}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--admin-text-muted)',
                        maxWidth: '380px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {sec.content || sec.subtitle || '—'}
                    </div>
                  </td>
                  <td>
                    {sec.mediaUrl ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img
                          src={sec.mediaUrl}
                          alt={sec.mediaAlt || sec.sectionName}
                          style={{
                            width: 36,
                            height: 24,
                            objectFit: 'cover',
                            borderRadius: '3px',
                            border: '1px solid var(--admin-border-light)',
                          }}
                          onError={(e: any) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--admin-text-muted)',
                            fontFamily: 'monospace',
                            maxWidth: '100px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {sec.mediaUrl.split('/').pop()}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>None</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleToggleVisibility(sec)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      title={sec.isVisible ? 'Hide Section' : 'Show Section'}
                    >
                      {sec.isVisible ? (
                        <Eye size={18} style={{ color: 'var(--admin-forest-light)' }} />
                      ) : (
                        <EyeOff size={18} style={{ color: 'var(--admin-danger)' }} />
                      )}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <button
                        onClick={() => {
                          setCurrentSection({ ...sec });
                          setModalOpen(true);
                        }}
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '0.4rem 0.6rem' }}
                        title="Edit Section Content"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(sec)}
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '0.4rem 0.6rem' }}
                        title="Duplicate Section"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(sec._id)}
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '0.4rem 0.6rem' }}
                        title="Delete Section"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit/Create Section Modal */}
      {modalOpen && currentSection && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                borderBottom: '1px solid var(--admin-border-light)',
                paddingBottom: '1rem',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                  {currentSection._id ? 'Edit Section' : 'Add New Section'}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--admin-accent-gold)' }}>
                  Page: {currentSection.pageSlug.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--admin-text-muted)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveSection}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="admin-label">Page Route Target</label>
                  <select
                    className="admin-select"
                    value={currentSection.pageSlug}
                    onChange={(e) =>
                      setCurrentSection({ ...currentSection, pageSlug: e.target.value })
                    }
                  >
                    {PAGE_OPTIONS.filter((p) => p.slug !== 'all').map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Internal Section ID (slug)</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={currentSection.sectionId}
                    onChange={(e) =>
                      setCurrentSection({ ...currentSection, sectionId: e.target.value })
                    }
                    placeholder="e.g. home-hero or about-vision"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="admin-label">Section Display Name</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={currentSection.sectionName}
                    onChange={(e) =>
                      setCurrentSection({ ...currentSection, sectionName: e.target.value })
                    }
                    placeholder="e.g. Hero Overview"
                  />
                </div>
                <div>
                  <label className="admin-label">Eyebrow / Sub-tagline</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={currentSection.eyebrow || ''}
                    onChange={(e) =>
                      setCurrentSection({ ...currentSection, eyebrow: e.target.value })
                    }
                    placeholder="e.g. ROOTED IN NATURE"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-label">Main Heading / Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={currentSection.title || ''}
                  onChange={(e) =>
                    setCurrentSection({ ...currentSection, title: e.target.value })
                  }
                  placeholder="Primary section headline..."
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-label">Subtitle / Key Highlight</label>
                <input
                  type="text"
                  className="admin-input"
                  value={currentSection.subtitle || ''}
                  onChange={(e) =>
                    setCurrentSection({ ...currentSection, subtitle: e.target.value })
                  }
                  placeholder="Supporting secondary line..."
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-label">Body Content / Paragraph</label>
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={currentSection.content || ''}
                  onChange={(e) =>
                    setCurrentSection({ ...currentSection, content: e.target.value })
                  }
                  placeholder="Enter full descriptive text..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="admin-label">Media Asset URL (Cloudinary or Local)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={currentSection.mediaUrl || ''}
                    onChange={(e) =>
                      setCurrentSection({ ...currentSection, mediaUrl: e.target.value })
                    }
                    placeholder="https://res.cloudinary.com/... or /assets/images/ax.jpg"
                  />
                </div>
                <div>
                  <label className="admin-label">Media Type</label>
                  <select
                    className="admin-select"
                    value={currentSection.mediaType || 'image'}
                    onChange={(e: any) =>
                      setCurrentSection({ ...currentSection, mediaType: e.target.value })
                    }
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>



              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--admin-border-light)',
                  paddingTop: '1.25rem',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={currentSection.isVisible}
                    onChange={(e) =>
                      setCurrentSection({ ...currentSection, isVisible: e.target.checked })
                    }
                  />
                  <span style={{ fontSize: '0.85rem' }}>Visible on public site</span>
                </label>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="admin-btn admin-btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    <Check size={16} />
                    Save Section
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
