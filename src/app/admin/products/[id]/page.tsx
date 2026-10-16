'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Eye,
  EyeOff,
  Box,
  Image as ImageIcon,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Layers,
  FileText,
  UploadCloud,
  RefreshCw,
  MoveUp,
  MoveDown,
  Globe,
  Sliders,
  Maximize2,
  Check,
  X,
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface SpecificationItem {
  label: string;
  value: string;
  unit?: string;
  isVisible?: boolean;
}

interface TechnicalProfileItem {
  label: string;
  val: string;
  unit?: string;
  isVisible?: boolean;
}

interface FloorplanItem {
  name: string;
  size?: string;
  dimensions?: string;
  description: string;
  image?: string;
  isVisible?: boolean;
}

interface ProductData {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  tagline: string;
  category: string;
  sizeRange: string;
  sizeRangeImperial?: string;
  leadTime: string;
  shortDescription: string;
  fullDescription?: string;
  keyQuote?: string;

  // 1. Hero
  heroEyebrow?: string;
  heroHeading?: string;
  heroSubtitle?: string;
  heroTagline?: string;
  heroImage: string;
  heroImageAlt?: string;
  heroImagePosition?: string;
  heroOverlayColor?: string;
  heroOverlayOpacity?: number;
  heroCtaText?: string;
  heroCtaDestination?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaDestination?: string;
  heroVideoUrl?: string;
  heroCtaVisible?: boolean;

  // 2. Overview
  overviewEyebrow?: string;
  overviewHeading?: string;
  overviewParagraphs?: string[];
  overviewImage?: string;
  overviewVisible?: boolean;
  applications: string[];

  // 3. Technical Profile
  technicalProfileTitle?: string;
  technicalProfile: TechnicalProfileItem[];
  technicalProfileButtonText?: string;
  technicalProfileButtonDestination?: string;
  technicalProfileVisible?: boolean;

  // 4 & 5. Galleries
  previewImage: string;
  galleryEyebrow?: string;
  galleryTitle?: string;
  gallery: {
    exterior: string[];
    interior: string[];
    plans?: string[];
  };
  galleryVisible?: boolean;

  // 6. Floor Plans & Specs
  plansEyebrow?: string;
  plansTitle?: string;
  plansSubtitle?: string;
  floorplansTitle?: string;
  floorplans: FloorplanItem[];
  specificationsTitle?: string;
  specifications: SpecificationItem[];
  specsVisible?: boolean;

  // 7. Related
  relatedEyebrow?: string;
  relatedTitle?: string;
  relatedProducts?: string[];
  relatedVisible?: boolean;

  // 8. CTA
  ctaEyebrow?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaDestination?: string;
  whatsappUrl?: string;
  ctaVisible?: boolean;

  // 9. SEO
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };

  status: 'published' | 'draft';
  displayOrder?: number;
  updatedAt?: string;
}

