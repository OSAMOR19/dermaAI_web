'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Package, Tag, Droplets, Shield, Star,
  ExternalLink, Clock, Sparkles, Layers, Info,
} from 'lucide-react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminTopbar from '../../../components/AdminTopbar';

interface Product {
  id: string;
  category_id: string;
  category_name: string;
  product_name: string;
  brand: string;
  sub_type: string | null;
  finish: string | null;
  best_for: string | null;
  confidence_level: string;
  skin_concern_tags: string[];
  description: string | null;
  image_url: string | null;
  product_url: string | null;
  status: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  group_name: string;
}

export default function ProductDetailClient() {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [recCount, setRecCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/products/${id}`);
    if (res.ok) {
      const data = await res.json();
      setProduct(data.product);
      setCategory(data.category);
      setRecCount(data.recommendation_count || 0);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  const getConfidenceStyle = (level: string) => {
    switch (level) {
      case 'High': return { bg: 'rgba(76,175,80,0.1)', color: '#388E3C', border: 'rgba(76,175,80,0.2)' };
      case 'Medium': return { bg: 'rgba(255,152,0,0.1)', color: '#E65100', border: 'rgba(255,152,0,0.2)' };
      case 'Low': return { bg: 'rgba(229,57,53,0.1)', color: '#C62828', border: 'rgba(229,57,53,0.2)' };
      default: return { bg: 'rgba(0,0,0,0.05)', color: '#888', border: 'rgba(0,0,0,0.1)' };
    }
  };

  if (loading) return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar title="Product Detail" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-page"><div className="admin-loading"><div className="admin-spinner" /><p>Loading product…</p></div></div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar title="Product Detail" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-page"><div className="admin-empty"><p>Product not found.</p></div></div>
      </div>
    </div>
  );

  const confStyle = getConfidenceStyle(product.confidence_level);

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar title="Product Detail" subtitle={product.product_name} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-page">

          <a href="/admin/products" className="pdt-back-btn"><ArrowLeft size={15} /> Back to Products</a>

          {/* Product Header Card */}
          <div className="pdt-header-card">
            <div className="pdt-image-wrap">
              {product.image_url ? (
                <img src={product.image_url} alt={product.product_name} className="pdt-image" />
              ) : (
                <div className="pdt-image-placeholder">
                  <Package size={40} />
                </div>
              )}
            </div>
            <div className="pdt-header-info">
              <div className="pdt-brand-row">
                <span className="pdt-brand-label">{product.brand}</span>
                <span className="pdt-status" data-status={product.status}>
                  {product.status === 'active' ? '● Active' : '○ Inactive'}
                </span>
              </div>
              <h1 className="pdt-name">{product.product_name}</h1>
              <div className="pdt-meta-row">
                <span className="pdt-meta-chip category">
                  <Layers size={12} /> {product.category_name}
                </span>
                {category && (
                  <span className="pdt-meta-chip group">
                    {category.group_name}
                  </span>
                )}
                {product.sub_type && (
                  <span className="pdt-meta-chip type">
                    {product.sub_type}
                  </span>
                )}
                {product.finish && (
                  <span className="pdt-meta-chip finish">
                    <Droplets size={12} /> {product.finish}
                  </span>
                )}
              </div>
              <div className="pdt-stats-row">
                <div className="pdt-stat">
                  <span className="pdt-stat-label">Confidence</span>
                  <span className="pdt-stat-value" style={{ background: confStyle.bg, color: confStyle.color, border: `1px solid ${confStyle.border}` }}>
                    <Shield size={12} /> {product.confidence_level}
                  </span>
                </div>
                <div className="pdt-stat">
                  <span className="pdt-stat-label">Recommendations</span>
                  <span className="pdt-stat-value rec">
                    <Star size={12} /> {recCount} time{recCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="pdt-stat">
                  <span className="pdt-stat-label">Product ID</span>
                  <span className="pdt-stat-value id">{product.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Sections Grid */}
          <div className="pdt-grid">
            {/* Best For */}
            <div className="pdt-section-card">
              <div className="pdt-section-title"><Sparkles size={16} /> Best For</div>
              <p className="pdt-section-text">{product.best_for || 'Not specified'}</p>
            </div>

            {/* Description */}
            <div className="pdt-section-card">
              <div className="pdt-section-title"><Info size={16} /> Description</div>
              <p className="pdt-section-text">{product.description || 'No description available.'}</p>
            </div>

            {/* Skin Concern Tags */}
            <div className="pdt-section-card full-width">
              <div className="pdt-section-title"><Tag size={16} /> Skin Concern Tags</div>
              <div className="pdt-tag-grid">
                {(product.skin_concern_tags || []).length === 0 ? (
                  <p className="pdt-section-text" style={{ color: '#999' }}>No tags assigned.</p>
                ) : (
                  product.skin_concern_tags.map((tag, i) => (
                    <span key={i} className="pdt-concern-tag">{tag}</span>
                  ))
                )}
              </div>
            </div>

            {/* Product Link */}
            {product.product_url && (
              <div className="pdt-section-card full-width">
                <div className="pdt-section-title"><ExternalLink size={16} /> WBH Store Link</div>
                <a href={product.product_url} target="_blank" rel="noopener noreferrer" className="pdt-store-link">
                  <ExternalLink size={14} /> View on Wholesale Beauty Hub
                </a>
              </div>
            )}

            {/* Coming Soon Cards */}
            <div className="pdt-section-card coming-soon">
              <div className="pdt-section-title"><Droplets size={16} /> Ingredients</div>
              <div className="pdt-coming-soon">
                <Clock size={20} />
                <span>Coming Soon</span>
              </div>
            </div>

            <div className="pdt-section-card coming-soon">
              <div className="pdt-section-title"><Info size={16} /> Usage Instructions</div>
              <div className="pdt-coming-soon">
                <Clock size={20} />
                <span>Coming Soon</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
