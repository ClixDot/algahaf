'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Video,
  UploadCloud,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Info,
  Layers,
  FileCheck,
} from 'lucide-react';

interface MediaItem {
  _id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  resourceType: 'image' | 'video';
  bytes: number;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  folder?: string;
  references?: string[];
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MediaItem | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Upload Form
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/media?type=${filterType}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.media || []);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [filterType]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(`Transmitting ${file.name} to Cloudinary...`);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', uploadAlt || file.name);
      formData.append('caption', uploadCaption);
      formData.append('folder', 'alghaf_architecture');

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setAlert({
          type: 'success',
          message: `Asset "${file.name}" uploaded successfully to Cloudinary!`,
        });
        setUploadAlt('');
        setUploadCaption('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchMedia();
      } else {
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to upload media to Cloudinary' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Network error during upload' });
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDeleteMedia = async (id: string, publicId: string) => {
    if (!window.confirm(`Are you sure you want to delete "${publicId}" from Cloudinary and database?`)) return;

    try {
      const res = await fetch(`/api/admin/media?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m._id !== id));
        if (selectedAsset?._id === id) setSelectedAsset(null);
        setAlert({ type: 'success', message: 'Asset removed successfully.' });
      } else {
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to delete asset' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error deleting asset' });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const filteredList = mediaList.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.publicId.toLowerCase().includes(term) ||
      (item.altText && item.altText.toLowerCase().includes(term)) ||
      (item.caption && item.caption.toLowerCase().includes(term))
    );
  });

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
            <ImageIcon style={{ color: 'var(--admin-accent-gold)', width: 24, height: 24 }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0 }}>
              Cloudinary Media Library
            </h1>
          </div>
          <p style={{ color: 'var(--admin-text-muted)', margin: 0, fontSize: '0.9rem' }}>
            High-definition architectural imagery, elevations, floor plans, and video assets stored on Cloudinary.
          </p>
        </div>

        <div>
          <label
            htmlFor="media-file-input"
            className="admin-btn admin-btn-primary"
            style={{ cursor: uploading ? 'wait' : 'pointer' }}
          >
            <UploadCloud size={16} />
            {uploading ? 'Uploading to Cloudinary...' : 'Upload New Media'}
          </label>
          <input
            id="media-file-input"
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            style={{ display: 'none' }}
            disabled={uploading}
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {uploadProgress && (
        <div className="admin-alert admin-alert-success">
          <Sparkles size={16} style={{ animation: 'spin 1s infinite' }} />
          <span>{uploadProgress}</span>
        </div>
      )}

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
            placeholder="Search by filename, public ID, or alt tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: 'var(--admin-accent-gold)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
            Resource Type:
          </span>
          <select
            className="admin-select"
            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            value={filterType}
            onChange={(e: any) => setFilterType(e.target.value)}
          >
            <option value="all">All Assets</option>
            <option value="image">Images Only</option>
            <option value="video">Videos Only</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="admin-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          <Sparkles size={24} style={{ color: 'var(--admin-accent-gold)', animation: 'spin 1s infinite' }} />
          <p style={{ marginTop: '1rem' }}>Accessing Cloudinary catalog...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="admin-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          <ImageIcon size={36} style={{ color: 'var(--admin-border)', margin: '0 auto 1rem auto' }} />
          <p>No media files found matching your criteria.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredList.map((item) => (
            <div
              key={item._id}
              className="admin-card"
              style={{
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Media Thumbnail */}
              <div
                style={{
                  width: '100%',
                  height: '160px',
                  backgroundColor: '#0a0d0a',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedAsset(item)}
              >
                {item.resourceType === 'video' ? (
                  <div style={{ textAlign: 'center', color: 'var(--admin-accent-gold)' }}>
                    <Video size={40} />
                    <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Video Asset</div>
                  </div>
                ) : (
                  <img
                    src={item.secureUrl || item.url}
                    alt={item.altText || item.publicId}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                )}

                <span
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    color: 'var(--admin-accent-gold)',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  {item.format}
                </span>
              </div>

              {/* Title & Info */}
              <div style={{ padding: '0.75rem 0.25rem 0.25rem 0.25rem', flex: 1 }}>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--admin-text-main)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={item.publicId}
                >
                  {item.publicId.split('/').pop()}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--admin-text-muted)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.35rem',
                  }}
                >
                  <span>{formatFileSize(item.bytes)}</span>
                  <span>{item.resourceType}</span>
                </div>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--admin-border-light)',
                  paddingTop: '0.6rem',
                  marginTop: '0.5rem',
                }}
              >
                <button
                  onClick={() => handleCopyUrl(item.secureUrl || item.url, item._id)}
                  className="admin-btn admin-btn-secondary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  title="Copy Secure Cloudinary URL"
                >
                  {copiedId === item._id ? (
                    <>
                      <Check size={13} style={{ color: '#72D48C' }} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy URL
                    </>
                  )}
                </button>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <a
                    href={item.secureUrl || item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '0.35rem 0.5rem' }}
                    title="Open Full Resolution Asset"
                  >
                    <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => handleDeleteMedia(item._id, item.publicId)}
                    className="admin-btn admin-btn-danger"
                    style={{ padding: '0.35rem 0.5rem' }}
                    title="Delete Asset"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Detail Modal */}
      {selectedAsset && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content" style={{ maxWidth: '750px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                borderBottom: '1px solid var(--admin-border-light)',
                paddingBottom: '0.75rem',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                Asset Details & Metadata
              </h3>
              <button
                onClick={() => setSelectedAsset(null)}
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

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              {selectedAsset.resourceType === 'video' ? (
                <video
                  src={selectedAsset.secureUrl || selectedAsset.url}
                  controls
                  style={{ maxHeight: '320px', maxWidth: '100%', borderRadius: '8px' }}
                />
              ) : (
                <img
                  src={selectedAsset.secureUrl || selectedAsset.url}
                  alt={selectedAsset.altText || selectedAsset.publicId}
                  style={{ maxHeight: '320px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }}
                />
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span className="admin-label">Public ID</span>
                <input type="text" readOnly className="admin-input" value={selectedAsset.publicId} />
              </div>
              <div>
                <span className="admin-label">Cloudinary Secure URL</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" readOnly className="admin-input" value={selectedAsset.secureUrl || selectedAsset.url} />
                  <button
                    onClick={() => handleCopyUrl(selectedAsset.secureUrl || selectedAsset.url, selectedAsset._id)}
                    className="admin-btn admin-btn-secondary"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div>
                <span className="admin-label">File Size / Format</span>
                <div style={{ padding: '0.65rem 1rem', backgroundColor: 'var(--admin-surface-muted)', border: '1px solid var(--admin-border-light)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--admin-forest-dark)', fontWeight: 600 }}>
                  {formatFileSize(selectedAsset.bytes)} ({selectedAsset.format.toUpperCase()})
                </div>
              </div>
              <div>
                <span className="admin-label">Created At</span>
                <div style={{ padding: '0.65rem 1rem', backgroundColor: 'var(--admin-surface-muted)', border: '1px solid var(--admin-border-light)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--admin-forest-dark)' }}>
                  {new Date(selectedAsset.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setSelectedAsset(null)}
                className="admin-btn admin-btn-primary"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
