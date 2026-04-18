import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../utils/api';
import RestaurantCard from '../components/RestaurantCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) { setLoading(false); return; }
    setLoading(true);
    api.get(`/restaurants?search=${encodeURIComponent(query)}&limit=20`)
      .then(({ data }) => setResults(data.restaurants))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
          <Search size={20} style={{ display: 'inline', marginRight: 10, color: 'var(--primary)' }} />
          Results for "{query}"
        </h1>
        {!loading && <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>{results.length} restaurant{results.length !== 1 ? 's' : ''} found</p>}
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /><span>Searching...</span></div>
      ) : results.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>No results found</h3>
          <p>Try searching for a different cuisine or restaurant name.</p>
        </div>
      ) : (
        <div className="grid-4">
          {results.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      )}
    </div>
  );
}