export default function ProductMasterEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [allProducts, setAllProducts] = useState<Array<{ id: string; name: string; category: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<
    | 'hero'
    | 'overview'
    | 'technicalProfile'
    | 'exteriorGallery'
    | 'interiorGallery'
    | 'floorplans'
    | 'specifications'
    | 'related'
    | 'cta'
    | 'seo'
  >('hero');

  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [newApplicationTag, setNewApplicationTag] = useState('');

  const fetchProductAndCollections = async () => {
    try {
      setLoading(true);
      // Fetch product detail
      const res = await fetch(`/api/admin/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
        }
      }

      // Fetch all products for related picker
      const allRes = await fetch('/api/admin/products');
      if (allRes.ok) {
        const allData = await allRes.json();
        setAllProducts(
          (allData.products || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
          }))
        );
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: 'Error loading product details from database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndCollections();
  }, [id]);

  const handleSaveProduct = async (statusOverride?: 'published' | 'draft') => {
    if (!product) return;
    try {
      setSaving(true);
      const targetStatus = statusOverride || product.status;
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          status: targetStatus,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
        }
        setAlert({
          type: 'success',
          message: `Product "${product.name}" saved successfully to MongoDB Atlas! (Status: ${targetStatus.toUpperCase()})`,
        });
      } else {
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to save product.' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error saving product.' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'heroImage' | 'previewImage' | 'overviewImage' | 'exterior' | 'interior' | 'floorplan' | 'seoOgImage',
    extraIdx?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file || !product) return;
    try {
      setUploadingTarget(extraIdx !== undefined ? `${target}-${extraIdx}` : target);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'alghaf_products');
      formData.append('title', `${product.name} ${target}`);

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const uploadedUrl = data.media?.secureUrl || data.media?.url;
      if (!res.ok || !uploadedUrl) {
        throw new Error(data.error || 'Failed to upload image to Cloudinary');
      }

      if (target === 'heroImage') {
        setProduct({ ...product, heroImage: uploadedUrl });
      } else if (target === 'previewImage') {
        setProduct({ ...product, previewImage: uploadedUrl });
      } else if (target === 'overviewImage') {
        setProduct({ ...product, overviewImage: uploadedUrl });
      } else if (target === 'exterior') {
        const ext = [...(product.gallery?.exterior || []), uploadedUrl];
        setProduct({ ...product, gallery: { ...product.gallery, exterior: ext } });
      } else if (target === 'interior') {
        const intList = [...(product.gallery?.interior || []), uploadedUrl];
        setProduct({ ...product, gallery: { ...product.gallery, interior: intList } });
      } else if (target === 'floorplan' && extraIdx !== undefined) {
        const fps = [...(product.floorplans || [])];
        fps[extraIdx] = { ...fps[extraIdx], image: uploadedUrl };
        setProduct({ ...product, floorplans: fps });
      } else if (target === 'seoOgImage') {
        setProduct({ ...product, seo: { ...product.seo, ogImage: uploadedUrl } });
      }

      setAlert({ type: 'success', message: `Image uploaded directly to Cloudinary successfully!` });
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Image upload failed' });
    } finally {
      setUploadingTarget(null);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--admin-forest)' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 1.25rem auto' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Loading Product CMS for "{id}"...</h2>
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>Retrieving live data from MongoDB Atlas</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="admin-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ color: 'var(--admin-danger)' }}>Product Not Found</h2>
        <p>Could not locate product record with ID "{id}".</p>
        <Link href="/admin/products" className="admin-btn admin-btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Product Collections
        </Link>
      </div>
    );
  }

  const sectionsList = [
    { key: 'hero', label: '1. Product Hero Banner', icon: Sparkles },
    { key: 'overview', label: '2. Product Overview & Badges', icon: FileText },
    { key: 'technicalProfile', label: '3. Key Technical Profile', icon: ShieldCheck },
    { key: 'exteriorGallery', label: `4. Exterior Renders (${product.gallery?.exterior?.length || 0})`, icon: ImageIcon },
    { key: 'interiorGallery', label: `5. Interior Views (${product.gallery?.interior?.length || 0})`, icon: ImageIcon },
    { key: 'floorplans', label: `6. Curated Layout Plans (${product.floorplans?.length || 0})`, icon: Layers },
    { key: 'specifications', label: `7. Technical Specifications (${Array.isArray(product.specifications) ? product.specifications.length : 0})`, icon: Sliders },
    { key: 'related', label: '8. Related Collections', icon: Box },
    { key: 'cta', label: '9. Enquiry & CTA Settings', icon: MessageSquare },
    { key: 'seo', label: '10. SEO & Metadata', icon: Globe },
  ] as const;

  return (
    <div className="admin-container">
      {/* Top Floating Control Bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(250, 248, 245, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1.5px solid var(--admin-border-light)',
          padding: '0.85rem 1rem',
          margin: '-1.5rem -1.5rem 1.75rem -1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            href="/admin/products"
            className="admin-btn admin-btn-secondary"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
          >
            <ArrowLeft size={14} /> Back
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: 'var(--admin-forest-dark)' }}>
                {product.name}
              </h1>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  backgroundColor: product.status === 'published' ? 'var(--admin-forest)' : 'var(--admin-accent-gold)',
                  color: '#FAF8F5',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {product.status}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                ({product.category})
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.1rem' }}>
              /{product.slug} &bull; All changes persist directly to MongoDB Atlas
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="admin-btn admin-btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
          >
            <ExternalLink size={14} />
            <span>Preview Live</span>
          </Link>

          <button
            type="button"
            onClick={() => handleSaveProduct('draft')}
            disabled={saving}
            className="admin-btn admin-btn-secondary"
            style={{ fontSize: '0.82rem' }}
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSaveProduct('published')}
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
          >
            {saving ? <RefreshCw className="animate-spin" size={14} /> : <CheckCircle size={14} />}
            <span>{saving ? 'Publishing...' : 'Publish Changes Live'}</span>
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alert && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            backgroundColor: alert.type === 'success' ? 'rgba(82, 105, 75, 0.1)' : 'rgba(197, 48, 48, 0.1)',
            color: alert.type === 'success' ? 'var(--admin-forest)' : 'var(--admin-danger)',
            border: `1px solid ${alert.type === 'success' ? 'rgba(82, 105, 75, 0.25)' : 'rgba(197, 48, 48, 0.25)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.88rem',
            fontWeight: 500,
          }}
        >
          <span>{alert.message}</span>
          <button
            onClick={() => setAlert(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main 2-Column Workspace: Left Section Navigation, Right Section Editor */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.75rem', alignItems: 'start' }}>
        {/* Left Section Navigation Panel */}
        <div
          style={{
            position: 'sticky',
            top: '5rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1.5px solid var(--admin-border-light)',
            padding: '0.85rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--admin-forest)', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
            Product Page Sections
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {sectionsList.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.key;
              return (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() => setActiveSection(sec.key as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--admin-forest)' : 'transparent',
                    color: isActive ? '#FAF8F5' : 'var(--admin-text-main)',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={15} style={{ opacity: isActive ? 1 : 0.65 }} />
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {sec.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--admin-border-light)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
              Quick Information:
            </div>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--admin-surface-muted)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
              <div><strong>Size:</strong> {product.sizeRange}</div>
              <div style={{ marginTop: '0.2rem' }}><strong>Lead:</strong> {product.leadTime}</div>
            </div>
          </div>
        </div>

        {/* Right Section Content Editor */}
        <div style={{ minWidth: 0 }}>
          {/* =========================================================================
              SECTION 1: PRODUCT HERO BANNER
              ========================================================================= */}
          {activeSection === 'hero' && (
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.85rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--admin-forest-dark)' }}>
                    Product Hero Banner
                  </h2>
                  <p style={{ margin: '0.2rem 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                    Top full-bleed visual header, product title, subtitle, size badge, and primary action buttons.
                  </p>
                </div>
              </div>

              {/* Hero Image Visual & Direct Upload */}
              <div style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--admin-surface-muted)', borderRadius: '8px', border: '1px solid var(--admin-border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>
                    Hero Background Photography / 3D Render
                  </label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>
                    Focal position: {product.heroImagePosition || 'center'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.25rem', alignItems: 'start' }}>
                  {/* Thumbnail Live Preview */}
                  <div
                    style={{
                      height: '150px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#1E231D',
                      border: '1.5px solid var(--admin-border-light)',
                      position: 'relative',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.heroImage}
                      alt={product.heroImageAlt || product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: product.heroImagePosition || 'center',
                      }}
                    />
                    <div style={{ position: 'absolute', bottom: '6px', right: '6px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFF', fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                      Preview
                    </div>
                  </div>

                  {/* Upload Controls & URL */}
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <input
                        type="file"
                        accept="image/*"
                        id="product-hero-image-file"
                        style={{ display: 'none' }}
                        disabled={uploadingTarget === 'heroImage'}
                        onChange={(e) => handleImageUpload(e, 'heroImage')}
                      />
                      <label
                        htmlFor="product-hero-image-file"
                        className="admin-btn admin-btn-primary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          cursor: uploadingTarget === 'heroImage' ? 'not-allowed' : 'pointer',
                          padding: '0.55rem 1rem',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                        }}
                      >
                        {uploadingTarget === 'heroImage' ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Uploading to Cloudinary...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud size={14} />
                            <span>Upload Hero Image from Device</span>
                          </>
                        )}
                      </label>
                    </div>

                    <label className="admin-label">Image URL / Path</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={product.heroImage}
                      onChange={(e) => setProduct({ ...product, heroImage: e.target.value })}
                      placeholder="/assets/renders/... or Cloudinary URL"
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                      <div>
                        <label className="admin-label">Focal Alignment</label>
                        <select
                          className="admin-select"
                          value={product.heroImagePosition || 'center'}
                          onChange={(e) => setProduct({ ...product, heroImagePosition: e.target.value })}
                        >
                          <option value="center">Center Center</option>
                          <option value="center top">Center Top</option>
                          <option value="center bottom">Center Bottom</option>
                          <option value="left center">Left Center</option>
                          <option value="right center">Right Center</option>
                        </select>
                      </div>
                      <div>
                        <label className="admin-label">Image Alt Text (SEO)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={product.heroImageAlt || ''}
                          onChange={(e) => setProduct({ ...product, heroImageAlt: e.target.value })}
                          placeholder="e.g. MOVA Modular Villa Exterior"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Headlines */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="admin-label">Eyebrow Badge Text</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.heroEyebrow || ''}
                    onChange={(e) => setProduct({ ...product, heroEyebrow: e.target.value })}
                    placeholder="e.g. MODULAR ARCHITECTURAL SYSTEM"
                  />
                </div>
                <div>
                  <label className="admin-label">Product Name / Main Heading *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value, heroHeading: e.target.value })}
                    placeholder="e.g. MOVA"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="admin-label">Full Name / Architectural Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.fullName}
                    onChange={(e) => setProduct({ ...product, fullName: e.target.value, heroSubtitle: e.target.value })}
                    placeholder="e.g. Modular Optimized Versatile Architecture"
                  />
                </div>
                <div>
                  <label className="admin-label">Tagline (Displayed in quotes)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.tagline}
                    onChange={(e) => setProduct({ ...product, tagline: e.target.value, heroTagline: e.target.value })}
                    placeholder="e.g. One System. Endless Possibilities."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="admin-label">Size Range Metric</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.sizeRange}
                    onChange={(e) => setProduct({ ...product, sizeRange: e.target.value })}
                    placeholder="e.g. 30–75 m²"
                  />
                </div>
                <div>
                  <label className="admin-label">Size Range Imperial (Optional)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.sizeRangeImperial || ''}
                    onChange={(e) => setProduct({ ...product, sizeRangeImperial: e.target.value })}
                    placeholder="e.g. 323–807 sq ft"
                  />
                </div>
              </div>

              {/* Action Buttons (CTAs) */}
              <div style={{ borderTop: '1px solid var(--admin-border-light)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--admin-forest-dark)', marginBottom: '0.85rem' }}>
                  Hero Call-to-Action Buttons
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="admin-label">Primary CTA Button Label</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={product.heroCtaText || `Enquire About ${product.name}`}
                      onChange={(e) => setProduct({ ...product, heroCtaText: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Primary Destination</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={product.heroCtaDestination || '#enquiry'}
                      onChange={(e) => setProduct({ ...product, heroCtaDestination: e.target.value })}
                      placeholder="#enquiry or /contact"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Secondary CTA Button Label</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={product.heroSecondaryCtaText || 'View 3D Renders'}
                      onChange={(e) => setProduct({ ...product, heroSecondaryCtaText: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Secondary Destination</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={product.heroSecondaryCtaDestination || '#renders'}
                      onChange={(e) => setProduct({ ...product, heroSecondaryCtaDestination: e.target.value })}
                      placeholder="#renders or /contact"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 2: PRODUCT OVERVIEW & DOCUMENTED APPLICATIONS
              ========================================================================= */}
          {activeSection === 'overview' && (
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.85rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--admin-forest-dark)' }}>
                    Architectural Overview & Applications
                  </h2>
                  <p style={{ margin: '0.2rem 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                    Left column narrative, editorial paragraphs, and documented application badges.
                  </p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={product.overviewVisible !== false}
                    onChange={(e) => setProduct({ ...product, overviewVisible: e.target.checked })}
                  />
                  <span>Section Visible</span>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="admin-label">Section Eyebrow</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.overviewEyebrow || 'Architectural Overview'}
                    onChange={(e) => setProduct({ ...product, overviewEyebrow: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Overview Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.overviewHeading || ''}
                    onChange={(e) => setProduct({ ...product, overviewHeading: e.target.value })}
                    placeholder="e.g. Versatile Living. Engineered Without Limits."
                  />
                </div>
              </div>

              {/* Overview Paragraphs */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>
                    Editorial Paragraphs (Preserves typography & formatting)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(product.overviewParagraphs || []), ''];
                      setProduct({ ...product, overviewParagraphs: updated });
                    }}
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                  >
                    <Plus size={13} /> Add Paragraph
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(product.overviewParagraphs || []).map((para, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--admin-forest)', paddingTop: '0.6rem' }}>
                        P#{idx + 1}
                      </span>
                      <textarea
                        className="admin-textarea"
                        rows={3}
                        value={para}
                        onChange={(e) => {
                          const updated = [...(product.overviewParagraphs || [])];
                          updated[idx] = e.target.value;
                          setProduct({ ...product, overviewParagraphs: updated });
                        }}
                        placeholder={`Paragraph ${idx + 1} text...`}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (product.overviewParagraphs || []).filter((_, i) => i !== idx);
                          setProduct({ ...product, overviewParagraphs: updated });
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', paddingTop: '0.6rem' }}
                        title="Delete paragraph"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documented Applications Badges */}
              <div style={{ borderTop: '1px solid var(--admin-border-light)', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--admin-forest-dark)', margin: 0 }}>
                      Documented Application Badges
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                      Pills displayed under the narrative on the live website
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {(product.applications || []).map((app, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.35rem 0.75rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--admin-border-light)',
                        borderRadius: '4px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--admin-forest-dark)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      }}
                    >
                      <span>{app}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (product.applications || []).filter((_, i) => i !== idx);
                          setProduct({ ...product, applications: updated });
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Application Tag Input */}
                <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '420px' }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="New application tag (e.g. Garden Pavilion)"
                    value={newApplicationTag}
                    onChange={(e) => setNewApplicationTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newApplicationTag.trim()) {
                          setProduct({ ...product, applications: [...(product.applications || []), newApplicationTag.trim()] });
                          setNewApplicationTag('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newApplicationTag.trim()) {
                        setProduct({ ...product, applications: [...(product.applications || []), newApplicationTag.trim()] });
                        setNewApplicationTag('');
                      }
                    }}
                    className="admin-btn admin-btn-secondary"
                  >
                    <Plus size={14} /> Add Badge
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 3: KEY TECHNICAL PROFILE CARD
              ========================================================================= */}
          {activeSection === 'technicalProfile' && (
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.85rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--admin-forest-dark)' }}>
                    Key Technical Profile (Floating Card)
                  </h2>
                  <p style={{ margin: '0.2rem 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                    Right-hand floating technical card with quick specs and the primary enquiry floor plan action.
                  </p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={product.technicalProfileVisible !== false}
                    onChange={(e) => setProduct({ ...product, technicalProfileVisible: e.target.checked })}
                  />
                  <span>Card Visible</span>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="admin-label">Profile Card Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.technicalProfileTitle || 'Key Technical Profile'}
                    onChange={(e) => setProduct({ ...product, technicalProfileTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Button Action Text</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.technicalProfileButtonText || 'Request Technical Floor Plans'}
                    onChange={(e) => setProduct({ ...product, technicalProfileButtonText: e.target.value })}
                  />
                </div>
              </div>

              {/* Technical Specifications Rows */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>
                    Technical Profile Rows ({product.technicalProfile?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(product.technicalProfile || []), { label: 'New Metric', val: 'Specification value' }];
                      setProduct({ ...product, technicalProfile: updated });
                    }}
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                  >
                    <Plus size={13} /> Add Spec Row
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {(product.technicalProfile || []).map((row, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 3fr auto auto',
                        gap: '0.65rem',
                        alignItems: 'center',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: 'var(--admin-surface-muted)',
                        borderRadius: '6px',
                        border: '1px solid var(--admin-border-light)',
                      }}
                    >
                      <div>
                        <input
                          type="text"
                          className="admin-input"
                          style={{ fontSize: '0.82rem' }}
                          value={row.label}
                          onChange={(e) => {
                            const updated = [...(product.technicalProfile || [])];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            setProduct({ ...product, technicalProfile: updated });
                          }}
                          placeholder="Label (e.g. Available Sizes)"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          className="admin-input"
                          style={{ fontSize: '0.82rem', fontWeight: 600 }}
                          value={row.val}
                          onChange={(e) => {
                            const updated = [...(product.technicalProfile || [])];
                            updated[idx] = { ...updated[idx], val: e.target.value };
                            setProduct({ ...product, technicalProfile: updated });
                          }}
                          placeholder="Value (e.g. 30 m² to 75 m²)"
                        />
                      </div>

                      {/* Reorder Buttons */}
                      <div style={{ display: 'flex', gap: '0.2rem' }}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const updated = [...product.technicalProfile];
                            const temp = updated[idx];
                            updated[idx] = updated[idx - 1];
                            updated[idx - 1] = temp;
                            setProduct({ ...product, technicalProfile: updated });
                          }}
                          style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 0.7 }}
                          title="Move up"
                        >
                          <MoveUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === product.technicalProfile.length - 1}
                          onClick={() => {
                            if (idx === product.technicalProfile.length - 1) return;
                            const updated = [...product.technicalProfile];
                            const temp = updated[idx];
                            updated[idx] = updated[idx + 1];
                            updated[idx + 1] = temp;
                            setProduct({ ...product, technicalProfile: updated });
                          }}
                          style={{ background: 'none', border: 'none', cursor: idx === product.technicalProfile.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === product.technicalProfile.length - 1 ? 0.3 : 0.7 }}
                          title="Move down"
                        >
                          <MoveDown size={14} />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = product.technicalProfile.filter((_, i) => i !== idx);
                          setProduct({ ...product, technicalProfile: updated });
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer' }}
                        title="Remove row"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 4: ARCHITECTURAL GALLERY (EXTERIOR VIEWS)
              ========================================================================= */}
          {activeSection === 'exteriorGallery' && (
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.85rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--admin-forest-dark)' }}>
                    Architectural Gallery — Exterior Views
                  </h2>
                  <p style={{ margin: '0.2rem 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                    High-resolution exterior renders and pavilion architecture photography.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    id="exterior-gallery-upload-file"
                    style={{ display: 'none' }}
                    disabled={uploadingTarget === 'exterior'}
                    onChange={(e) => handleImageUpload(e, 'exterior')}
                  />
                  <label
                    htmlFor="exterior-gallery-upload-file"
                    className="admin-btn admin-btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      cursor: uploadingTarget === 'exterior' ? 'not-allowed' : 'pointer',
                      padding: '0.45rem 0.95rem',
                      fontSize: '0.82rem',
                    }}
                  >
                    {uploadingTarget === 'exterior' ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={14} />
                        <span>Upload Exterior Image</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Renders Grid with Reorder and Delete */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '1.15rem',
                  marginBottom: '1.5rem',
                }}
              >
                {(product.gallery?.exterior || []).map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--admin-border-light)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ position: 'relative', height: '140px', backgroundColor: '#1E231D' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Render ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFF', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        #{idx + 1}
                      </div>
                    </div>

                    <div style={{ padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '0.2rem' }}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const updated = [...product.gallery.exterior];
                            const temp = updated[idx];
                            updated[idx] = updated[idx - 1];
                            updated[idx - 1] = temp;
                            setProduct({ ...product, gallery: { ...product.gallery, exterior: updated } });
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '0.25rem 0.4rem', opacity: idx === 0 ? 0.3 : 1 }}
                          title="Move left"
                        >
                          <MoveUp size={12} style={{ transform: 'rotate(-90deg)' }} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (product.gallery?.exterior?.length || 0) - 1}
                          onClick={() => {
                            if (idx === (product.gallery?.exterior?.length || 0) - 1) return;
                            const updated = [...product.gallery.exterior];
                            const temp = updated[idx];
                            updated[idx] = updated[idx + 1];
                            updated[idx + 1] = temp;
                            setProduct({ ...product, gallery: { ...product.gallery, exterior: updated } });
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '0.25rem 0.4rem', opacity: idx === (product.gallery?.exterior?.length || 0) - 1 ? 0.3 : 1 }}
                          title="Move right"
                        >
                          <MoveDown size={12} style={{ transform: 'rotate(-90deg)' }} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Delete this exterior render?')) {
                            const updated = product.gallery.exterior.filter((_, i) => i !== idx);
                            setProduct({ ...product, gallery: { ...product.gallery, exterior: updated } });
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '0.2rem' }}
                        title="Remove render"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bulk URL text fallback */}
              <div style={{ borderTop: '1px solid var(--admin-border-light)', paddingTop: '1rem' }}>
                <label className="admin-label">Direct URLs / Text Input (one URL per line)</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={(product.gallery?.exterior || []).join('\n')}
                  onChange={(e) => {
                    const list = e.target.value.split('\n').filter((x) => x.trim().length > 0);
                    setProduct({ ...product, gallery: { ...product.gallery, exterior: list } });
                  }}
                  placeholder="/assets/renders/... or Cloudinary URL"
                />
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 5: INTERIOR GALLERY (INTERIOR ARCHITECTURE)
              ========================================================================= */}
          {activeSection === 'interiorGallery' && (
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.85rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--admin-forest-dark)' }}>
                    Interior Gallery — Architecture & Living Spaces
                  </h2>
                  <p style={{ margin: '0.2rem 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                    Interior renders, joinery details, living voids, kitchens, and en-suite bathrooms.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    id="interior-gallery-upload-file"
                    style={{ display: 'none' }}
                    disabled={uploadingTarget === 'interior'}
                    onChange={(e) => handleImageUpload(e, 'interior')}
                  />
                  <label
                    htmlFor="interior-gallery-upload-file"
                    className="admin-btn admin-btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      cursor: uploadingTarget === 'interior' ? 'not-allowed' : 'pointer',
                      padding: '0.45rem 0.95rem',
                      fontSize: '0.82rem',
                    }}
                  >
                    {uploadingTarget === 'interior' ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={14} />
                        <span>Upload Interior Image</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Interior Renders Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '1.15rem',
                  marginBottom: '1.5rem',
                }}
              >
                {(product.gallery?.interior || []).map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--admin-border-light)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ position: 'relative', height: '140px', backgroundColor: '#1E231D' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Interior ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFF', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        #{idx + 1}
                      </div>
                    </div>

                    <div style={{ padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '0.2rem' }}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const updated = [...product.gallery.interior];
                            const temp = updated[idx];
                            updated[idx] = updated[idx - 1];
                            updated[idx - 1] = temp;
                            setProduct({ ...product, gallery: { ...product.gallery, interior: updated } });
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '0.25rem 0.4rem', opacity: idx === 0 ? 0.3 : 1 }}
                          title="Move left"
                        >
                          <MoveUp size={12} style={{ transform: 'rotate(-90deg)' }} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (product.gallery?.interior?.length || 0) - 1}
                          onClick={() => {
                            if (idx === (product.gallery?.interior?.length || 0) - 1) return;
                            const updated = [...product.gallery.interior];
                            const temp = updated[idx];
                            updated[idx] = updated[idx + 1];
                            updated[idx + 1] = temp;
                            setProduct({ ...product, gallery: { ...product.gallery, interior: updated } });
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '0.25rem 0.4rem', opacity: idx === (product.gallery?.interior?.length || 0) - 1 ? 0.3 : 1 }}
                          title="Move right"
                        >
                          <MoveDown size={12} style={{ transform: 'rotate(-90deg)' }} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Delete this interior render?')) {
                            const updated = product.gallery.interior.filter((_, i) => i !== idx);
                            setProduct({ ...product, gallery: { ...product.gallery, interior: updated } });
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '0.2rem' }}
                        title="Remove render"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bulk URL fallback */}
              <div style={{ borderTop: '1px solid var(--admin-border-light)', paddingTop: '1rem' }}>
                <label className="admin-label">Direct URLs / Text Input (one URL per line)</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={(product.gallery?.interior || []).join('\n')}
                  onChange={(e) => {
                    const list = e.target.value.split('\n').filter((x) => x.trim().length > 0);
                    setProduct({ ...product, gallery: { ...product.gallery, interior: list } });
                  }}
                  placeholder="/assets/renders/... or Cloudinary URL"
                />
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 6: SPECIFICATIONS & FLOOR CONFIGURATIONS (CURATED LAYOUT PLANS)
              ========================================================================= */}
          {activeSection === 'floorplans' && (
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.85rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--admin-forest-dark)' }}>
                    Curated Layout Plans
                  </h2>
                  <p style={{ margin: '0.2rem 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                    Standard architectural floor configurations (e.g. Studio 30m², One-Bed 52m², Grand Villa 75m²).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [
                      ...(product.floorplans || []),
                      {
                        name: `${product.name} Custom Plan`,
                        dimensions: '10.0m x 5.0m',
                        description: 'Detailed layout description with integrated kitchen, bathroom, and terrace deck.',
                      },
                    ];
                    setProduct({ ...product, floorplans: updated });
                  }}
                  className="admin-btn admin-btn-primary"
                  style={{ fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}
                >
                  <Plus size={14} /> Add Floor Plan
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {(product.floorplans || []).map((plan, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1.5px solid var(--admin-border-light)',
                      borderRadius: '8px',
                      padding: '1.15rem',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ backgroundColor: 'var(--admin-forest)', color: '#FAF8F5', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                          Plan #{idx + 1}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--admin-forest-dark)' }}>
                          {plan.name}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const updated = [...product.floorplans];
                            const temp = updated[idx];
                            updated[idx] = updated[idx - 1];
                            updated[idx - 1] = temp;
                            setProduct({ ...product, floorplans: updated });
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '0.25rem 0.45rem', opacity: idx === 0 ? 0.3 : 1 }}
                          title="Move up"
                        >
                          <MoveUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === product.floorplans.length - 1}
                          onClick={() => {
                            if (idx === product.floorplans.length - 1) return;
                            const updated = [...product.floorplans];
                            const temp = updated[idx];
                            updated[idx] = updated[idx + 1];
                            updated[idx + 1] = temp;
                            setProduct({ ...product, floorplans: updated });
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '0.25rem 0.45rem', opacity: idx === product.floorplans.length - 1 ? 0.3 : 1 }}
                          title="Move down"
                        >
                          <MoveDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete plan "${plan.name}"?`)) {
                              const updated = product.floorplans.filter((_, i) => i !== idx);
                              setProduct({ ...product, floorplans: updated });
                            }
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', marginLeft: '0.35rem' }}
                          title="Delete plan"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label className="admin-label">Plan Name & Typology *</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={plan.name}
                          onChange={(e) => {
                            const updated = [...product.floorplans];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            setProduct({ ...product, floorplans: updated });
                          }}
                          placeholder="e.g. MOVA Studio (30 m²)"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Exterior Dimensions</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={plan.dimensions || ''}
                          onChange={(e) => {
                            const updated = [...product.floorplans];
                            updated[idx] = { ...updated[idx], dimensions: e.target.value };
                            setProduct({ ...product, floorplans: updated });
                          }}
                          placeholder="e.g. 7.5m x 4.0m"
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <label className="admin-label">Architectural Layout Description</label>
                      <textarea
                        className="admin-textarea"
                        rows={2}
                        value={plan.description}
                        onChange={(e) => {
                          const updated = [...product.floorplans];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setProduct({ ...product, floorplans: updated });
                        }}
                        placeholder="Open-plan living with integrated kitchenette, luxury bathroom, built-in storage..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 7: TECHNICAL SPECIFICATIONS TABLE
              ========================================================================= */}
          {activeSection === 'specifications' && (
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.85rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--admin-forest-dark)' }}>
                    Complete Technical Specifications Table
                  </h2>
                  <p style={{ margin: '0.2rem 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                    Engineered tolerances, structural steel chassis, facade finishes, acoustic ratings, and climate systems.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const currentSpecs = Array.isArray(product.specifications) ? product.specifications : [];
                    const updated = [...currentSpecs, { label: 'New Specification', value: 'Technical description' }];
                    setProduct({ ...product, specifications: updated });
                  }}
                  className="admin-btn admin-btn-primary"
                  style={{ fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}
                >
                  <Plus size={14} /> Add Spec Item
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {(Array.isArray(product.specifications) ? product.specifications : []).map((spec: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 3.5fr auto auto',
                      gap: '0.75rem',
                      alignItems: 'center',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: 'var(--admin-surface-muted)',
                      borderRadius: '6px',
                      border: '1px solid var(--admin-border-light)',
                    }}
                  >
                    <div>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ fontSize: '0.82rem' }}
                        value={spec.label || ''}
                        onChange={(e) => {
                          const updated = [...product.specifications];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setProduct({ ...product, specifications: updated });
                        }}
                        placeholder="e.g. Structural Frame"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ fontSize: '0.82rem', fontWeight: 500 }}
                        value={spec.value || ''}
                        onChange={(e) => {
                          const updated = [...product.specifications];
                          updated[idx] = { ...updated[idx], value: e.target.value };
                          setProduct({ ...product, specifications: updated });
                        }}
                        placeholder="e.g. Precision cold-formed high-tensile steel chassis"
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.2rem' }}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          if (idx === 0) return;
                          const updated = [...product.specifications];
                          const temp = updated[idx];
                          updated[idx] = updated[idx - 1];
                          updated[idx - 1] = temp;
                          setProduct({ ...product, specifications: updated });
                        }}
                        style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 0.7 }}
                        title="Move up"
                      >
                        <MoveUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === product.specifications.length - 1}
                        onClick={() => {
                          if (idx === product.specifications.length - 1) return;
                          const updated = [...product.specifications];
                          const temp = updated[idx];
                          updated[idx] = updated[idx + 1];
                          updated[idx + 1] = temp;
                          setProduct({ ...product, specifications: updated });
                        }}
                        style={{ background: 'none', border: 'none', cursor: idx === product.specifications.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === product.specifications.length - 1 ? 0.3 : 0.7 }}
                        title="Move down"
                      >
                        <MoveDown size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = product.specifications.filter((_: any, i: number) => i !== idx);
                        setProduct({ ...product, specifications: updated });
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer' }}
                      title="Remove specification"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 8: RELATED ALGHAF COLLECTIONS
              ========================================================================= */}
          {activeSection === 'related' && (
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.85rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--admin-forest-dark)' }}>
                    Related AlGhaf Collections
                  </h2>
                  <p style={{ margin: '0.2rem 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                    Select which other collections appear at the bottom of this product's page.
                  </p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={product.relatedVisible !== false}
                    onChange={(e) => setProduct({ ...product, relatedVisible: e.target.checked })}
                  />
                  <span>Section Visible</span>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="admin-label">Eyebrow</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.relatedEyebrow || 'Explore Other Systems'}
                    onChange={(e) => setProduct({ ...product, relatedEyebrow: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.relatedTitle || 'Related AlGhaf Collections.'}
                    onChange={(e) => setProduct({ ...product, relatedTitle: e.target.value })}
                  />
                </div>
              </div>

              {/* Related Products Checklist */}
              <div>
                <label className="admin-label" style={{ marginBottom: '0.75rem', fontWeight: 700 }}>
                  Select Displayed Collections (Self is excluded automatically)
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                  {allProducts
                    .filter((p) => p.id.toLowerCase() !== product.id.toLowerCase())
                    .map((other) => {
                      const isSelected = (product.relatedProducts || []).includes(other.id.toLowerCase());
                      return (
                        <div
                          key={other.id}
                          onClick={() => {
                            let updated = [...(product.relatedProducts || [])];
                            if (isSelected) {
                              updated = updated.filter((x) => x !== other.id.toLowerCase());
                            } else {
                              updated.push(other.id.toLowerCase());
                            }
                            setProduct({ ...product, relatedProducts: updated });
                          }}
                          style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            border: `2px solid ${isSelected ? 'var(--admin-forest)' : 'var(--admin-border-light)'}`,
                            backgroundColor: isSelected ? 'rgba(82, 105, 75, 0.05)' : '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--admin-forest-dark)' }}>
                              {other.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                              {other.category}
                            </div>
                          </div>
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '4px',
                              border: `1.5px solid ${isSelected ? 'var(--admin-forest)' : 'var(--admin-border)'}`,
                              backgroundColor: isSelected ? 'var(--admin-forest)' : 'transparent',
                              color: '#FFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {isSelected && <Check size={14} />}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 9: PRODUCT ENQUIRY & CTA
              ========================================================================= */}
          {activeSection === 'cta' && (
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.85rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--admin-forest-dark)' }}>
                    Enquiry & Call-To-Action Flow
                  </h2>
                  <p style={{ margin: '0.2rem 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                    Configure the bottom conversion banner, enquiry modal trigger, and direct contact options.
                  </p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={product.ctaVisible !== false}
                    onChange={(e) => setProduct({ ...product, ctaVisible: e.target.checked })}
                  />
                  <span>Banner Visible</span>
                </label>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-label">CTA Banner Headline</label>
                <input
                  type="text"
                  className="admin-input"
                  value={product.ctaHeading || `Ready to Build with ${product.name}?`}
                  onChange={(e) => setProduct({ ...product, ctaHeading: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-label">Supporting Narrative</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={product.ctaDescription || ''}
                  onChange={(e) => setProduct({ ...product, ctaDescription: e.target.value })}
                  placeholder="Connect with our architectural advisory team to discuss spatial configurations..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Button Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.ctaButtonText || `Enquire About ${product.name}`}
                    onChange={(e) => setProduct({ ...product, ctaButtonText: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Button Destination</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.ctaDestination || '#enquiry'}
                    onChange={(e) => setProduct({ ...product, ctaDestination: e.target.value })}
                    placeholder="#enquiry (opens modal) or /contact"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 10: SEO & METADATA
              ========================================================================= */}
          {activeSection === 'seo' && (
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.85rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--admin-forest-dark)' }}>
                    Product SEO & Social Metadata
                  </h2>
                  <p style={{ margin: '0.2rem 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                    Google search metadata, page title, URL slug, and OpenGraph social preview images.
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-label">Page Title Tag</label>
                <input
                  type="text"
                  className="admin-input"
                  value={product.seo?.title || `${product.name} — ${product.fullName}`}
                  onChange={(e) => setProduct({ ...product, seo: { ...product.seo, title: e.target.value } })}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-label">Meta Description</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={product.seo?.description || product.shortDescription}
                  onChange={(e) => setProduct({ ...product, seo: { ...product.seo, description: e.target.value } })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="admin-label">URL Slug *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.slug}
                    onChange={(e) => setProduct({ ...product, slug: e.target.value.toLowerCase().trim() })}
                    placeholder="e.g. mova"
                  />
                </div>
                <div>
                  <label className="admin-label">Keywords</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.seo?.keywords || ''}
                    onChange={(e) => setProduct({ ...product, seo: { ...product.seo, keywords: e.target.value } })}
                    placeholder="modular villa, prefab UAE, luxury living"
                  />
                </div>
              </div>

              {/* OG Social Image */}
              <div>
                <label className="admin-label">Social Share Image (OG Image)</label>
                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="admin-input"
                    value={product.seo?.ogImage || product.heroImage}
                    onChange={(e) => setProduct({ ...product, seo: { ...product.seo, ogImage: e.target.value } })}
                    placeholder="/assets/renders/... or Cloudinary URL"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="seo-og-image-file"
                    style={{ display: 'none' }}
                    disabled={uploadingTarget === 'seoOgImage'}
                    onChange={(e) => handleImageUpload(e, 'seoOgImage')}
                  />
                  <label
                    htmlFor="seo-og-image-file"
                    className="admin-btn admin-btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    <UploadCloud size={14} />
                    <span>Upload OG Image</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1.5px solid var(--admin-border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
              Working on <strong>{product.name}</strong> &bull; Status: <strong style={{ color: product.status === 'published' ? 'var(--admin-forest)' : 'var(--admin-accent-gold)' }}>{product.status.toUpperCase()}</strong>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => handleSaveProduct('draft')}
                disabled={saving}
                className="admin-btn admin-btn-secondary"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSaveProduct('published')}
                disabled={saving}
                className="admin-btn admin-btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                {saving ? <RefreshCw className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                <span>{saving ? 'Publishing to MongoDB...' : 'Publish Product Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
