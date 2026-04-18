import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Bike, Phone, MapPin, Plus, Minus, ShoppingCart } from 'lucide-react';
import api from '../utils/api';
import useCartStore from '../context/cartStore';
import toast from 'react-hot-toast';

function VegBadge({ isVeg }) {
  return (
    <span className={`veg-badge ${isVeg ? 'veg' : 'non-veg'}`} title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'} />
  );
}

function MenuItemCard({ item, restaurantId, restaurantName }) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.id === item.id);

  const handleAdd = () => {
    const result = addItem(
      { id: item.id, name: item.name, price: parseFloat(item.price), image: item.image },
      restaurantId,
      restaurantName
    );
    if (result?.conflict) {
      if (window.confirm(`Your cart has items from ${result.restaurantName}. Start a new cart from ${restaurantName}?`)) {
        useCartStore.getState().clearCart();
        addItem(
          { id: item.id, name: item.name, price: parseFloat(item.price), image: item.image },
          restaurantId,
          restaurantName
        );
      }
    }
  };

  return (
    <div className="menu-item-card">
      <div className="menu-item-content">
        <VegBadge isVeg={item.isVeg} />
        <div className="menu-item-name">
          {item.name}
          {item.isBestseller && <span className="bestseller-tag">Bestseller</span>}
        </div>
        <div className="menu-item-desc">{item.description}</div>
        <div className="menu-item-price">₹{parseFloat(item.price).toFixed(0)}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
        {item.image && (
          <img src={item.image} alt={item.name} className="menu-item-img" />
        )}

        {!item.isAvailable ? (
          <span style={{ fontSize: '0.8rem', color: 'var(--error)' }}>Not available</span>
        ) : cartItem ? (
          <div className="quantity-control">
            <button className="qty-btn" onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}>
              <Minus size={14} />
            </button>
            <span className="qty-count">{cartItem.quantity}</span>
            <button className="qty-btn" onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}>
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button className="btn btn-outline btn-sm" onClick={handleAdd}>
            <Plus size={14} /> Add
          </button>
        )}
      </div>
    </div>
  );
}

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const { items, restaurantId: cartRestaurantId, getItemCount, getSubtotal } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    api.get(`/restaurants/${id}`)
      .then(({ data }) => {
        setRestaurant(data.restaurant);
        if (data.restaurant.menuCategories?.length) {
          setActiveSection(data.restaurant.menuCategories[0].id);
        }
      })
      .catch(() => navigate('/restaurants'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loader"><div className="spinner" /></div>;
  if (!restaurant) return null;

  const scrollToSection = (secId) => {
    setActiveSection(secId);
    document.getElementById(`section-${secId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      {/* ── Cover ──────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        {restaurant.coverImage ? (
          <img src={restaurant.coverImage} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--bg-3), var(--bg-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>🍽️</div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,20,1) 0%, rgba(13,13,20,0.3) 60%, transparent 100%)' }} />
      </div>

      <div className="container" style={{ marginTop: -80, position: 'relative', zIndex: 1, paddingBottom: 80 }}>
        {/* ── Info Card ─────────────────────────────────────────────── */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: 32, marginBottom: 40
        }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {restaurant.logo && (
              <img src={restaurant.logo} alt="" style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'cover', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>{restaurant.name}</h1>
              <div style={{ color: 'var(--text-muted)', marginBottom: 12, fontSize: '0.95rem' }}>
                {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(' • ') : restaurant.cuisine}
              </div>
              {restaurant.description && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 600, lineHeight: 1.7 }}>
                  {restaurant.description}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', background: 'var(--bg-3)', padding: '12px 20px', borderRadius: 12 }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
                  ⭐ {parseFloat(restaurant.rating).toFixed(1)}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 2 }}>
                  {restaurant.totalRatings?.toLocaleString()} ratings
                </div>
              </div>
              <div style={{ textAlign: 'center', background: 'var(--bg-3)', padding: '12px 20px', borderRadius: 12 }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  <Clock size={18} style={{ display: 'inline' }} /> {restaurant.deliveryTime}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 2 }}>mins</div>
              </div>
              <div style={{ textAlign: 'center', background: 'var(--bg-3)', padding: '12px 20px', borderRadius: 12 }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {parseFloat(restaurant.deliveryFee) === 0 ? 'FREE' : `₹${restaurant.deliveryFee}`}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 2 }}>delivery</div>
              </div>
            </div>
          </div>

          {!restaurant.isOpen && (
            <div style={{ marginTop: 16, background: 'rgba(239,71,111,0.1)', border: '1px solid rgba(239,71,111,0.3)', padding: '12px 20px', borderRadius: 10, color: 'var(--error)', fontWeight: 600 }}>
              🔴 This restaurant is currently closed
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32 }}>
          {/* ── Category Nav ─────────────────────────────────────────── */}
          <div style={{ position: 'sticky', top: 90, height: 'fit-content' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                MENU
              </div>
              {restaurant.menuCategories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToSection(cat.id)}
                  style={{
                    width: '100%', padding: '14px 20px',
                    background: activeSection === cat.id ? 'rgba(255,107,53,0.1)' : 'transparent',
                    borderLeft: activeSection === cat.id ? '3px solid var(--primary)' : '3px solid transparent',
                    border: 'none',
                    color: activeSection === cat.id ? 'var(--primary)' : 'var(--text-muted)',
                    fontSize: '0.9rem', fontWeight: activeSection === cat.id ? 700 : 400,
                    textAlign: 'left', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.name}
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    {cat.items?.length || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Menu Items ────────────────────────────────────────────── */}
          <div>
            {restaurant.menuCategories?.map((cat) => (
              <div key={cat.id} id={`section-${cat.id}`} style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                  {cat.name}
                  <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-dim)', marginLeft: 10 }}>
                    {cat.items?.length} items
                  </span>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {cat.items?.map((item) => (
                    <MenuItemCard key={item.id} item={item} restaurantId={restaurant.id} restaurantName={restaurant.name} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating Cart Bar ─────────────────────────────────────── */}
      {itemCount > 0 && cartRestaurantId === restaurant.id && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--primary)', color: 'white',
          padding: '16px 32px', borderRadius: 50, zIndex: 100,
          display: 'flex', alignItems: 'center', gap: 20,
          boxShadow: '0 8px 40px rgba(255,107,53,0.4)',
          cursor: 'pointer', minWidth: 320, justifyContent: 'space-between',
          fontWeight: 700, fontSize: '1rem'
        }} onClick={() => navigate('/cart')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingCart size={20} />
            {itemCount} item{itemCount > 1 ? 's' : ''} added
          </div>
          <div>View Cart · ₹{getSubtotal().toFixed(0)}</div>
        </div>
      )}
    </div>
  );
}
