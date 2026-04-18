import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut, ChefHat, ClipboardList, Menu, X } from 'lucide-react';
import useAuthStore from '../context/authStore';
import useCartStore from '../context/cartStore';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const itemCount = getItemCount();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo">🍔 FoodRush</Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search restaurants, cuisines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className="navbar-links">
          <Link to="/restaurants" className={`nav-link ${location.pathname === '/restaurants' ? 'active' : ''}`}>
            <ChefHat size={16} /> Restaurants
          </Link>

          {isAuthenticated() && (
            <Link to="/orders" className={`nav-link ${location.pathname.startsWith('/orders') ? 'active' : ''}`}>
              <ClipboardList size={16} /> Orders
            </Link>
          )}

          <button className="cart-btn" onClick={() => navigate('/cart')}>
            <ShoppingCart size={16} />
            Cart
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>

          {isAuthenticated() ? (
            <div style={{ position: 'relative' }}>
              <button
                className="nav-link"
                onClick={() => setProfileOpen(!profileOpen)}
                style={{ gap: 8 }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff6b35, #ffd166)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 700, color: '#000'
                }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                {user?.name?.split(' ')[0]}
              </button>

              {profileOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: 8,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: 8, minWidth: 180,
                  zIndex: 100, boxShadow: 'var(--shadow)'
                }}>
                  <Link to="/profile" className="nav-link" style={{ borderRadius: 8, width: '100%' }} onClick={() => setProfileOpen(false)}>
                    <User size={16} /> Profile
                  </Link>
                  <button className="nav-link" style={{ borderRadius: 8, width: '100%', color: 'var(--error)' }}
                    onClick={() => { logout(); setProfileOpen(false); navigate('/'); }}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-link">
              <User size={16} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
