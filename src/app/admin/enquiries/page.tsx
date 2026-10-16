'use client';

import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  User,
  Box,
  AlertCircle,
  Copy,
  Check,
  X,
} from 'lucide-react';

interface EnquiryItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  projectType?: string;
  product?: string;
  location?: string;
  timeline?: string;
  message?: string;
  status: 'new' | 'contacted' | 'in_progress' | 'closed';
  notes?: string;
  createdAt: string;
}

export default function EnquiriesInboxPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'in_progress' | 'closed'>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const url =
        statusFilter === 'all'
          ? `/api/admin/enquiries?search=${encodeURIComponent(search)}`
          : `/api/admin/enquiries?status=${statusFilter}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, status: string, notes?: string) => {
    try {
      setUpdatingStatus(true);
      const res = await fetch('/api/admin/enquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, notes }),
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((item) =>
            item._id === id
              ? { ...item, status: status as any, ...(notes !== undefined ? { notes } : {}) }
              : item
          )
        );
        if (selectedEnquiry?._id === id) {
          setSelectedEnquiry((prev) =>
            prev ? { ...prev, status: status as any, ...(notes !== undefined ? { notes } : {}) } : null
          );
        }
        setAlert({ type: 'success', message: 'Enquiry updated successfully.' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Failed to update enquiry' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this client enquiry record?')) return;
    try {
      const res = await fetch(`/api/admin/enquiries?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((item) => item._id !== id));
        if (selectedEnquiry?._id === id) setSelectedEnquiry(null);
        setAlert({ type: 'success', message: 'Enquiry removed successfully.' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Failed to delete' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="admin-badge admin-badge-new">New Enquiry</span>;
      case 'contacted':
        return <span className="admin-badge admin-badge-draft">Contacted</span>;
      case 'in_progress':
        return <span className="admin-badge admin-badge-draft">In Progress</span>;
      case 'closed':
        return <span className="admin-badge admin-badge-published">Closed / Converted</span>;
      default:
        return <span className="admin-badge">{status}</span>;
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner */}
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
            <MessageSquare style={{ color: 'var(--admin-accent-gold)', width: 24, height: 24 }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0 }}>
              Client Enquiries & Consultations
            </h1>
          </div>
          <p style={{ color: 'var(--admin-text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Authorised inbox capturing consultation bookings, model requests, and site evaluations from the website.
          </p>
        </div>

        <button onClick={fetchEnquiries} className="admin-btn admin-btn-secondary">
          <Sparkles size={16} />
          Refresh Inbox
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
            placeholder="Search enquiries by client name, email, phone, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') fetchEnquiries();
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: 'var(--admin-accent-gold)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
            Status:
          </span>
          <select
            className="admin-select"
            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Enquiries</option>
            <option value="new">New Only</option>
            <option value="contacted">Contacted</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            <Sparkles size={24} style={{ color: 'var(--admin-accent-gold)', animation: 'spin 1s infinite' }} />
            <p style={{ marginTop: '1rem' }}>Checking database consultations...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            No enquiries recorded matching your filters.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Client Contact</th>
                <th style={{ width: '20%' }}>Interested Model / Type</th>
                <th style={{ width: '15%' }}>Location</th>
                <th style={{ width: '15%' }}>Date Received</th>
                <th style={{ width: '13%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '12%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--admin-accent-gold)', marginTop: '0.2rem' }}>
                      {item.email}
                    </div>
                    {item.phone && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                        {item.phone}
                      </div>
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        backgroundColor: 'var(--admin-surface-muted)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--admin-text-main)',
                      }}
                    >
                      {item.product || item.projectType || 'General Consultation'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                      {item.location || 'UAE'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                      {new Date(item.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>{getStatusBadge(item.status)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <button
                        onClick={() => setSelectedEnquiry(item)}
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '0.4rem 0.5rem' }}
                        title="Delete record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content" style={{ maxWidth: '680px', borderRadius: '12px', padding: '1.75rem', backgroundColor: '#FFFFFF', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                borderBottom: '1px solid var(--admin-border-light)',
                paddingBottom: '1rem',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 700,
                    margin: 0,
                    fontFamily: "'Aftika', var(--admin-font-display), sans-serif",
                    letterSpacing: '-0.02em',
                    color: 'var(--admin-forest-dark)',
                  }}
                >
                  Enquiry: {selectedEnquiry.name}
                </h3>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--admin-forest)', backgroundColor: 'rgba(82, 105, 75, 0.08)', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontWeight: 600 }}>
                  <Clock size={12} />
                  <span>Received {new Date(selectedEnquiry.createdAt).toLocaleString('en-AE', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                style={{
                  background: 'var(--admin-surface-muted)',
                  border: '1px solid var(--admin-border-light)',
                  borderRadius: '6px',
                  color: 'var(--admin-text-main)',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* 4 Core Details Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Email Address */}
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#F8FAF6',
                  border: '1px solid var(--admin-border-light)',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--admin-forest)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.4rem',
                  }}
                >
                  <Mail size={13} /> Email Address
                </span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    style={{
                      color: 'var(--admin-forest-dark)',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      textDecoration: 'none',
                      wordBreak: 'break-all',
                    }}
                  >
                    {selectedEnquiry.email}
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedEnquiry.email, 'email')}
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '0.2rem 0.45rem', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}
                    title="Copy Email"
                  >
                    {copiedField === 'email' ? <Check size={12} style={{ color: 'var(--admin-success)' }} /> : <Copy size={12} />}
                    <span>{copiedField === 'email' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Telephone */}
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#F8FAF6',
                  border: '1px solid var(--admin-border-light)',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--admin-forest)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.4rem',
                  }}
                >
                  <Phone size={13} /> Telephone
                </span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    style={{
                      color: 'var(--admin-forest-dark)',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      textDecoration: 'none',
                    }}
                  >
                    {selectedEnquiry.phone || 'Not provided'}
                  </a>
                  {selectedEnquiry.phone && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedEnquiry.phone, 'phone')}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '0.2rem 0.45rem', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}
                      title="Copy Phone"
                    >
                      {copiedField === 'phone' ? <Check size={12} style={{ color: 'var(--admin-success)' }} /> : <Copy size={12} />}
                      <span>{copiedField === 'phone' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Target Architecture / Model */}
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#F8FAF6',
                  border: '1px solid var(--admin-border-light)',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--admin-forest)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.4rem',
                  }}
                >
                  <Box size={13} /> Target Architecture / Model
                </span>
                <div style={{ fontWeight: 700, color: 'var(--admin-forest-dark)', fontSize: '0.95rem' }}>
                  {selectedEnquiry.product || selectedEnquiry.projectType || 'General Consultation'}
                </div>
              </div>

              {/* Project Location / Emirate */}
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#F8FAF6',
                  border: '1px solid var(--admin-border-light)',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--admin-forest)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.4rem',
                  }}
                >
                  <MapPin size={13} /> Project Location / Emirate
                </span>
                <div style={{ fontWeight: 600, color: 'var(--admin-forest-dark)', fontSize: '0.92rem' }}>
                  {selectedEnquiry.location || 'United Arab Emirates'}
                </div>
              </div>
            </div>

            {/* Client Message / Project Vision */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--admin-forest)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '0.5rem',
                }}
              >
                <MessageSquare size={13} /> Client Message / Project Vision
              </span>
              <div
                style={{
                  padding: '1.15rem 1.25rem',
                  backgroundColor: '#F8FAF6',
                  border: '1px solid var(--admin-border-light)',
                  borderLeft: '4px solid var(--admin-forest)',
                  borderRadius: '8px',
                  lineHeight: 1.65,
                  fontSize: '0.92rem',
                  color: 'var(--admin-forest-dark)',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedEnquiry.message || 'No additional text message submitted.'}
              </div>
            </div>

            {/* Workflow Status Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--admin-forest)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '0.55rem',
                }}
              >
                Workflow Status
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { key: 'new', label: 'NEW', activeBg: 'var(--admin-forest)', activeColor: '#FAF8F5' },
                  { key: 'contacted', label: 'CONTACTED', activeBg: '#C08A3E', activeColor: '#FAF8F5' },
                  { key: 'in_progress', label: 'IN PROGRESS', activeBg: '#2B6699', activeColor: '#FAF8F5' },
                  { key: 'closed', label: 'CLOSED', activeBg: '#64748B', activeColor: '#FAF8F5' },
                ].map((st) => {
                  const isActive = selectedEnquiry.status === st.key;
                  return (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedEnquiry._id, st.key, selectedEnquiry.notes)}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        padding: '0.45rem 0.95rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        backgroundColor: isActive ? st.activeBg : '#FFFFFF',
                        color: isActive ? st.activeColor : 'var(--admin-text-main)',
                        border: `1.5px solid ${isActive ? st.activeBg : 'var(--admin-border-light)'}`,
                        boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Internal Administrator Notes */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--admin-forest)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '0.45rem',
                }}
              >
                Internal Administrator Notes
              </span>
              <textarea
                className="admin-textarea"
                rows={3}
                value={selectedEnquiry.notes || ''}
                onChange={(e) =>
                  setSelectedEnquiry({ ...selectedEnquiry, notes: e.target.value })
                }
                placeholder="Add private follow-up notes, call logs, or client requirements..."
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--admin-border-light)',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  fontSize: '0.88rem',
                  color: 'var(--admin-forest-dark)',
                }}
              />
              <button
                type="button"
                onClick={() =>
                  handleUpdateStatus(selectedEnquiry._id, selectedEnquiry.status, selectedEnquiry.notes)
                }
                disabled={updatingStatus}
                className="admin-btn admin-btn-primary"
                style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}
              >
                <CheckCircle size={15} />
                <span>{updatingStatus ? 'Saving Notes...' : 'Save Notes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
