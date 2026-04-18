import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import useCartStore from '../context/cartStore';
import useAuthStore from '../context/authStore';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, restaurantName, updateQuantity, removeItem, clearCart, getSubtotal, restaurantId } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [applying, setApplying] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax - discount;

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setApplying(true);
    try {
      const { data } = await api.post('/payments/apply-coupon', { code: coupon, orderTotal: subtotal });
      setDiscount(parseFloat(data.discount));
      setCouponMsg(data.message);
      toast.success(data.message);
    } catch (_) {
      setDiscount(0);
      setCouponMsg('');
    }
    setApplying(false);
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some delicious items from a restaurant to get started.</p>
          <button className="btn btn-primary" onClick={() => navigate('/restaurants')}>
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* ── Items ─────────────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Your Cart</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
              from <strong style={{ color: 'var(--primary)' }}>{restaurantName}</strong>
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => { if (window.confirm('Clear cart?')) clearCart(); }}>
            <Trash2 size={14} /> Clear Cart
          </button>
        </div>

        {items.map((item) => (
          <div key={item.id} className="cart-item">
            {item.image && (
              <img src={item.image} alt={item.name} className="cart-item-img" />
            )}
            <div className="cart-item-info">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">₹{(item.price * item.quantity).toFixed(0)}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>₹{item.price} each</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="quantity-control">
                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus size={14} />
                </button>
                <span className="qty-count">{item.quantity}</span>
                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: 4 }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* ── Coupon ─────────────────────────────────────────────── */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginTop: 20 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Tag size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Enter coupon code (try WELCOME50)"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                style={{ paddingLeft: 40 }}
              />
            </div>
            <button className="btn btn-primary" onClick={applyCoupon} disabled={applying}>
              {applying ? 'Checking...' : 'Apply'}
            </button>
          </div>
          {couponMsg && <p style={{ marginTop: 10, color: 'var(--success)', fontSize: '0.88rem', fontWeight: 600 }}>✅ {couponMsg}</p>}
          <p style={{ marginTop: 10, color: 'var(--text-dim)', fontSize: '0.82rem' }}>
            Try: WELCOME50 · SAVE20 · FLAT100 · FREEDEL
          </p>
        </div>
      </div>

      {/* ── Summary ────────────────────────────────────────────────── */}
      <div>
        <div className="cart-summary">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 24 }}>Order Summary</h2>

          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span style={{ color: deliveryFee === 0 ? 'var(--success)' : undefined }}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </span>
          </div>
          <div className="summary-row"><span>GST (5%)</span><span>₹{tax.toFixed(0)}</span></div>
          {discount > 0 && (
            <div className="summary-row" style={{ color: 'var(--success)' }}>
              <span>Coupon Discount</span><span>-₹{discount.toFixed(0)}</span>
            </div>
          )}
          {subtotal > 500 && (
            <div style={{ fontSize: '0.82rem', color: 'var(--success)', marginBottom: 8 }}>
              🎉 You got free delivery on orders above ₹500!
            </div>
          )}
          <div className="summary-total">
            <span>Total</span>
            <span style={{ color: 'var(--primary)', fontSize: '1.3rem' }}>₹{total.toFixed(0)}</span>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 24 }}
            onClick={() => isAuthenticated() ? navigate('/checkout') : navigate('/login')}
          >
            {isAuthenticated() ? 'Proceed to Checkout' : 'Login to Checkout'}
            <ArrowRight size={16} />
          </button>

          <button className="btn btn-secondary" style={{ width: '100%', marginTop: 10 }}
            onClick={() => navigate(`/restaurants/${restaurantId}`)}>
            Add More Items
          </button>
        </div>
      </div>
    </div>
  );
}
