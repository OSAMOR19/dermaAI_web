'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package, Search, Filter, ChevronDown, ChevronLeft, ChevronRight,
  TrendingUp, Layers, Tag, Star, Grid3X3, BarChart3,
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

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
  image_url: string | null;
  status: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  group_name: string;
  product_count: number;
  actual_count?: number;
}

interface StatsData {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  productsByCategory: Category[];
  recentProducts: { id: string; product_name: string; brand: string; category_name: string; created_at: string }[];
  topRecommended: { id: string; product_name: string; brand: string; category_name: string; rec_count: number }[];
}

const BAR_COLORS = [
  '#e84c88', '#00B4FA', '#4CAF50', '#FF9800', '#7C3AED',
  '#E53935', '#00BCD4', '#FF5722', '#9C27B0', '#607D8B',
  '#795548', '#3F51B5', '#009688', '#F44336', '#CDDC39',
  '#2196F3', '#FFC107', '#8BC34A',
];

export default function ProductsClient() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<'dashboard' | 'list'>('list');

  // Dashboard state
  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // List state
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [concernFilter, setConcernFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const LIMIT = 20;

  // Fetch stats
  useEffect(() => {
    fetch('/api/admin/products/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setStatsLoading(false); })
      .catch(() => setStatsLoading(false));
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search) params.set('search', search);
    if (categoryFilter) params.set('category', categoryFilter);
    if (brandFilter) params.set('brand', brandFilter);
    if (concernFilter) params.set('concern', concernFilter);

    const res = await fetch(`/api/admin/products?${params}`);
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setCategories(data.categories || []);
      setBrands(data.brands || []);
      setConcerns(data.concerns || []);
    }
    setLoading(false);
  }, [page, search, categoryFilter, brandFilter, concernFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = () => { setPage(1); setSearch(searchInput); };
  const clearFilters = () => {
    setSearch(''); setSearchInput(''); setCategoryFilter('');
    setBrandFilter(''); setConcernFilter(''); setPage(1);
  };
  const totalPages = Math.ceil(total / LIMIT);
  const hasFilters = search || categoryFilter || brandFilter || concernFilter;

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'High': return { bg: 'rgba(76,175,80,0.1)', color: '#388E3C' };
      case 'Medium': return { bg: 'rgba(255,152,0,0.1)', color: '#E65100' };
      case 'Low': return { bg: 'rgba(229,57,53,0.1)', color: '#C62828' };
      default: return { bg: 'rgba(0,0,0,0.05)', color: '#888' };
    }
  };

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar
          title="Products"
          subtitle={`${total.toLocaleString()} products in catalog`}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="admin-page">

          {/* View Toggle */}
          <div className="pd-view-toggle">
            <button
              className={`pd-view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <Grid3X3 size={15} /> Product List
            </button>
            <button
              className={`pd-view-btn ${view === 'dashboard' ? 'active' : ''}`}
              onClick={() => setView('dashboard')}
            >
              <BarChart3 size={15} /> Dashboard
            </button>
          </div>

          {/* ══════════════ DASHBOARD VIEW ══════════════ */}
          {view === 'dashboard' && (
            <>
              {statsLoading ? (
                <div className="admin-loading"><div className="admin-spinner" /><p>Loading stats…</p></div>
              ) : !stats ? (
                <div className="admin-empty"><p>Failed to load product stats.</p></div>
              ) : (
                <>
                  {/* Stat Cards */}
                  <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="admin-stat-card">
                      <div className="admin-stat-top">
                        <div className="admin-stat-icon" style={{ background: 'rgba(232,76,136,0.1)' }}>
                          <Package size={20} color="#e84c88" />
                        </div>
                        <div className="admin-stat-delta neutral">Catalog</div>
                      </div>
                      <div className="admin-stat-value">{stats.totalProducts}</div>
                      <div className="admin-stat-label">Total Products</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-top">
                        <div className="admin-stat-icon" style={{ background: 'rgba(0,180,250,0.1)' }}>
                          <Layers size={20} color="#00B4FA" />
                        </div>
                        <div className="admin-stat-delta neutral">Groups</div>
                      </div>
                      <div className="admin-stat-value">{stats.totalCategories}</div>
                      <div className="admin-stat-label">Categories</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-top">
                        <div className="admin-stat-icon" style={{ background: 'rgba(76,175,80,0.1)' }}>
                          <Tag size={20} color="#4CAF50" />
                        </div>
                        <div className="admin-stat-delta neutral">Unique</div>
                      </div>
                      <div className="admin-stat-value">{stats.totalBrands}</div>
                      <div className="admin-stat-label">Brands</div>
                    </div>
                  </div>

                  {/* Products by Category Chart */}
                  <div className="admin-chart-card" style={{ marginBottom: 20 }}>
                    <div className="admin-chart-title">
                      <Layers size={16} /> Products by Category
                    </div>
                    <ResponsiveContainer width="100%" height={Math.max(280, stats.productsByCategory.length * 32)}>
                      <BarChart
                        data={stats.productsByCategory}
                        layout="vertical"
                        margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                      >
                        <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          width={100}
                        />
                        <Tooltip
                          contentStyle={{ borderRadius: 10, border: '1px solid #E8E8E8', fontSize: 12 }}
                          formatter={(value) => [`${value} products`, 'Count']}
                        />
                        <Bar dataKey="product_count" name="Products" radius={[0, 6, 6, 0]}>
                          {stats.productsByCategory.map((_, index) => (
                            <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Bottom Row: Recent + Top Recommended */}
                  <div className="admin-charts-grid">
                    {/* Recently Added */}
                    <div className="admin-table-card">
                      <div className="admin-table-header">
                        <h3>Recently Added</h3>
                        <span style={{ fontSize: '0.75rem', color: '#999' }}>Latest products</span>
                      </div>
                      {stats.recentProducts.length === 0 ? (
                        <div className="admin-empty" style={{ padding: '24px 16px' }}><p>No products yet.</p></div>
                      ) : (
                        <div className="admin-activity-list">
                          {stats.recentProducts.slice(0, 5).map(p => (
                            <div
                              key={p.id}
                              className="admin-activity-item"
                              style={{ cursor: 'pointer' }}
                              onClick={() => router.push(`/admin/products/${p.id}`)}
                            >
                              <div className="pd-product-icon">
                                <Package size={14} />
                              </div>
                              <div className="activity-info">
                                <div className="activity-name">{p.product_name}</div>
                                <div className="activity-email">{p.brand}</div>
                              </div>
                              <span className="activity-condition">{p.category_name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Top Recommended */}
                    <div className="admin-table-card">
                      <div className="admin-table-header">
                        <h3>Most Recommended</h3>
                        <span style={{ fontSize: '0.75rem', color: '#999' }}>By recommendation count</span>
                      </div>
                      {stats.topRecommended.length === 0 ? (
                        <div className="admin-empty" style={{ padding: '24px 16px' }}><p>No recommendations yet.</p></div>
                      ) : (
                        <div className="admin-activity-list">
                          {stats.topRecommended.slice(0, 5).map((p, i) => (
                            <div
                              key={p.id}
                              className="admin-activity-item"
                              style={{ cursor: 'pointer' }}
                              onClick={() => router.push(`/admin/products/${p.id}`)}
                            >
                              <div className="pd-rank-badge">
                                <Star size={10} /> {i + 1}
                              </div>
                              <div className="activity-info">
                                <div className="activity-name">{p.product_name}</div>
                                <div className="activity-email">{p.brand}</div>
                              </div>
                              <span className="pd-rec-count">{p.rec_count} rec{p.rec_count !== 1 ? 's' : ''}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ══════════════ PRODUCT LIST VIEW ══════════════ */}
          {view === 'list' && (
            <>
              {/* Search & Filter Bar */}
              <div className="pl-toolbar">
                <div className="admin-search" style={{ flex: 1 }}>
                  <Search size={15} color="#999" />
                  <input
                    placeholder="Search products, brands, concerns…"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button className="pl-search-btn" onClick={handleSearch}>Search</button>
                <button
                  className={`pl-filter-toggle ${showFilters ? 'active' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={15} /> Filters <ChevronDown size={14} />
                </button>
                {hasFilters && (
                  <button className="pl-clear-btn" onClick={clearFilters}>Clear All</button>
                )}
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="pl-filters">
                  <div className="pl-filter-group">
                    <label>Category</label>
                    <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}>
                      <option value="">All Categories</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.product_count})</option>
                      ))}
                    </select>
                  </div>
                  <div className="pl-filter-group">
                    <label>Brand</label>
                    <select value={brandFilter} onChange={e => { setBrandFilter(e.target.value); setPage(1); }}>
                      <option value="">All Brands</option>
                      {brands.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="pl-filter-group">
                    <label>Skin Concern</label>
                    <select value={concernFilter} onChange={e => { setConcernFilter(e.target.value); setPage(1); }}>
                      <option value="">All Concerns</option>
                      {concerns.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Active Filters */}
              {hasFilters && (
                <div className="pl-active-filters">
                  {search && <span className="pl-filter-chip">Search: &ldquo;{search}&rdquo; <button onClick={() => { setSearch(''); setSearchInput(''); }}>×</button></span>}
                  {categoryFilter && <span className="pl-filter-chip">Category: {categories.find(c => c.id === categoryFilter)?.name} <button onClick={() => setCategoryFilter('')}>×</button></span>}
                  {brandFilter && <span className="pl-filter-chip">Brand: {brandFilter} <button onClick={() => setBrandFilter('')}>×</button></span>}
                  {concernFilter && <span className="pl-filter-chip">Concern: {concernFilter} <button onClick={() => setConcernFilter('')}>×</button></span>}
                </div>
              )}

              {/* Product Table */}
              {loading ? (
                <div className="admin-loading"><div className="admin-spinner" /><p>Loading products…</p></div>
              ) : products.length === 0 ? (
                <div className="admin-empty">
                  <p>{hasFilters ? 'No products match your filters.' : 'No products in database. Run the products_schema.sql migration first.'}</p>
                </div>
              ) : (
                <div className="pl-table-card">
                  <div className="pl-table-wrap">
                    <table className="pl-table">
                      <thead>
                        <tr>
                          <th style={{ width: 48 }}></th>
                          <th>Product Name</th>
                          <th>Brand</th>
                          <th>Category</th>
                          <th>Type</th>
                          <th>Best For</th>
                          <th>Tags</th>
                          <th>Confidence</th>
                          <th style={{ width: 70 }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => {
                          const conf = getConfidenceColor(p.confidence_level);
                          return (
                            <tr key={p.id} onClick={() => router.push(`/admin/products/${p.id}`)} style={{ cursor: 'pointer' }}>
                              <td>
                                <div className="pl-product-thumb">
                                  {p.image_url ? (
                                    <img src={p.image_url} alt={p.product_name} />
                                  ) : (
                                    <Package size={16} color="#ccc" />
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="pl-product-name">{p.product_name}</div>
                                <div className="pl-product-id">{p.id}</div>
                              </td>
                              <td><span className="pl-brand">{p.brand || '—'}</span></td>
                              <td><span className="pl-category-badge">{p.category_name || '—'}</span></td>
                              <td><span className="pl-type">{p.sub_type || '—'}</span></td>
                              <td><span className="pl-best-for">{p.best_for || '—'}</span></td>
                              <td>
                                <div className="pl-tags">
                                  {(p.skin_concern_tags || []).slice(0, 2).map((tag, i) => (
                                    <span key={i} className="pl-tag">{tag}</span>
                                  ))}
                                  {(p.skin_concern_tags || []).length > 2 && (
                                    <span className="pl-tag-more">+{p.skin_concern_tags.length - 2}</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <span className="pl-confidence" style={{ background: conf.bg, color: conf.color }}>
                                  {p.confidence_level || '—'}
                                </span>
                              </td>
                              <td>
                                <span className={`pl-status ${p.status}`}>
                                  {p.status === 'active' ? '● Active' : '○ Inactive'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {total > LIMIT && (
                    <div className="pl-pagination">
                      <span className="pl-page-info">
                        Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
                      </span>
                      <div className="pl-page-btns">
                        <button className="pl-page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                          <ChevronLeft size={14} /> Prev
                        </button>
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                          let p: number;
                          if (totalPages <= 7) {
                            p = i + 1;
                          } else if (page <= 4) {
                            p = i + 1;
                          } else if (page >= totalPages - 3) {
                            p = totalPages - 6 + i;
                          } else {
                            p = page - 3 + i;
                          }
                          return (
                            <button
                              key={p}
                              className={`pl-page-btn ${p === page ? 'active' : ''}`}
                              onClick={() => setPage(p)}
                            >
                              {p}
                            </button>
                          );
                        })}
                        <button className="pl-page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
                          Next <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
