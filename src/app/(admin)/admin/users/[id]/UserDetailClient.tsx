'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, ChevronDown, ChevronUp, Calendar, ScanLine, Mail, Shield,
  Sparkles, Package, Search, X, Plus, Check, Star, Tag, Trash2, RefreshCw, ClipboardCheck,
} from 'lucide-react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminTopbar from '../../../components/AdminTopbar';

interface Scan {
  id: string;
  created_at: string;
  score: number | null;
  signed_image_urls: string[];
  analysis: {
    detected_conditions?: { condition: string; severity: string; confidence: number }[];
    skin_type_estimate?: string;
  } | null;
}

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: string;
  plan: string;
  created_at: string;
}

interface RecItem {
  id: string;
  product_id: string;
  match_reason: string;
  concern_match: string[];
  confidence_score: number;
  added_by: string;
  sort_order: number;
  products: {
    id: string;
    product_name: string;
    brand: string;
    category_name: string;
    image_url: string | null;
    confidence_level: string;
    skin_concern_tags: string[];
    best_for: string | null;
  };
}

interface Recommendation {
  id: string;
  skin_concerns: string[];
  status: string;
  notes: string | null;
  created_at: string;
  recommendation_items: RecItem[];
}

interface SearchProduct {
  id: string;
  product_name: string;
  brand: string;
  category_name: string;
  skin_concern_tags: string[];
}

