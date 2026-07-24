'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardList, Search, Download, Package, Plus, Check, X, ChevronDown,
  ChevronUp, Sparkles, Trash2, ExternalLink, Filter,
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  age_range: string | null;
  location: string | null;
  skin_concerns: string[];
  other_concern: string | null;
  created_at: string;
}

interface Product {
  id: string;
  product_name: string;
  brand: string;
  category_name: string;
  skin_concern_tags: string[];
  best_for: string | null;
  image_url: string | null;
}

interface SelectedProduct {
  product: Product;
  reason: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Product recommendation state
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, SelectedProduct[]>>({});
  const [productSearch, setProductSearch] = useState('');
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/event-registration')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setRegistrations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Load products
  const loadProducts = useCallback(async (): Promise<Product[]> => {
    if (productsLoaded) return allProducts;
    if (productsLoading) return [];
    setProductsLoading(true);
    try {
      const res = await fetch('/api/admin/products?limit=500');
      if (res.ok) {
        const data = await res.json();
        const prods: Product[] = data.products || [];
        setAllProducts(prods);
        setCategories(data.categories || []);
        setProductsLoaded(true);
        setProductsLoading(false);
        return prods;
      }
    } catch { /* ignore */ }
    setProductsLoading(false);
    return [];
  }, [productsLoaded, productsLoading, allProducts]);

  // Expand row handler
  const handleExpandRow = async (regId: string) => {
    if (expandedRow === regId) {
      setExpandedRow(null);
      return;
    }
    setExpandedRow(regId);
    setProductSearch('');
    setCategoryFilter('');

    const prods = productsLoaded ? allProducts : await loadProducts();
    const reg = registrations.find(r => r.id === regId);
    if (reg && prods.length > 0) {
      filterByRegistration(reg, prods);
    } else {
      setProductResults(prods.slice(0, 30));
    }
  };

  // Auto-filter products based on skin concerns
  const filterByRegistration = (reg: Registration, products: Product[]) => {
    const concerns = [...(reg.skin_concerns || [])];
    if (reg.other_concern) concerns.push(reg.other_concern);
    if (concerns.length === 0) { setProductResults(products.slice(0, 30)); return; }
    const normalised = concerns.map(c => c.toLowerCase());
    const matched = products.filter(p => {
      const tags = (p.skin_concern_tags || []).map(t => t.toLowerCase());
      const bestFor = (p.best_for || '').toLowerCase();
      return normalised.some(c => tags.some(t => t.includes(c) || c.includes(t)) || bestFor.includes(c));
    });
    setProductResults(matched.length > 0 ? matched : products.slice(0, 30));
  };

