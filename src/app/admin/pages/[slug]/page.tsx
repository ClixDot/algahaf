'use client';

import React, { useEffect, useState, use, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Eye,
  Layers,
  MoveUp,
  MoveDown,
  EyeOff,
  Edit2,
  Trash2,
  Plus,
  Sparkles,
  ExternalLink,
  Image as ImageIcon,
  Check,
  AlertCircle,
  UploadCloud,
  Video,
  Search,
  Filter,
  RefreshCw,
  Sliders,
  X,
  FileText,
  HelpCircle,
  Play,
  Copy,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';
import { applicationsData } from '../../../../data/applicationsData';

interface SectionItem {
  _id?: string;
  pageSlug: string;
  sectionId: string;
  sectionName: string;
  thumbnailUrl?: string;
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
  items?: Array<Record<string, any>>;
  isVisible: boolean;
  displayOrder: number;
  status?: 'published' | 'draft';
  draftContent?: Record<string, any>;
  publishedAt?: string | Date;
  lastDraftAt?: string | Date;
}

interface PageData {
  _id?: string;
  slug: string;
  title: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  status: 'published' | 'draft';
}

// Helper to robustly identify Hero slider sections
const isHeroSection = (sec: any) => {
  if (!sec) return false;
  const sid = (sec.sectionId || sec.id || '').toLowerCase();
  const sname = (sec.sectionName || sec.title || '').toLowerCase();
  const slug = (sec.pageSlug || '').toLowerCase();
  if (sid === 'applications-hero') return false;
  if (sid === 'home-hero' || (slug === 'home' && (sec.displayOrder === 1 || sid.includes('hero')))) return true;
  return false;
};

// Helper to get clean, simple page titles across all admin UI (Home, About, Products, etc.)
export const getCleanSlugTitle = (slugStr: string, rawTitle?: string) => {
  const s = (slugStr || '').toLowerCase().trim();
  if (s === 'home') return 'Home';
  if (s === 'about') return 'About';
  if (s === 'products') return 'Products';
  if (s === 'applications') return 'Applications';
  if (s === 'contact') return 'Contact';
  if (s === 'mova') return 'MOVA';
  if (s === 'penta') return 'PENTA';
  if (s === 'entra') return 'ENTRA';
  if (rawTitle) return rawTitle.split(/ [—–-] /)[0].trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Page';
};

// Helper to check if a section actually uses section-level background/featured media on the live website
const sectionHasMedia = (sec: any) => {
  if (!sec) return false;
  const sid = (sec.sectionId || sec.id || '').trim().toLowerCase();

  // Multi-slide hero sections manage images inside the Hero Slider Images tab, not single media
  if (isHeroSection(sec)) return false;

  // Sections that explicitly DO NOT have any section-level background/image on the live website
  const noMediaSections = [
    'about-stats',          // 3 Metric Cards only (50%, 1, 30-300 m²)
    'about-origin',         // Editorial story text only (no media)
    'home-philosophy',      // 4 Pillar icon cards (Comfort, Quality, Speed, Value)
    'home-products',        // Products cards have item images, section has NO section-level media
    'home-applications',    // Application cards have item images, section has NO section-level media
    'contact-direct',       // Contact info cards (HQ, phone, email, hours)
    'contact-form',         // Interactive enquiry form fields
    'contact-faq',          // FAQ accordion items
    'products-comparison',  // Modular comparison table
    'applications-categories', // Category filter pills (no section background)
    'applications-cards',      // Application cards have individual images (no section-level media)
  ];

  if (noMediaSections.includes(sid)) return false;

  // Sections that definitely HAVE section media/background on the live website
  const hasMediaSections = [
    'home-origin',          // Right-side desert landscape background
    'home-process',         // "How We Build" video & background poster
    'home-closing',         // "Live Better" closing background photography
    'about-hero',           // About hero banner photography
    'about-philosophy',     // Right-side botanical photography
    'about-office',         // Interactive Google Map & office building photo
    'about-closing',        // About closing CTA background photography
    'contact-hero',         // Contact hero banner photography
    'products-hero',        // Products hero banner photography
    'process-hero',         // Process hero banner photography
    'applications-hero',    // Applications hero banner photography
  ];

  if (hasMediaSections.includes(sid)) return true;

  if (sid.includes('closing') || sid.includes('banner')) return true;

  return false;
};

// Helper to strictly check if cards/items of this section actually use images on the live website
const sectionItemsHaveImages = (sec: any) => {
  if (!sec) return false;
  const sid = (sec.sectionId || sec.id || '').trim().toLowerCase();

  // Multi-slide hero sections definitely use slide images
  if (isHeroSection(sec)) return true;

  // Sections whose cards/items definitely have images on the live website:
  if (
    sid === 'home-products' ||
    sid === 'home-applications' ||
    sid.includes('products-list') ||
    sid.includes('products-catalog') ||
    sid.includes('catalog') ||
    sid.includes('applications-grid') ||
    sid.includes('applications-cards') ||
    sid.includes('gallery') ||
    sid.includes('renders')
  ) {
    return true;
  }

  // ALL OTHER SECTIONS DO NOT HAVE CARD IMAGES:
  // - home-philosophy (Core Pillars: Comfort, Quality, Speed, Value -> Icons + text only)
  // - home-process (Process Steps -> Step number + title + description only)
  // - about-stats (Metric cards: 50%, 1, 30–300 m² -> Stat number + title + description only)
  // - about-philosophy (Value pillars -> Title + description only)
  // - contact-direct (HQ, Phone, Email, Hours -> Title + value only)
  // - contact-form (Form fields -> Label + type only)
  // - contact-faq (Q&A Accordion -> Question + answer only)
  // - products-comparison (Specs table -> Spec + values only)
  return false;
};

// Helper to strictly check if cards/items of this section actually use clickable links on the live website
const sectionItemsHaveLinks = (sec: any) => {
  if (!sec) return false;
  const sid = (sec.sectionId || sec.id || '').trim().toLowerCase();

  if (
    sid === 'home-products' ||
    sid === 'home-applications' ||
    sid.includes('products-list') ||
    sid.includes('products-catalog') ||
    sid.includes('catalog') ||
    sid.includes('applications-grid') ||
    sid.includes('applications-cards')
  ) {
    return true;
  }

  return false;
};

export default function PageEditor({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [page, setPage] = useState<PageData>({
    slug,
    title: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
    status: 'published',
  });

  const [sections, setSections] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'visible' | 'hidden'>('all');
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Section Editing Modal
  const [editingSection, setEditingSection] = useState<SectionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'items'>('content');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaUploadError, setMediaUploadError] = useState<string | null>(null);
  const [slideUploadingIndex, setSlideUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addNewHeroSlide = () => {
    if (!editingSection) return;
    const currentItems = editingSection.items || [];
    const nextNum = currentItems.length + 1;
    const sampleImages = [
      '/assets/images/hero1.jpeg',
      '/assets/images/hero 2.png',
      '/assets/images/hero3.jpeg',
      '/assets/renders/MOVA_EXT_3D_img1.jpg',
      '/assets/renders/CINE_EXT_3D_img1.jpg',
    ];
    const pickedImage = sampleImages[(nextNum - 1) % sampleImages.length];

    const newSlide = {
      id: `hero-${Date.now()}`,
      title: `Hero Image ${nextNum}`,
      label: `Hero Image ${nextNum}`,
      url: pickedImage,
      image: pickedImage,
      position: 'center 42%',
      isVisible: true,
      order: nextNum,
    };

    setEditingSection({
      ...editingSection,
      items: [...currentItems, newSlide],
    });
  };

  const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideIdx: number) => {
    const file = e.target.files?.[0];
    if (!file || !editingSection) return;

    if (file.size > 25 * 1024 * 1024) {
      setAlert({ type: 'error', message: 'File size exceeds 25MB limit.' });
      return;
    }

    try {
      setSlideUploadingIndex(slideIdx);
      const sid = (editingSection.sectionId || '').toLowerCase();
      let folderName = 'alghaf_website';
      if (sid.includes('application')) folderName = 'alghaf_applications';
      else if (sid.includes('product')) folderName = 'alghaf_products';
      else if (isHeroSection(editingSection)) folderName = 'alghaf_hero_slides';

      const currentItem = editingSection.items?.[slideIdx];
      const itemName = currentItem?.title || currentItem?.name || currentItem?.label || `Item #${slideIdx + 1}`;
      const altText = `${editingSection.sectionName} - ${itemName}`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folderName);
      formData.append('altText', altText);

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.media?.secureUrl || data.media?.url;

        const newItems = [...(editingSection.items || [])];
        newItems[slideIdx] = {
          ...newItems[slideIdx],
          url: uploadedUrl,
          image: uploadedUrl,
          heroImage: uploadedUrl,
          mediaUrl: uploadedUrl,
        };

        const updatedSec = { ...editingSection, items: newItems };
        if (slideIdx === 0 && isHeroSection(editingSection)) {
          updatedSec.mediaUrl = uploadedUrl;
          updatedSec.thumbnailUrl = uploadedUrl;
        }

        setEditingSection(updatedSec);
        setAlert({
          type: 'success',
          message: `Photo for "${itemName}" uploaded to Cloudinary successfully!`,
        });
      } else {
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to upload image' });
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Error uploading image' });
    } finally {
      setSlideUploadingIndex(null);
      e.target.value = '';
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!editingSection?.items) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= editingSection.items.length) return;
    const newItems = [...editingSection.items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    newItems.forEach((it, i) => {
      it.order = i + 1;
    });
    setEditingSection({ ...editingSection, items: newItems });
  };

  const duplicateItem = (index: number) => {
    if (!editingSection?.items) return;
    const itemToCopy = editingSection.items[index];
    const clone = {
      ...itemToCopy,
      id: `${itemToCopy.id || 'item'}-${Date.now()}`,
      title: `${itemToCopy.title || itemToCopy.label || itemToCopy.question || 'Item'} (Copy)`,
      label: itemToCopy.label ? `${itemToCopy.label} (Copy)` : undefined,
      question: itemToCopy.question ? `${itemToCopy.question} (Copy)` : undefined,
      order: (itemToCopy.order || index + 1) + 1,
    };
    const newItems = [...editingSection.items];
    newItems.splice(index + 1, 0, clone);
    newItems.forEach((it, i) => {
      it.order = i + 1;
    });
    setEditingSection({ ...editingSection, items: newItems });
  };

  // Helper to render the comprehensive Application Detail Page Content Editor (/applications/[slug])
  const renderApplicationDetailEditor = (item: any, idx: number, sectionKey: string) => {
    if (!editingSection) return null;

    const defaultApp = applicationsData.find((a) =>
      a.id === item.id ||
      (item.id === 'hospitality-resorts' && a.id === 'hospitality') ||
      (item.id === 'farm-living-estates' && a.id === 'farm-living') ||
      (item.id === 'eco-developments' && a.id === 'eco-retreats') ||
      a.title?.toLowerCase() === item.title?.toLowerCase()
    ) || applicationsData[idx % applicationsData.length];

    const detailSlug =
      item.id === 'hospitality-resorts' ? 'hospitality' :
      item.id === 'farm-living-estates' ? 'farm-living' :
      item.id === 'eco-developments' ? 'eco-retreats' :
      item.id || defaultApp.id;

    const detailUrl = `/applications/${detailSlug}`;

    const heroEyebrowVal = item.heroEyebrow !== undefined ? item.heroEyebrow : defaultApp.heroEyebrow || `APPLICATIONS — ${(item.category || defaultApp.category || 'RESIDENTIAL').toUpperCase()}`;
    const heroTitleVal = item.heroTitle !== undefined ? item.heroTitle : defaultApp.heroTitle || item.title || defaultApp.title;
    const heroDescVal = item.heroDesc !== undefined ? item.heroDesc : defaultApp.heroDesc || item.description || defaultApp.description;
    const heroImgVal = item.detailHeroImage || item.image || item.url || defaultApp.image;

    const originEyebrowVal = item.originEyebrow !== undefined ? item.originEyebrow : defaultApp.originEyebrow || `OUR ${(item.category || defaultApp.category || 'RESIDENTIAL').toUpperCase()} VISION`;
    const originHeadlineVal = item.originHeadline !== undefined ? item.originHeadline : defaultApp.originHeadline || 'Harmonious Living. Built for the UAE.';

    const paragraphs: string[] = Array.isArray(item.storyParagraphs) && item.storyParagraphs.length > 0
      ? item.storyParagraphs
      : typeof item.storyParagraphs === 'string' && item.storyParagraphs.trim()
      ? item.storyParagraphs.split('\n\n').filter(Boolean)
      : (defaultApp.storyParagraphs || [
          'The Ghaf tree has thrived in the UAE’s desert for generations — resilient and sustaining life in the harshest conditions. Inspired by that enduring spirit, AlGhaf modular residences are engineered to harmonize with the desert while delivering absolute luxury and thermal serenity.',
          'From primary luxury desert residences to estate guest pavilions and independent family annexes, our modular homes offer expansive double-height volumes, floor-to-ceiling desert-tested glass facades, cantilevered pergolas for natural solar shading, and bespoke interiors completed with turnkey precision.',
          'Bringing this vision together with the design, prefabrication, and modular construction expertise of CK Living Concepts, AlGhaf Collective delivers precision-engineered homes up to 50% faster than conventional on-site construction — fully customizable from 30 m² to 300 m².'
        ]);

    const isUploading = slideUploadingIndex === idx;

    return (
      <div
        style={{
          borderTop: '2px solid rgba(82, 105, 75, 0.18)',
          backgroundColor: '#FAF8F5',
          padding: '1.25rem',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            paddingBottom: '0.85rem',
            marginBottom: '1.15rem',
            borderBottom: '1px solid rgba(82, 105, 75, 0.14)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'var(--admin-accent-gold)',
                color: '#1E231D',
                fontWeight: 700,
                fontSize: '0.75rem',
                padding: '0.22rem 0.65rem',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <FileText size={13} /> Detail Page Content
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--admin-forest-dark)' }}>
              Live Route:
            </span>
            <code
              style={{
                fontSize: '0.82rem',
                backgroundColor: 'rgba(82, 105, 75, 0.1)',
                color: 'var(--admin-forest-dark)',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 600,
              }}
            >
              {detailUrl}
            </code>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href={detailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                color: 'var(--admin-forest)',
                borderColor: 'var(--admin-forest)',
                padding: '0.3rem 0.65rem',
                textDecoration: 'none',
              }}
              title="Open public detail page in a new browser tab"
            >
              <ExternalLink size={13} /> View Live Detail Page
            </a>
          </div>
        </div>

        {/* SECTION 1: HERO BANNER SETTINGS */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--admin-border-light)',
            borderRadius: '8px',
            padding: '1rem 1.15rem',
            marginBottom: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
            <span
              style={{
                backgroundColor: 'var(--admin-forest)',
                color: '#FFF',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: '3px',
              }}
            >
              01
            </span>
            <h5 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: 'var(--admin-forest-dark)' }}>
              Detail Page Hero Header (Top Full-Bleed Banner)
            </h5>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1rem', marginBottom: '0.85rem' }}>
            <div>
              <label className="admin-label">Hero Eyebrow (Category Header)</label>
              <input
                type="text"
                className="admin-input"
                value={heroEyebrowVal}
                onChange={(e) => {
                  const newItems = [...(editingSection.items || [])];
                  newItems[idx] = { ...newItems[idx], heroEyebrow: e.target.value };
                  setEditingSection({ ...editingSection, items: newItems });
                }}
                placeholder="e.g. APPLICATIONS — RESIDENTIAL"
              />
            </div>

            <div>
              <label className="admin-label">
                Hero Main Headline / Title (Supports multi-line with Enter)
              </label>
              <textarea
                rows={2}
                className="admin-textarea"
                style={{ minHeight: '42px', resize: 'vertical' }}
                value={heroTitleVal}
                onChange={(e) => {
                  const newItems = [...(editingSection.items || [])];
                  newItems[idx] = { ...newItems[idx], heroTitle: e.target.value };
                  setEditingSection({ ...editingSection, items: newItems });
                }}
                placeholder="Modular Homes &\nPrivate Residences."
              />
            </div>
          </div>

          <div style={{ marginBottom: '0.85rem' }}>
            <label className="admin-label">Hero Subtitle / Narrative Description</label>
            <textarea
              rows={2}
              className="admin-textarea"
              value={heroDescVal}
              onChange={(e) => {
                const newItems = [...(editingSection.items || [])];
                newItems[idx] = { ...newItems[idx], heroDesc: e.target.value };
                setEditingSection({ ...editingSection, items: newItems });
              }}
              placeholder="A UAE-rooted modular architecture and construction approach..."
            />
          </div>

          {/* Hero Background Image Controls */}
          <div
            style={{
              backgroundColor: 'rgba(82, 105, 75, 0.04)',
              border: '1px solid var(--admin-border-light)',
              borderRadius: '6px',
              padding: '0.85rem',
              display: 'grid',
              gridTemplateColumns: '110px 1fr',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '110px',
                height: '70px',
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundColor: '#1E231D',
                border: '1px solid var(--admin-border-light)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImgVal}
                alt={item.title || 'Detail Hero'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultApp.image;
                }}
              />
            </div>

            <div>
              <label className="admin-label" style={{ marginBottom: '0.35rem' }}>
                Detail Page Hero Background Photography
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="text"
                  className="admin-input"
                  style={{ flex: '1 1 240px', fontSize: '0.82rem' }}
                  value={heroImgVal}
                  onChange={(e) => {
                    const newItems = [...(editingSection.items || [])];
                    newItems[idx] = { ...newItems[idx], detailHeroImage: e.target.value, image: e.target.value };
                    setEditingSection({ ...editingSection, items: newItems });
                  }}
                  placeholder="/assets/images/... or Cloudinary URL"
                />

                <input
                  type="file"
                  accept="image/*"
                  id={`detail-hero-upload-${sectionKey}-${idx}`}
                  style={{ display: 'none' }}
                  disabled={isUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      setSlideUploadingIndex(idx);
                      const formData = new FormData();
                      formData.append('file', file);
                      formData.append('folder', 'alghaf_applications');
                      formData.append('altText', `${item.title || 'Application'} Hero Banner`);
                      const res = await fetch('/api/admin/media', { method: 'POST', body: formData });
                      if (res.ok) {
                        const data = await res.json();
                        const uploadedUrl = data.media?.secureUrl || data.media?.url;
                        const newItems = [...(editingSection.items || [])];
                        newItems[idx] = {
                          ...newItems[idx],
                          detailHeroImage: uploadedUrl,
                          image: uploadedUrl,
                        };
                        setEditingSection({ ...editingSection, items: newItems });
                        setAlert({ type: 'success', message: 'Hero banner photo uploaded successfully!' });
                      } else {
                        const err = await res.json();
                        setAlert({ type: 'error', message: err.error || 'Failed to upload photo' });
                      }
                    } catch (err: any) {
                      setAlert({ type: 'error', message: err.message || 'Error uploading photo' });
                    } finally {
                      setSlideUploadingIndex(null);
                    }
                  }}
                />

                <label
                  htmlFor={`detail-hero-upload-${sectionKey}-${idx}`}
                  className="admin-btn admin-btn-primary"
                  style={{
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.78rem',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isUploading ? <RefreshCw className="animate-spin" size={13} /> : <UploadCloud size={13} />}
                  {isUploading ? 'Uploading...' : 'Upload Hero Photo'}
                </label>

                {item.image && heroImgVal !== item.image && (
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = [...(editingSection.items || [])];
                      newItems[idx] = { ...newItems[idx], detailHeroImage: item.image };
                      setEditingSection({ ...editingSection, items: newItems });
                    }}
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem' }}
                    title="Set detail hero image to match card image"
                  >
                    Use Card Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: EDITORIAL VISION & STORY SECTION */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--admin-border-light)',
            borderRadius: '8px',
            padding: '1rem 1.15rem',
            marginBottom: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
            <span
              style={{
                backgroundColor: 'var(--admin-forest)',
                color: '#FFF',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: '3px',
              }}
            >
              02
            </span>
            <h5 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: 'var(--admin-forest-dark)' }}>
              Editorial Story & Vision Section (Second Section Below Hero)
            </h5>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1rem', marginBottom: '0.85rem' }}>
            <div>
              <label className="admin-label">Vision Left-Column Eyebrow Anchor</label>
              <input
                type="text"
                className="admin-input"
                value={originEyebrowVal}
                onChange={(e) => {
                  const newItems = [...(editingSection.items || [])];
                  newItems[idx] = { ...newItems[idx], originEyebrow: e.target.value };
                  setEditingSection({ ...editingSection, items: newItems });
                }}
                placeholder="e.g. OUR RESIDENTIAL VISION"
              />
            </div>

            <div>
              <label className="admin-label">Vision Main Heading / Headline</label>
              <input
                type="text"
                className="admin-input"
                value={originHeadlineVal}
                onChange={(e) => {
                  const newItems = [...(editingSection.items || [])];
                  newItems[idx] = { ...newItems[idx], originHeadline: e.target.value };
                  setEditingSection({ ...editingSection, items: newItems });
                }}
                placeholder="e.g. Harmonious Living. Built for the UAE."
              />
            </div>
          </div>

          {/* Story Paragraphs Editor */}
          <div style={{ marginTop: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>
                Narrative Story Paragraphs ({paragraphs.length})
              </label>
              <button
                type="button"
                onClick={() => {
                  const newParas = [...paragraphs, ''];
                  const newItems = [...(editingSection.items || [])];
                  newItems[idx] = { ...newItems[idx], storyParagraphs: newParas };
                  setEditingSection({ ...editingSection, items: newItems });
                }}
                className="admin-btn admin-btn-secondary"
                style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Plus size={13} /> Add Paragraph
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {paragraphs.map((paraText, pIdx) => (
                <div
                  key={pIdx}
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'flex-start',
                    backgroundColor: 'var(--admin-surface-muted)',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--admin-border-light)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--admin-forest)',
                      padding: '0.2rem 0.45rem',
                      backgroundColor: 'rgba(82, 105, 75, 0.1)',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      marginTop: '0.2rem',
                    }}
                  >
                    P{pIdx + 1}
                  </span>

                  <textarea
                    rows={3}
                    className="admin-textarea"
                    style={{ flex: 1, fontSize: '0.82rem', lineHeight: 1.45 }}
                    value={paraText}
                    onChange={(e) => {
                      const newParas = [...paragraphs];
                      newParas[pIdx] = e.target.value;
                      const newItems = [...(editingSection.items || [])];
                      newItems[idx] = { ...newItems[idx], storyParagraphs: newParas };
                      setEditingSection({ ...editingSection, items: newItems });
                    }}
                    placeholder={`Paragraph ${pIdx + 1} content...`}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <button
                      type="button"
                      disabled={pIdx === 0}
                      onClick={() => {
                        if (pIdx === 0) return;
                        const newParas = [...paragraphs];
                        const temp = newParas[pIdx - 1];
                        newParas[pIdx - 1] = newParas[pIdx];
                        newParas[pIdx] = temp;
                        const newItems = [...(editingSection.items || [])];
                        newItems[idx] = { ...newItems[idx], storyParagraphs: newParas };
                        setEditingSection({ ...editingSection, items: newItems });
                      }}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '0.2rem 0.35rem', opacity: pIdx === 0 ? 0.3 : 1 }}
                      title="Move Up"
                    >
                      <MoveUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={pIdx === paragraphs.length - 1}
                      onClick={() => {
                        if (pIdx === paragraphs.length - 1) return;
                        const newParas = [...paragraphs];
                        const temp = newParas[pIdx + 1];
                        newParas[pIdx + 1] = newParas[pIdx];
                        newParas[pIdx] = temp;
                        const newItems = [...(editingSection.items || [])];
                        newItems[idx] = { ...newItems[idx], storyParagraphs: newParas };
                        setEditingSection({ ...editingSection, items: newItems });
                      }}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '0.2rem 0.35rem', opacity: pIdx === paragraphs.length - 1 ? 0.3 : 1 }}
                      title="Move Down"
                    >
                      <MoveDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (paragraphs.length <= 1) {
                          const newItems = [...(editingSection.items || [])];
                          newItems[idx] = { ...newItems[idx], storyParagraphs: [''] };
                          setEditingSection({ ...editingSection, items: newItems });
                          return;
                        }
                        const newParas = paragraphs.filter((_, i) => i !== pIdx);
                        const newItems = [...(editingSection.items || [])];
                        newItems[idx] = { ...newItems[idx], storyParagraphs: newParas };
                        setEditingSection({ ...editingSection, items: newItems });
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--admin-danger)',
                        cursor: 'pointer',
                        padding: '0.2rem',
                      }}
                      title="Delete Paragraph"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const fetchPageDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/pages/${slug}`);
      if (res.ok) {
        const data = await res.json();
        if (data.page) {
          setPage(data.page);
        }
        if (data.sections && data.sections.length > 0) {
          setSections(data.sections);
        }
      }
    } catch (e: any) {
      console.error('Error fetching page details:', e);
      setAlert({ type: 'error', message: 'Could not load page data. Using cached state.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageDetails();
  }, [slug]);

  useEffect(() => {
    if (editingSection && isHeroSection(editingSection) && activeTab === 'media') {
      setActiveTab('items');
    } else if (editingSection && !sectionHasMedia(editingSection) && activeTab === 'media') {
      setActiveTab(editingSection.items && editingSection.items.length > 0 ? 'items' : 'content');
    }
  }, [editingSection, activeTab]);

  // Publish All Sections & Page to Live
  const handlePublishToLive = async () => {
    try {
      setPublishing(true);
      const res = await fetch(`/api/admin/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageSlug: slug, action: 'publish_all' }),
      });

      if (res.ok) {
        // Also update page status
        await fetch(`/api/admin/pages/${slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...page, status: 'published', action: 'publish' }),
        });

        setPage((prev) => ({ ...prev, status: 'published' }));
        setSections((prev) =>
          prev.map((s) => ({ ...s, status: 'published', draftContent: undefined }))
        );
        setAlert({
          type: 'success',
          message: `🎉 All ${sections.length} sections published to live website! Public changes are now active.`,
        });
      } else {
        setAlert({ type: 'error', message: 'Failed to publish changes to live website.' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error publishing page' });
    } finally {
      setPublishing(false);
    }
  };

  // Save Page Meta (or Draft)
  const handleSavePageMeta = async (newStatus: 'published' | 'draft' = 'draft') => {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...page,
          status: newStatus,
          action: newStatus === 'published' ? 'publish' : 'save_draft',
        }),
      });

      if (res.ok) {
        setPage((prev) => ({ ...prev, status: newStatus }));
        setAlert({
          type: 'success',
          message:
            newStatus === 'published'
              ? 'Page published successfully to live website!'
              : 'Page draft settings saved successfully.',
        });
      } else {
        setAlert({ type: 'error', message: 'Failed to save page changes' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error saving page' });
    } finally {
      setSaving(false);
    }
  };

  // Toggle Visibility
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
          prev.map((s) => (s.sectionId === sec.sectionId ? updated : s))
        );
        setAlert({
          type: 'success',
          message: `Section "${sec.sectionName}" is now ${
            updated.isVisible ? 'Visible' : 'Hidden'
          } on public website.`,
        });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error updating section visibility' });
    }
  };

  // Reorder Sections
  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    const updated = newSections.map((sec, idx) => ({ ...sec, displayOrder: idx + 1 }));
    setSections(updated);

    try {
      const orders = updated.map((sec) => ({
        sectionId: sec.sectionId,
        displayOrder: sec.displayOrder,
      }));

      await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageSlug: slug, orders }),
      });

      setAlert({ type: 'success', message: 'Section order updated and saved.' });
    } catch (e: any) {
      console.error('Reorder error:', e);
    }
  };

  // Save Modal Section (Draft or Published)
  const handleSaveModalSection = async (publishNow: boolean = false) => {
    if (!editingSection) return;

    try {
      setSaving(true);
      const payload = {
        ...editingSection,
        status: publishNow ? 'published' : 'draft',
        action: publishNow ? 'publish' : 'save_draft',
      };

      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const saved = data.section || payload;
        setSections((prev) => {
          const exists = prev.some((s) => s.sectionId === saved.sectionId);
          if (exists) {
            return prev.map((s) => (s.sectionId === saved.sectionId ? saved : s));
          }
          return [...prev, saved];
        });
        setIsModalOpen(false);
        setEditingSection(null);
        setAlert({
          type: 'success',
          message: publishNow
            ? `Section "${saved.sectionName}" published live successfully!`
            : `Draft saved for section "${saved.sectionName}".`,
        });
      } else {
        setAlert({ type: 'error', message: 'Failed to save section changes' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error saving section' });
    } finally {
      setSaving(false);
    }
  };

  // Cloudinary Direct File Upload
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'mediaUrl' | 'videoUrl' = 'mediaUrl') => {
    const file = e.target.files?.[0];
    if (!file || !editingSection) return;

    // Validate size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      setMediaUploadError('File size exceeds 25MB limit.');
      return;
    }

    try {
      setUploadingMedia(true);
      setMediaUploadError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'alghaf_website');
      formData.append('altText', editingSection.sectionName);

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.media.secureUrl || data.media.url;
        const isVideo = file.type.startsWith('video/');

        setEditingSection((prev) => {
          if (!prev) return null;
          if (targetField === 'videoUrl') {
            return { ...prev, videoUrl: uploadedUrl, mediaType: 'video' };
          }
          return {
            ...prev,
            mediaUrl: uploadedUrl,
            thumbnailUrl: isVideo ? prev.thumbnailUrl : uploadedUrl,
            mediaType: isVideo ? 'video' : 'image',
          };
        });

        setAlert({
          type: 'success',
          message: `Asset "${file.name}" uploaded to Cloudinary successfully!`,
        });
      } else {
        const err = await res.json();
        setMediaUploadError(err.error || 'Failed to upload asset to Cloudinary');
      }
    } catch (err: any) {
      setMediaUploadError(err.message || 'Media upload error');
    } finally {
      setUploadingMedia(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Filter sections by search and visibility
  const filteredSections = sections.filter((sec) => {
    const matchesSearch =
      sec.sectionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.sectionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sec.title && sec.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sec.eyebrow && sec.eyebrow.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterVisibility === 'visible') return matchesSearch && sec.isVisible;
    if (filterVisibility === 'hidden') return matchesSearch && !sec.isVisible;
    return matchesSearch;
  });

  const liveUrl = slug === 'home' ? '/' : `/${slug}`;

  return (
    <div style={{ padding: '2rem', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header & Breadcrumb */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--admin-border-light)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            href="/admin/pages"
            className="admin-btn admin-btn-secondary"
            style={{ padding: '0.5rem 0.75rem' }}
            title="Back to Pages list"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 700,
                  margin: 0,
                  color: 'var(--admin-forest-dark)',
                  fontFamily: "'Aftika', var(--admin-font-display), sans-serif",
                  letterSpacing: '-0.02em',
                }}
              >
                {slug === 'home'
                  ? 'Home'
                  : slug === 'about'
                  ? 'About'
                  : slug === 'products'
                  ? 'Products'
                  : slug === 'applications'
                  ? 'Applications'
                  : slug === 'contact'
                  ? 'Contact'
                  : slug === 'mova'
                  ? 'MOVA'
                  : slug === 'penta'
                  ? 'PENTA'
                  : slug === 'entra'
                  ? 'ENTRA'
                  : (page.title ? page.title.split(/ [—–-] /)[0].trim() : `${slug.charAt(0).toUpperCase() + slug.slice(1)}`)}
              </h1>
              <span
                className={`admin-badge ${
                  page.status === 'published' ? 'admin-badge-published' : 'admin-badge-draft'
                }`}
              >
                {page.status === 'published' ? 'Live & Published' : 'Draft Mode'}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--admin-accent-gold)', marginTop: '0.25rem' }}>
              {sections.length} Configured Sections
            </div>
          </div>
        </div>

        {/* Global Page Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Eye size={15} />
            Live Preview
          </a>
          <button
            onClick={() => handleSavePageMeta('draft')}
            disabled={saving || publishing}
            className="admin-btn admin-btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Save size={15} />
            Save Draft
          </button>
          <button
            onClick={handlePublishToLive}
            disabled={saving || publishing}
            className="admin-btn admin-btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <CheckCircle size={16} />
            {publishing ? 'Publishing Live...' : 'Publish to Live Website'}
          </button>
        </div>
      </div>

      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`} style={{ marginBottom: '1.5rem' }}>
          <span>{alert.message}</span>
          <button
            onClick={() => setAlert(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Sections Visual Manager (Full Width) */}
      <div>
        {/* Section Toolbar: Search, Filters & Quick Add */}
          <div
            className="admin-card"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1.25rem',
              padding: '1rem 1.25rem',
            }}
          >
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--admin-text-muted)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search section by name, headline or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-input"
                  style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setFilterVisibility('all')}
                className={`admin-btn ${filterVisibility === 'all' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              >
                All ({sections.length})
              </button>
              <button
                onClick={() => setFilterVisibility('visible')}
                className={`admin-btn ${filterVisibility === 'visible' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              >
                Visible ({sections.filter((s) => s.isVisible).length})
              </button>
              <button
                onClick={() => setFilterVisibility('hidden')}
                className={`admin-btn ${filterVisibility === 'hidden' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              >
                Hidden ({sections.filter((s) => !s.isVisible).length})
              </button>
            </div>
          </div>

          {/* Section Cards List (Rendered in Public Display Order) */}
          {loading ? (
            <div className="admin-card" style={{ textAlign: 'center', padding: '3.5rem' }}>
              <RefreshCw className="animate-spin" size={28} style={{ color: 'var(--admin-accent-gold)', margin: '0 auto 1rem auto' }} />
              <p style={{ color: 'var(--admin-text-muted)' }}>Loading Home sections...</p>
            </div>
          ) : filteredSections.length === 0 ? (
            <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Layers size={32} style={{ color: 'var(--admin-border)', margin: '0 auto 1rem auto' }} />
              <p style={{ color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>
                No matching sections found.
              </p>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="admin-btn admin-btn-secondary">
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredSections.map((sec, idx) => {
                const previewImg = sec.thumbnailUrl || sec.mediaUrl || (sec.items && sec.items[0]?.url) || (sec.items && sec.items[0]?.image) || '/assets/images/ax.jpg';
                const isDraft = sec.status === 'draft';
                const itemsCount = sec.items && Array.isArray(sec.items) ? sec.items.length : 0;

                return (
                  <div
                    key={sec.sectionId}
                    className="admin-card"
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1.25rem',
                      borderLeft: sec.isVisible
                        ? '4px solid var(--admin-forest)'
                        : '4px solid #D5CDBD',
                      opacity: sec.isVisible ? 1 : 0.65,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Left: Visual Preview Thumbnail & Section Details */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {/* Section Order Badge */}
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--admin-surface-muted)',
                          border: '1px solid var(--admin-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--admin-forest)',
                        }}
                      >
                        {sec.displayOrder || idx + 1}
                      </div>

                      {/* Visual Section Thumbnail */}
                      {sec.sectionId === 'contact-faq' ? (
                        <div
                          style={{
                            width: '100px',
                            height: '68px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(82, 105, 75, 0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--admin-border)',
                            color: 'var(--admin-forest)',
                            gap: '0.25rem',
                            flexShrink: 0,
                          }}
                        >
                          <HelpCircle size={22} />
                          <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.04em' }}>FAQ LIST</span>
                        </div>
                      ) : (
                        <div
                          style={{
                            width: '100px',
                            height: '68px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            backgroundColor: '#20231F',
                            position: 'relative',
                            border: '1px solid var(--admin-border)',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={previewImg}
                            alt={sec.sectionName}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          {sec.mediaType === 'video' && (
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFF',
                              }}
                            >
                              <Play size={16} fill="#FFF" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Section Content & Badges */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0, color: 'var(--admin-text-main)' }}>
                            {sec.sectionName}
                          </h3>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontFamily: 'monospace',
                              padding: '0.12rem 0.45rem',
                              backgroundColor: 'var(--admin-surface-muted)',
                              border: '1px solid var(--admin-border)',
                              borderRadius: '4px',
                              color: 'var(--admin-text-muted)',
                            }}
                          >
                            #{sec.sectionId}
                          </span>
                          {isDraft && (
                            <span className="admin-badge admin-badge-draft" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                              Draft Edits
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', maxWidth: '520px', lineHeight: 1.4 }}>
                          {sec.eyebrow && <span style={{ fontWeight: 600, color: 'var(--admin-accent-gold)', marginRight: '0.4rem' }}>{sec.eyebrow} &bull;</span>}
                          {sec.title ? sec.title.replace('\n', ' ') : sec.subtitle || sec.content || 'Configured Section'}
                        </div>

                        {/* Extra metadata tags */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                          {itemsCount > 0 && (
                            <span>
                              &bull; {itemsCount}{' '}
                              {sec.sectionId === 'home-hero'
                                ? 'Scenes'
                                : sec.sectionId === 'home-philosophy'
                                ? 'Pillars'
                                : sec.sectionId === 'home-process'
                                ? 'Steps'
                                : sec.sectionId === 'home-products'
                                ? 'Products'
                                : sec.sectionId === 'home-applications'
                                ? 'Bento Typologies'
                                : sec.sectionId === 'contact-faq'
                                ? 'FAQs'
                                : sec.sectionId === 'contact-form'
                                ? 'Form Fields'
                                : sec.sectionId === 'contact-direct'
                                ? 'Contact Cards'
                                : sec.sectionId === 'products-comparison'
                                ? 'Specs'
                                : 'Items'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {/* Visibility Toggle */}
                      <button
                        onClick={() => handleToggleVisibility(sec)}
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '0.45rem 0.65rem' }}
                        title={sec.isVisible ? 'Hide from public website' : 'Show on public website'}
                      >
                        {sec.isVisible ? (
                          <Eye size={16} style={{ color: 'var(--admin-forest)' }} />
                        ) : (
                          <EyeOff size={16} style={{ color: 'var(--admin-danger)' }} />
                        )}
                      </button>

                      {/* Manage Media Shortcut, Manage FAQs, or Manage Hero Slides */}
                      {sec.sectionId === 'contact-faq' ? (
                        <button
                          onClick={() => {
                            setEditingSection({ ...sec });
                            setActiveTab('items');
                            setIsModalOpen(true);
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
                          title="Manage FAQ Questions & Answers"
                        >
                          <HelpCircle size={15} />
                          Manage FAQs
                        </button>
                      ) : sec.sectionId === 'home-hero' ? (
                        <button
                          onClick={() => {
                            setEditingSection({ ...sec });
                            setActiveTab('items');
                            setIsModalOpen(true);
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            borderColor: 'var(--admin-forest)',
                            color: 'var(--admin-forest)',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                          title="Manage Hero Slides & Image Previews"
                        >
                          <Sparkles size={15} />
                          Hero Slides ({sec.items?.length || 3})
                        </button>
                      ) : sec.sectionId === 'home-products' ? (
                        <button
                          onClick={() => {
                            setEditingSection({ ...sec });
                            setActiveTab('items');
                            setIsModalOpen(true);
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            borderColor: 'var(--admin-forest)',
                            color: 'var(--admin-forest)',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                          title="Manage Product Showcase Cards (MOVA, PENTA, ENTRA)"
                        >
                          <Layers size={15} />
                          Product Cards ({sec.items?.length || 3})
                        </button>
                      ) : sec.sectionId === 'home-applications' ? (
                        <button
                          onClick={() => {
                            setEditingSection({ ...sec });
                            setActiveTab('items');
                            setIsModalOpen(true);
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            borderColor: 'var(--admin-forest)',
                            color: 'var(--admin-forest)',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                          title="Manage Application Showcase Cards (Residences, Hospitality, Farms, Eco)"
                        >
                          <Layers size={15} />
                          Application Cards ({sec.items?.length || 4})
                        </button>
                      ) : sec.sectionId === 'about-office' ? (
                        <button
                          onClick={() => {
                            setEditingSection({ ...sec });
                            setActiveTab('content');
                            setIsModalOpen(true);
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            borderColor: 'var(--admin-forest)',
                            color: 'var(--admin-forest)',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                          title="Configure Office Location, Google Maps & Directions Link"
                        >
                          <MapPin size={15} />
                          Map & Location
                        </button>
                      ) : sec.sectionId === 'about-philosophy' ? (
                        <button
                          onClick={() => {
                            setEditingSection({ ...sec });
                            setActiveTab('content');
                            setIsModalOpen(true);
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            borderColor: 'var(--admin-forest)',
                            color: 'var(--admin-forest)',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                          title="View Philosophy Content & Right-Side Visual"
                        >
                          <ImageIcon size={15} />
                          Right-Side Visual
                        </button>
                      ) : sec.sectionId === 'about-stats' ? (
                        <button
                          onClick={() => {
                            setEditingSection({ ...sec });
                            setActiveTab('items');
                            setIsModalOpen(true);
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            borderColor: 'var(--admin-forest)',
                            color: 'var(--admin-forest)',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                          title="Manage 3 Origin Metric Cards (50%, 1, 30–300 m²)"
                        >
                          <Sliders size={15} />
                          Metric Cards ({sec.items?.length || 3})
                        </button>
                      ) : sec.sectionId === 'home-philosophy' ? (
                        <button
                          onClick={() => {
                            setEditingSection({ ...sec });
                            setActiveTab('items');
                            setIsModalOpen(true);
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            borderColor: 'var(--admin-forest)',
                            color: 'var(--admin-forest)',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                          title="Manage 4 Core Pillars (Comfort, Quality, Speed, Value)"
                        >
                          <Sparkles size={15} />
                          4 Pillars ({sec.items?.length || 4})
                        </button>
                      ) : sec.sectionId === 'contact-direct' ? (
                        <button
                          onClick={() => {
                            setEditingSection({ ...sec });
                            setActiveTab('items');
                            setIsModalOpen(true);
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            borderColor: 'var(--admin-forest)',
                            color: 'var(--admin-forest)',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                          title="Manage Contact Information Cards"
                        >
                          <MapPin size={15} />
                          Contact Cards ({sec.items?.length || 4})
                        </button>
                      ) : sec.sectionId === 'contact-form' ? (
                        <button
                          onClick={() => {
                            setEditingSection({ ...sec });
                            setActiveTab('items');
                            setIsModalOpen(true);
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            borderColor: 'var(--admin-forest)',
                            color: 'var(--admin-forest)',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                          title="Manage Form Fields & Options"
                        >
                          <Sliders size={15} />
                          Form Fields ({sec.items?.length || 5})
                        </button>
                      ) : sec.sectionId === 'applications-categories' ? (
                        <button
                          onClick={() => {
                            setEditingSection({ ...sec });
                            setActiveTab('items');
                            setIsModalOpen(true);
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            borderColor: 'var(--admin-forest)',
                            color: 'var(--admin-forest)',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                          title="Manage Dynamic Application Categories & Filter Chips"
                        >
                          <Filter size={15} />
                          Categories ({sec.items?.length || 5})
                        </button>
                      ) : sec.sectionId === 'applications-cards' ? (
                        <button
                          onClick={() => {
                            setEditingSection({ ...sec });
                            setActiveTab('items');
                            setIsModalOpen(true);
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            borderColor: 'var(--admin-forest)',
                            color: 'var(--admin-forest)',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                          title="Manage All 6 Architectural Application Typology Cards"
                        >
                          <Layers size={15} />
                          Cards ({sec.items?.length || 6})
                        </button>
                      ) : sec.sectionId === 'applications-hero' ? (
                        <button
                          onClick={() => {
                            setEditingSection({ ...sec });
                            setActiveTab('media');
                            setIsModalOpen(true);
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            borderColor: 'var(--admin-forest)',
                            color: 'var(--admin-forest)',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                          title="Hero Background Photography & Media"
                        >
                          <ImageIcon size={15} />
                          Hero Media
                        </button>
                      ) : sectionHasMedia(sec) ? (
                        <button
                          onClick={() => {
                            setEditingSection({ ...sec });
                            setActiveTab('media');
                            setIsModalOpen(true);
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
                          title="Upload or replace section background/image"
                        >
                          <ImageIcon size={15} />
                          Media
                        </button>
                      ) : null}

                      {/* Edit Content Button */}
                      <button
                        onClick={() => {
                          setEditingSection({ ...sec });
                          setActiveTab('content');
                          setIsModalOpen(true);
                        }}
                        className="admin-btn admin-btn-primary"
                        style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                      >
                        <Edit2 size={15} />
                        Edit Content
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      {/* =========================================================================
          SECTION EDITOR MODAL (Dedicated Custom Fields & Cloudinary Media Integration)
          ========================================================================= */}
      {isModalOpen && editingSection && (
        <div className="admin-modal-overlay">
          <div
            className="admin-modal-content"
            style={{ maxWidth: '880px', width: '92%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--admin-border-light)',
                marginBottom: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, color: 'var(--admin-forest-dark)', fontFamily: 'var(--admin-font-display)' }}>
                    Edit Section: {editingSection.sectionName}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      padding: '0.1rem 0.4rem',
                      backgroundColor: 'var(--admin-surface-muted)',
                      border: '1px solid var(--admin-border)',
                      borderRadius: '4px',
                      color: 'var(--admin-accent-gold)',
                    }}
                  >
                    #{editingSection.sectionId}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>
                  {editingSection.sectionId === 'about-office'
                    ? 'Configure office address, Google Maps direction link, and interactive map embed.'
                    : editingSection.sectionId === 'about-philosophy'
                    ? 'Configure editorial philosophy text, value pillars, and right-side architectural visual.'
                    : `Editing ${getCleanSlugTitle(slug, page?.title)} page section parameters. All changes preview seamlessly on the live frontend.`}
                </div>
              </div>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingSection(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--admin-text-muted)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            {(() => {
              const secId = (editingSection.sectionId || (editingSection as any).id || '').trim().toLowerCase();
              return (
                <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('content')}
                    className={`admin-btn ${activeTab === 'content' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    {secId === 'about-office' ? (
                      <MapPin size={14} />
                    ) : secId === 'about-philosophy' ? (
                      <Sparkles size={14} />
                    ) : (
                      <FileText size={14} />
                    )}
                    {secId === 'about-office'
                      ? 'Office Info & Real Location Link'
                      : secId === 'about-philosophy'
                      ? 'Philosophy Text & Visual'
                      : 'Text & Headlines'}
                  </button>
                  {/* ONLY show Media & Cloudinary tab if this section ACTUALLY uses media on the live website */}
                  {sectionHasMedia(editingSection) && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('media')}
                      className={`admin-btn ${activeTab === 'media' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <ImageIcon size={14} />
                      {secId === 'about-office'
                        ? 'Interactive Map & Photo'
                        : secId === 'about-philosophy'
                        ? 'Right-Side Visual & Cloudinary'
                        : 'Media & Cloudinary'}
                    </button>
                  )}
                  {secId !== 'about-office' && ((editingSection.items && editingSection.items.length > 0) || isHeroSection(editingSection)) && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('items')}
                      className={`admin-btn ${activeTab === 'items' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      {isHeroSection(editingSection) ? <ImageIcon size={14} /> : <Sliders size={14} />}
                      {isHeroSection(editingSection)
                        ? `Hero Slider Images (${editingSection.items?.length || 0})`
                        : secId === 'about-stats'
                        ? `Origin Metric Cards (${editingSection.items?.length || 3})`
                        : secId === 'home-philosophy'
                        ? `Core Pillars (${editingSection.items?.length || 4})`
                        : secId === 'about-philosophy'
                        ? `Value Pillars (${editingSection.items?.length || 3})`
                        : secId === 'home-process'
                        ? `Process Steps (${editingSection.items?.length || 3})`
                        : secId === 'home-products'
                        ? `Product Cards (${editingSection.items?.length || 3})`
                        : secId === 'home-applications'
                        ? `Application Cards (${editingSection.items?.length || 4})`
                        : secId === 'contact-faq'
                        ? `FAQ Questions & Answers (${editingSection.items?.length || 0})`
                        : secId === 'contact-form'
                        ? `Form Fields & Options (${editingSection.items?.length || 0})`
                        : secId === 'contact-direct'
                        ? `Contact Information Cards (${editingSection.items?.length || 0})`
                        : secId === 'products-comparison'
                        ? `Comparison Specs (${editingSection.items?.length || 0})`
                        : secId === 'applications-categories'
                        ? `Category Filters (${editingSection.items?.length || 5})`
                        : secId === 'applications-cards'
                        ? `Application Cards (${editingSection.items?.length || 6})`
                        : `Cards & Repeated Items (${editingSection.items?.length || 0})`}
                    </button>
                  )}
                </div>
              );
            })()}

            {/* Modal Scrollable Body */}
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
              
              {/* TAB 1: CONTENT & HEADLINES / OFFICE LOCATION */}
              {activeTab === 'content' && (
                editingSection.sectionId === 'about-office' ? (
                  <div>
                    {/* Top Row: Section Display Name & Eyebrow */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label className="admin-label">Section Display Name</label>
                        <input
                          type="text"
                          required
                          className="admin-input"
                          value={editingSection.sectionName}
                          onChange={(e) => setEditingSection({ ...editingSection, sectionName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Eyebrow / Over-Title Tag</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={editingSection.eyebrow || ''}
                          onChange={(e) => setEditingSection({ ...editingSection, eyebrow: e.target.value })}
                          placeholder="e.g. Main office"
                        />
                      </div>
                    </div>

                    {/* Primary Headline */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label className="admin-label">Primary Headline / Section Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={editingSection.title || ''}
                        onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                        placeholder="e.g. Come visit our office"
                      />
                    </div>

                    {/* DEDICATED REAL LOCATION LINK & GOOGLE MAPS DIRECTIONS BOX */}
                    <div
                      style={{
                        backgroundColor: 'rgba(82, 105, 75, 0.05)',
                        border: '1.5px solid var(--admin-forest)',
                        borderRadius: '10px',
                        padding: '1.25rem',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--admin-forest)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <MapPin size={16} />
                          </div>
                          <div>
                            <span style={{ fontWeight: 600, color: 'var(--admin-forest-dark)', fontSize: '0.95rem' }}>
                              Real Google Maps Location & Directions Link
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block' }}>
                              Direct URL opened when visitors click the map card button or the top-left location badge.
                            </span>
                          </div>
                        </div>

                        {editingSection.ctaUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              if (editingSection.ctaUrl?.startsWith('http://') || editingSection.ctaUrl?.startsWith('https://')) {
                                window.open(editingSection.ctaUrl, '_blank', 'noopener,noreferrer');
                              } else {
                                window.open(editingSection.ctaUrl, '_blank');
                              }
                            }}
                            className="admin-btn admin-btn-secondary"
                            style={{
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.78rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              borderColor: 'var(--admin-forest)',
                              color: 'var(--admin-forest)',
                              backgroundColor: '#fff',
                            }}
                            title="Open link in new tab to test if it opens correctly"
                          >
                            <ExternalLink size={13} />
                            Test Location Link Live ↗
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div>
                          <label className="admin-label" style={{ fontWeight: 600 }}>
                            Real Location Link / Google Maps URL
                          </label>
                          <input
                            type="text"
                            className="admin-input"
                            value={editingSection.ctaUrl || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingSection((prev) => {
                                if (!prev) return null;
                                const currentItem = (prev.items && prev.items[0]) || { id: 'office-card' };
                                return {
                                  ...prev,
                                  ctaUrl: val,
                                  items: [{ ...currentItem, link: val }],
                                };
                              });
                            }}
                            placeholder="https://maps.google.com/?q=... or https://maps.app.goo.gl/..."
                            style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                          />
                        </div>

                        <div>
                          <label className="admin-label" style={{ fontWeight: 600 }}>
                            Card Button Label
                          </label>
                          <input
                            type="text"
                            className="admin-input"
                            value={editingSection.ctaText || 'Get Directions'}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingSection((prev) => {
                                if (!prev) return null;
                                const currentItem = (prev.items && prev.items[0]) || { id: 'office-card' };
                                return {
                                  ...prev,
                                  ctaText: val,
                                  items: [{ ...currentItem, linkText: val }],
                                };
                              });
                            }}
                            placeholder="e.g. Get Directions"
                          />
                        </div>
                      </div>

                      {/* Quick Presets & Helpers */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Quick Presets:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const val = 'https://maps.google.com/?q=Dubai+Design+District+Building+7+Dubai+UAE';
                            setEditingSection((prev) => {
                              if (!prev) return null;
                              const currentItem = (prev.items && prev.items[0]) || { id: 'office-card' };
                              return {
                                ...prev,
                                ctaUrl: val,
                                ctaText: 'Get Directions',
                                items: [{ ...currentItem, link: val, linkText: 'Get Directions' }],
                              };
                            });
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '0.2rem 0.55rem', fontSize: '0.74rem' }}
                        >
                          📍 Dubai Design District (Google Maps)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const val = 'https://maps.google.com/?q=Downtown+Dubai+United+Arab+Emirates';
                            setEditingSection((prev) => {
                              if (!prev) return null;
                              const currentItem = (prev.items && prev.items[0]) || { id: 'office-card' };
                              return {
                                ...prev,
                                ctaUrl: val,
                                ctaText: 'Get Directions',
                                items: [{ ...currentItem, link: val, linkText: 'Get Directions' }],
                              };
                            });
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '0.2rem 0.55rem', fontSize: '0.74rem' }}
                        >
                          📍 Downtown Dubai
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const val = '/contact';
                            setEditingSection((prev) => {
                              if (!prev) return null;
                              const currentItem = (prev.items && prev.items[0]) || { id: 'office-card' };
                              return {
                                ...prev,
                                ctaUrl: val,
                                ctaText: 'Contacts',
                                items: [{ ...currentItem, link: val, linkText: 'Contacts' }],
                              };
                            });
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '0.2rem 0.55rem', fontSize: '0.74rem' }}
                        >
                          📋 Contact Page (/contact)
                        </button>
                      </div>
                    </div>

                    {/* District Name and Physical Address in 2 columns */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <label className="admin-label">Office District / Location Name</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={editingSection.subtitle || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingSection((prev) => {
                              if (!prev) return null;
                              const currentItem = (prev.items && prev.items[0]) || { id: 'office-card' };
                              return {
                                ...prev,
                                subtitle: val,
                                items: [{ ...currentItem, title: val }],
                              };
                            });
                          }}
                          placeholder="e.g. Dubai Design District (d3)"
                        />
                        <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-muted)', marginTop: '0.3rem', display: 'block' }}>
                          Appears on the map top-left badge and card header.
                        </span>
                      </div>

                      <div>
                        <label className="admin-label">Physical Office Street Address</label>
                        <textarea
                          rows={2}
                          className="admin-textarea"
                          style={{ resize: 'none' }}
                          value={editingSection.items?.[0]?.subtitle || 'Building 7, Dubai\nUnited Arab Emirates'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingSection((prev) => {
                              if (!prev) return null;
                              const currentItem = (prev.items && prev.items[0]) || { id: 'office-card' };
                              return {
                                ...prev,
                                items: [{ ...currentItem, subtitle: val }],
                              };
                            });
                          }}
                          placeholder="e.g. Building 7, Dubai&#10;United Arab Emirates"
                        />
                        <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-muted)', marginTop: '0.3rem', display: 'block' }}>
                          Displayed on the floating office card over the map.
                        </span>
                      </div>
                    </div>

                    {/* Narrative / Paragraph Content */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label className="admin-label">Visit Invitation / Narrative Text</label>
                      <textarea
                        rows={3}
                        className="admin-textarea"
                        value={editingSection.content || ''}
                        onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                        placeholder="Enter visit invitation details..."
                      />
                    </div>
                  </div>
                ) : editingSection.sectionId === 'about-philosophy' ? (
                  <div>
                    {/* Top Row: Section Display Name & Eyebrow */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label className="admin-label">Section Display Name</label>
                        <input
                          type="text"
                          required
                          className="admin-input"
                          value={editingSection.sectionName}
                          onChange={(e) => setEditingSection({ ...editingSection, sectionName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Eyebrow / Over-Title Tag</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={editingSection.eyebrow || ''}
                          onChange={(e) => setEditingSection({ ...editingSection, eyebrow: e.target.value })}
                          placeholder="e.g. OUR PHILOSOPHY"
                        />
                      </div>
                    </div>

                    {/* Primary Headline */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label className="admin-label">Primary Headline (Use newline for 2-line split)</label>
                      <textarea
                        rows={2}
                        className="admin-textarea"
                        value={editingSection.title || ''}
                        onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                        placeholder="One Vision. One System.&#10;One Accountable Team."
                      />
                    </div>

                    {/* PROMINENT RIGHT-SIDE ARCHITECTURAL IMAGE CARD */}
                    <div
                      style={{
                        backgroundColor: 'rgba(82, 105, 75, 0.05)',
                        border: '1.5px solid var(--admin-forest)',
                        borderRadius: '10px',
                        padding: '1.25rem',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--admin-forest)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <ImageIcon size={16} />
                          </div>
                          <div>
                            <span style={{ fontWeight: 600, color: 'var(--admin-forest-dark)', fontSize: '0.95rem' }}>
                              Right-Side Featured Architectural Visual (about us.png)
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block' }}>
                              This visual appears on the right side of the Philosophy section on the public About page.
                            </span>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontFamily: 'monospace',
                            padding: '0.15rem 0.45rem',
                            backgroundColor: '#fff',
                            border: '1px solid var(--admin-border)',
                            borderRadius: '4px',
                            color: 'var(--admin-forest)',
                            fontWeight: 600,
                          }}
                        >
                          Public Website Visual
                        </span>
                      </div>

                      {/* 2-column image preview and controls */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem', alignItems: 'center' }}>
                        {/* Left: Image visual preview */}
                        <div>
                          <div
                            style={{
                              width: '100%',
                              height: '190px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              backgroundColor: '#20231F',
                              border: '1px solid var(--admin-border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            }}
                          >
                            <img
                              src={editingSection.mediaUrl || '/assets/images/about us.png'}
                              alt="Right Side Architectural Composition"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: '0.35rem', textAlign: 'center' }}>
                            Visual: {editingSection.mediaUrl || '/assets/images/about us.png'}
                          </div>
                        </div>

                        {/* Right: Controls & Cloudinary Uploader */}
                        <div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <label className="admin-label" style={{ fontWeight: 600 }}>Image Asset Path or CDN URL</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={editingSection.mediaUrl || ''}
                              onChange={(e) =>
                                setEditingSection({
                                  ...editingSection,
                                  mediaUrl: e.target.value,
                                  thumbnailUrl: e.target.value,
                                })
                              }
                              placeholder="/assets/images/about us.png"
                              style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleMediaUpload(e, 'mediaUrl')}
                              style={{ display: 'none' }}
                              id="philosophy-visual-file-picker"
                            />
                            <label
                              htmlFor="philosophy-visual-file-picker"
                              className="admin-btn admin-btn-primary"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                padding: '0.45rem 0.85rem',
                                fontSize: '0.82rem',
                              }}
                            >
                              {uploadingMedia ? <RefreshCw className="animate-spin" size={15} /> : <UploadCloud size={15} />}
                              {uploadingMedia ? 'Uploading to Cloudinary...' : 'Upload New Image from Device'}
                            </label>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingSection({
                                  ...editingSection,
                                  mediaUrl: '/assets/images/about us.png',
                                  thumbnailUrl: '/assets/images/about us.png',
                                });
                              }}
                              className="admin-btn admin-btn-secondary"
                              style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              Reset to Default Architecture Visual
                            </button>
                          </div>

                          {mediaUploadError && (
                            <div style={{ color: 'var(--admin-danger)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                              {mediaUploadError}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Problem Statement & Integrated Solution Text */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label className="admin-label">Problem Statement Paragraph (Subtitle)</label>
                        <textarea
                          rows={4}
                          className="admin-textarea"
                          value={editingSection.subtitle || ''}
                          onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                          placeholder="Traditional construction is fragmented..."
                        />
                      </div>
                      <div>
                        <label className="admin-label">Integrated Solution Paragraph (Content)</label>
                        <textarea
                          rows={4}
                          className="admin-textarea"
                          value={editingSection.content || ''}
                          onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                          placeholder="AlGhaf Collective brings design, engineering..."
                        />
                      </div>
                    </div>

                    {/* Notice to edit 3 Pillars */}
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--admin-surface-muted)',
                        borderRadius: '6px',
                        border: '1px solid var(--admin-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                        Looking to edit the 3 bullet points (Unified Accountability, Millimeter-Level Precision, Schedule & Cost Certainty)?
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('items')}
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.76rem', color: 'var(--admin-forest)', fontWeight: 600 }}
                      >
                        Edit Value Pillars (3) &rarr;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label className="admin-label">Section Display Name</label>
                        <input
                          type="text"
                          required
                          className="admin-input"
                          value={editingSection.sectionName}
                          onChange={(e) => setEditingSection({ ...editingSection, sectionName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Eyebrow / Over-title Tag</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={editingSection.eyebrow || ''}
                          onChange={(e) => setEditingSection({ ...editingSection, eyebrow: e.target.value })}
                          placeholder="e.g. DIRECT CONTACT / 01"
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label className="admin-label">
                        Primary Headline / Title {isHeroSection(editingSection) && '(Use new lines for split heading)'}
                      </label>
                      <textarea
                        rows={2}
                        className="admin-textarea"
                        value={editingSection.title || ''}
                        onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                        placeholder="e.g. Connect With Our Team."
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label className="admin-label">Subtitle / Highlight Concept</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={editingSection.subtitle || ''}
                        onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                        placeholder="e.g. Speak directly with our architectural directors..."
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label className="admin-label">
                        {editingSection.sectionId === 'contact-form'
                          ? 'Submission Confirmation & Success Notice'
                          : 'Narrative / Paragraph Content'}
                      </label>
                      <textarea
                        rows={4}
                        className="admin-textarea"
                        value={editingSection.content || ''}
                        onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                        placeholder={
                          editingSection.sectionId === 'contact-form'
                            ? 'Thank you. Your enquiry has been logged. An AlGhaf project coordinator will be in touch within 24 business hours.'
                            : 'Enter detailed narrative text...'
                        }
                      />
                    </div>

                    {/* Optional Action Button Label */}
                    {(editingSection.ctaText !== undefined || editingSection.sectionId === 'contact-form' || editingSection.sectionId?.includes('cta')) && (
                      <div style={{ marginBottom: '1rem' }}>
                        <label className="admin-label">Action / Submit Button Label</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={editingSection.ctaText || ''}
                          onChange={(e) => setEditingSection({ ...editingSection, ctaText: e.target.value })}
                          placeholder="e.g. Send Enquiry"
                        />
                      </div>
                    )}

                    {/* DEDICATED APPLICATIONS HERO SETTINGS & STYLING CONTROLS */}
                    {editingSection.sectionId === 'applications-hero' && (() => {
                      const styling = (editingSection.items && editingSection.items[0]) || {};
                      const overlayColor = styling.overlayColor || '#0E100E';
                      const overlayOpacity = typeof styling.overlayOpacity === 'number' ? styling.overlayOpacity : 0.82;
                      const textAlign = styling.textAlign || 'center';
                      const contentWidth = styling.contentWidth || '880px';
                      const heroHeight = styling.heroHeight || 'clamp(520px, 62vh, 700px)';

                      const updateStyling = (patch: Record<string, any>) => {
                        const items = [...(editingSection.items || [])];
                        items[0] = { ...(items[0] || { id: 'hero-styling' }), ...patch };
                        setEditingSection({ ...editingSection, items });
                      };

                      return (
                        <div
                          style={{
                            marginTop: '1.5rem',
                            border: '1.5px solid var(--admin-forest)',
                            borderRadius: '10px',
                            padding: '1.25rem',
                            backgroundColor: 'rgba(82, 105, 75, 0.04)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.65rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Sliders size={18} color="var(--admin-forest)" />
                              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--admin-forest-dark)' }}>
                                Applications Hero Layout, Overlay & Visual Settings
                              </h4>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                              Applied directly to live /applications banner
                            </span>
                          </div>

                          {/* Hero Live Visual Preview */}
                          <div style={{ marginBottom: '1.25rem' }}>
                            <label className="admin-label" style={{ marginBottom: '0.4rem' }}>
                              Interactive Live Hero Preview
                            </label>
                            <div
                              style={{
                                width: '100%',
                                minHeight: '190px',
                                borderRadius: '8px',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center',
                                padding: '1.5rem',
                                color: '#FAF8F5',
                                textAlign: textAlign as any,
                                backgroundImage: `linear-gradient(to bottom, ${overlayColor}${Math.round(overlayOpacity * 0.7 * 255).toString(16).padStart(2, '0')} 0%, ${overlayColor}${Math.round(overlayOpacity * 255).toString(16).padStart(2, '0')} 100%), url('${editingSection.mediaUrl || '/assets/images/image_bg_alghaf222.jpg'}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                border: '1px solid var(--admin-border-light)',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                              }}
                            >
                              <div style={{ maxWidth: '90%' }}>
                                {editingSection.eyebrow && (
                                  <div
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.4rem',
                                      padding: '0.25rem 0.65rem',
                                      borderRadius: '9999px',
                                      fontSize: '0.68rem',
                                      fontWeight: 600,
                                      letterSpacing: '0.08em',
                                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                      border: '1px solid rgba(255, 255, 255, 0.18)',
                                      color: '#D4AF37',
                                      marginBottom: '0.5rem',
                                    }}
                                  >
                                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#D4AF37' }} />
                                    {editingSection.eyebrow}
                                  </div>
                                )}
                                <h2 style={{ fontSize: '1.35rem', margin: '0 0 0.4rem 0', fontWeight: 600, fontFamily: 'var(--admin-font-display, serif)', color: '#FFFFFF' }}>
                                  {editingSection.title || 'Built For More Than Homes.'}
                                </h2>
                                <p style={{ fontSize: '0.78rem', margin: 0, opacity: 0.85, lineHeight: 1.4, color: '#E8E5DF' }}>
                                  {editingSection.subtitle || editingSection.content || 'From private desert residences and luxury eco-resorts...'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Overlay Colour & Opacity Controls */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                              <label className="admin-label">Overlay Tint Color</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                  type="color"
                                  value={overlayColor.startsWith('#') ? overlayColor : '#0E100E'}
                                  onChange={(e) => updateStyling({ overlayColor: e.target.value })}
                                  style={{ width: '42px', height: '36px', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: 0 }}
                                />
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={overlayColor}
                                  onChange={(e) => updateStyling({ overlayColor: e.target.value })}
                                  placeholder="#0E100E"
                                />
                              </div>
                            </div>

                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                <label className="admin-label" style={{ margin: 0 }}>Overlay Opacity</label>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-forest)' }}>
                                  {Math.round(overlayOpacity * 100)}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.02"
                                value={overlayOpacity}
                                onChange={(e) => updateStyling({ overlayOpacity: parseFloat(e.target.value) })}
                                style={{ width: '100%', height: '8px', cursor: 'pointer', marginTop: '0.5rem' }}
                              />
                            </div>
                          </div>

                          {/* Text Alignment & Content Width */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                              <label className="admin-label">Text Alignment</label>
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                {['left', 'center', 'right'].map((align) => (
                                  <button
                                    key={align}
                                    type="button"
                                    onClick={() => updateStyling({ textAlign: align })}
                                    className={`admin-btn ${textAlign === align ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                                    style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', textTransform: 'capitalize' }}
                                  >
                                    {align}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="admin-label">Content Max Width</label>
                              <select
                                className="admin-select"
                                value={contentWidth}
                                onChange={(e) => updateStyling({ contentWidth: e.target.value })}
                              >
                                <option value="720px">Narrow (720px)</option>
                                <option value="880px">Balanced / Standard (880px)</option>
                                <option value="1080px">Wide (1080px)</option>
                                <option value="1200px">Full Width (1200px)</option>
                              </select>
                            </div>
                          </div>

                          {/* Hero Height & SEO Image Alt */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                              <label className="admin-label">Hero Section Height</label>
                              <select
                                className="admin-select"
                                value={heroHeight}
                                onChange={(e) => updateStyling({ heroHeight: e.target.value })}
                              >
                                <option value="clamp(450px, 50vh, 600px)">Compact (clamp 450px - 600px)</option>
                                <option value="clamp(520px, 62vh, 700px)">Standard (clamp 520px - 700px)</option>
                                <option value="clamp(600px, 75vh, 850px)">Expansive (clamp 600px - 850px)</option>
                                <option value="100vh">Full Screen Height (100vh)</option>
                              </select>
                            </div>

                            <div>
                              <label className="admin-label">SEO Image Alt Text</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={editingSection.mediaAlt || ''}
                                onChange={(e) => setEditingSection({ ...editingSection, mediaAlt: e.target.value })}
                                placeholder="Built For More Than Homes - AlGhaf Applications"
                              />
                            </div>
                          </div>

                          {/* Background Image Upload & Presets */}
                          <div style={{ borderTop: '1px solid var(--admin-border-light)', paddingTop: '0.85rem' }}>
                            <label className="admin-label" style={{ marginBottom: '0.4rem' }}>Hero Background Image</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', alignItems: 'center' }}>
                              <input
                                type="text"
                                className="admin-input"
                                value={editingSection.mediaUrl || ''}
                                onChange={(e) => setEditingSection({ ...editingSection, mediaUrl: e.target.value, thumbnailUrl: e.target.value })}
                                placeholder="/assets/images/image_bg_alghaf222.jpg or Cloudinary URL"
                              />
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <input
                                  type="file"
                                  accept="image/*"
                                  id="hero-bg-upload-input"
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleMediaUpload(e, 'mediaUrl')}
                                />
                                <label
                                  htmlFor="hero-bg-upload-input"
                                  className="admin-btn admin-btn-primary"
                                  style={{ flex: 1, padding: '0.45rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', cursor: 'pointer' }}
                                >
                                  {uploadingMedia ? <RefreshCw className="animate-spin" size={14} /> : <UploadCloud size={14} />}
                                  {uploadingMedia ? 'Uploading...' : 'Upload Image'}
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setEditingSection({ ...editingSection, mediaUrl: '/assets/images/image_bg_alghaf222.jpg', thumbnailUrl: '/assets/images/image_bg_alghaf222.jpg' })}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.45rem 0.65rem', fontSize: '0.75rem' }}
                                  title="Reset to default green hills hero image"
                                >
                                  Default
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* End of content fields */}
                  </div>
                )
              )}

              {/* TAB 2: MEDIA & CLOUDINARY UPLOADER / INTERACTIVE MAP & PHOTO */}
              {activeTab === 'media' && sectionHasMedia(editingSection) && (
                editingSection.sectionId === 'about-office' ? (
                  <div>
                    {/* Google Maps Embed iframe configuration */}
                    <div
                      style={{
                        backgroundColor: '#fff',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '8px',
                        padding: '1.25rem',
                        marginBottom: '1.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--admin-forest-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <MapPin size={16} color="var(--admin-forest)" />
                            Google Maps Interactive Background Embed (iframe)
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                            Paste embed URL, full &lt;iframe&gt; code, standard Google Maps link, or place name (auto-converted).
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => {
                              const addr = editingSection.subtitle || editingSection.items?.[0]?.subtitle || 'Dubai Design District Building 7 Dubai';
                              const cleanAddr = addr.replace(/\n/g, ' ');
                              const generated = `https://maps.google.com/maps?q=${encodeURIComponent(cleanAddr)}&output=embed`;
                              setEditingSection({
                                ...editingSection,
                                videoUrl: generated,
                              });
                            }}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.74rem' }}
                            title="Generate map embed directly from the office address below"
                          >
                            ⚡ Auto-Generate from Address
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSection({
                                ...editingSection,
                                videoUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14441.428489814526!2d55.2954752!3d25.1861054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f68307d896173%3A0xe54d924192b6a555!2sDubai%20Design%20District!5e0!3m2!1sen!2sae!4v1710000000000!5m2!1sen!2sae',
                              });
                            }}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.74rem' }}
                          >
                            Reset to Default Map
                          </button>
                        </div>
                      </div>

                      {/* Map Embed Input with auto-sanitization */}
                      <div style={{ marginBottom: '0.75rem' }}>
                        <input
                          type="text"
                          className="admin-input"
                          value={editingSection.videoUrl || ''}
                          onChange={(e) => {
                            let val = e.target.value.trim();
                            // 1. Extract src if user pasted full <iframe> tag
                            const iframeMatch = val.match(/src=["']([^"']+)["']/i);
                            if (iframeMatch && iframeMatch[1]) {
                              val = iframeMatch[1];
                            }
                            // 2. If standard google maps link with query or place
                            else if (!val.includes('/embed') && !val.includes('output=embed')) {
                              const qMatch = val.match(/[?&]q=([^&]+)/);
                              if (qMatch && qMatch[1]) {
                                val = `https://maps.google.com/maps?q=${qMatch[1]}&output=embed`;
                              } else {
                                const placeMatch = val.match(/\/place\/([^/@?]+)/);
                                if (placeMatch && placeMatch[1]) {
                                  val = `https://maps.google.com/maps?q=${placeMatch[1]}&output=embed`;
                                } else if (val.length > 3 && !val.startsWith('http://') && !val.startsWith('https://')) {
                                  // User typed location name like "Dubai Marina" or "Business Bay"
                                  val = `https://maps.google.com/maps?q=${encodeURIComponent(val)}&output=embed`;
                                }
                              }
                            }
                            setEditingSection({ ...editingSection, videoUrl: val });

                            if (val.includes('goo.gl')) {
                              fetch(`/api/resolve-map?url=${encodeURIComponent(val)}`)
                                .then((r) => r.json())
                                .then((d) => {
                                  if (d.embedUrl) {
                                    setEditingSection((prev: any) => {
                                      if (!prev) return prev;
                                      const updatedItems = prev.items && prev.items.length > 0
                                        ? [{ ...prev.items[0], title: d.placeName || prev.items[0]?.title }]
                                        : prev.items;
                                      return {
                                        ...prev,
                                        videoUrl: d.embedUrl,
                                        subtitle: d.placeName || prev.subtitle,
                                        items: updatedItems,
                                      };
                                    });
                                  }
                                })
                                .catch(() => {});
                            }
                          }}
                          placeholder="https://www.google.com/maps/embed?pb=... or paste <iframe> tag"
                          style={{ fontFamily: 'monospace', fontSize: '0.82rem', marginBottom: '0.4rem' }}
                        />

                        {/* Quick Presets */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', fontWeight: 600 }}>Quick Locations:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSection({
                                ...editingSection,
                                videoUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14441.428489814526!2d55.2954752!3d25.1861054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f68307d896173%3A0xe54d924192b6a555!2sDubai%20Design%20District!5e0!3m2!1sen!2sae!4v1710000000000!5m2!1sen!2sae',
                              });
                            }}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '0.15rem 0.45rem', fontSize: '0.7rem' }}
                          >
                            📍 Dubai Design District (d3)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSection({
                                ...editingSection,
                                videoUrl: 'https://maps.google.com/maps?q=Downtown+Dubai+United+Arab+Emirates&output=embed',
                              });
                            }}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '0.15rem 0.45rem', fontSize: '0.7rem' }}
                          >
                            📍 Downtown Dubai
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSection({
                                ...editingSection,
                                videoUrl: 'https://maps.google.com/maps?q=Dubai+Marina+Dubai+United+Arab+Emirates&output=embed',
                              });
                            }}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '0.15rem 0.45rem', fontSize: '0.7rem' }}
                          >
                            📍 Dubai Marina
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSection({
                                ...editingSection,
                                videoUrl: 'https://maps.google.com/maps?q=Al+Maryah+Island+Abu+Dhabi+UAE&output=embed',
                              });
                            }}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '0.15rem 0.45rem', fontSize: '0.7rem' }}
                          >
                            📍 Abu Dhabi
                          </button>
                        </div>
                      </div>

                      {/* Location Name & Address Synchronization Fields */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1.2fr',
                          gap: '0.85rem',
                          padding: '0.85rem 1rem',
                          backgroundColor: 'var(--admin-surface-muted)',
                          borderRadius: '6px',
                          border: '1px solid var(--admin-border-light)',
                          marginBottom: '1rem',
                        }}
                      >
                        <div>
                          <label className="admin-label" style={{ fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                            Location / District Title (Card & Badge)
                          </label>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem' }}
                            value={editingSection.subtitle || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              const currentItem = (editingSection.items && editingSection.items[0]) || { id: 'office-card' };
                              setEditingSection({
                                ...editingSection,
                                subtitle: val,
                                items: [{ ...currentItem, title: val }],
                              });
                            }}
                            placeholder="e.g. Dubai Design District (d3)"
                          />
                        </div>

                        <div>
                          <label className="admin-label" style={{ fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                            Physical Street Address (Card Body)
                          </label>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem' }}
                            value={(editingSection.items?.[0]?.subtitle || 'Building 7, Dubai, United Arab Emirates').replace(/\n/g, ', ')}
                            onChange={(e) => {
                              const val = e.target.value;
                              const currentItem = (editingSection.items && editingSection.items[0]) || { id: 'office-card' };
                              setEditingSection({
                                ...editingSection,
                                items: [{ ...currentItem, subtitle: val }],
                              });
                            }}
                            placeholder="e.g. Building 7, Dubai, United Arab Emirates"
                          />
                        </div>
                      </div>

                      {/* Live Interactive Map Preview */}
                      {editingSection.videoUrl ? (
                        <div>
                          {editingSection.videoUrl.includes('goo.gl') && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.5rem',
                                padding: '0.55rem 0.75rem',
                                backgroundColor: '#FEF3C7',
                                border: '1px solid #F59E0B',
                                borderRadius: '6px',
                                marginBottom: '0.65rem',
                                fontSize: '0.8rem',
                                color: '#92400E',
                              }}
                            >
                              <span>
                                ⚠️ <strong>Short link detected (maps.app.goo.gl).</strong> Google blocks direct embedding of share links.
                              </span>
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    const res = await fetch(`/api/resolve-map?url=${encodeURIComponent(editingSection.videoUrl)}`);
                                    const data = await res.json();
                                    if (data.embedUrl) {
                                      setEditingSection({
                                        ...editingSection,
                                        videoUrl: data.embedUrl,
                                        subtitle: data.placeName || editingSection.subtitle,
                                      });
                                    }
                                  } catch (err) {}
                                }}
                                className="admin-btn admin-btn-primary"
                                style={{ padding: '0.25rem 0.65rem', fontSize: '0.74rem', whiteSpace: 'nowrap' }}
                              >
                                ⚡ Click to Convert into Working Embed
                              </button>
                            </div>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-muted)' }}>
                              Live Interactive Map Preview:
                            </span>
                            <span style={{ fontSize: '0.72rem', color: editingSection.videoUrl.includes('goo.gl') ? '#B45309' : 'var(--admin-forest)', fontWeight: 600 }}>
                              {editingSection.videoUrl.includes('goo.gl') ? '⚠ Short link (Click Convert button above)' : '✓ Active Embed URL'}
                            </span>
                          </div>
                          <div
                            style={{
                              width: '100%',
                              height: '240px',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              border: '1px solid var(--admin-border)',
                              backgroundColor: '#e5e3df',
                            }}
                          >
                            <iframe
                              src={editingSection.videoUrl}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              loading="lazy"
                              title="Interactive Google Map Preview"
                            />
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--admin-surface-muted)', borderRadius: '6px', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                          No Google Maps Embed URL entered.
                        </div>
                      )}
                    </div>

                    {/* Office Building Photo thumbnail configuration */}
                    <div
                      style={{
                        backgroundColor: '#fff',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '8px',
                        padding: '1.25rem',
                      }}
                    >
                      <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.95rem', color: 'var(--admin-forest-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <ImageIcon size={16} color="var(--admin-forest)" />
                        Office Building Photo (Floating Card Thumbnail)
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', margin: '0 0 1rem 0' }}>
                        This photo is featured on the floating office card that hovers over the map.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', alignItems: 'start' }}>
                        <div>
                          <label className="admin-label">Building Image Asset URL</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={editingSection.mediaUrl || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingSection((prev) => {
                                if (!prev) return null;
                                const currentItem = (prev.items && prev.items[0]) || { id: 'office-card' };
                                return {
                                  ...prev,
                                  mediaUrl: val,
                                  thumbnailUrl: val,
                                  items: [{ ...currentItem, image: val }],
                                };
                              });
                            }}
                            placeholder="/assets/images/... or Cloudinary URL"
                            style={{ marginBottom: '0.75rem' }}
                          />

                          {/* Cloudinary Upload Button */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleMediaUpload(e, 'mediaUrl')}
                              style={{ display: 'none' }}
                              id="office-photo-file-picker"
                            />
                            <label
                              htmlFor="office-photo-file-picker"
                              className="admin-btn admin-btn-secondary"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            >
                              {uploadingMedia ? <RefreshCw className="animate-spin" size={14} /> : <UploadCloud size={14} />}
                              {uploadingMedia ? 'Uploading...' : 'Upload New Photo to Cloudinary'}
                            </label>
                            {mediaUploadError && (
                              <span style={{ color: 'var(--admin-danger)', fontSize: '0.75rem' }}>{mediaUploadError}</span>
                            )}
                          </div>
                        </div>

                        {/* Image Preview Box */}
                        <div>
                          <label className="admin-label">Card Photo Preview</label>
                          <div
                            style={{
                              width: '100%',
                              height: '110px',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              border: '1px solid var(--admin-border)',
                              backgroundColor: '#20231F',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {editingSection.mediaUrl ? (
                              <img
                                src={editingSection.mediaUrl}
                                alt="Office Building"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>No image</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : editingSection.sectionId === 'about-philosophy' ? (
                  <div>
                    <div
                      style={{
                        backgroundColor: '#fff',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '8px',
                        padding: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.98rem', color: 'var(--admin-forest-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <ImageIcon size={18} color="var(--admin-forest)" />
                            Right-Side Featured Architectural Composition (about us.png)
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                            High-resolution editorial image shown on the right side of the Philosophy section on the public About page.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSection({
                              ...editingSection,
                              mediaUrl: '/assets/images/about us.png',
                              thumbnailUrl: '/assets/images/about us.png',
                            });
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.74rem' }}
                        >
                          Reset to Default Architecture Visual
                        </button>
                      </div>

                      {/* Large Live Preview */}
                      <div
                        style={{
                          width: '100%',
                          maxHeight: '340px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: '#20231F',
                          border: '1px solid var(--admin-border)',
                          margin: '1rem 0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        }}
                      >
                        <img
                          src={editingSection.mediaUrl || '/assets/images/about us.png'}
                          alt="Right Side Architectural Composition"
                          style={{ maxHeight: '340px', width: '100%', objectFit: 'contain' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', alignItems: 'center' }}>
                        <div>
                          <label className="admin-label">Image Asset URL or Cloudinary CDN Path</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={editingSection.mediaUrl || ''}
                            onChange={(e) =>
                              setEditingSection({
                                ...editingSection,
                                mediaUrl: e.target.value,
                                thumbnailUrl: e.target.value,
                              })
                            }
                            placeholder="/assets/images/about us.png"
                          />
                        </div>

                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMediaUpload(e, 'mediaUrl')}
                            style={{ display: 'none' }}
                            id="phil-tab2-media-picker"
                          />
                          <label
                            htmlFor="phil-tab2-media-picker"
                            className="admin-btn admin-btn-primary"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              cursor: 'pointer',
                              width: '100%',
                              padding: '0.55rem',
                              fontSize: '0.82rem',
                            }}
                          >
                            {uploadingMedia ? <RefreshCw className="animate-spin" size={16} /> : <UploadCloud size={16} />}
                            {uploadingMedia ? 'Uploading...' : 'Upload New Image'}
                          </label>
                        </div>
                      </div>

                      {mediaUploadError && (
                        <div style={{ color: 'var(--admin-danger)', fontSize: '0.8rem', marginTop: '0.75rem' }}>
                          {mediaUploadError}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        border: '1px dashed var(--admin-border)',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        textAlign: 'center',
                        backgroundColor: 'rgba(82, 105, 75, 0.03)',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <UploadCloud size={36} style={{ color: 'var(--admin-forest)', margin: '0 auto 0.75rem auto' }} />
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: 'var(--admin-forest-dark)' }}>
                        Upload Media to Cloudinary
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', margin: '0 0 1rem 0' }}>
                        Upload high-resolution images or videos directly to Cloudinary CDN for instant optimized delivery.
                      </p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => handleMediaUpload(e, 'mediaUrl')}
                        style={{ display: 'none' }}
                        id="section-media-file-picker"
                      />

                      <label
                        htmlFor="section-media-file-picker"
                        className="admin-btn admin-btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                      >
                        {uploadingMedia ? <RefreshCw className="animate-spin" size={16} /> : <UploadCloud size={16} />}
                        {uploadingMedia ? 'Uploading to Cloudinary...' : 'Select File from Device'}
                      </label>

                      {mediaUploadError && (
                        <div style={{ color: 'var(--admin-danger)', fontSize: '0.82rem', marginTop: '0.75rem' }}>
                          {mediaUploadError}
                        </div>
                      )}
                    </div>

                    {/* Manual URL Input */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <label className="admin-label">Image or Background Media URL</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={editingSection.mediaUrl || ''}
                          onChange={(e) =>
                            setEditingSection({
                              ...editingSection,
                              mediaUrl: e.target.value,
                              thumbnailUrl: e.target.value,
                            })
                          }
                          placeholder="/assets/images/... or Cloudinary URL"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Media Type</label>
                        <select
                          className="admin-select"
                          value={editingSection.mediaType || 'image'}
                          onChange={(e: any) => setEditingSection({ ...editingSection, mediaType: e.target.value })}
                        >
                          <option value="image">Image Asset</option>
                          <option value="video">Video Stream</option>
                        </select>
                      </div>
                    </div>

                    {/* Optional Video Stream URL for Process Section */}
                    {(editingSection.sectionId === 'home-process' || editingSection.mediaType === 'video') && (
                      <div style={{ marginBottom: '1.25rem' }}>
                        <label className="admin-label">Video Stream URL (MP4 / WebM / Cloudinary)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={editingSection.videoUrl || ''}
                          onChange={(e) => setEditingSection({ ...editingSection, videoUrl: e.target.value })}
                          placeholder="/assets/videos/core idea.mp4 or Cloudinary URL"
                        />
                      </div>
                    )}

                    {/* Media Live Preview Box */}
                    {editingSection.mediaUrl && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <label className="admin-label" style={{ margin: 0 }}>Media Aspect & Crop Preview</label>
                          <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                            Live render aspect ratio preview
                          </span>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '240px',
                            minHeight: '200px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#1E231D',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--admin-border)',
                            position: 'relative',
                            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.25)'
                          }}
                        >
                          {editingSection.mediaType === 'video' ? (
                            <video
                              src={editingSection.videoUrl || editingSection.mediaUrl}
                              controls
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          ) : (
                            <img
                              src={editingSection.mediaUrl}
                              alt="Section Media Preview"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                if (!target.src.includes('about_bg.png')) {
                                  target.src = '/assets/images/about_bg.png';
                                }
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}

              {/* TAB 3: CARDS & REPEATED ITEMS / HERO SLIDES */}
              {activeTab === 'items' && editingSection.sectionId !== 'about-office' && (editingSection.items || isHeroSection(editingSection)) && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                      {isHeroSection(editingSection)
                        ? 'Manage your cinematic hero slider images (Hero Image 1, 2, 3, 4, 5). Upload photography directly or set image URLs.'
                        : editingSection.sectionId === 'about-stats'
                        ? 'Manage the 3 Origin Metric showcase cards (50% Faster Delivery, 1 Integrated System, 30–300 m² Scalable Architecture) with live values and descriptions.'
                        : editingSection.sectionId === 'home-philosophy'
                        ? 'Manage the 4 Core Pillar cards (Comfort, Quality, Speed, Value) with custom numbers, headlines, and icons.'
                        : editingSection.sectionId === 'about-philosophy'
                        ? 'Manage the 3 Value Pillars (Unified Accountability, Millimeter-Level Precision, Schedule & Cost Certainty) displayed under the editorial text.'
                        : editingSection.sectionId === 'home-process'
                        ? 'Manage the 3 How We Build process steps (Design Smarter, Prefabricate Precisely, Build Modular).'
                        : editingSection.sectionId === 'home-products'
                        ? 'Manage the 3 Product showcase cards (MOVA, PENTA, ENTRA) with card photography, tags, and narratives.'
                        : editingSection.sectionId === 'home-applications'
                        ? 'Manage the 4 Application showcase cards (Residences, Hospitality, Farms, Eco-Developments) with card photography and links.'
                        : editingSection.sectionId === 'contact-faq'
                        ? 'Manage Frequently Asked Questions. Reorder, duplicate, edit questions & answers, or toggle visibility.'
                        : editingSection.sectionId === 'contact-form'
                        ? 'Manage form fields, input types, required validations, placeholders, and select options.'
                        : editingSection.sectionId === 'contact-direct'
                        ? 'Independently edit each contact card: Headquarters, Phone & WhatsApp, Inquiries Email, and Working Hours.'
                        : editingSection.sectionId === 'applications-categories'
                        ? 'Manage dynamic category filter chips (All, Residential, Hospitality, Wellness, Specialized). Add, reorder, hide/show, or delete categories.'
                        : editingSection.sectionId === 'applications-cards'
                        ? 'Complete CRUD management for all 6 architectural application typology cards with custom photography, multi-category assignment, and actions.'
                        : 'Manage repeated cards, slides, or feature items in this section.'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (isHeroSection(editingSection)) {
                          addNewHeroSlide();
                        } else if (editingSection.sectionId === 'about-stats') {
                          const newStat = {
                            id: `stat-${Date.now()}`,
                            number: '100%',
                            title: 'New Metric Title',
                            description: 'Enter verified performance metric description here.',
                          };
                          setEditingSection({ ...editingSection, items: [...(editingSection.items || []), newStat] });
                        } else if (editingSection.sectionId === 'home-philosophy') {
                          const newPillar = {
                            id: `pillar-${Date.now()}`,
                            number: `0${(editingSection.items?.length || 0) + 1}`,
                            title: 'New Pillar Title',
                            subtitle: 'Pillar Subtitle',
                            description: 'Detailed description of this design or engineering pillar.',
                            icon: 'Sparkles',
                          };
                          setEditingSection({ ...editingSection, items: [...(editingSection.items || []), newPillar] });
                        } else if (editingSection.sectionId === 'about-philosophy') {
                          const newFeat = {
                            id: `phil-${Date.now()}`,
                            title: 'New Value Pillar',
                            description: 'Description of integrated architecture value driver.',
                          };
                          setEditingSection({ ...editingSection, items: [...(editingSection.items || []), newFeat] });
                        } else if (editingSection.sectionId === 'home-process') {
                          const newStep = {
                            number: `0${(editingSection.items?.length || 0) + 1}`,
                            title: 'New Process Step',
                            description: 'Describe the engineering or manufacturing step here.',
                            icon: 'blueprint',
                          };
                          setEditingSection({ ...editingSection, items: [...(editingSection.items || []), newStep] });
                        } else if (editingSection.sectionId === 'home-products') {
                          const newProd = {
                            id: `product-${Date.now()}`,
                            name: 'NEW MODEL',
                            category: 'Modular Living',
                            tagline: 'Precision engineered architectural living.',
                            shortDescription: 'Product description and features.',
                            heroImage: '/assets/renders/MOVA_EXT_3D_img1.jpg',
                            slug: `model-${Date.now()}`,
                          };
                          setEditingSection({ ...editingSection, items: [...(editingSection.items || []), newProd] });
                        } else if (editingSection.sectionId === 'home-applications') {
                          const newApp = {
                            id: `app-${Date.now()}`,
                            title: 'New Architectural Application',
                            category: 'Residential',
                            image: '/assets/images/built_more_than_homes_01_web.jpg',
                            link: '/applications/modular-homes',
                          };
                          setEditingSection({ ...editingSection, items: [...(editingSection.items || []), newApp] });
                        } else if (editingSection.sectionId === 'contact-faq') {
                          const newFaq = {
                            id: `faq-${Date.now()}`,
                            title: 'New Question Title',
                            question: 'New Question Title',
                            answer: 'Provide the verified response here.',
                            category: 'General Enquiries',
                            order: (editingSection.items?.length || 0) + 1,
                            status: 'published',
                            isVisible: true,
                          };
                          setEditingSection({ ...editingSection, items: [...(editingSection.items || []), newFaq] });
                        } else if (editingSection.sectionId === 'contact-form') {
                          const newField = {
                            id: `field-${Date.now()}`,
                            fieldKey: `custom_${Date.now()}`,
                            title: 'New Field',
                            label: 'New Field Label',
                            placeholder: '',
                            type: 'text',
                            required: false,
                            order: (editingSection.items?.length || 0) + 1,
                            isVisible: true,
                          };
                          setEditingSection({ ...editingSection, items: [...(editingSection.items || []), newField] });
                        } else if (editingSection.sectionId === 'contact-direct') {
                          const newCard = {
                            id: `card-${Date.now()}`,
                            type: 'custom',
                            title: 'New Contact Location',
                            name: 'New Contact Location',
                            address: 'Office address or branch details',
                            description: 'Office address or branch details',
                            icon: 'MapPin',
                            link: '',
                            isVisible: true,
                          };
                          setEditingSection({ ...editingSection, items: [...(editingSection.items || []), newCard] });
                        } else if (editingSection.sectionId === 'products-comparison') {
                          const newRow = {
                            id: `row-${Date.now()}`,
                            attr: 'New Attribute',
                            title: 'New Attribute',
                            mova: '—',
                            penta: '—',
                            entra: '—',
                          };
                          setEditingSection({ ...editingSection, items: [...(editingSection.items || []), newRow] });
                        } else if (editingSection.sectionId === 'applications-categories') {
                          const newCat = {
                            id: `cat-${Date.now()}`,
                            name: 'New Category',
                            slug: `category-${Date.now()}`,
                            order: (editingSection.items?.length || 0),
                            isVisible: true,
                          };
                          setEditingSection({ ...editingSection, items: [...(editingSection.items || []), newCat] });
                        } else if (editingSection.sectionId === 'applications-cards') {
                          const newCard = {
                            id: `app-${Date.now()}`,
                            title: 'New Architectural Typology',
                            category: 'Residential',
                            categories: ['Residential'],
                            tagline: 'Modern architectural concept for bespoke desert living.',
                            description: 'Enter brief overview description of this modular application typology.',
                            detailedDescription: 'Detailed engineering specifications, thermal performance, and interior options.',
                            recommendedProducts: ['MOVA'],
                            compatibility: ['MOVA'],
                            image: '/assets/images/built_more_than_homes_01_web.jpg',
                            imageAlt: 'New Architectural Typology',
                            imagePosition: 'center center',
                            overviewBtnText: 'Overview',
                            overviewUrl: '/applications/modular-homes',
                            overviewOpenNewTab: false,
                            enquireBtnText: 'Enquire',
                            enquireUrl: '#enquiry',
                            showButtons: true,
                            order: (editingSection.items?.length || 0) + 1,
                            isVisible: true,
                            status: 'published',
                          };
                          setEditingSection({ ...editingSection, items: [...(editingSection.items || []), newCard] });
                        } else {
                          const newItem = {
                            id: `item-${Date.now()}`,
                            title: 'New Item',
                            subtitle: '',
                            description: '',
                            image: '/assets/images/ax.jpg',
                            url: '/assets/images/ax.jpg',
                            label: 'Scene Title',
                          };
                          setEditingSection({ ...editingSection, items: [...(editingSection.items || []), newItem] });
                        }
                      }}
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Plus size={14} />{' '}
                      {isHeroSection(editingSection)
                        ? `+ Add Hero Image (Hero Image ${(editingSection.items?.length || 0) + 1})`
                        : editingSection.sectionId === 'about-stats'
                        ? 'Add Metric Card'
                        : editingSection.sectionId === 'home-philosophy'
                        ? 'Add Pillar Card'
                        : editingSection.sectionId === 'about-philosophy'
                        ? 'Add Value Pillar'
                        : editingSection.sectionId === 'home-process'
                        ? 'Add Process Step'
                        : editingSection.sectionId === 'home-products'
                        ? 'Add Product Card'
                        : editingSection.sectionId === 'home-applications'
                        ? 'Add Application Card'
                        : editingSection.sectionId === 'contact-faq'
                        ? 'Add FAQ Question'
                        : editingSection.sectionId === 'contact-form'
                        ? 'Add Form Field'
                        : editingSection.sectionId === 'contact-direct'
                        ? 'Add Contact Card'
                        : editingSection.sectionId === 'products-comparison'
                        ? 'Add Comparison Row'
                        : editingSection.sectionId === 'applications-categories'
                        ? 'Add Category'
                        : editingSection.sectionId === 'applications-cards'
                        ? 'Add Application Card'
                        : 'Add Item'}
                    </button>
                  </div>

                  {(!editingSection.items || editingSection.items.length === 0) ? (
                    <div
                      style={{
                        padding: '2.5rem',
                        textAlign: 'center',
                        border: '2px dashed var(--admin-border-light)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--admin-surface-muted)',
                      }}
                    >
                      <Sparkles size={32} style={{ color: 'var(--admin-forest)', margin: '0 auto 0.75rem', opacity: 0.7 }} />
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-forest-dark)', margin: '0 0 0.5rem 0' }}>
                        No Hero Slider Images Added Yet
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                        Add your first cinematic banner image (Hero Image 1). Click below to get started.
                      </p>
                      <button
                        type="button"
                        onClick={addNewHeroSlide}
                        className="admin-btn admin-btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Plus size={15} /> Add Hero Image 1
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {editingSection.items.map((item, idx) => {
                        const isHero = isHeroSection(editingSection) || (item.id && String(item.id).toLowerCase().includes('hero')) || (item.url && item.url.includes('hero'));

                        // 0. DEDICATED HERO SLIDE EDITOR (Visual Live Preview, Direct Upload, Ultra Clean UX)
                        if (isHero) {
                          const slideImage = item.url || item.image || '';
                          const slidePosition = item.position || 'center 42%';
                          const slideNumber = idx + 1;
                          const isVisible = item.isVisible !== false;

                          return (
                            <div
                              key={item.id || idx}
                              style={{
                                border: '1px solid var(--admin-border-light)',
                                borderRadius: '10px',
                                backgroundColor: isVisible ? '#FFFFFF' : 'var(--admin-surface-muted)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                overflow: 'hidden',
                                transition: 'all 0.2s ease',
                                opacity: isVisible ? 1 : 0.8,
                              }}
                            >
                              {/* Slide Header: Hero Image 1, 2, 3, 4, 5 + Reorder / Duplicate / Visibility / Delete */}
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0.75rem 1rem',
                                  backgroundColor: 'rgba(82, 105, 75, 0.05)',
                                  borderBottom: '1px solid var(--admin-border-light)',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.4rem',
                                      backgroundColor: 'var(--admin-forest)',
                                      color: '#FAF8F5',
                                      fontSize: '0.78rem',
                                      fontWeight: 700,
                                      padding: '0.22rem 0.75rem',
                                      borderRadius: '9999px',
                                      letterSpacing: '0.03em',
                                    }}
                                  >
                                    <ImageIcon size={13} /> Hero Image {slideNumber}
                                  </span>

                                  {item.label && (
                                    <span
                                      style={{
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        color: 'var(--admin-forest-dark)',
                                        backgroundColor: 'rgba(255,255,255,0.7)',
                                        padding: '0.15rem 0.6rem',
                                        borderRadius: '4px',
                                        border: '1px solid var(--admin-border-light)',
                                      }}
                                    >
                                      {item.label}
                                    </span>
                                  )}

                                  {!isVisible && (
                                    <span
                                      style={{
                                        fontSize: '0.72rem',
                                        color: 'var(--admin-danger)',
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        padding: '0.15rem 0.45rem',
                                        borderRadius: '4px',
                                        fontWeight: 600,
                                      }}
                                    >
                                      Hidden on live website
                                    </span>
                                  )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => moveItem(idx, 'up')}
                                    className="admin-btn admin-btn-secondary"
                                    style={{ padding: '0.25rem 0.45rem', opacity: idx === 0 ? 0.3 : 1 }}
                                    title="Move Slide Up"
                                  >
                                    <MoveUp size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === (editingSection.items?.length || 1) - 1}
                                    onClick={() => moveItem(idx, 'down')}
                                    className="admin-btn admin-btn-secondary"
                                    style={{ padding: '0.25rem 0.45rem', opacity: idx === (editingSection.items?.length || 1) - 1 ? 0.3 : 1 }}
                                    title="Move Slide Down"
                                  >
                                    <MoveDown size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => duplicateItem(idx)}
                                    className="admin-btn admin-btn-secondary"
                                    style={{ padding: '0.25rem 0.45rem' }}
                                    title="Duplicate Slide"
                                  >
                                    <Copy size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newItems = [...(editingSection.items || [])];
                                      newItems[idx] = { ...newItems[idx], isVisible: newItems[idx].isVisible === false ? true : false };
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }}
                                    className="admin-btn admin-btn-secondary"
                                    style={{ padding: '0.25rem 0.45rem' }}
                                    title={isVisible ? 'Hide Slide from Website' : 'Show Slide on Website'}
                                  >
                                    {isVisible ? (
                                      <Eye size={13} style={{ color: 'var(--admin-forest)' }} />
                                    ) : (
                                      <EyeOff size={13} style={{ color: 'var(--admin-danger)' }} />
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`Delete Hero Image ${slideNumber}${item.label ? ` (${item.label})` : ''}?`)) {
                                        const newItems = editingSection.items?.filter((_, i) => i !== idx);
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--admin-danger)',
                                      cursor: 'pointer',
                                      padding: '0.25rem 0.4rem',
                                      marginLeft: '0.25rem',
                                    }}
                                    title="Delete Slide"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              {/* Slide Body: Visual Live Preview Left, Settings Right */}
                              <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                                {/* Left Column: Prominent Live Image Preview + Upload */}
                                <div>
                                  <div
                                    style={{
                                      width: '100%',
                                      height: '170px',
                                      borderRadius: '8px',
                                      overflow: 'hidden',
                                      backgroundColor: '#1E231D',
                                      position: 'relative',
                                      border: '1.5px solid var(--admin-border-light)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                    }}
                                  >
                                    {slideImage ? (
                                      <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={slideImage}
                                          alt={`Hero Image ${slideNumber}`}
                                          style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: slidePosition,
                                          }}
                                          onError={(e) => {
                                            (e.target as HTMLElement).style.display = 'none';
                                          }}
                                        />
                                        <div
                                          style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                            color: '#4ADE80',
                                            fontSize: '0.68rem',
                                            fontWeight: 600,
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            backdropFilter: 'blur(4px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                          }}
                                        >
                                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ADE80', display: 'inline-block' }} />
                                          Live Preview
                                        </div>
                                        <div
                                          style={{
                                            position: 'absolute',
                                            bottom: '8px',
                                            left: '8px',
                                            backgroundColor: 'rgba(0,0,0,0.75)',
                                            color: '#FAF8F5',
                                            fontSize: '0.68rem',
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            fontFamily: 'monospace',
                                            backdropFilter: 'blur(4px)',
                                          }}
                                        >
                                          {slidePosition}
                                        </div>
                                      </>
                                    ) : (
                                      <div style={{ textAlign: 'center', color: '#8C827A', padding: '1rem' }}>
                                        <ImageIcon size={32} style={{ margin: '0 auto 0.4rem', opacity: 0.5 }} />
                                        <span style={{ fontSize: '0.78rem', display: 'block', fontWeight: 500 }}>No Image Loaded</span>
                                        <span style={{ fontSize: '0.7rem', display: 'block', opacity: 0.7, marginTop: '0.2rem' }}>
                                          Click upload or enter URL
                                        </span>
                                      </div>
                                    )}

                                    {/* Upload Spinner Overlay */}
                                    {slideUploadingIndex === idx && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          inset: 0,
                                          backgroundColor: 'rgba(0,0,0,0.8)',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: '#FAF8F5',
                                          gap: '0.5rem',
                                          zIndex: 5,
                                        }}
                                      >
                                        <RefreshCw size={24} className="admin-spin" style={{ color: 'var(--admin-forest)' }} />
                                        <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Uploading to Cloudinary...</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Direct Device Upload Button */}
                                  <div style={{ marginTop: '0.65rem' }}>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      id={`slide-file-${idx}`}
                                      style={{ display: 'none' }}
                                      disabled={slideUploadingIndex === idx}
                                      onChange={(e) => handleSlideImageUpload(e, idx)}
                                    />
                                    <label
                                      htmlFor={`slide-file-${idx}`}
                                      className="admin-btn admin-btn-primary"
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.4rem',
                                        width: '100%',
                                        padding: '0.45rem 0.75rem',
                                        fontSize: '0.8rem',
                                        cursor: slideUploadingIndex === idx ? 'not-allowed' : 'pointer',
                                      }}
                                    >
                                      <UploadCloud size={15} />
                                      {slideUploadingIndex === idx ? 'Uploading Image...' : 'Upload Image from Device'}
                                    </label>
                                  </div>

                                  {/* Quick Presets Row: Hero 1, Hero 2, Hero 3, Hero 4, Hero 5 */}
                                  <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', fontWeight: 600 }}>Presets:</span>
                                    {[
                                      { name: 'Hero 1', url: '/assets/images/hero1.jpeg', label: 'Palm Residence' },
                                      { name: 'Hero 2', url: '/assets/images/hero 2.png', label: 'Twilight Villa' },
                                      { name: 'Hero 3', url: '/assets/images/hero3.jpeg', label: 'AlGhaf Pavilion' },
                                      { name: 'Hero 4', url: '/assets/renders/MOVA_EXT_3D_img1.jpg', label: 'MOVA Villa' },
                                      { name: 'Hero 5', url: '/assets/renders/CINE_EXT_3D_img1.jpg', label: 'Desert Oasis' },
                                    ].map((preset) => (
                                      <button
                                        key={preset.name}
                                        type="button"
                                        onClick={() => {
                                          const newItems = [...(editingSection.items || [])];
                                          newItems[idx] = {
                                            ...newItems[idx],
                                            url: preset.url,
                                            image: preset.url,
                                            label: newItems[idx].label || preset.label,
                                          };
                                          setEditingSection({ ...editingSection, items: newItems });
                                        }}
                                        style={{
                                          fontSize: '0.68rem',
                                          padding: '0.15rem 0.45rem',
                                          background: '#F1ECE4',
                                          border: '1px solid #D8D1C4',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          fontWeight: 500,
                                        }}
                                        title={preset.url}
                                      >
                                        {preset.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Right Column: Clean, User-Friendly Slide Inputs (NO TITLE/SUBTITLE/DESC/LINK CLUTTER) */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                  <div>
                                    <label className="admin-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                      <span style={{ fontWeight: 600 }}>Image Source URL (CDN or Local Asset)</span>
                                      <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>
                                        Cloudinary URL or /assets/...
                                      </span>
                                    </label>
                                    <input
                                      type="text"
                                      className="admin-input"
                                      value={item.url || item.image || ''}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = {
                                          ...newItems[idx],
                                          url: e.target.value,
                                          image: e.target.value,
                                        };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      placeholder="/assets/images/hero1.jpeg or https://res.cloudinary.com/..."
                                    />
                                  </div>

                                  <div>
                                    <label className="admin-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                      <span style={{ fontWeight: 600 }}>Scene Name / Label (Optional)</span>
                                      <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>
                                        Shown on homepage bottom scene pill (e.g. Palm Residence)
                                      </span>
                                    </label>
                                    <input
                                      type="text"
                                      className="admin-input"
                                      value={item.label || item.title || ''}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = {
                                          ...newItems[idx],
                                          label: e.target.value,
                                          title: e.target.value,
                                        };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      placeholder="e.g. Palm Residence, Twilight Villa..."
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }

                      // DEDICATED HOME PRODUCTS SHOWCASE EDITOR (MOVA, PENTA, ENTRA)
                      if (editingSection.sectionId === 'home-products') {
                        const prodImg = item.heroImage || item.image || '/assets/renders/MOVA_EXT_3D_img1.jpg';
                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              border: '1.5px solid var(--admin-border-light)',
                              borderRadius: '10px',
                              padding: '1.25rem',
                              backgroundColor: '#FFFFFF',
                              boxShadow: 'var(--admin-shadow-sm)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.75rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span
                                  style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--admin-forest)',
                                    color: '#FAF8F5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                  }}
                                >
                                  {idx + 1}
                                </span>
                                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--admin-forest-dark)', letterSpacing: '0.04em' }}>
                                  {item.name || item.title || `Product Card #${idx + 1}`}
                                </span>
                                {item.category && (
                                  <span
                                    style={{
                                      fontSize: '0.72rem',
                                      padding: '0.2rem 0.55rem',
                                      backgroundColor: 'rgba(82, 105, 75, 0.1)',
                                      color: 'var(--admin-forest)',
                                      borderRadius: '4px',
                                      fontWeight: 600,
                                    }}
                                  >
                                    {item.category}
                                  </span>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => moveItem(idx, 'up')}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem', opacity: idx === 0 ? 0.3 : 1 }}
                                  title="Move Up"
                                >
                                  <MoveUp size={13} />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (editingSection.items?.length || 1) - 1}
                                  onClick={() => moveItem(idx, 'down')}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem', opacity: idx === (editingSection.items?.length || 1) - 1 ? 0.3 : 1 }}
                                  title="Move Down"
                                >
                                  <MoveDown size={13} />
                                </button>
                              </div>
                            </div>

                            {/* Product Card Body: Visual Left, Inputs Right */}
                            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.25rem' }}>
                              {/* Left: Thumbnail Preview & Direct Asset Presets */}
                              <div>
                                <div
                                  style={{
                                    width: '100%',
                                    height: '140px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    backgroundColor: '#1E231D',
                                    position: 'relative',
                                    border: '1px solid var(--admin-border-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={prodImg}
                                    alt={item.name || ''}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                </div>

                                <div style={{ marginTop: '0.65rem' }}>
                                  <label className="admin-label" style={{ fontSize: '0.72rem', marginBottom: '0.35rem' }}>Quick Asset Preset</label>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], heroImage: '/assets/renders/MOVA_EXT_3D_img1.jpg', image: '/assets/renders/MOVA_EXT_3D_img1.jpg' };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      className="admin-btn admin-btn-secondary"
                                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', justifyContent: 'flex-start' }}
                                    >
                                      🏡 MOVA Pool Villa
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], heroImage: '/assets/images/imgupscaler-enhanced-7.jpg', image: '/assets/images/imgupscaler-enhanced-7.jpg' };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      className="admin-btn admin-btn-secondary"
                                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', justifyContent: 'flex-start' }}
                                    >
                                      🌲 PENTA Timber Villa
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], heroImage: '/assets/renders/CINE_EXT_3D_img1.jpg', image: '/assets/renders/CINE_EXT_3D_img1.jpg' };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      className="admin-btn admin-btn-secondary"
                                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', justifyContent: 'flex-start' }}
                                    >
                                      🎬 ENTRA Pavilion + SUV
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Product Details Fields */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                  <div>
                                    <label className="admin-label">Product Name</label>
                                    <input
                                      type="text"
                                      className="admin-input"
                                      value={item.name || item.title || ''}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], name: e.target.value, title: e.target.value };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      placeholder="e.g. MOVA"
                                    />
                                  </div>
                                  <div>
                                    <label className="admin-label">Category Badge (e.g. Modular Living)</label>
                                    <input
                                      type="text"
                                      className="admin-input"
                                      value={item.category || ''}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], category: e.target.value };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      placeholder="e.g. Modular Living"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="admin-label">Tagline (Italic line under title)</label>
                                  <input
                                    type="text"
                                    className="admin-input"
                                    value={item.tagline || item.subtitle || ''}
                                    onChange={(e) => {
                                      const newItems = [...(editingSection.items || [])];
                                      newItems[idx] = { ...newItems[idx], tagline: e.target.value, subtitle: e.target.value };
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }}
                                    placeholder="e.g. One System. Endless Possibilities."
                                  />
                                </div>

                                <div>
                                  <label className="admin-label">Short Description</label>
                                  <textarea
                                    rows={2}
                                    className="admin-textarea"
                                    value={item.shortDescription || item.description || ''}
                                    onChange={(e) => {
                                      const newItems = [...(editingSection.items || [])];
                                      newItems[idx] = { ...newItems[idx], shortDescription: e.target.value, description: e.target.value };
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }}
                                    placeholder="Description of this product model..."
                                  />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                                  <div>
                                    <label className="admin-label">Product Image & Upload</label>
                                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                      <input
                                        type="text"
                                        className="admin-input"
                                        style={{ flex: 1 }}
                                        value={item.heroImage || item.image || ''}
                                        onChange={(e) => {
                                          const newItems = [...(editingSection.items || [])];
                                          newItems[idx] = { ...newItems[idx], heroImage: e.target.value, image: e.target.value, url: e.target.value };
                                          setEditingSection({ ...editingSection, items: newItems });
                                        }}
                                        placeholder="/assets/renders/MOVA_EXT_3D_img1.jpg"
                                      />
                                      <input
                                        type="file"
                                        accept="image/*"
                                        id={`product-page-img-${idx}`}
                                        style={{ display: 'none' }}
                                        disabled={slideUploadingIndex === idx}
                                        onChange={(e) => handleSlideImageUpload(e, idx)}
                                      />
                                      <label
                                        htmlFor={`product-page-img-${idx}`}
                                        className="admin-btn admin-btn-primary"
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.35rem',
                                          cursor: slideUploadingIndex === idx ? 'not-allowed' : 'pointer',
                                          whiteSpace: 'nowrap',
                                          padding: '0.45rem 0.75rem',
                                          fontSize: '0.78rem',
                                          fontWeight: 600,
                                        }}
                                        title="Upload photo from device"
                                      >
                                        {slideUploadingIndex === idx ? <RefreshCw className="animate-spin" size={14} /> : <UploadCloud size={14} />}
                                        {slideUploadingIndex === idx ? 'Uploading...' : 'Upload'}
                                      </label>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="admin-label">Product Slug</label>
                                    <input
                                      type="text"
                                      className="admin-input"
                                      value={item.slug || item.id || ''}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], slug: e.target.value, id: e.target.value };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      placeholder="mova"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // 1. DEDICATED FAQ ITEM EDITOR
                      if (editingSection.sectionId === 'contact-faq') {
                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              border: '1px solid var(--admin-border-light)',
                              borderRadius: '8px',
                              padding: '1.25rem',
                              backgroundColor: item.isVisible !== false ? '#FFFFFF' : 'var(--admin-surface-muted)',
                              boxShadow: 'var(--admin-shadow-sm)',
                              opacity: item.isVisible !== false ? 1 : 0.75,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span
                                  style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--admin-forest)',
                                    color: '#FAF8F5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                  }}
                                >
                                  {idx + 1}
                                </span>
                                <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--admin-forest-dark)' }}>
                                  {item.question || item.title || `FAQ Question #${idx + 1}`}
                                </span>
                                {item.category && (
                                  <span
                                    style={{
                                      fontSize: '0.72rem',
                                      padding: '0.15rem 0.5rem',
                                      backgroundColor: 'rgba(82, 105, 75, 0.08)',
                                      color: 'var(--admin-forest)',
                                      borderRadius: '4px',
                                      fontWeight: 500,
                                    }}
                                  >
                                    {item.category}
                                  </span>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => moveItem(idx, 'up')}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem', opacity: idx === 0 ? 0.3 : 1 }}
                                  title="Move Up"
                                >
                                  <MoveUp size={13} />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (editingSection.items?.length || 1) - 1}
                                  onClick={() => moveItem(idx, 'down')}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem', opacity: idx === (editingSection.items?.length || 1) - 1 ? 0.3 : 1 }}
                                  title="Move Down"
                                >
                                  <MoveDown size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => duplicateItem(idx)}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem' }}
                                  title="Duplicate FAQ"
                                >
                                  <Copy size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], isVisible: newItems[idx].isVisible === false ? true : false };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem' }}
                                  title={item.isVisible === false ? 'Show FAQ' : 'Hide FAQ'}
                                >
                                  {item.isVisible === false ? (
                                    <EyeOff size={13} style={{ color: 'var(--admin-danger)' }} />
                                  ) : (
                                    <Eye size={13} style={{ color: 'var(--admin-forest)' }} />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Delete question: "${item.question || item.title}"?`)) {
                                      const newItems = editingSection.items?.filter((_, i) => i !== idx);
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }
                                  }}
                                  style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '0.25rem' }}
                                  title="Delete Question"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                              <div>
                                <label className="admin-label">Question Text</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.question || item.title || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], question: e.target.value, title: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="e.g. Do AlGhaf modular homes comply with UAE municipal building regulations?"
                                />
                              </div>
                              <div>
                                <label className="admin-label">Category / Topic</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.category || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], category: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="e.g. General"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="admin-label">Complete Detailed Answer</label>
                              <textarea
                                rows={4}
                                className="admin-textarea"
                                value={item.answer || item.description || ''}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.items || [])];
                                  newItems[idx] = { ...newItems[idx], answer: e.target.value, description: e.target.value };
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                placeholder="Enter approved official answer..."
                              />
                            </div>
                          </div>
                        );
                      }

                      // 2. DEDICATED FORM BUILDER FIELD EDITOR
                      if (editingSection.sectionId === 'contact-form') {
                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              border: '1px solid var(--admin-border-light)',
                              borderRadius: '8px',
                              padding: '1.25rem',
                              backgroundColor: item.isVisible !== false ? '#FFFFFF' : 'var(--admin-surface-muted)',
                              boxShadow: 'var(--admin-shadow-sm)',
                              opacity: item.isVisible !== false ? 1 : 0.75,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span
                                  style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--admin-forest)',
                                    color: '#FAF8F5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                  }}
                                >
                                  {idx + 1}
                                </span>
                                <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--admin-forest-dark)' }}>
                                  {item.label || item.title || `Form Field #${idx + 1}`}
                                </span>
                                <span
                                  style={{
                                    fontSize: '0.72rem',
                                    padding: '0.15rem 0.5rem',
                                    backgroundColor: 'rgba(82, 105, 75, 0.08)',
                                    color: 'var(--admin-forest)',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                  }}
                                >
                                  type: {item.type || 'text'}
                                </span>
                                {item.required && (
                                  <span className="admin-badge admin-badge-active" style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem' }}>
                                    Required
                                  </span>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => moveItem(idx, 'up')}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem', opacity: idx === 0 ? 0.3 : 1 }}
                                  title="Move Up"
                                >
                                  <MoveUp size={13} />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (editingSection.items?.length || 1) - 1}
                                  onClick={() => moveItem(idx, 'down')}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem', opacity: idx === (editingSection.items?.length || 1) - 1 ? 0.3 : 1 }}
                                  title="Move Down"
                                >
                                  <MoveDown size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], isVisible: newItems[idx].isVisible === false ? true : false };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem' }}
                                  title={item.isVisible === false ? 'Show Field' : 'Hide Field'}
                                >
                                  {item.isVisible === false ? (
                                    <EyeOff size={13} style={{ color: 'var(--admin-danger)' }} />
                                  ) : (
                                    <Eye size={13} style={{ color: 'var(--admin-forest)' }} />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Delete field "${item.label || item.title}"?`)) {
                                      const newItems = editingSection.items?.filter((_, i) => i !== idx);
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }
                                  }}
                                  style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '0.25rem' }}
                                  title="Delete Field"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                              <div>
                                <label className="admin-label">Field Label (Displayed to User)</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.label || item.title || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], label: e.target.value, title: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="e.g. Full Name *"
                                />
                              </div>

                              <div>
                                <label className="admin-label">Input Type</label>
                                <select
                                  className="admin-select"
                                  value={item.type || 'text'}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], type: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                >
                                  <option value="text">Text Single Line</option>
                                  <option value="email">Email Address</option>
                                  <option value="tel">Phone / WhatsApp</option>
                                  <option value="select">Dropdown Select</option>
                                  <option value="textarea">Multiline Text Area</option>
                                </select>
                              </div>

                              <div>
                                <label className="admin-label">Validation</label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                                  <input
                                    type="checkbox"
                                    checked={!!item.required}
                                    onChange={(e) => {
                                      const newItems = [...(editingSection.items || [])];
                                      newItems[idx] = { ...newItems[idx], required: e.target.checked };
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }}
                                  />
                                  <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-main)' }}>Required field</span>
                                </label>
                              </div>
                            </div>

                            <div style={{ marginBottom: '0.75rem' }}>
                              <label className="admin-label">Input Placeholder</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={item.placeholder || ''}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.items || [])];
                                  newItems[idx] = { ...newItems[idx], placeholder: e.target.value };
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                placeholder="Field placeholder (leave blank for none)"
                              />
                            </div>

                            {item.type === 'select' && (
                              <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--admin-surface-muted)', borderRadius: '6px' }}>
                                <label className="admin-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>Dropdown Choices (One option per line)</span>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>
                                    {Array.isArray(item.options) ? item.options.length : 0} options
                                  </span>
                                </label>
                                <textarea
                                  rows={4}
                                  className="admin-textarea"
                                  value={Array.isArray(item.options) ? item.options.join('\n') : ''}
                                  onChange={(e) => {
                                    const lines = e.target.value.split('\n');
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], options: lines };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="Enter each dropdown choice on a new line..."
                                />
                              </div>
                            )}
                          </div>
                        );
                      }

                      // 3. DEDICATED DIRECT CONTACT CARDS EDITOR
                      if (editingSection.sectionId === 'contact-direct') {
                        const isPhone = item.type === 'phone' || item.id === 'phone-whatsapp';
                        const isEmail = item.type === 'email' || item.id === 'email';
                        const isHeadquarters = item.type === 'headquarters' || item.id === 'headquarters';
                        const isHours = item.type === 'hours' || item.id === 'working-hours';

                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              border: '1px solid var(--admin-border-light)',
                              borderRadius: '8px',
                              padding: '1.25rem',
                              backgroundColor: item.isVisible !== false ? '#FFFFFF' : 'var(--admin-surface-muted)',
                              boxShadow: 'var(--admin-shadow-sm)',
                              opacity: item.isVisible !== false ? 1 : 0.75,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div
                                  style={{
                                    padding: '0.45rem',
                                    borderRadius: '4px',
                                    backgroundColor: 'rgba(82, 105, 75, 0.08)',
                                    color: 'var(--admin-forest)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {isHeadquarters ? <MapPin size={16} /> : isPhone ? <Phone size={16} /> : isEmail ? <Mail size={16} /> : <Clock size={16} />}
                                </div>
                                <div>
                                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--admin-forest-dark)' }}>
                                    {item.title || item.name || `Contact Card #${idx + 1}`}
                                  </span>
                                  <span
                                    style={{
                                      marginLeft: '0.5rem',
                                      fontSize: '0.72rem',
                                      fontFamily: 'monospace',
                                      color: 'var(--admin-text-muted)',
                                    }}
                                  >
                                    #{item.id}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], isVisible: newItems[idx].isVisible === false ? true : false };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                  title={item.isVisible === false ? 'Show Card' : 'Hide Card'}
                                >
                                  {item.isVisible === false ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--admin-danger)' }}>
                                      <EyeOff size={14} /> Hidden
                                    </span>
                                  ) : (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--admin-forest)' }}>
                                      <Eye size={14} /> Visible
                                    </span>
                                  )}
                                </button>
                              </div>
                            </div>

                            <div style={{ marginBottom: '0.75rem' }}>
                              <label className="admin-label">Card Title</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={item.title || item.name || ''}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.items || [])];
                                  newItems[idx] = { ...newItems[idx], title: e.target.value, name: e.target.value };
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                              />
                            </div>

                            {isHeadquarters && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div>
                                  <label className="admin-label">Office Address</label>
                                  <textarea
                                    rows={2}
                                    className="admin-textarea"
                                    value={item.address || item.description || ''}
                                    onChange={(e) => {
                                      const newItems = [...(editingSection.items || [])];
                                      newItems[idx] = { ...newItems[idx], address: e.target.value, description: e.target.value };
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }}
                                    placeholder="Dubai Design District (d3), Building 7, Dubai, United Arab Emirates"
                                  />
                                </div>
                                <div>
                                  <label className="admin-label">Google Maps Directions URL</label>
                                  <input
                                    type="text"
                                    className="admin-input"
                                    value={item.link || ''}
                                    onChange={(e) => {
                                      const newItems = [...(editingSection.items || [])];
                                      newItems[idx] = { ...newItems[idx], link: e.target.value };
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }}
                                    placeholder="https://maps.google.com/?q=..."
                                  />
                                </div>
                              </div>
                            )}

                            {isPhone && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                  <label className="admin-label">Main Landline Phone</label>
                                  <input
                                    type="text"
                                    className="admin-input"
                                    value={item.phone || ''}
                                    onChange={(e) => {
                                      const newItems = [...(editingSection.items || [])];
                                      newItems[idx] = {
                                        ...newItems[idx],
                                        phone: e.target.value,
                                        link: `tel:${e.target.value.replace(/\s+/g, '')}`,
                                      };
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }}
                                    placeholder="+971 4 288 9412"
                                  />
                                </div>
                                <div>
                                  <label className="admin-label">WhatsApp Number</label>
                                  <input
                                    type="text"
                                    className="admin-input"
                                    value={item.whatsapp || ''}
                                    onChange={(e) => {
                                      const newItems = [...(editingSection.items || [])];
                                      newItems[idx] = {
                                        ...newItems[idx],
                                        whatsapp: e.target.value,
                                        whatsappLink: `https://wa.me/${e.target.value.replace(/[^0-9]/g, '')}`,
                                      };
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }}
                                    placeholder="+971 50 892 4110"
                                  />
                                </div>
                              </div>
                            )}

                            {isEmail && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div>
                                  <label className="admin-label">Inquiries Email Address</label>
                                  <input
                                    type="email"
                                    className="admin-input"
                                    value={item.email || ''}
                                    onChange={(e) => {
                                      const newItems = [...(editingSection.items || [])];
                                      newItems[idx] = {
                                        ...newItems[idx],
                                        email: e.target.value,
                                        description: e.target.value,
                                        link: `mailto:${e.target.value}`,
                                      };
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }}
                                    placeholder="info@alghafcollective.ae"
                                  />
                                </div>
                              </div>
                            )}

                            {isHours && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                                  <div>
                                    <label className="admin-label">Working Days</label>
                                    <input
                                      type="text"
                                      className="admin-input"
                                      value={item.workingDays || 'Monday – Friday'}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], workingDays: e.target.value };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      placeholder="Monday – Friday"
                                    />
                                  </div>
                                  <div>
                                    <label className="admin-label">Daily Hours</label>
                                    <input
                                      type="text"
                                      className="admin-input"
                                      value={item.workingHours || '9:00 AM – 6:00 PM'}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], workingHours: e.target.value };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      placeholder="9:00 AM – 6:00 PM"
                                    />
                                  </div>
                                  <div>
                                    <label className="admin-label">Time Zone Label</label>
                                    <input
                                      type="text"
                                      className="admin-input"
                                      value={item.timeZone || 'GST'}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], timeZone: e.target.value };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      placeholder="GST"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="admin-label">Display Narrative (Combined summary)</label>
                                  <input
                                    type="text"
                                    className="admin-input"
                                    value={item.description || ''}
                                    onChange={(e) => {
                                      const newItems = [...(editingSection.items || [])];
                                      newItems[idx] = { ...newItems[idx], description: e.target.value };
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }}
                                    placeholder="Monday – Friday: 9:00 AM – 6:00 PM GST"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }

                      // 4. DEDICATED PRODUCTS COMPARISON ROW EDITOR
                      if (editingSection.sectionId === 'products-comparison' || item.attr !== undefined || item.mova !== undefined) {
                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              border: '1px solid var(--admin-border-light)',
                              borderRadius: '6px',
                              padding: '1rem',
                              backgroundColor: 'var(--admin-surface-muted)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--admin-forest-dark)' }}>
                                Comparison Row #{idx + 1} — {item.attr || item.title || 'Specification'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = editingSection.items?.filter((_, i) => i !== idx);
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '0.2rem' }}
                                title="Remove Item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: '0.65rem' }}>
                              <div>
                                <label className="admin-label">Attribute / Specification</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.attr || item.title || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], attr: e.target.value, title: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="e.g. Footprint Range"
                                />
                              </div>
                              <div>
                                <label className="admin-label">MOVA Value</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.mova || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], mova: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="e.g. 30 m² to 75 m²"
                                />
                              </div>
                              <div>
                                <label className="admin-label">PENTA Value</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.penta || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], penta: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="e.g. 50 m² to 300 m²"
                                />
                              </div>
                              <div>
                                <label className="admin-label">ENTRA Value</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.entra || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], entra: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="e.g. 3 Standard Sizes"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // 5. DEDICATED ORIGIN METRIC CARDS EDITOR (about-stats: 50%, 1, 30–300 m²)
                      if (editingSection.sectionId === 'about-stats') {
                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              border: '1px solid var(--admin-border-light)',
                              borderRadius: '8px',
                              padding: '1.1rem',
                              backgroundColor: '#FFFFFF',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span
                                  style={{
                                    backgroundColor: 'var(--admin-forest)',
                                    color: '#FAF8F5',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '9999px',
                                  }}
                                >
                                  Metric Card #{idx + 1}
                                </span>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--admin-forest-dark)' }}>
                                  {item.number || '0'} — {item.title || 'Performance Metric'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = editingSection.items?.filter((_, i) => i !== idx);
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '0.25rem' }}
                                title="Remove Metric Card"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                              <div>
                                <label className="admin-label">Metric Value / Stat (e.g. 50%, 1, 30–300 m²)</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.number || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], number: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="e.g. 50%"
                                />
                              </div>
                              <div>
                                <label className="admin-label">Metric Title / Headline</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.title || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], title: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="e.g. Faster Delivery"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="admin-label">Metric Narrative & Benchmark Description</label>
                              <textarea
                                rows={2}
                                className="admin-textarea"
                                value={item.description || ''}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.items || [])];
                                  newItems[idx] = { ...newItems[idx], description: e.target.value };
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                placeholder="Factory-controlled prefabrication compresses project timelines compared to conventional site construction."
                              />
                            </div>
                          </div>
                        );
                      }

                      // 6. DEDICATED CORE PILLARS EDITOR (home-philosophy: Comfort, Quality, Speed, Value)
                      if (editingSection.sectionId === 'home-philosophy') {
                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              border: '1px solid var(--admin-border-light)',
                              borderRadius: '8px',
                              padding: '1.1rem',
                              backgroundColor: '#FFFFFF',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span
                                  style={{
                                    backgroundColor: 'var(--admin-forest)',
                                    color: '#FAF8F5',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '9999px',
                                  }}
                                >
                                  Pillar #{idx + 1}
                                </span>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--admin-forest-dark)' }}>
                                  {item.number || `0${idx + 1}`} — {item.title || 'Core Pillar'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = editingSection.items?.filter((_, i) => i !== idx);
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '0.25rem' }}
                                title="Remove Pillar Card"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '90px 1.2fr 1.5fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                              <div>
                                <label className="admin-label">Number</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.number || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], number: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="01"
                                />
                              </div>
                              <div>
                                <label className="admin-label">Pillar Title</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.title || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], title: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="Comfort"
                                />
                              </div>
                              <div>
                                <label className="admin-label">Pillar Subtitle</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.subtitle || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], subtitle: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="Engineered for thermal performance"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="admin-label">Pillar Description</label>
                              <textarea
                                rows={2}
                                className="admin-textarea"
                                value={item.description || ''}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.items || [])];
                                  newItems[idx] = { ...newItems[idx], description: e.target.value };
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                placeholder="High-performance thermal envelopes and airtight assemblies..."
                              />
                            </div>
                          </div>
                        );
                      }

                      // 7. DEDICATED VALUE PILLARS EDITOR (about-philosophy)
                      if (editingSection.sectionId === 'about-philosophy') {
                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              border: '1px solid var(--admin-border-light)',
                              borderRadius: '8px',
                              padding: '1.1rem',
                              backgroundColor: '#FFFFFF',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span
                                  style={{
                                    backgroundColor: 'var(--admin-forest)',
                                    color: '#FAF8F5',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '9999px',
                                  }}
                                >
                                  Value Pillar #{idx + 1}
                                </span>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--admin-forest-dark)' }}>
                                  {item.title || 'Integrated Value Driver'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = editingSection.items?.filter((_, i) => i !== idx);
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '0.25rem' }}
                                title="Remove Value Pillar"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div style={{ marginBottom: '0.75rem' }}>
                              <label className="admin-label">Pillar Title (e.g. Unified Accountability)</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={item.title || ''}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.items || [])];
                                  newItems[idx] = { ...newItems[idx], title: e.target.value };
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                placeholder="Unified Accountability"
                              />
                            </div>

                            <div>
                              <label className="admin-label">Pillar Narrative & Detail</label>
                              <textarea
                                rows={2}
                                className="admin-textarea"
                                value={item.description || ''}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.items || [])];
                                  newItems[idx] = { ...newItems[idx], description: e.target.value };
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                placeholder="Single-source ownership from initial sketch through turnkey handover..."
                              />
                            </div>
                          </div>
                        );
                      }

                      // 8. DEDICATED PROCESS STEPS EDITOR (home-process: Design, Prefabricate, Build)
                      if (editingSection.sectionId === 'home-process') {
                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              border: '1px solid var(--admin-border-light)',
                              borderRadius: '8px',
                              padding: '1.1rem',
                              backgroundColor: '#FFFFFF',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span
                                  style={{
                                    backgroundColor: 'var(--admin-forest)',
                                    color: '#FAF8F5',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '9999px',
                                  }}
                                >
                                  Process Step #{idx + 1}
                                </span>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--admin-forest-dark)' }}>
                                  {item.number || `0${idx + 1}`} — {item.title || 'Step'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = editingSection.items?.filter((_, i) => i !== idx);
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '0.25rem' }}
                                title="Remove Step"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                              <div>
                                <label className="admin-label">Step #</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.number || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], number: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="01"
                                />
                              </div>
                              <div>
                                <label className="admin-label">Step Title</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.title || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], title: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="Design Smarter."
                                />
                              </div>
                            </div>

                            <div>
                              <label className="admin-label">Step Description</label>
                              <textarea
                                rows={2}
                                className="admin-textarea"
                                value={item.description || ''}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.items || [])];
                                  newItems[idx] = { ...newItems[idx], description: e.target.value };
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                placeholder="Architecture, planning and BIM for spaces that are functional, beautiful and future-ready."
                              />
                            </div>
                          </div>
                        );
                      }

                      // 9. DEDICATED PRODUCT SHOWCASE CARDS EDITOR (home-products: MOVA, PENTA, ENTRA)
                      if (editingSection.sectionId === 'home-products') {
                        const cardImg = item.heroImage || item.image || '';
                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              border: '1px solid var(--admin-border-light)',
                              borderRadius: '8px',
                              padding: '1.1rem',
                              backgroundColor: '#FFFFFF',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span
                                  style={{
                                    backgroundColor: 'var(--admin-forest)',
                                    color: '#FAF8F5',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '9999px',
                                  }}
                                >
                                  Product #{idx + 1}
                                </span>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--admin-forest-dark)' }}>
                                  {item.name || item.title || 'Product Model'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = editingSection.items?.filter((_, i) => i !== idx);
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '0.25rem' }}
                                title="Remove Product Card"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                              <div>
                                <label className="admin-label">Product Name / Model</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.name || item.title || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], name: e.target.value, title: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="MOVA"
                                />
                              </div>
                              <div>
                                <label className="admin-label">Category</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.category || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], category: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="Modular Living"
                                />
                              </div>
                              <div>
                                <label className="admin-label">Slug / ID</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.slug || item.id || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], slug: e.target.value, id: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="mova"
                                />
                              </div>
                            </div>

                            <div style={{ marginBottom: '0.75rem' }}>
                              <label className="admin-label">Tagline / Headline</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={item.tagline || item.subtitle || ''}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.items || [])];
                                  newItems[idx] = { ...newItems[idx], tagline: e.target.value, subtitle: e.target.value };
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                placeholder="One System. Endless Possibilities."
                              />
                            </div>

                            <div style={{ marginBottom: '0.75rem' }}>
                              <label className="admin-label">Description</label>
                              <textarea
                                rows={2}
                                className="admin-textarea"
                                value={item.shortDescription || item.description || ''}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.items || [])];
                                  newItems[idx] = { ...newItems[idx], shortDescription: e.target.value, description: e.target.value };
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                placeholder="A versatile modular building system engineered to create adaptable spaces..."
                              />
                            </div>

                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                <label className="admin-label" style={{ margin: 0, fontWeight: 600 }}>Product Showcase Image & Upload</label>
                                <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>
                                  Upload from device or enter URL
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                                {cardImg && (
                                  <div
                                    style={{
                                      width: '64px',
                                      height: '44px',
                                      borderRadius: '4px',
                                      overflow: 'hidden',
                                      backgroundColor: '#1E231D',
                                      border: '1.5px solid var(--admin-border-light)',
                                      flexShrink: 0,
                                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    }}
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={cardImg}
                                      alt=""
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}
                                <input
                                  type="text"
                                  className="admin-input"
                                  style={{ flex: 1, minWidth: '220px' }}
                                  value={cardImg}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], heroImage: e.target.value, image: e.target.value, url: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="/assets/renders/MOVA_EXT_3D_img1.jpg or Cloudinary URL"
                                />

                                <div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id={`home-product-img-${idx}`}
                                    style={{ display: 'none' }}
                                    disabled={slideUploadingIndex === idx}
                                    onChange={(e) => handleSlideImageUpload(e, idx)}
                                  />
                                  <label
                                    htmlFor={`home-product-img-${idx}`}
                                    className="admin-btn admin-btn-primary"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.4rem',
                                      padding: '0.48rem 0.95rem',
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      cursor: slideUploadingIndex === idx ? 'not-allowed' : 'pointer',
                                      whiteSpace: 'nowrap',
                                    }}
                                    title="Upload photo from device"
                                  >
                                    {slideUploadingIndex === idx ? (
                                      <>
                                        <RefreshCw size={14} className="animate-spin" />
                                        <span>Uploading...</span>
                                      </>
                                    ) : (
                                      <>
                                        <UploadCloud size={14} />
                                        <span>Upload Image</span>
                                      </>
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // 10. DEDICATED APPLICATION SHOWCASE CARDS EDITOR (home-applications)
                      if (editingSection.sectionId === 'home-applications') {
                        const officialPresets = [
                          {
                            id: 'modular-homes',
                            title: 'Modular Homes & Private Residences',
                            category: 'Residential',
                            image: '/assets/images/built_more_than_homes_01_web.jpg',
                            link: '/applications/modular-homes',
                            presetLabel: '01 Residential (Desert Home)',
                          },
                          {
                            id: 'hospitality-resorts',
                            title: 'Hospitality & Boutique Resorts',
                            category: 'Hospitality',
                            image: '/assets/images/built_more_than_homes_02_web.jpg',
                            link: '/applications/hospitality',
                            presetLabel: '02 Hospitality (Pool Villas)',
                          },
                          {
                            id: 'farm-living-estates',
                            title: 'Farm Living & Desert Ranches',
                            category: 'Residential & Agriculture',
                            image: '/assets/images/built_more_than_homes_03_web.jpg',
                            link: '/applications/farm-living',
                            presetLabel: '03 Farm & Ranch (Solar Barn)',
                          },
                          {
                            id: 'eco-developments',
                            title: 'Eco Retreats & Nature Escapes',
                            category: 'Hospitality & Wellness',
                            image: '/assets/images/built_more_than_homes_04_web.jpg',
                            link: '/applications/eco-retreats',
                            presetLabel: '04 Eco Retreat (Timber Pavilion)',
                          },
                        ];

                        const preset = officialPresets[idx % officialPresets.length];
                        let appImg = item.image || item.url || '';
                        if (!appImg || appImg.includes('/assets/images/app2.jpg') || appImg.includes('/assets/images/app3.jpg') || appImg.includes('/assets/images/app4.jpg')) {
                          appImg = preset.image;
                        }

                        const isUploading = slideUploadingIndex === idx;
                        const isVisible = item.isVisible !== false;

                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              border: '1.5px solid var(--admin-border-light)',
                              borderRadius: '10px',
                              backgroundColor: isVisible ? '#FFFFFF' : 'var(--admin-surface-muted)',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                              overflow: 'hidden',
                              transition: 'all 0.2s ease',
                              opacity: isVisible ? 1 : 0.8,
                            }}
                          >
                            {/* Card Header: Application Card #X + Controls */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.75rem 1rem',
                                backgroundColor: 'rgba(82, 105, 75, 0.05)',
                                borderBottom: '1px solid var(--admin-border-light)',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    backgroundColor: 'var(--admin-forest)',
                                    color: '#FAF8F5',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    padding: '0.22rem 0.75rem',
                                    borderRadius: '9999px',
                                    letterSpacing: '0.03em',
                                  }}
                                >
                                  <ImageIcon size={13} /> Card #{idx + 1}
                                </span>
                                <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--admin-forest-dark)' }}>
                                  {item.title || preset.title}
                                </span>
                                {item.category && (
                                  <span
                                    style={{
                                      fontSize: '0.72rem',
                                      fontWeight: 600,
                                      color: 'var(--admin-forest-dark)',
                                      backgroundColor: 'rgba(255,255,255,0.85)',
                                      padding: '0.15rem 0.55rem',
                                      borderRadius: '4px',
                                      border: '1px solid var(--admin-border-light)',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.04em',
                                    }}
                                  >
                                    {item.category}
                                  </span>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => moveItem(idx, 'up')}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem', opacity: idx === 0 ? 0.3 : 1 }}
                                  title="Move Card Left/Up"
                                >
                                  <MoveUp size={13} />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (editingSection.items?.length || 1) - 1}
                                  onClick={() => moveItem(idx, 'down')}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem', opacity: idx === (editingSection.items?.length || 1) - 1 ? 0.3 : 1 }}
                                  title="Move Card Right/Down"
                                >
                                  <MoveDown size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => duplicateItem(idx)}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem' }}
                                  title="Duplicate Card"
                                >
                                  <Copy size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], isVisible: newItems[idx].isVisible === false ? true : false };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem' }}
                                  title={isVisible ? 'Hide Card' : 'Show Card'}
                                >
                                  {isVisible ? (
                                    <Eye size={13} style={{ color: 'var(--admin-forest)' }} />
                                  ) : (
                                    <EyeOff size={13} style={{ color: 'var(--admin-danger)' }} />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Delete Application Card #${idx + 1} (${item.title || 'Untitled'})?`)) {
                                      const newItems = editingSection.items?.filter((_, i) => i !== idx);
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--admin-danger)',
                                    cursor: 'pointer',
                                    padding: '0.25rem 0.4rem',
                                    marginLeft: '0.25rem',
                                  }}
                                  title="Delete Card"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Card Body: Visual Live Preview Left (270px), Form Right */}
                            <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '270px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                              {/* Left Column: Prominent Visual Card Preview & Upload */}
                              <div>
                                <div
                                  style={{
                                    width: '100%',
                                    height: '185px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    backgroundColor: '#1E231D',
                                    position: 'relative',
                                    border: '1.5px solid var(--admin-border-light)',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                  }}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={appImg}
                                    alt={item.title || 'Application'}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                    }}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = preset.image;
                                    }}
                                  />
                                  {/* Overlay simulating website card appearance */}
                                  <div
                                    style={{
                                      position: 'absolute',
                                      inset: 0,
                                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(10,18,12,0.85) 100%)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'space-between',
                                      padding: '0.75rem',
                                      pointerEvents: 'none',
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                      <span
                                        style={{
                                          backgroundColor: 'rgba(0,0,0,0.65)',
                                          color: '#4ADE80',
                                          fontSize: '0.68rem',
                                          fontWeight: 600,
                                          padding: '0.18rem 0.5rem',
                                          borderRadius: '4px',
                                          backdropFilter: 'blur(4px)',
                                        }}
                                      >
                                        Live Preview
                                      </span>
                                    </div>
                                    <div>
                                      <span
                                        style={{
                                          display: 'block',
                                          fontSize: '0.65rem',
                                          color: '#D4AF37',
                                          fontWeight: 700,
                                          letterSpacing: '0.08em',
                                          textTransform: 'uppercase',
                                          marginBottom: '0.2rem',
                                        }}
                                      >
                                        {item.category || preset.category}
                                      </span>
                                      <h4
                                        style={{
                                          fontSize: '0.82rem',
                                          color: '#FAF8F5',
                                          fontWeight: 500,
                                          lineHeight: 1.3,
                                          margin: 0,
                                        }}
                                      >
                                        {item.title || preset.title}
                                      </h4>
                                    </div>
                                  </div>
                                </div>

                                {/* Upload button */}
                                <div style={{ marginTop: '0.65rem' }}>
                                  <label
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '0.45rem',
                                      width: '100%',
                                      padding: '0.55rem 0.85rem',
                                      backgroundColor: 'var(--admin-forest)',
                                      color: '#FAF8F5',
                                      borderRadius: '6px',
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      cursor: isUploading ? 'not-allowed' : 'pointer',
                                      transition: 'background-color 0.15s ease',
                                    }}
                                  >
                                    <UploadCloud size={15} />
                                    <span>{isUploading ? 'Uploading Image...' : 'Upload Card Image'}</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      disabled={isUploading}
                                      onChange={(e) => handleSlideImageUpload(e, idx)}
                                      style={{ display: 'none' }}
                                    />
                                  </label>
                                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--admin-text-muted)', textAlign: 'center', marginTop: '0.3rem' }}>
                                    JPG, PNG, or WebP up to 25MB
                                  </span>
                                </div>
                              </div>

                              {/* Right Column: Editable Fields */}
                              <div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                  <div>
                                    <label className="admin-label">Application Title</label>
                                    <input
                                      type="text"
                                      className="admin-input"
                                      value={item.title || ''}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], title: e.target.value };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      placeholder={preset.title}
                                    />
                                  </div>
                                  <div>
                                    <label className="admin-label">Category Badge</label>
                                    <input
                                      type="text"
                                      className="admin-input"
                                      value={item.category || ''}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], category: e.target.value };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      placeholder={preset.category}
                                    />
                                  </div>
                                </div>

                                <div style={{ marginBottom: '0.85rem' }}>
                                  <label className="admin-label">Card Photography Image URL</label>
                                  <input
                                    type="text"
                                    className="admin-input"
                                    value={item.image || item.url || ''}
                                    onChange={(e) => {
                                      const newItems = [...(editingSection.items || [])];
                                      newItems[idx] = { ...newItems[idx], image: e.target.value, url: e.target.value };
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }}
                                    placeholder={preset.image}
                                  />
                                </div>

                                {/* Quick Official Asset Presets */}
                                <div
                                  style={{
                                    backgroundColor: 'var(--admin-surface-muted)',
                                    padding: '0.75rem',
                                    borderRadius: '6px',
                                    border: '1px solid var(--admin-border-light)',
                                  }}
                                >
                                  <span
                                    style={{
                                      display: 'block',
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      color: 'var(--admin-forest)',
                                      marginBottom: '0.45rem',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.04em',
                                    }}
                                  >
                                    Official Typology Image Presets (1-Click Apply)
                                  </span>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {officialPresets.map((p) => (
                                      <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => {
                                          const newItems = [...(editingSection.items || [])];
                                          newItems[idx] = {
                                            ...newItems[idx],
                                            title: p.title,
                                            category: p.category,
                                            image: p.image,
                                            url: p.image,
                                            link: p.link,
                                          };
                                          setEditingSection({ ...editingSection, items: newItems });
                                        }}
                                        className="admin-btn admin-btn-secondary"
                                        style={{
                                          padding: '0.3rem 0.6rem',
                                          fontSize: '0.75rem',
                                          backgroundColor: appImg === p.image ? 'rgba(82, 105, 75, 0.15)' : '#FFFFFF',
                                          borderColor: appImg === p.image ? 'var(--admin-forest)' : 'var(--admin-border-light)',
                                          fontWeight: appImg === p.image ? 600 : 400,
                                          color: appImg === p.image ? 'var(--admin-forest-dark)' : 'var(--admin-text-main)',
                                        }}
                                      >
                                        {p.presetLabel}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Dedicated Application Detail Page Content & Visuals */}
                            {renderApplicationDetailEditor(item, idx, 'home-applications')}
                          </div>
                        );
                      }

                      // 11. DEDICATED APPLICATION CATEGORIES & FILTERS EDITOR
                      if (editingSection.sectionId === 'applications-categories') {
                        const isVisible = item.isVisible !== false;
                        const isLocked = item.isLocked || item.slug === 'all';
                        
                        // Count cards assigned to this category
                        const cardsSec = sections.find((s) => s.sectionId === 'applications-cards');
                        const cardCount = cardsSec?.items?.filter((c: any) => {
                          if (item.slug === 'all') return true;
                          const catName = (item.name || '').toLowerCase();
                          const catSlug = (item.slug || '').toLowerCase();
                          const cardCat = (c.category || '').toLowerCase();
                          const cardCats = Array.isArray(c.categories) ? c.categories.map((x: string) => x.toLowerCase()) : [];
                          return cardCat.includes(catName) || cardCat.includes(catSlug) || cardCats.includes(catName) || cardCats.includes(catSlug);
                        }).length || 0;

                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              border: '1.5px solid var(--admin-border-light)',
                              borderRadius: '8px',
                              padding: '1rem 1.25rem',
                              backgroundColor: isVisible ? '#FFFFFF' : 'var(--admin-surface-muted)',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                              opacity: isVisible ? 1 : 0.75,
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.6rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span
                                  style={{
                                    backgroundColor: isLocked ? 'var(--admin-accent-gold)' : 'var(--admin-forest)',
                                    color: '#FAF8F5',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.65rem',
                                    borderRadius: '9999px',
                                  }}
                                >
                                  Filter #{idx + 1}
                                </span>
                                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--admin-forest-dark)' }}>
                                  {item.name || 'Untitled Category'}
                                </span>
                                {isLocked && (
                                  <span
                                    style={{
                                      fontSize: '0.7rem',
                                      backgroundColor: 'rgba(212, 175, 55, 0.15)',
                                      color: 'var(--admin-accent-gold)',
                                      padding: '0.15rem 0.5rem',
                                      borderRadius: '4px',
                                      fontWeight: 600,
                                    }}
                                  >
                                    Primary Filter (Locked)
                                  </span>
                                )}
                                <span
                                  style={{
                                    fontSize: '0.72rem',
                                    backgroundColor: 'rgba(82, 105, 75, 0.08)',
                                    color: 'var(--admin-forest)',
                                    padding: '0.15rem 0.55rem',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                  }}
                                >
                                  {item.slug === 'all' ? `All (${cardCount} Cards)` : `${cardCount} Assigned Cards`}
                                </span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => moveItem(idx, 'up')}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem', opacity: idx === 0 ? 0.3 : 1 }}
                                  title="Move Category Up"
                                >
                                  <MoveUp size={13} />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (editingSection.items?.length || 1) - 1}
                                  onClick={() => moveItem(idx, 'down')}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem', opacity: idx === (editingSection.items?.length || 1) - 1 ? 0.3 : 1 }}
                                  title="Move Category Down"
                                >
                                  <MoveDown size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], isVisible: newItems[idx].isVisible === false ? true : false };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem' }}
                                  title={isVisible ? 'Hide Category Filter' : 'Show Category Filter'}
                                >
                                  {isVisible ? (
                                    <Eye size={13} style={{ color: 'var(--admin-forest)' }} />
                                  ) : (
                                    <EyeOff size={13} style={{ color: 'var(--admin-danger)' }} />
                                  )}
                                </button>
                                {!isLocked && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to delete category "${item.name}"? Cards assigned to this category will still exist.`)) {
                                        const newItems = editingSection.items?.filter((_, i) => i !== idx);
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--admin-danger)',
                                      cursor: 'pointer',
                                      padding: '0.25rem 0.4rem',
                                      marginLeft: '0.2rem',
                                    }}
                                    title="Delete Category"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 0.8fr', gap: '0.85rem' }}>
                              <div>
                                <label className="admin-label">Category Name</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.name || ''}
                                  disabled={isLocked}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = {
                                      ...newItems[idx],
                                      name: e.target.value,
                                      slug: isLocked ? newItems[idx].slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                                    };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="e.g. Residential, Hospitality"
                                />
                              </div>
                              <div>
                                <label className="admin-label">Filter Slug / Identifier</label>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={item.slug || ''}
                                  disabled={isLocked}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], slug: e.target.value };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="e.g. residential"
                                />
                              </div>
                              <div>
                                <label className="admin-label">Display Order</label>
                                <input
                                  type="number"
                                  className="admin-input"
                                  value={item.order !== undefined ? item.order : idx}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], order: parseInt(e.target.value) || 0 };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // 12. DEDICATED APPLICATION CARDS CATALOG CRUD MANAGER (applications-cards)
                      if (editingSection.sectionId === 'applications-cards') {
                        const isVisible = item.isVisible !== false;
                        const isPublished = (item.status || 'published') === 'published';
                        const cardImg = item.image || item.mediaUrl || '/assets/images/built_more_than_homes_01_web.jpg';
                        const isUploading = slideUploadingIndex === idx;

                        // Available categories from applications-categories section
                        const catSec = sections.find((s) => s.sectionId === 'applications-categories');
                        const availableCategories = catSec?.items && catSec.items.length > 0
                          ? catSec.items.filter((c: any) => c.slug !== 'all' && c.isVisible !== false).map((c: any) => c.name || c.slug)
                          : ['Residential', 'Hospitality', 'Wellness', 'Specialized'];

                        const cardCategories: string[] = Array.isArray(item.categories)
                          ? item.categories
                          : item.category
                          ? [item.category]
                          : ['Residential'];

                        const cardCompatibility: string[] = Array.isArray(item.compatibility)
                          ? item.compatibility
                          : Array.isArray(item.recommendedProducts)
                          ? item.recommendedProducts
                          : ['PENTA', 'MOVA'];

                        const officialPresets = [
                          { label: '01 Desert Residence', img: '/assets/images/built_more_than_homes_01_web.jpg' },
                          { label: '02 Pool Villas', img: '/assets/images/built_more_than_homes_02_web.jpg' },
                          { label: '03 Farm Barn', img: '/assets/images/built_more_than_homes_03_web.jpg' },
                          { label: '04 Eco Pavilion', img: '/assets/images/built_more_than_homes_04_web.jpg' },
                          { label: '05 Media Lounge', img: '/assets/renders/CINE_EXT_3D_img1.jpg' },
                          { label: '06 Wellness Gym', img: '/assets/images/imgupscaler-enhanced-6.jpg' },
                        ];

                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              border: '1.5px solid var(--admin-border-light)',
                              borderRadius: '10px',
                              backgroundColor: isVisible ? '#FFFFFF' : 'var(--admin-surface-muted)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                              overflow: 'hidden',
                              transition: 'all 0.2s ease',
                              opacity: isVisible ? 1 : 0.8,
                            }}
                          >
                            {/* Card Header Bar */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.85rem 1.15rem',
                                backgroundColor: 'rgba(82, 105, 75, 0.05)',
                                borderBottom: '1px solid var(--admin-border-light)',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    backgroundColor: 'var(--admin-forest)',
                                    color: '#FAF8F5',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    padding: '0.22rem 0.75rem',
                                    borderRadius: '9999px',
                                  }}
                                >
                                  <Layers size={13} /> Card #{idx + 1}
                                </span>

                                <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--admin-forest-dark)' }}>
                                  {item.title || `Application Card #${idx + 1}`}
                                </span>

                                {cardCategories.map((catName) => (
                                  <span
                                    key={catName}
                                    style={{
                                      fontSize: '0.72rem',
                                      fontWeight: 600,
                                      color: 'var(--admin-forest)',
                                      backgroundColor: 'rgba(82, 105, 75, 0.1)',
                                      padding: '0.15rem 0.55rem',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    {catName}
                                  </span>
                                ))}

                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '4px',
                                    backgroundColor: isPublished ? 'rgba(74, 222, 128, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                                    color: isPublished ? '#166534' : '#92400E',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                  }}
                                >
                                  {isPublished ? 'Published' : 'Draft'}
                                </span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => moveItem(idx, 'up')}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem', opacity: idx === 0 ? 0.3 : 1 }}
                                  title="Move Card Up"
                                >
                                  <MoveUp size={13} />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (editingSection.items?.length || 1) - 1}
                                  onClick={() => moveItem(idx, 'down')}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem', opacity: idx === (editingSection.items?.length || 1) - 1 ? 0.3 : 1 }}
                                  title="Move Card Down"
                                >
                                  <MoveDown size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => duplicateItem(idx)}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem' }}
                                  title="Duplicate Card"
                                >
                                  <Copy size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = { ...newItems[idx], isVisible: !isVisible };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem' }}
                                  title={isVisible ? 'Hide Card' : 'Show Card'}
                                >
                                  {isVisible ? (
                                    <Eye size={13} style={{ color: 'var(--admin-forest)' }} />
                                  ) : (
                                    <EyeOff size={13} style={{ color: 'var(--admin-danger)' }} />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete "${item.title || 'Untitled Card'}"?`)) {
                                      const newItems = editingSection.items?.filter((_, i) => i !== idx);
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--admin-danger)',
                                    cursor: 'pointer',
                                    padding: '0.25rem 0.4rem',
                                    marginLeft: '0.25rem',
                                  }}
                                  title="Delete Card"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Card Body Grid: Visual Left (300px), Content & Options Right */}
                            <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                              
                              {/* Left Column: Image Controls & Live Preview */}
                              <div>
                                <label className="admin-label" style={{ marginBottom: '0.4rem' }}>
                                  Card Visual Preview
                                </label>
                                <div
                                  style={{
                                    width: '100%',
                                    height: item.imageHeight || '210px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    backgroundColor: '#1E231D',
                                    position: 'relative',
                                    border: '1px solid var(--admin-border-light)',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                  }}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={cardImg}
                                    alt={item.title || ''}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      objectPosition: item.imagePosition || 'center center',
                                    }}
                                  />
                                  <div
                                    style={{
                                      position: 'absolute',
                                      bottom: '0.5rem',
                                      right: '0.5rem',
                                      backgroundColor: 'rgba(0,0,0,0.7)',
                                      color: '#FFF',
                                      padding: '0.2rem 0.45rem',
                                      borderRadius: '4px',
                                      fontSize: '0.65rem',
                                      fontWeight: 600,
                                    }}
                                  >
                                    {item.imagePosition || 'center center'}
                                  </div>
                                </div>

                                {/* Upload & URL */}
                                <div style={{ marginTop: '0.85rem' }}>
                                  <label className="admin-label">Image URL / Path</label>
                                  <input
                                    type="text"
                                    className="admin-input"
                                    value={cardImg}
                                    onChange={(e) => {
                                      const newItems = [...(editingSection.items || [])];
                                      newItems[idx] = { ...newItems[idx], image: e.target.value, mediaUrl: e.target.value };
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }}
                                    placeholder="/assets/images/... or Cloudinary URL"
                                  />
                                </div>

                                <div style={{ marginTop: '0.65rem' }}>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id={`app-card-img-${idx}`}
                                    style={{ display: 'none' }}
                                    disabled={isUploading}
                                    onChange={(e) => handleSlideImageUpload(e, idx)}
                                  />
                                  <label
                                    htmlFor={`app-card-img-${idx}`}
                                    className="admin-btn admin-btn-primary"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '0.4rem',
                                      width: '100%',
                                      padding: '0.45rem',
                                      fontSize: '0.78rem',
                                      cursor: isUploading ? 'not-allowed' : 'pointer',
                                    }}
                                  >
                                    {isUploading ? <RefreshCw className="animate-spin" size={14} /> : <UploadCloud size={14} />}
                                    {isUploading ? 'Uploading Image...' : 'Upload Image from Device'}
                                  </label>
                                </div>

                                {/* Focal Point & Image Height */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.65rem' }}>
                                  <div>
                                    <label className="admin-label" style={{ fontSize: '0.74rem' }}>Focal Point</label>
                                    <select
                                      className="admin-select"
                                      style={{ fontSize: '0.78rem', padding: '0.35rem 0.5rem' }}
                                      value={item.imagePosition || 'center center'}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], imagePosition: e.target.value };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                    >
                                      <option value="center center">Center</option>
                                      <option value="center top">Top Center</option>
                                      <option value="center bottom">Bottom Center</option>
                                      <option value="center 30%">Upper 30%</option>
                                      <option value="center 40%">Upper 40%</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="admin-label" style={{ fontSize: '0.74rem' }}>Image Height</label>
                                    <select
                                      className="admin-select"
                                      style={{ fontSize: '0.78rem', padding: '0.35rem 0.5rem' }}
                                      value={item.imageHeight || '245px'}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], imageHeight: e.target.value };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                    >
                                      <option value="210px">210px (Compact)</option>
                                      <option value="245px">245px (Standard)</option>
                                      <option value="280px">280px (Medium)</option>
                                      <option value="320px">320px (Large)</option>
                                    </select>
                                  </div>
                                </div>

                                <div style={{ marginTop: '0.65rem' }}>
                                  <label className="admin-label" style={{ fontSize: '0.74rem' }}>SEO Alt Text</label>
                                  <input
                                    type="text"
                                    className="admin-input"
                                    style={{ fontSize: '0.8rem' }}
                                    value={item.imageAlt || ''}
                                    onChange={(e) => {
                                      const newItems = [...(editingSection.items || [])];
                                      newItems[idx] = { ...newItems[idx], imageAlt: e.target.value };
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }}
                                    placeholder={item.title || 'Application Image'}
                                  />
                                </div>

                                {/* Quick Presets */}
                                <div style={{ marginTop: '0.85rem' }}>
                                  <label className="admin-label" style={{ fontSize: '0.72rem', marginBottom: '0.3rem' }}>Photo Presets</label>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
                                    {officialPresets.map((pr) => (
                                      <button
                                        key={pr.label}
                                        type="button"
                                        onClick={() => {
                                          const newItems = [...(editingSection.items || [])];
                                          newItems[idx] = { ...newItems[idx], image: pr.img, mediaUrl: pr.img };
                                          setEditingSection({ ...editingSection, items: newItems });
                                        }}
                                        className="admin-btn admin-btn-secondary"
                                        style={{
                                          padding: '0.25rem 0.4rem',
                                          fontSize: '0.7rem',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          backgroundColor: cardImg === pr.img ? 'rgba(82, 105, 75, 0.15)' : '#FFF',
                                          borderColor: cardImg === pr.img ? 'var(--admin-forest)' : 'var(--admin-border-light)',
                                        }}
                                      >
                                        {pr.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Right Column: Copy, Categories, Compatibility & Buttons */}
                              <div>
                                {/* Row 1: Title & Publication Status */}
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                                  <div>
                                    <label className="admin-label">Application Title</label>
                                    <input
                                      type="text"
                                      className="admin-input"
                                      value={item.title || ''}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], title: e.target.value };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      placeholder="Modular Homes & Private Residences"
                                    />
                                  </div>

                                  <div>
                                    <label className="admin-label">Publication Status</label>
                                    <select
                                      className="admin-select"
                                      value={item.status || 'published'}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], status: e.target.value };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                    >
                                      <option value="published">Published Live</option>
                                      <option value="draft">Draft Mode</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="admin-label">Display Order</label>
                                    <input
                                      type="number"
                                      className="admin-input"
                                      value={item.order !== undefined ? item.order : idx + 1}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], order: parseInt(e.target.value) || 1 };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                    />
                                  </div>
                                </div>

                                {/* Row 2: Category Multi-Select */}
                                <div style={{ marginBottom: '0.85rem', backgroundColor: 'rgba(82, 105, 75, 0.04)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--admin-border-light)' }}>
                                  <label className="admin-label" style={{ marginBottom: '0.35rem' }}>
                                    Assign to Categories (Card appears in selected filter tabs)
                                  </label>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                                    {availableCategories.map((catOption: string) => {
                                      const isChecked = cardCategories.some((c) => c.toLowerCase() === catOption.toLowerCase());
                                      return (
                                        <label
                                          key={catOption}
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            fontSize: '0.82rem',
                                            cursor: 'pointer',
                                            backgroundColor: isChecked ? 'rgba(82, 105, 75, 0.15)' : '#FFFFFF',
                                            border: `1px solid ${isChecked ? 'var(--admin-forest)' : 'var(--admin-border-light)'}`,
                                            padding: '0.25rem 0.65rem',
                                            borderRadius: '9999px',
                                            fontWeight: isChecked ? 600 : 400,
                                            color: isChecked ? 'var(--admin-forest-dark)' : 'var(--admin-text-main)',
                                          }}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => {
                                              const newItems = [...(editingSection.items || [])];
                                              let updatedCats = [...cardCategories];
                                              if (e.target.checked) {
                                                if (!updatedCats.includes(catOption)) updatedCats.push(catOption);
                                              } else {
                                                updatedCats = updatedCats.filter((c) => c.toLowerCase() !== catOption.toLowerCase());
                                                if (updatedCats.length === 0) updatedCats = [catOption]; // preserve at least one
                                              }
                                              newItems[idx] = {
                                                ...newItems[idx],
                                                categories: updatedCats,
                                                category: updatedCats[0] || catOption,
                                              };
                                              setEditingSection({ ...editingSection, items: newItems });
                                            }}
                                          />
                                          {catOption}
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Row 3: Supporting Quote / Tagline */}
                                <div style={{ marginBottom: '0.85rem' }}>
                                  <label className="admin-label">Supporting Quote / Tagline (Italicized on Card)</label>
                                  <input
                                    type="text"
                                    className="admin-input"
                                    value={item.tagline || ''}
                                    onChange={(e) => {
                                      const newItems = [...(editingSection.items || [])];
                                      newItems[idx] = { ...newItems[idx], tagline: e.target.value };
                                      setEditingSection({ ...editingSection, items: newItems });
                                    }}
                                    placeholder="Architecture designed for mindful modern living."
                                  />
                                </div>

                                {/* Row 4: Short & Detailed Descriptions */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                                  <div>
                                    <label className="admin-label">Short Description (Card Face)</label>
                                    <textarea
                                      rows={3}
                                      className="admin-textarea"
                                      value={item.description || ''}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], description: e.target.value };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      placeholder="From primary luxury residences to estate guest pavilions..."
                                    />
                                  </div>
                                  <div>
                                    <label className="admin-label">Detailed Description / Specs</label>
                                    <textarea
                                      rows={3}
                                      className="admin-textarea"
                                      value={item.detailedDescription || ''}
                                      onChange={(e) => {
                                        const newItems = [...(editingSection.items || [])];
                                        newItems[idx] = { ...newItems[idx], detailedDescription: e.target.value };
                                        setEditingSection({ ...editingSection, items: newItems });
                                      }}
                                      placeholder="Engineering details, acoustic ratings, and prefabrication specs..."
                                    />
                                  </div>
                                </div>

                                {/* Row 5: Compatible Model Badges */}
                                <div style={{ marginBottom: '0.85rem' }}>
                                  <label className="admin-label" style={{ marginBottom: '0.35rem' }}>Compatible Building Systems</label>
                                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                                    {['PENTA', 'MOVA', 'ENTRA'].map((model) => {
                                      const isComp = cardCompatibility.includes(model);
                                      return (
                                        <label
                                          key={model}
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '4px',
                                            border: `1px solid ${isComp ? 'var(--admin-forest)' : 'var(--admin-border-light)'}`,
                                            backgroundColor: isComp ? 'rgba(82, 105, 75, 0.12)' : '#FFF',
                                            fontWeight: isComp ? 700 : 400,
                                            color: isComp ? 'var(--admin-forest-dark)' : 'var(--admin-text-main)',
                                          }}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isComp}
                                            onChange={(e) => {
                                              const newItems = [...(editingSection.items || [])];
                                              let updatedComp = [...cardCompatibility];
                                              if (e.target.checked) {
                                                if (!updatedComp.includes(model)) updatedComp.push(model);
                                              } else {
                                                updatedComp = updatedComp.filter((m) => m !== model);
                                              }
                                              newItems[idx] = {
                                                ...newItems[idx],
                                                compatibility: updatedComp,
                                                recommendedProducts: updatedComp,
                                              };
                                              setEditingSection({ ...editingSection, items: newItems });
                                            }}
                                          />
                                          {model}
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Row 6: Action Buttons Configuration */}
                                <div style={{ borderTop: '1px solid var(--admin-border-light)', paddingTop: '0.85rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                                    <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>Action Buttons Configuration</label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                                      <input
                                        type="checkbox"
                                        checked={item.showButtons !== false}
                                        onChange={(e) => {
                                          const newItems = [...(editingSection.items || [])];
                                          newItems[idx] = { ...newItems[idx], showButtons: e.target.checked };
                                          setEditingSection({ ...editingSection, items: newItems });
                                        }}
                                      />
                                      Show Buttons on Card
                                    </label>
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr 0.8fr 1.2fr 1.4fr', gap: '0.65rem', alignItems: 'center' }}>
                                    <div>
                                      <label className="admin-label" style={{ fontSize: '0.72rem' }}>Overview Label</label>
                                      <input
                                        type="text"
                                        className="admin-input"
                                        style={{ fontSize: '0.8rem' }}
                                        value={item.overviewBtnText || 'Overview'}
                                        onChange={(e) => {
                                          const newItems = [...(editingSection.items || [])];
                                          newItems[idx] = { ...newItems[idx], overviewBtnText: e.target.value };
                                          setEditingSection({ ...editingSection, items: newItems });
                                        }}
                                        placeholder="Overview"
                                      />
                                    </div>

                                    <div>
                                      <label className="admin-label" style={{ fontSize: '0.72rem' }}>Overview Destination URL</label>
                                      <input
                                        type="text"
                                        className="admin-input"
                                        style={{ fontSize: '0.8rem' }}
                                        value={item.overviewUrl || `/applications/${item.id}`}
                                        onChange={(e) => {
                                          const newItems = [...(editingSection.items || [])];
                                          newItems[idx] = { ...newItems[idx], overviewUrl: e.target.value };
                                          setEditingSection({ ...editingSection, items: newItems });
                                        }}
                                        placeholder="/applications/modular-homes"
                                      />
                                    </div>

                                    <div>
                                      <label className="admin-label" style={{ fontSize: '0.72rem' }}>New Tab</label>
                                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer', height: '36px' }}>
                                        <input
                                          type="checkbox"
                                          checked={item.overviewOpenNewTab === true}
                                          onChange={(e) => {
                                            const newItems = [...(editingSection.items || [])];
                                            newItems[idx] = { ...newItems[idx], overviewOpenNewTab: e.target.checked };
                                            setEditingSection({ ...editingSection, items: newItems });
                                          }}
                                        />
                                        Blank
                                      </label>
                                    </div>

                                    <div>
                                      <label className="admin-label" style={{ fontSize: '0.72rem' }}>Enquire Label</label>
                                      <input
                                        type="text"
                                        className="admin-input"
                                        style={{ fontSize: '0.8rem' }}
                                        value={item.enquireBtnText || 'Enquire'}
                                        onChange={(e) => {
                                          const newItems = [...(editingSection.items || [])];
                                          newItems[idx] = { ...newItems[idx], enquireBtnText: e.target.value };
                                          setEditingSection({ ...editingSection, items: newItems });
                                        }}
                                        placeholder="Enquire"
                                      />
                                    </div>

                                    <div>
                                      <label className="admin-label" style={{ fontSize: '0.72rem' }}>Enquire Target / Modal</label>
                                      <input
                                        type="text"
                                        className="admin-input"
                                        style={{ fontSize: '0.8rem' }}
                                        value={item.enquireUrl || '#enquiry'}
                                        onChange={(e) => {
                                          const newItems = [...(editingSection.items || [])];
                                          newItems[idx] = { ...newItems[idx], enquireUrl: e.target.value };
                                          setEditingSection({ ...editingSection, items: newItems });
                                        }}
                                        placeholder="#enquiry or /contact"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Dedicated Application Detail Page Content & Visuals */}
                            {renderApplicationDetailEditor(item, idx, 'applications-cards')}
                          </div>
                        );
                      }

                      // 13. GENERIC CARDS / SLIDES / STATS EDITOR
                      // Guard: NEVER render generic editor for Hero sections or dedicated sections
                      const currentSecId = (editingSection.sectionId || (editingSection as any).id || '').trim().toLowerCase();
                      if (
                        isHeroSection(editingSection) ||
                        currentSecId === 'about-stats' ||
                        currentSecId === 'home-philosophy' ||
                        currentSecId === 'about-philosophy' ||
                        currentSecId === 'home-process' ||
                        currentSecId === 'home-products' ||
                        currentSecId === 'home-applications' ||
                        currentSecId === 'applications-categories' ||
                        currentSecId === 'applications-cards' ||
                        currentSecId === 'contact-faq' ||
                        currentSecId === 'contact-form' ||
                        currentSecId === 'contact-direct' ||
                        currentSecId === 'products-comparison' ||
                        (item.id && String(item.id).toLowerCase().includes('hero')) ||
                        (item.url && item.url.includes('hero'))
                      ) {
                        return null;
                      }

                      return (
                        <div
                          key={item.id || idx}
                          style={{
                            border: '1px solid var(--admin-border-light)',
                            borderRadius: '6px',
                            padding: '1rem',
                            backgroundColor: 'var(--admin-surface-muted)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--admin-forest-dark)' }}>
                              Item #{idx + 1} {item.number ? `(${item.number})` : ''} — {item.title || item.name || item.label || 'Card'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = editingSection.items?.filter((_, i) => i !== idx);
                                setEditingSection({ ...editingSection, items: newItems });
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '0.2rem' }}
                              title="Remove Item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {(item.number !== undefined || editingSection.sectionId === 'about-stats') && (
                            <div style={{ marginBottom: '0.65rem' }}>
                              <label className="admin-label">Metric Value / Stat (e.g. 50%, 1, 30–300 m²)</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={item.number || ''}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.items || [])];
                                  newItems[idx] = { ...newItems[idx], number: e.target.value };
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                placeholder="e.g. 50%"
                              />
                            </div>
                          )}

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <div>
                              <label className="admin-label">Title / Name / Label</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={item.title || item.name || item.label || ''}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.items || [])];
                                  newItems[idx] = {
                                    ...newItems[idx],
                                    title: e.target.value,
                                    name: e.target.value,
                                    label: e.target.value,
                                  };
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                              />
                            </div>
                            <div>
                              <label className="admin-label">Subtitle / Category / Value</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={item.subtitle || item.category || item.tagline || item.value || ''}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.items || [])];
                                  newItems[idx] = {
                                    ...newItems[idx],
                                    subtitle: e.target.value,
                                    category: e.target.value,
                                    tagline: e.target.value,
                                    value: e.target.value,
                                  };
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                              />
                            </div>
                          </div>

                          <div style={{ marginBottom: '0.5rem' }}>
                            <label className="admin-label">Description / Narrative</label>
                            <textarea
                              rows={2}
                              className="admin-textarea"
                              value={item.description || item.shortDescription || ''}
                              onChange={(e) => {
                                const newItems = [...(editingSection.items || [])];
                                newItems[idx] = {
                                  ...newItems[idx],
                                  description: e.target.value,
                                  shortDescription: e.target.value,
                                };
                                setEditingSection({ ...editingSection, items: newItems });
                              }}
                            />
                          </div>

                          {/* ONLY render Image URL if this section's items actually use images on the live website */}
                          {sectionItemsHaveImages(editingSection) && (
                            <div style={{ marginBottom: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                <label className="admin-label" style={{ margin: 0, fontWeight: 600 }}>Card Image & Upload</label>
                                <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>
                                  Upload from device or enter URL
                                </span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                {(item.image || item.url || item.heroImage || item.mediaUrl) ? (
                                  <div
                                    style={{
                                      width: '52px',
                                      height: '44px',
                                      borderRadius: '6px',
                                      overflow: 'hidden',
                                      backgroundColor: '#1E231D',
                                      border: '1.5px solid var(--admin-border-light)',
                                      flexShrink: 0,
                                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    }}
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={item.image || item.url || item.heroImage || item.mediaUrl}
                                      alt=""
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      width: '52px',
                                      height: '44px',
                                      borderRadius: '6px',
                                      backgroundColor: 'var(--admin-surface-muted)',
                                      border: '1.5px dashed var(--admin-border-light)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'var(--admin-text-muted)',
                                      flexShrink: 0,
                                    }}
                                  >
                                    <ImageIcon size={20} />
                                  </div>
                                )}

                                <input
                                  type="text"
                                  className="admin-input"
                                  style={{ flex: 1, minWidth: '220px' }}
                                  value={item.image || item.url || item.heroImage || item.mediaUrl || ''}
                                  onChange={(e) => {
                                    const newItems = [...(editingSection.items || [])];
                                    newItems[idx] = {
                                      ...newItems[idx],
                                      image: e.target.value,
                                      url: e.target.value,
                                      heroImage: e.target.value,
                                      mediaUrl: e.target.value,
                                    };
                                    setEditingSection({ ...editingSection, items: newItems });
                                  }}
                                  placeholder="/assets/images/... or Cloudinary URL"
                                />

                                {/* Direct Device Upload Button */}
                                <div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id={`generic-item-file-${idx}`}
                                    style={{ display: 'none' }}
                                    disabled={slideUploadingIndex === idx}
                                    onChange={(e) => handleSlideImageUpload(e, idx)}
                                  />
                                  <label
                                    htmlFor={`generic-item-file-${idx}`}
                                    className="admin-btn admin-btn-primary"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.4rem',
                                      padding: '0.48rem 0.95rem',
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      cursor: slideUploadingIndex === idx ? 'not-allowed' : 'pointer',
                                      whiteSpace: 'nowrap',
                                    }}
                                    title="Choose an image file from your computer to upload directly to Cloudinary"
                                  >
                                    {slideUploadingIndex === idx ? (
                                      <>
                                        <RefreshCw size={14} className="animate-spin" />
                                        <span>Uploading...</span>
                                      </>
                                    ) : (
                                      <>
                                        <UploadCloud size={14} />
                                        <span>Upload Image</span>
                                      </>
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ONLY render Link Destination if this section's items actually have links on the live website */}
                          {sectionItemsHaveLinks(editingSection) && (
                            <div style={{ marginBottom: '0.65rem' }}>
                              <label className="admin-label">Link Destination</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={item.link || (item.slug ? `/products/${item.slug}` : '')}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.items || [])];
                                  newItems[idx] = {
                                    ...newItems[idx],
                                    link: e.target.value,
                                  };
                                  setEditingSection({ ...editingSection, items: newItems });
                                }}
                                placeholder="/applications/... or /products/..."
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {isHeroSection(editingSection) && (
                      <button
                        type="button"
                        onClick={addNewHeroSlide}
                        className="admin-btn admin-btn-secondary"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          width: '100%',
                          padding: '0.85rem',
                          border: '2px dashed var(--admin-border)',
                          backgroundColor: '#FAF8F5',
                          color: 'var(--admin-forest)',
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          marginTop: '0.75rem',
                        }}
                      >
                        <Plus size={16} /> + Add Hero Image (Hero Image {(editingSection.items?.length || 0) + 1})
                      </button>
                    )}
                  </div>
                )}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--admin-border-light)',
                paddingTop: '1rem',
                marginTop: '1.25rem',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editingSection.isVisible}
                  onChange={(e) => setEditingSection({ ...editingSection, isVisible: e.target.checked })}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-main)' }}>
                  Visible on public website
                </span>
              </label>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingSection(null);
                  }}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveModalSection(false)}
                  disabled={saving}
                  className="admin-btn admin-btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Save size={15} />
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveModalSection(true)}
                  disabled={saving}
                  className="admin-btn admin-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Check size={16} />
                  Publish Section Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
