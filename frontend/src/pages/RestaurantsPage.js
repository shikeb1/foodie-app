import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import api from '../utils/api';
import RestaurantCard from '../components/RestaurantCard';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'deliveryTime', label: 'Fastest Delivery' },
  { value: 'deliveryFee', label: 'Lowest Delivery Fee' },
];

const CUISINE_FILTERS = ['All', 'North Indian', 'South Indian', 'Chinese', 'Italian', 'American', 'Biryani', 'Healthy'];

export default function RestaurantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [sortBy, setSortBy] = useState('rating');
  const [activeCuisine, setActiveCuisine] = useState(searchParams.get('cuisine') || 'All');
  const [filters, setFilters] = useState({ rating: '', deliveryTime: '', isVeg: false });
  const page = parseInt(searchParams.get('page') || '1');

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, sortBy });
      if (activeCuisine !== 'All') params.set('cuisine', activeCuisine);
      if (filters.rating) params.set('rating', filters.rating);
      if (filters.deliveryTime) params.set('deliveryTime', filters.deliveryTime);

      const { data } = await api.get(`/restaurants?${params}`);
      setRestaurants(data.restaurants);
      setPagination(data.pagination);
    } catch (_) {}
    setLoading(false);
  }, [page, sortBy, activeCuisine, filters]);

  useEffect(() => { fetchRestaurants(); }, [fetchRestaurants]);

  const setPage = (p) => {
    setSearchParams({ page: p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="section-title" style={{ marginBottom: 8 }}>
          Restaurants <span>near you</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {pagination.total || 0} restaurants available
        </p>
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────────── */}
      <div className="filter-bar">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600 }}>
          <SlidersHorizontal size={14} style={{ display: 'inline', marginRight: 6 }} />
          Filter:
        </span>

        {CUISINE_FILTERS.map((c) => (
          <button
            key={c}
            className={`filter-chip ${activeCuisine === c ? 'active' : ''}`}
            onClick={() => { setActiveCuisine(c); setPage(1); }}
          >
            {c}
          </button>
        ))}

        <button
          className={`filter-chip ${filters.rating === '4' ? 'active' : ''}`}
          onClick={() => setFilters(f => ({ ...f, rating: f.rating === '4' ? '' : '4' }))}
        >
          ⭐ 4.0+
        </button>

        <button
          className={`filter-chip ${filters.deliveryTime === '30' ? 'active' : ''}`}
          onClick={() => setFilters(f => ({ ...f, deliveryTime: f.deliveryTime === '30' ? '' : '30' }))}
        >
          <span>⚡</span> Under 30 min
        </button>

        {/* Sort dropdown */}
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
            style={{ padding: '8px 36px 8px 16px', borderRadius: 50, fontSize: '0.88rem', minWidth: 160 }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────────────────────── */}
      {loading ? (
        <div className="loader"><div className="spinner" /><span>Finding restaurants...</span></div>
      ) : restaurants.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🍽️</div>
          <h3>No restaurants found</h3>
          <p>Try changing your filters or search in a different area.</p>
          <button className="btn btn-primary" onClick={() => { setActiveCuisine('All'); setFilters({ rating: '', deliveryTime: '' }); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid-4">
            {restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>

          {/* ── Pagination ─────────────────────────────────────────── */}
          {pagination.pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`page-btn ${p === page ? 'active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
