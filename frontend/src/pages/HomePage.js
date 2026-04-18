import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Flame, Clock, Shield } from 'lucide-react';
import api from '../utils/api';
import RestaurantCard from '../components/RestaurantCard';

const CATEGORIES = [
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Burgers', emoji: '🍔' },
  { name: 'Biryani', emoji: '🍛' },
  { name: 'Chinese', emoji: '🥡' },
  { name: 'North Indian', emoji: '🫓' },
  { name: 'South Indian', emoji: '🥘' },
  { name: 'Healthy', emoji: '🥗' },
  { name: 'Desserts', emoji: '🍰' },
  { name: 'Beverages', emoji: '🧃' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, allRes] = await Promise.all([
          api.get('/restaurants/featured'),
          api.get('/restaurants?limit=8'),
        ]);
        setFeatured(featRes.data.restaurants);
        setAllRestaurants(allRes.data.restaurants);
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-tag">
            <Flame size={14} /> India's fastest food delivery
          </div>
          <h1>
            Order food from<br />
            <span>anywhere, anytime</span>
          </h1>
          <p>Discover 500+ restaurants near you. Fresh meals delivered in 30 minutes or less.</p>

          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-wrapper">
              <Search size={18} className="hero-search-icon" />
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search for restaurants or dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>500+</strong>
              <span>Restaurants</span>
            </div>
            <div className="hero-stat">
              <strong>30 min</strong>
              <span>Avg Delivery</span>
            </div>
            <div className="hero-stat">
              <strong>50K+</strong>
              <span>Happy Customers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────── */}
      <section className="section-sm" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What's on your <span>mind?</span></h2>
          </div>
          <div className="categories-scroll">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                className="category-pill"
                onClick={() => navigate(`/restaurants?cuisine=${cat.name}`)}
              >
                <span className="emoji">{cat.emoji}</span>
                <span className="label">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured ─────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">⭐ Featured <span>restaurants</span></h2>
            <button className="section-link" onClick={() => navigate('/restaurants')}>
              See all <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="loader"><div className="spinner" /><span>Loading restaurants...</span></div>
          ) : (
            <div className="grid-4">
              {featured.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Why FoodRush ─────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <h2 className="section-title">Why choose <span>FoodRush?</span></h2>
          </div>
          <div className="grid-3" style={{ marginTop: 40 }}>
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Average delivery time of 30 minutes. Track your order live on the map.' },
              { icon: '🍽️', title: 'Best Restaurants', desc: 'Curated list of top-rated restaurants in your city, with honest reviews.' },
              { icon: '💳', title: 'Safe Payments', desc: 'Secure checkout with UPI, cards, wallets and cash on delivery.' },
            ].map((f) => (
              <div key={f.title} className="card" style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All Restaurants ──────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🔥 <span>All</span> restaurants</h2>
            <button className="section-link" onClick={() => navigate('/restaurants')}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid-4">
            {allRestaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,209,102,0.1))',
        borderTop: '1px solid rgba(255,107,53,0.2)',
        borderBottom: '1px solid rgba(255,107,53,0.2)',
        padding: '64px 0',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 16 }}>
            Own a restaurant? <span style={{ background: 'linear-gradient(135deg,#ff6b35,#ffd166)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Partner with us</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: 32 }}>
            Reach thousands of hungry customers in your area. Join 500+ restaurants on FoodRush.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
            Get Started <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </>
  );
}