  // Search products
  const handleProductSearchInput = (query: string) => {
    setProductSearch(query);
    let list = allProducts;
    if (categoryFilter) {
      const catName = categories.find(c => c.id === categoryFilter)?.name;
      list = list.filter(p => p.category_name === catName);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.product_name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q) ||
        (p.skin_concern_tags || []).some(t => t.toLowerCase().includes(q))
      );
    } else if (!categoryFilter) {
      const reg = registrations.find(r => r.id === expandedRow);
      if (reg) { filterByRegistration(reg, allProducts); return; }
    }
    setProductResults(list.slice(0, 30));
  };

  // Category filter
  const handleCategoryFilter = (catId: string) => {
    setCategoryFilter(catId);
    let list = allProducts;
    if (catId) {
      const catName = categories.find(c => c.id === catId)?.name;
      list = list.filter(p => p.category_name === catName);
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      list = list.filter(p => p.product_name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (list.length === 0 && !catId && !productSearch.trim()) {
      const reg = registrations.find(r => r.id === expandedRow);
      if (reg) { filterByRegistration(reg, allProducts); return; }
    }
    setProductResults(list.slice(0, 30));
  };

  const addProduct = (regId: string, product: Product) => {
    setSelectedProducts(prev => {
      const current = prev[regId] || [];
      if (current.some(s => s.product.id === product.id)) return prev;
      const reg = registrations.find(r => r.id === regId);
      const concerns = [...(reg?.skin_concerns || [])];
      if (reg?.other_concern) concerns.push(reg.other_concern);
      const matchedTags = (product.skin_concern_tags || []).filter(t =>
        concerns.some(c => t.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(t.toLowerCase()))
      );
      const reason = matchedTags.length > 0
        ? `${product.category_name} for ${matchedTags.slice(0, 2).join(', ')}`
        : `${product.category_name} — manually selected`;
      return { ...prev, [regId]: [...current, { product, reason }] };
    });
  };

  const removeProduct = (regId: string, productId: string) => {
    setSelectedProducts(prev => ({
      ...prev,
      [regId]: (prev[regId] || []).filter(s => s.product.id !== productId),
    }));
  };

  const copyRecommendation = (regId: string) => {
    const reg = registrations.find(r => r.id === regId);
    const selected = selectedProducts[regId] || [];
    if (!reg || selected.length === 0) return;
    const lines = [
      `Product Recommendations for ${reg.full_name}`,
      `Skin Concerns: ${[...(reg.skin_concerns || []), reg.other_concern].filter(Boolean).join(', ')}`,
      '', ...selected.map((s, i) => `${i + 1}. ${s.product.product_name} (${s.product.brand}) — ${s.reason}`),
      '', `Generated by WBH Skin Admin on ${new Date().toLocaleDateString('en-GB')}`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedId(regId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = registrations.filter(r => {
    const q = search.toLowerCase();
    return r.full_name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) ||
      (r.phone && r.phone.toLowerCase().includes(q)) || (r.location && r.location.toLowerCase().includes(q));
  });

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Age Range', 'Location', 'Skin Concerns', 'Other Concern', 'Registered At'];
    const rows = filtered.map(r => [r.full_name, r.email, r.phone || '', r.age_range || '', r.location || '',
      (r.skin_concerns || []).join('; '), r.other_concern || '', formatDate(r.created_at)]);
    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `wbh-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const selCount = (regId: string) => (selectedProducts[regId] || []).length;

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar title="Event Registrations" subtitle="Client registration sign-ups" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-page">
          {loading ? (
            <div className="admin-loading"><div className="admin-spinner" /><p>Loading registrations…</p></div>
          ) : (
            <>
              {/* Controls */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 200, padding: '8px 14px', background: '#fff', border: '1px solid #E8E8E8', borderRadius: 10 }}>
                  <Search size={14} color="#999" />
                  <input style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: '#1a1a1a' }} placeholder="Search by name, email, phone…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#888', whiteSpace: 'nowrap' }}>{filtered.length} registrations</span>
                <button onClick={handleExportCSV} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 16px', borderRadius: 10, background: 'rgba(232,76,136,0.08)', border: '1px solid rgba(232,76,136,0.15)', color: '#e84c88', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <Download size={13} /> Export CSV
                </button>
              </div>

              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
                  <ClipboardList size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <p>{search ? 'No registrations match your search.' : 'No registrations yet.'}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {filtered.map(reg => {
                    const isExpanded = expandedRow === reg.id;
                    const selected = selectedProducts[reg.id] || [];
                    return (
                      <div key={reg.id} style={{
                        background: '#fff', border: isExpanded ? '1.5px solid rgba(232,76,136,0.3)' : '1px solid #E8E8E8',
                        borderRadius: 16, overflow: 'hidden', transition: 'all 0.2s',
                        boxShadow: isExpanded ? '0 4px 24px rgba(232,76,136,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
                      }}>
                        {/* Registration Row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', cursor: 'pointer' }}
                          onClick={() => handleExpandRow(reg.id)}>
                          {/* Avatar */}
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(232,76,136,0.08)', color: '#e84c88', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem', flexShrink: 0 }}>
                            {reg.full_name.charAt(0).toUpperCase()}
                          </div>
                          {/* Name & Email */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1a1a1a' }}>{reg.full_name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{reg.email}</div>
                          </div>
                          {/* Details */}
                          <div style={{ display: 'flex', gap: 20, flexShrink: 0 }} className="reg-details-hide">
                            <span style={{ fontSize: '0.78rem', color: '#888' }}>{reg.phone || '—'}</span>
                            <span style={{ fontSize: '0.78rem', color: '#888' }}>{reg.location || '—'}</span>
                            <span style={{ fontSize: '0.78rem', color: '#888' }}>{reg.age_range || '—'}</span>
                          </div>
                          {/* Concern Tags */}
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 260, flexShrink: 0 }} className="reg-concerns-hide">
                            {(reg.skin_concerns || []).slice(0, 3).map((c, i) => (
                              <span key={i} style={{ padding: '2px 9px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 600, background: 'rgba(232,76,136,0.08)', color: '#e84c88', border: '1px solid rgba(232,76,136,0.12)', whiteSpace: 'nowrap' }}>{c}</span>
                            ))}
                            {(reg.skin_concerns || []).length > 3 && <span style={{ fontSize: '0.68rem', color: '#888', fontWeight: 600 }}>+{reg.skin_concerns.length - 3}</span>}
                          </div>
                          {/* Date */}
                          <span style={{ fontSize: '0.72rem', color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }} className="reg-date-hide">{formatDate(reg.created_at)}</span>
                          {/* Recommend Button */}
                          <button onClick={e => { e.stopPropagation(); handleExpandRow(reg.id); }} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px',
                            border: isExpanded ? '1.5px solid rgba(232,76,136,0.3)' : '1px solid #E8E8E8',
                            borderRadius: 8, background: isExpanded ? 'rgba(232,76,136,0.05)' : '#fff',
                            fontSize: '0.75rem', fontWeight: 600,
                            color: isExpanded ? '#e84c88' : '#888', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                          }}>
                            <Package size={12} />
                            {isExpanded ? 'Close' : selCount(reg.id) > 0 ? `${selCount(reg.id)} Selected` : 'Recommend'}
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        </div>

                        {/* ===== EXPANDED PRODUCT PICKER ===== */}
                        {isExpanded && (
                          <div style={{ borderTop: '1px solid #F0F0F0', background: '#FAFBFC' }}>

                            {/* Header with concerns */}
                            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid #F0F0F0', background: '#fff' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Sparkles size={15} color="#e84c88" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a' }}>Recommend products for <strong style={{ color: '#e84c88' }}>{reg.full_name}</strong></span>
                              </div>
                              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                {(reg.skin_concerns || []).map((c, i) => (
                                  <span key={i} style={{ padding: '3px 10px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 700, background: 'rgba(232,76,136,0.08)', color: '#e84c88', border: '1px solid rgba(232,76,136,0.12)' }}>{c}</span>
                                ))}
                                {reg.other_concern && (
                                  <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 700, background: 'rgba(0,180,250,0.08)', color: '#0288D1', border: '1px solid rgba(0,180,250,0.12)' }}>{reg.other_concern}</span>
                                )}
                              </div>
                            </div>

                            {/* Selected Products */}
                            {selected.length > 0 && (
                              <div style={{ padding: '12px 20px', background: '#fff', borderBottom: '1px solid #F0F0F0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 700, color: '#388E3C' }}>
                                    <Check size={13} /> {selected.length} Product{selected.length !== 1 ? 's' : ''} Selected
                                  </span>
                                  <button onClick={() => copyRecommendation(reg.id)} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 14px',
                                    border: '1px solid #E8E8E8', borderRadius: 8, background: copiedId === reg.id ? 'rgba(76,175,80,0.08)' : '#fff',
                                    fontSize: '0.72rem', fontWeight: 600, color: copiedId === reg.id ? '#388E3C' : '#888', cursor: 'pointer',
                                  }}>
                                    {copiedId === reg.id ? <><Check size={11} /> Copied!</> : <><ExternalLink size={11} /> Copy Prescription</>}
                                  </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                  {selected.map(s => (
                                    <div key={s.product.id} style={{
                                      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                                      background: 'rgba(76,175,80,0.03)', border: '1px solid rgba(76,175,80,0.12)',
                                      borderRadius: 10,
                                    }}>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.product.product_name}</div>
                                        <div style={{ fontSize: '0.68rem', color: '#888' }}>{s.product.brand} · {s.reason}</div>
                                      </div>
                                      <button onClick={() => removeProduct(reg.id, s.product.id)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: 4, borderRadius: 6 }}>
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Search & Filter */}
                            <div style={{ display: 'flex', gap: 8, padding: '12px 20px', alignItems: 'center', flexWrap: 'wrap' }}>
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 200,
                                padding: '8px 12px', background: '#fff', border: '1px solid #E8E8E8', borderRadius: 10,
                              }}>
                                <Search size={13} color="#999" />
                                <input
                                  style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', color: '#1a1a1a' }}
                                  placeholder="Search products by name, brand, concern…"
                                  value={productSearch}
                                  onChange={e => handleProductSearchInput(e.target.value)}
                                />
                                {productSearch && (
                                  <button onClick={() => handleProductSearchInput('')} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: 0, display: 'flex' }}>
                                    <X size={12} />
                                  </button>
                                )}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Filter size={12} color="#999" />
                                <select
                                  value={categoryFilter}
                                  onChange={e => handleCategoryFilter(e.target.value)}
                                  style={{
                                    padding: '8px 12px', border: '1px solid #E8E8E8', borderRadius: 10,
                                    background: '#fff', fontSize: '0.82rem', color: '#1a1a1a', cursor: 'pointer', outline: 'none',
                                  }}
                                >
                                  <option value="">All Categories</option>
                                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                              </div>
                            </div>

                            {/* Product Grid */}
                            <div style={{
                              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                              gap: 8, padding: '4px 20px 16px', maxHeight: 320, overflowY: 'auto',
                            }}>
                              {productsLoading && !productsLoaded ? (
                                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 40, color: '#999', fontSize: '0.82rem' }}>
                                  <div className="admin-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Loading products…
                                </div>
                              ) : productResults.length === 0 ? (
                                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 40, color: '#999', fontSize: '0.82rem' }}>
                                  <Package size={18} /> No matching products found. Try a different search.
                                </div>
                              ) : (
                                productResults.map(p => {
                                  const isSelected = selected.some(s => s.product.id === p.id);
                                  return (
                                    <div key={p.id} onClick={() => !isSelected && addProduct(reg.id, p)} style={{
                                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                                      background: isSelected ? 'rgba(76,175,80,0.03)' : '#fff',
                                      border: isSelected ? '1px solid rgba(76,175,80,0.2)' : '1px solid #E8E8E8',
                                      borderRadius: 10, cursor: isSelected ? 'default' : 'pointer',
                                      transition: 'all 0.15s', opacity: isSelected ? 0.65 : 1,
                                    }}
                                    onMouseEnter={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,76,136,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(232,76,136,0.02)'; } }}
                                    onMouseLeave={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = '#E8E8E8'; (e.currentTarget as HTMLElement).style.background = '#fff'; } }}
                                    >
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.product_name}</div>
                                        <div style={{ fontSize: '0.68rem', color: '#888', marginTop: 1 }}>{p.brand}</div>
                                        <span style={{ display: 'inline-block', padding: '1px 7px', borderRadius: 4, fontSize: '0.62rem', fontWeight: 600, background: 'rgba(0,180,250,0.06)', color: '#0288D1', marginTop: 3 }}>{p.category_name}</span>
                                      </div>
                                      <div style={{
                                        width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        background: isSelected ? 'rgba(76,175,80,0.1)' : 'rgba(232,76,136,0.06)',
                                        color: isSelected ? '#388E3C' : '#e84c88',
                                      }}>
                                        {isSelected ? <Check size={13} /> : <Plus size={13} />}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                            {productResults.length >= 30 && (
                              <div style={{ textAlign: 'center', padding: '6px 20px 14px', fontSize: '0.72rem', color: '#999' }}>
                                Showing 30 of {allProducts.length} products — refine your search to see more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .reg-details-hide { display: none !important; }
          .reg-concerns-hide { max-width: 180px !important; }
        }
        @media (max-width: 640px) {
          .reg-concerns-hide { display: none !important; }
          .reg-date-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}