export default function UserDetailClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedScan, setExpandedScan] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [currentRole, setCurrentRole] = useState('user');

  // Recommendation state
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [recLoading, setRecLoading] = useState(false);
  const [recGenerating, setRecGenerating] = useState(false);
  const [recError, setRecError] = useState('');
  const [recFinalizing, setRecFinalizing] = useState(false);
  const [recFinalized, setRecFinalized] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [addingProduct, setAddingProduct] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [notesSaving, setNotesSaving] = useState(false);
  const [allRecommendations, setAllRecommendations] = useState<Recommendation[]>([]);

  // Quick product picker state
  const [allProducts, setAllProducts] = useState<SearchProduct[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const [quickResults, setQuickResults] = useState<SearchProduct[]>([]);
  const [quickCategoryFilter, setQuickCategoryFilter] = useState('');
  const [quickCategories, setQuickCategories] = useState<{id:string;name:string}[]>([]);
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickAdding, setQuickAdding] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/users/${id}`);
    if (res.ok) {
      const data = await res.json();
      setProfile(data.profile);
      setScans(data.scans || []);
      setCurrentPlan(data.profile?.plan || 'free');
      setCurrentRole(data.profile?.role || 'user');
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  // Fetch existing recommendations
  const fetchRecommendation = useCallback(async () => {
    setRecLoading(true);
    const res = await fetch(`/api/admin/recommendations?user_id=${id}`);
    if (res.ok) {
      const data = await res.json();
      const recs = data.recommendations || [];
      setAllRecommendations(recs);
      if (recs.length > 0) {
        setRecommendation(recs[0]); // Most recent
        setRecFinalized(recs[0].status === 'finalized');
        setNotes(recs[0].notes || '');
      }
    }
    setRecLoading(false);
  }, [id]);

  useEffect(() => { fetchRecommendation(); }, [fetchRecommendation]);

  // Generate recommendations
  const handleGenerateRec = async () => {
    setRecGenerating(true);
    setRecError('');
    try {
      const res = await fetch('/api/admin/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRecError(data.error || 'Failed to generate recommendations');
      } else {
        setRecommendation(data.recommendation);
        setRecFinalized(false);
        setNotes(data.recommendation.notes || '');
        setAllRecommendations(prev => [data.recommendation, ...prev]);
      }
    } catch {
      setRecError('Network error generating recommendations');
    }
    setRecGenerating(false);
  };

  // Remove item from recommendation
  const handleRemoveItem = async (itemId: string) => {
    if (!recommendation) return;
    await fetch(`/api/admin/recommendations/${recommendation.id}/items?item_id=${itemId}`, { method: 'DELETE' });
    setRecommendation(prev => prev ? {
      ...prev,
      recommendation_items: prev.recommendation_items.filter(i => i.id !== itemId),
    } : null);
  };

  // Search products to add (legacy method for existing recommendation)
  const handleProductSearch = async () => {
    if (!productSearch.trim()) return;
    const res = await fetch(`/api/admin/products?search=${encodeURIComponent(productSearch)}&limit=10`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(data.products || []);
    }
  };

  // Load all products for the quick picker
  const loadAllProducts = useCallback(async () => {
    if (productsLoaded) return;
    const res = await fetch('/api/admin/products?limit=500');
    if (res.ok) {
      const data = await res.json();
      setAllProducts(data.products || []);
      setQuickCategories(data.categories || []);
      setProductsLoaded(true);
      setQuickResults((data.products || []).slice(0, 20));
    }
  }, [productsLoaded]);

  // Quick picker search
  const handleQuickSearch = (query: string) => {
    setQuickSearch(query);
    filterQuickProducts(query, quickCategoryFilter);
  };

  // Quick picker category filter
  const handleQuickCategoryChange = (catId: string) => {
    setQuickCategoryFilter(catId);
    filterQuickProducts(quickSearch, catId);
  };

  const filterQuickProducts = (query: string, catId: string) => {
    let list = allProducts;
    if (catId) {
      const catName = quickCategories.find(c => c.id === catId)?.name;
      list = list.filter(p => p.category_name === catName);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.product_name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q) ||
        (p.skin_concern_tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    setQuickResults(list.length > 0 ? list.slice(0, 30) : []);
  };

  // Quick add product (creates recommendation record if needed)
  const handleQuickAdd = async (product: SearchProduct) => {
    setQuickAdding(product.id);
    let recId = recommendation?.id;

    // If no recommendation exists, create one
    if (!recId) {
      const res = await fetch('/api/admin/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id, concerns: userConcerns.length > 0 ? userConcerns : ['General Skincare'], skip_generate: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendation(data.recommendation);
        recId = data.recommendation.id;
      } else {
        setQuickAdding(null);
        return;
      }
    }

    // Add the product
    const res = await fetch(`/api/admin/recommendations/${recId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: product.id,
        match_reason: `${product.category_name} — manually selected by admin`,
        concern_match: product.skin_concern_tags?.slice(0, 3) || [],
        confidence_score: 50,
      }),
    });
    if (res.ok) {
      const newItem = await res.json();
      setRecommendation(prev => prev ? {
        ...prev,
        recommendation_items: [...prev.recommendation_items, newItem],
      } : null);
    }
    setQuickAdding(null);
  };

  // Add product to recommendation
  const handleAddProduct = async (product: SearchProduct) => {
    if (!recommendation) return;
    setAddingProduct(product.id);
    const res = await fetch(`/api/admin/recommendations/${recommendation.id}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: product.id,
        match_reason: `Manually added by admin — ${product.category_name}`,
        concern_match: product.skin_concern_tags?.slice(0, 3) || [],
        confidence_score: 50,
      }),
    });
    if (res.ok) {
      const newItem = await res.json();
      setRecommendation(prev => prev ? {
        ...prev,
        recommendation_items: [...prev.recommendation_items, newItem],
      } : null);
      setSearchResults(prev => prev.filter(p => p.id !== product.id));
    }
    setAddingProduct(null);
  };

  // Save notes to DB
  const handleSaveNotes = async () => {
    if (!recommendation) return;
    setNotesSaving(true);
    await fetch('/api/admin/recommendations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: recommendation.id, notes }),
    });
    setNotesSaving(false);
  };

  // Finalize recommendation
  const handleFinalize = async () => {
    if (!recommendation) return;
    setRecFinalizing(true);
    await fetch('/api/admin/recommendations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: recommendation.id, status: 'finalized', notes }),
    });
    setRecFinalizing(false);
    setRecFinalized(true);
    setRecommendation(prev => prev ? { ...prev, status: 'finalized', notes } : null);
    setAllRecommendations(prev => prev.map(r => r.id === recommendation.id ? { ...r, status: 'finalized', notes } : r));
  };

  // Get user concerns from scans
  const userConcerns: string[] = [];
  scans.forEach(scan => {
    (scan.analysis?.detected_conditions || []).forEach(c => {
      if (c.confidence >= 30 && !userConcerns.includes(c.condition)) {
        userConcerns.push(c.condition);
      }
    });
  });

  const handleUpdate = async () => {
    setSaving(true);
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: currentPlan, role: currentRole }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar title="User Detail" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-page"><div className="admin-loading"><div className="admin-spinner" /><p>Loading user…</p></div></div>
      </div>
    </div>
  );

  const displayName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User';
  const initial = profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar title="User Detail" subtitle={displayName} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-page">

          <a href="/admin/users" className="ud-back-btn"><ArrowLeft size={15} /> Back to Users</a>

          {/* ---- Profile Header Card ---- */}
          <div className="ud-profile-card">
            <div className="ud-avatar">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt={displayName} />
                : <span>{initial}</span>
              }
            </div>
            <div className="ud-profile-info">
              <h2 className="ud-name">{displayName}</h2>
              <div className="ud-email"><Mail size={13} /> {profile?.email || 'No email'}</div>
              <div className="ud-meta-row">
                <span className={`plan-badge ${currentPlan === 'pro' ? 'pro' : 'free'}`}>
                  {currentPlan === 'pro' ? '★ Pro' : 'Free'}
                </span>
                {currentRole === 'admin' && <span className="plan-badge admin-role">Admin</span>}
                <span className="ud-meta-item">
                  <Calendar size={12} />
                  Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                </span>
                <span className="ud-meta-item">
                  <ScanLine size={12} />
                  {scans.length} scan{scans.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* ---- Access Control ---- */}
          <div className="ud-section-card">
            <div className="ud-section-header"><Shield size={16} /> Access Control</div>
            <div className="ud-access-row">
              <div className="ud-access-field">
                <label>Plan</label>
                <select value={currentPlan} onChange={e => setCurrentPlan(e.target.value)}>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
              <div className="ud-access-field">
                <label>Role</label>
                <select value={currentRole} onChange={e => setCurrentRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button className="ud-save-btn" onClick={handleUpdate} disabled={saving}>
                {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* ---- Scan History ---- */}
          <div className="ud-section-card">
            <div className="ud-section-header">
              <span><ScanLine size={16} /> Scan History</span>
              <span className="ud-scan-count">{scans.length} scan{scans.length !== 1 ? 's' : ''}</span>
            </div>
            {scans.length === 0 ? (
              <div className="admin-empty"><p>This user has no scans yet.</p></div>
            ) : (
              <div className="ud-scan-list">
                {scans.map(scan => (
                  <div key={scan.id} className={`ud-scan-item ${expandedScan === scan.id ? 'expanded' : ''}`}>
                    <div className="ud-scan-row" onClick={() => setExpandedScan(expandedScan === scan.id ? null : scan.id)}>
                      <div className="ud-scan-thumb">
                        {scan.signed_image_urls[0] ? (
                          <img src={scan.signed_image_urls[0]} alt="Scan" />
                        ) : (
                          <span>🩺</span>
                        )}
                      </div>
                      <div className="ud-scan-info">
                        <div className="ud-scan-date">
                          {new Date(scan.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="ud-scan-pills">
                          {(scan.analysis?.detected_conditions || []).slice(0, 3).map((c, i) => (
                            <span key={i} className="condition-pill">{c.condition}</span>
                          ))}
                          {(scan.analysis?.detected_conditions?.length || 0) > 3 && (
                            <span className="condition-pill" style={{ background: '#f5f5f5', color: '#999', border: '1px solid #e0e0e0' }}>
                              +{(scan.analysis?.detected_conditions?.length || 0) - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      {scan.score !== null && (
                        <div className="ud-scan-score">
                          <div style={{ color: scan.score >= 70 ? '#388E3C' : scan.score >= 50 ? '#E65100' : '#C62828' }}>{scan.score}</div>
                          <span>Score</span>
                        </div>
                      )}
                      {expandedScan === scan.id ? <ChevronUp size={16} color="#999" /> : <ChevronDown size={16} color="#999" />}
                    </div>

                    {expandedScan === scan.id && (
                      <div className="ud-scan-detail">
                        {scan.signed_image_urls.length > 0 && (
                          <div className="ud-scan-images">
                            {scan.signed_image_urls.map((url, i) => (
                              <div key={i} className="ud-scan-img-card">
                                <img src={url} alt={`Image ${i + 1}`} />
                              </div>
                            ))}
                          </div>
                        )}
                        {(scan.analysis?.detected_conditions || []).map((c, i) => (
                          <div key={i} className="ud-condition-row">
                            <span className="ud-condition-name">{c.condition}</span>
                            <span className={`sev-badge ${c.severity?.toLowerCase()}`}>{c.severity}</span>
                            <span className="ud-condition-conf">{c.confidence}%</span>
                          </div>
                        ))}
                        {scan.analysis?.skin_type_estimate && (
                          <p style={{ fontSize: '0.82rem', color: '#999', marginTop: 8 }}>
                            Skin type: <strong>{scan.analysis.skin_type_estimate}</strong>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* ---- Recommendations Section ---- */}
          <div className="ud-section-card">
            <div className="ud-section-header">
              <span><Sparkles size={16} /> Product Recommendations</span>
              {recommendation && (
                <span className={`rec-status-badge ${recommendation.status}`}>
                  {recommendation.status === 'finalized' ? '✓ Finalized' : '◐ Draft'}
                </span>
              )}
            </div>

            {/* Recommendations History Selector */}
            {allRecommendations.length > 1 && (
              <div className="rec-history-selector">
                <span className="rec-history-label">Recommendation History</span>
                <select
                  value={recommendation?.id}
                  onChange={e => {
                    const selected = allRecommendations.find(r => r.id === e.target.value);
                    if (selected) {
                      setRecommendation(selected);
                      setRecFinalized(selected.status === 'finalized');
                      setNotes(selected.notes || '');
                    }
                  }}
                  className="rec-history-select"
                >
                  {allRecommendations.map((r, idx) => (
                    <option key={r.id} value={r.id}>
                      {idx === 0 ? 'Current / Most Recent' : `Previous Recommendation — ${new Date(r.created_at).toLocaleDateString('en-GB')}`} ({r.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* User Concerns Summary */}
            {userConcerns.length > 0 && (
              <div className="rec-concerns-bar">
                <span className="rec-concerns-label">Detected Concerns:</span>
                <div className="rec-concerns-pills">
                  {userConcerns.map((c, i) => (
                    <span key={i} className="rec-concern-pill">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {recError && (
              <div className="rec-error">
                <X size={14} /> {recError}
              </div>
            )}

            {/* Generate AI Recommendations (if scans exist) */}
            {!recLoading && !recommendation && userConcerns.length > 0 && (
              <div className="rec-generate">
                <div className="rec-generate-info">
                  <Sparkles size={20} />
                  <div>
                    <strong>Ready to Generate Recommendations</strong>
                    <p>Based on {userConcerns.length} detected concern{userConcerns.length !== 1 ? 's' : ''} from {scans.length} scan{scans.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <button className="rec-generate-btn" onClick={handleGenerateRec} disabled={recGenerating}>
                  {recGenerating ? (
                    <><div className="admin-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Generating…</>
                  ) : (
                    <><Sparkles size={15} /> Generate Recommendations</>
                  )}
                </button>
              </div>
            )}

            {/* Loading */}
            {recLoading && (
              <div className="admin-loading" style={{ minHeight: 120 }}>
                <div className="admin-spinner" /><p>Loading recommendations…</p>
              </div>
            )}

            {/* Recommendation Items */}
            {recommendation && recommendation.recommendation_items.length > 0 && (
              <div className="rec-items">
                {recommendation.recommendation_items.map(item => (
                  <div key={item.id} className="rec-item">
                    <div className="rec-item-img">
                      {item.products?.image_url ? (
                        <img src={item.products.image_url} alt={item.products.product_name} />
                      ) : (
                        <Package size={18} color="#ccc" />
                      )}
                    </div>
                    <div className="rec-item-info">
                      <div className="rec-item-name">{item.products?.product_name}</div>
                      <div className="rec-item-brand">{item.products?.brand} · {item.products?.category_name}</div>
                      <div className="rec-item-reason">{item.match_reason}</div>
                    </div>
                    <div className="rec-item-meta">
                      <div className="rec-item-score">
                        <div className="rec-score-bar">
                          <div style={{ width: `${item.confidence_score}%` }} />
                        </div>
                        <span>{item.confidence_score}%</span>
                      </div>
                      <div className="rec-item-tags">
                        {(item.concern_match || []).slice(0, 2).map((t, i) => (
                          <span key={i} className="rec-match-tag">{t}</span>
                        ))}
                      </div>
                      <span className={`rec-added-by ${item.added_by}`}>
                        {item.added_by === 'system' ? 'AI' : 'Manual'}
                      </span>
                    </div>
                    {!recFinalized && (
                      <button className="rec-remove-btn" onClick={() => handleRemoveItem(item.id)} title="Remove">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {recommendation && recommendation.recommendation_items.length === 0 && !quickOpen && (
              <div className="rec-empty">
                <Package size={24} />
                <p>No products recommended yet. Use the dropdown below to select products.</p>
              </div>
            )}

            {!recommendation && !recLoading && !quickOpen && (
              <div className="rec-empty">
                <Package size={24} />
                <p>{userConcerns.length > 0 ? 'Generate AI recommendations or select products manually below.' : 'Select products from the dropdown below to recommend for this user.'}</p>
              </div>
            )}

            {/* ====== QUICK PRODUCT PICKER DROPDOWN ====== */}
            {!recFinalized && (
              <div className="rp-quick-section">
                <button
                  className={`rp-recommend-btn lg ${quickOpen ? 'active' : ''}`}
                  onClick={() => { setQuickOpen(!quickOpen); if (!quickOpen) loadAllProducts(); }}
                >
                  <Package size={14} />
                  {quickOpen ? 'Close Product Picker' : 'Select Products to Recommend'}
                  {quickOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {quickOpen && (
                  <div className="rp-panel" style={{ marginTop: 12 }}>
                    {/* Search + Filter Row */}
                    <div className="rp-search-row">
                      <div className="rp-search-input">
                        <Search size={14} />
                        <input
                          placeholder="Search products by name, brand, concern…"
                          value={quickSearch}
                          onChange={e => handleQuickSearch(e.target.value)}
                        />
                        {quickSearch && (
                          <button className="rp-search-clear" onClick={() => handleQuickSearch('')}>
                            <X size={12} />
                          </button>
                        )}
                      </div>
                      <select
                        className="rp-category-select"
                        value={quickCategoryFilter}
                        onChange={e => handleQuickCategoryChange(e.target.value)}
                      >
                        <option value="">All Categories</option>
                        {quickCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Product Grid */}
                    <div className="rp-products-grid">
                      {quickResults.length === 0 ? (
                        <div className="rp-no-products">
                          <Package size={20} />
                          <span>{productsLoaded ? 'No matching products found.' : 'Loading products…'}</span>
                        </div>
                      ) : (
                        quickResults.map(p => {
                          const isAdded = recommendation?.recommendation_items.some(i => i.product_id === p.id);
                          return (
                            <div
                              key={p.id}
                              className={`rp-product-card ${isAdded ? 'selected' : ''}`}
                              onClick={() => !isAdded && handleQuickAdd(p)}
                            >
                              <div className="rp-prod-info">
                                <div className="rp-prod-name">{p.product_name}</div>
                                <div className="rp-prod-brand">{p.brand}</div>
                                <span className="rp-prod-cat">{p.category_name}</span>
                              </div>
                              {isAdded ? (
                                <div className="rp-prod-added"><Check size={14} /></div>
                              ) : quickAdding === p.id ? (
                                <div className="rp-prod-add" style={{ opacity: 0.5 }}>…</div>
                              ) : (
                                <div className="rp-prod-add"><Plus size={14} /></div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                    {quickResults.length >= 30 && (
                      <div className="rp-more-hint">
                        Showing first 30 results — refine your search to see more
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Custom Notes Section */}
            {recommendation && (
              <div className="rec-notes-section">
                <label className="rec-notes-label">Other Recommendations / Consultant Notes</label>
                <textarea
                  className="rec-notes-textarea"
                  placeholder="Enter any custom advice, routine steps, or other product suggestions..."
                  value={notes}
                  disabled={recFinalized}
                  onChange={e => setNotes(e.target.value)}
                  onBlur={handleSaveNotes}
                />
                {!recFinalized && notesSaving && (
                  <span className="rec-notes-saving-status">Saving notes...</span>
                )}
              </div>
            )}

            {/* Action Bar */}
            {recommendation && recommendation.recommendation_items.length > 0 && (
              <div className="rec-action-bar">
                {!recFinalized ? (
                  <>
                    <button className="rec-regenerate-btn" onClick={handleGenerateRec} disabled={recGenerating}>
                      <RefreshCw size={14} /> Regenerate
                    </button>
                    <button className="rec-finalize-btn" onClick={handleFinalize} disabled={recFinalizing}>
                      {recFinalizing ? 'Finalizing…' : <><ClipboardCheck size={14} /> Finalize Recommendation</>}
                    </button>
                  </>
                ) : (
                  <div className="rec-finalized-msg">
                    <Check size={16} /> Recommendation finalized with {recommendation.recommendation_items.length} product{recommendation.recommendation_items.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
        </div>
      </div>

      <style>{`
        .ud-back-btn {
          display: inline-flex; align-items: center; gap: 6px; color: var(--text-muted);
          text-decoration: none; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px;
          padding: 8px 16px; background: #fff; border: 1px solid #E8E8E8; border-radius: 10px;
          transition: all 0.2s;
        }
        .ud-back-btn:hover { background: #F5F5F5; color: var(--text); }

        /* Profile Card */
        .ud-profile-card {
          display: flex; align-items: center; gap: 24px; padding: 28px;
          background: #fff; border: 1px solid #E8E8E8; border-radius: 16px; margin-bottom: 20px;
        }
        .ud-avatar {
          width: 72px; height: 72px; border-radius: 50%; flex-shrink: 0; overflow: hidden;
          background: rgba(232,76,136,0.12); display: flex; align-items: center; justify-content: center;
        }
        .ud-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ud-avatar span { font-size: 1.6rem; font-weight: 800; color: var(--primary); }
        .ud-profile-info { flex: 1; min-width: 0; }
        .ud-name { font-size: 1.3rem; font-weight: 800; color: var(--text); margin-bottom: 4px; }
        .ud-email { font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
        .ud-meta-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .ud-meta-item { display: flex; align-items: center; gap: 4px; font-size: 0.78rem; color: var(--text-muted); }

        /* Section Cards */
        .ud-section-card {
          background: #fff; border: 1px solid #E8E8E8; border-radius: 16px; margin-bottom: 20px; overflow: hidden;
        }
        .ud-section-header {
          padding: 16px 20px; border-bottom: 1px solid #F0F0F0;
          font-size: 0.9rem; font-weight: 700; color: var(--text);
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
        }
        .ud-section-header > span { display: flex; align-items: center; gap: 8px; }
        .ud-scan-count { font-size: 0.78rem; color: var(--text-muted); font-weight: 600; }

        /* Access Control */
        .ud-access-row { display: flex; align-items: flex-end; gap: 20px; padding: 20px; flex-wrap: wrap; }
        .ud-access-field label {
          display: block; font-size: 0.72rem; font-weight: 700; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px;
        }
        .ud-access-field select {
          border: 1px solid #E8E8E8; border-radius: 10px; padding: 9px 14px;
          font-size: 0.85rem; font-weight: 600; color: var(--text); background: #fff;
          cursor: pointer; outline: none; min-width: 120px;
        }
        .ud-access-field select:focus { border-color: var(--primary); }
        .ud-save-btn {
          background: var(--primary); color: #fff; border: none; border-radius: 10px;
          padding: 10px 28px; font-size: 0.85rem; font-weight: 700; cursor: pointer;
          transition: all 0.2s;
        }
        .ud-save-btn:hover { opacity: 0.85; }
        .ud-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Scan List */
        .ud-scan-list { }
        .ud-scan-item { border-bottom: 1px solid #F0F0F0; }
        .ud-scan-item:last-child { border-bottom: none; }
        .ud-scan-item.expanded { background: #FAFAFA; }
        .ud-scan-row { display: flex; align-items: center; gap: 14px; padding: 14px 20px; cursor: pointer; transition: background 0.15s; }
        .ud-scan-row:hover { background: #FAFAFA; }
        .ud-scan-thumb {
          width: 48px; height: 48px; border-radius: 10px; flex-shrink: 0; overflow: hidden;
          background: #f5f5f5; display: flex; align-items: center; justify-content: center;
          border: 1px solid #e8e8e8;
        }
        .ud-scan-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ud-scan-thumb span { font-size: 1.2rem; }
        .ud-scan-info { flex: 1; min-width: 0; }
        .ud-scan-date { font-weight: 700; font-size: 0.85rem; color: var(--text); margin-bottom: 4px; }
        .ud-scan-pills { display: flex; gap: 4px; flex-wrap: wrap; }
        .ud-scan-score { text-align: center; flex-shrink: 0; margin-right: 4px; }
        .ud-scan-score > div { font-size: 1.2rem; font-weight: 800; }
        .ud-scan-score > span { font-size: 0.68rem; color: var(--text-muted); font-weight: 600; }

        /* Scan Detail Expanded */
        .ud-scan-detail { padding: 0 20px 16px; }
        .ud-scan-images { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; margin-bottom: 12px; }
        .ud-scan-img-card { aspect-ratio: 1; border-radius: 10px; overflow: hidden; background: #f5f5f5; border: 1px solid #e8e8e8; }
        .ud-scan-img-card img { width: 100%; height: 100%; object-fit: cover; }
        .ud-condition-row {
          display: flex; align-items: center; gap: 10px; padding: 10px 14px;
          background: #fff; border: 1px solid #E8E8E8; border-radius: 10px; margin-bottom: 6px;
        }
        .ud-condition-name { flex: 1; font-size: 0.85rem; font-weight: 700; color: var(--text); text-transform: capitalize; }
        .ud-condition-conf { font-size: 0.78rem; color: var(--text-muted); font-weight: 600; }

        @media (max-width: 768px) {
          .ud-profile-card { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px; }
          .ud-avatar { width: 56px; height: 56px; }
          .ud-avatar span { font-size: 1.2rem; }
          .ud-name { font-size: 1.1rem; }
          .ud-access-row { gap: 12px; }
          .ud-scan-row { flex-wrap: wrap; gap: 10px; padding: 12px 16px; }
          .ud-scan-detail { padding: 0 16px 12px; }
        }

        /* Rec Notes styling */
        .rec-notes-section {
          padding: 16px 20px;
          border-top: 1px solid #F0F0F0;
          background: #FAFAFA;
        }
        .rec-notes-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .rec-notes-textarea {
          width: 100%;
          min-height: 80px;
          padding: 12px 14px;
          border: 1px solid #E8E8E8;
          border-radius: 10px;
          font-size: 0.85rem;
          color: var(--text);
          background: #fff;
          resize: vertical;
          outline: none;
          font-family: inherit;
        }
        .rec-notes-textarea:focus {
          border-color: var(--primary);
        }
        .rec-notes-textarea:disabled {
          background: #f5f5f5;
          color: #888;
          cursor: not-allowed;
        }
        .rec-notes-saving-status {
          font-size: 0.68rem;
          color: var(--text-muted);
          margin-top: 4px;
          display: block;
        }

        /* Rec History Styling */
        .rec-history-selector {
          padding: 12px 20px;
          border-bottom: 1px solid #F0F0F0;
          background: #FAFAFA;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .rec-history-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .rec-history-select {
          border: 1px solid #E8E8E8;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text);
          background: #fff;
          outline: none;
          cursor: pointer;
        }
        .rec-history-select:focus {
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
}
