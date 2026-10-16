'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Copy,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  RefreshCw,
  Clock,
  Compass,
  Check,
  X,
} from 'lucide-react';

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  category: string;
  tagline: string;
  sizeRange: string;
  leadTime: string;
  heroImage: string;
  previewImage: string;
  shortDescription: string;
  status: 'published' | 'draft';
  updatedAt?: string;
  gallery?: {
    exterior?: string[];
    interior?: string[];
  };
  floorplans?: any[];
  specifications?: any[];
}

export default function AdminProductsDashboard() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'order' | 'name' | 'updated'>('order');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Product Details Public Access Toggle
  const [productDetailsAccess, setProductDetailsAccess] = useState(false);
  const [togglingAccess, setTogglingAccess] = useState(false);

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    fullName: '',
    category: 'Modular Living',
    sizeRange: '30–75 m²',
    leadTime: '6–10 Weeks',
    tagline: '',
    shortDescription: '',
  });
  const [creating, setCreating] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: 'Failed to load products from database.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data?.settings && typeof data.settings.productDetailsAccess === 'boolean') {
          setProductDetailsAccess(data.settings.productDetailsAccess);
        }
      }
    } catch (e) {
      console.warn('Failed to sync settings:', e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  const handleToggleDetailsAccess = async () => {
    const nextVal = !productDetailsAccess;
    setTogglingAccess(true);
    setProductDetailsAccess(nextVal);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productDetailsAccess: nextVal }),
      });
      if (res.ok) {
        setAlert({
          type: 'success',
          message: nextVal
            ? 'Product details pages are now LIVE for published products.'
            : 'Product details pages are now LOCKED (Coming Soon active for public visitors).',
        });
      } else {
        setProductDetailsAccess(!nextVal);
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to update access toggle.' });
      }
    } catch (e: any) {
      setProductDetailsAccess(!nextVal);
      setAlert({ type: 'error', message: e.message || 'Error updating access toggle.' });
    } finally {
      setTogglingAccess(false);
    }
  };

  const handleToggleStatus = async (product: ProductItem) => {
    const nextStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, status: nextStatus }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p))
        );
        setAlert({
          type: 'success',
          message: `Product "${product.name}" is now ${nextStatus.toUpperCase()}.`,
        });
      } else {
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to update status.' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error updating product status.' });
    }
  };

  const handleDuplicate = async (product: ProductItem) => {
    const newId = `${product.id}-copy-${Date.now().toString().slice(-4)}`;
    const newName = `${product.name} (Copy)`;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          id: newId,
          slug: newId,
          name: newName,
          status: 'draft',
          isNew: true,
        }),
      });

      if (res.ok) {
        setAlert({
          type: 'success',
          message: `Successfully duplicated "${product.name}" as "${newName}".`,
        });
        fetchProducts();
      } else {
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to duplicate product.' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error duplicating product.' });
    }
  };

  const handleDelete = async (product: ProductItem) => {
    if (!window.confirm(`Are you sure you want to delete product "${product.name}" (${product.id})? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        setAlert({
          type: 'success',
          message: `Product "${product.name}" was deleted successfully.`,
        });
      } else {
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to delete product.' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error deleting product.' });
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;

    try {
      setCreating(true);
      const cleanId = newProduct.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          id: cleanId,
          slug: cleanId,
          fullName: newProduct.fullName || newProduct.name,
          heroImage: '/assets/renders/MOVA_EXT_3D_img1.jpg',
          previewImage: '/assets/renders/MOVA_EXT_3D_img2.jpg',
          status: 'draft',
          isNew: true,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewProduct({
          name: '',
          fullName: '',
          category: 'Modular Living',
          sizeRange: '30–75 m²',
          leadTime: '6–10 Weeks',
          tagline: '',
          shortDescription: '',
        });
        setAlert({
          type: 'success',
          message: `Product "${newProduct.name}" created successfully! Opening editor...`,
        });
        fetchProducts();
      } else {
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to create product.' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error creating product.' });
    } finally {
      setCreating(false);
    }
  };

  // Categories list
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  // Filtered & sorted products
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        (p.tagline && p.tagline.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'updated') {
        const da = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const db = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return db - da;
      }
      return 0; // Default order
    });

  return (
    <div className="admin-container">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(82, 105, 75, 0.1)',
                color: 'var(--admin-forest)',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <Box size={13} /> Product Details CMS
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
              ({products.length} Products Configured)
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--admin-forest-dark)', letterSpacing: '-0.02em' }}>
            AlGhaf Product Collections
          </h1>
          <p style={{ margin: '0.35rem 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.92rem' }}>
            Complete content management for individual product pages (MOVA, PENTA, ENTRA). Edit hero banners, 3D renders, floor plans, specs, and enquiry destinations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={fetchProducts}
            className="admin-btn admin-btn-secondary"
            title="Refresh from MongoDB Atlas"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync DB</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="admin-btn admin-btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.15rem' }}
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Product Details Public Access Control Banner */}
      <div
        className="admin-card"
        style={{
          marginBottom: '1.75rem',
          padding: '1.2rem 1.5rem',
          border: productDetailsAccess
            ? '1px solid rgba(62, 126, 78, 0.35)'
            : '1px solid rgba(192, 57, 43, 0.35)',
          backgroundColor: productDetailsAccess
            ? 'rgba(62, 126, 78, 0.04)'
            : 'rgba(192, 57, 43, 0.04)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: productDetailsAccess ? 'rgba(62, 126, 78, 0.12)' : 'rgba(192, 57, 43, 0.12)',
              color: productDetailsAccess ? 'var(--admin-forest)' : '#C0392B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {productDetailsAccess ? <Eye size={22} /> : <EyeOff size={22} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--admin-forest-dark)' }}>
                Product Details Page Public Access:
              </span>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  backgroundColor: productDetailsAccess ? 'rgba(62, 126, 78, 0.15)' : 'rgba(192, 57, 43, 0.15)',
                  color: productDetailsAccess ? '#2E6E3E' : '#C0392B',
                  border: productDetailsAccess ? '1px solid rgba(62, 126, 78, 0.3)' : '1px solid rgba(192, 57, 43, 0.3)',
                }}
              >
                {productDetailsAccess ? 'PUBLIC ACCESS LIVE' : 'LOCKED (COMING SOON / DRAFT MODE)'}
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--admin-text-muted)', marginTop: '0.25rem' }}>
              {productDetailsAccess
                ? "Published product details pages (/products/mova, /products/penta, /products/entra) are visible to public visitors."
                : "Product details pages are strictly LOCKED. Visitors cannot open them and will see the curated Coming Soon screen with private brochure enquiry access."}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            disabled={togglingAccess}
            onClick={handleToggleDetailsAccess}
            className="admin-btn"
            style={{
              backgroundColor: productDetailsAccess ? '#C0392B' : 'var(--admin-forest)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              padding: '0.55rem 1.15rem',
              cursor: togglingAccess ? 'not-allowed' : 'pointer',
              opacity: togglingAccess ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            {togglingAccess ? (
              <span>Updating Access...</span>
            ) : productDetailsAccess ? (
              <>
                <EyeOff size={15} /> Lock Details Pages (Coming Soon)
              </>
            ) : (
              <>
                <Eye size={15} /> Enable Public Access
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert banner */}
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

      {/* Search & Filter Bar */}
      <div
        className="admin-card"
        style={{
          padding: '1.15rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }}
          />
          <input
            type="text"
            className="admin-input"
            style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
            placeholder="Search by product name, category, or tagline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', backgroundColor: 'var(--admin-surface-muted)', borderRadius: '6px', padding: '0.2rem', border: '1px solid var(--admin-border-light)' }}>
            {(['all', 'published', 'draft'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: statusFilter === s ? '#FFFFFF' : 'transparent',
                  color: statusFilter === s ? 'var(--admin-forest-dark)' : 'var(--admin-text-muted)',
                  boxShadow: statusFilter === s ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <select
              className="admin-select"
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.75rem', width: 'auto' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {/* Sort By */}
          <select
            className="admin-select"
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.75rem', width: 'auto' }}
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
          >
            <option value="order">Sort: Custom Order</option>
            <option value="name">Sort: Name (A–Z)</option>
            <option value="updated">Sort: Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--admin-forest)' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
          <p style={{ fontWeight: 600 }}>Loading AlGhaf Products from MongoDB Atlas...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div
          className="admin-card"
          style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--admin-text-muted)' }}
        >
          <Box size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--admin-forest-dark)', marginBottom: '0.5rem' }}>
            No products match your filters
          </h3>
          <p style={{ fontSize: '0.88rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            Try resetting your search query or status filter to see all configured products.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
            className="admin-btn admin-btn-secondary"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && filteredProducts.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {filteredProducts.map((p) => {
            const isPublished = p.status === 'published';
            const renderCount = (p.gallery?.exterior?.length || 0) + (p.gallery?.interior?.length || 0);
            const plansCount = p.floorplans?.length || 0;

            return (
              <div
                key={p.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1.5px solid var(--admin-border-light)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Product Cover Image */}
                <div style={{ position: 'relative', height: '220px', backgroundColor: '#1E231D', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.heroImage || p.previewImage || '/assets/renders/MOVA_EXT_3D_img1.jpg'}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Top Badges */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0.85rem',
                      left: '0.85rem',
                      right: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: 'rgba(26, 32, 25, 0.85)',
                        backdropFilter: 'blur(6px)',
                        color: '#FAF8F5',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.7rem',
                        borderRadius: '9999px',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        border: '1px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      {p.category}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(p)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor: isPublished ? 'rgba(82, 105, 75, 0.95)' : 'rgba(217, 119, 6, 0.95)',
                        backdropFilter: 'blur(6px)',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        border: 'none',
                        cursor: 'pointer',
                        letterSpacing: '0.03em',
                      }}
                      title="Click to toggle status"
                    >
                      {isPublished ? <CheckCircle size={12} /> : <Clock size={12} />}
                      <span>{isPublished ? 'PUBLISHED' : 'DRAFT'}</span>
                    </button>
                  </div>

                  {/* Size Range Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.85rem',
                      left: '0.85rem',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(4px)',
                      color: 'var(--admin-accent-gold)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                    }}
                  >
                    {p.sizeRange}
                  </div>
                </div>

                {/* Product Body */}
                <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: 'var(--admin-forest-dark)', letterSpacing: '-0.01em' }}>
                        {p.name}
                      </h2>
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>
                        /{p.slug}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--admin-forest)', marginTop: '0.15rem' }}>
                      {p.fullName}
                    </div>
                  </div>

                  {p.tagline && (
                    <p style={{ fontStyle: 'italic', fontSize: '0.82rem', color: 'var(--admin-text-muted)', margin: '0 0 0.85rem 0' }}>
                      “{p.tagline}”
                    </p>
                  )}

                  <p
                    style={{
                      fontSize: '0.84rem',
                      lineHeight: '1.55',
                      color: 'var(--admin-text-main)',
                      margin: '0 0 1.25rem 0',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {p.shortDescription}
                  </p>

                  {/* Stats Meta row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: 'var(--admin-surface-muted)',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      color: 'var(--admin-text-muted)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <span>
                      📸 <strong>{renderCount}</strong> Renders
                    </span>
                    <span>
                      📐 <strong>{plansCount}</strong> Layout Plans
                    </span>
                    <span>
                      ⏱ <strong>{p.leadTime || '6–10 Wks'}</strong>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '0.45rem', alignItems: 'center' }}>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="admin-btn admin-btn-primary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        padding: '0.55rem',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      <Edit size={14} />
                      <span>Edit Product</span>
                    </Link>

                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '0.55rem 0.65rem' }}
                      title="Preview live public page"
                    >
                      <ExternalLink size={14} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(p)}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '0.55rem 0.65rem' }}
                      title="Duplicate product"
                    >
                      <Copy size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '0.55rem 0.65rem', color: 'var(--admin-danger)' }}
                      title="Delete product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Product Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              maxWidth: '540px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--admin-border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Box size={18} style={{ color: 'var(--admin-forest)' }} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--admin-forest-dark)', fontWeight: 700 }}>
                  Add New Architectural Collection
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-label">Product Short Code / Name *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="e.g. VITA, AURA, SKYLA"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-label">Full Architectural Name</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Elevated Modular Living"
                  value={newProduct.fullName}
                  onChange={(e) => setNewProduct({ ...newProduct, fullName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="admin-label">Category</label>
                  <select
                    className="admin-select"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="Modular Living">Modular Living</option>
                    <option value="Luxury Architectural Living">Luxury Architectural Living</option>
                    <option value="Private Entertainment">Private Entertainment</option>
                    <option value="Hospitality & Resorts">Hospitality & Resorts</option>
                    <option value="Bespoke Annexes">Bespoke Annexes</option>
                  </select>
                </div>

                <div>
                  <label className="admin-label">Size Range</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. 40–120 m²"
                    value={newProduct.sizeRange}
                    onChange={(e) => setNewProduct({ ...newProduct, sizeRange: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-label">Turnaround / Lead Time</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. 8–12 Weeks"
                  value={newProduct.leadTime}
                  onChange={(e) => setNewProduct({ ...newProduct, leadTime: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="admin-label">Tagline / Motto</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. One System. Endless Possibilities."
                  value={newProduct.tagline}
                  onChange={(e) => setNewProduct({ ...newProduct, tagline: e.target.value })}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  borderTop: '1px solid var(--admin-border-light)',
                  paddingTop: '1.25rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="admin-btn admin-btn-secondary"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={creating}
                >
                  {creating ? <RefreshCw className="animate-spin" size={14} /> : <Plus size={14} />}
                  <span>{creating ? 'Creating Product...' : 'Create & Open Editor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
