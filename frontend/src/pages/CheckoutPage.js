import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Truck, ChevronRight, CheckCircle } from 'lucide-react';
import useCartStore from '../context/cartStore';
import useAuthStore from '../context/authStore';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'wallet', label: 'Wallet', icon: '👛' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, restaurantId, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '',
    type: 'home',
  });

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  const handlePlace = async () => {
    if (!address.line1 || !address.city || !address.pincode) {
      toast.error('Please fill in all address fields');
      return;
    }
    if (items.length === 0) { toast.error('Cart is empty'); return; }

    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        restaurantId,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        deliveryAddress: address,
        paymentMethod,
      });
      clearCart();
      toast.success('Order placed! 🎉');
      navigate(`/orders/${data.order.id}`);
    } catch (_) {}
    setPlacing(false);
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 1000 }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 32 }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
        <div>
          {/* ── Delivery Address ─────────────────────────────────── */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={18} style={{ color: 'var(--primary)' }} /> Delivery Address
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Address Line 1 *</label>
                <input className="form-input" placeholder="House no, Building, Street" value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Address Line 2</label>
                <input className="form-input" placeholder="Area, Landmark (optional)" value={address.line2}
                  onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input className="form-input" value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode *</label>
                <input className="form-input" placeholder="560001" value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {['home', 'work', 'other'].map((t) => (
                <button key={t} className={`filter-chip ${address.type === t ? 'active' : ''}`}
                  onClick={() => setAddress({ ...address, type: t })}>
                  {t === 'home' ? '🏠' : t === 'work' ? '🏢' : '📍'} {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ── Payment ───────────────────────────────────────────── */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={18} style={{ color: 'var(--primary)' }} /> Payment Method
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PAYMENT_METHODS.map((pm) => (
                <label key={pm.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 20px',
                  background: paymentMethod === pm.id ? 'rgba(255,107,53,0.1)' : 'var(--bg-3)',
                  border: `1px solid ${paymentMethod === pm.id ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s'
                }}>
                  <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id}
                    onChange={() => setPaymentMethod(pm.id)} style={{ accentColor: 'var(--primary)' }} />
                  <span style={{ fontSize: '1.2rem' }}>{pm.icon}</span>
                  <span style={{ fontWeight: 600 }}>{pm.label}</span>
                  {paymentMethod === pm.id && <CheckCircle size={16} style={{ marginLeft: 'auto', color: 'var(--primary)' }} />}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── Order Summary ────────────────────────────────────────── */}
        <div>
          <div className="cart-summary">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 20 }}>
              <Truck size={18} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} />
              Order Summary
            </h2>

            <div style={{ marginBottom: 20 }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.9rem', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
            <div className="summary-row">
              <span>Delivery</span>
              <span style={{ color: deliveryFee === 0 ? 'var(--success)' : undefined }}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="summary-row"><span>GST (5%)</span><span>₹{tax.toFixed(0)}</span></div>

            <div className="summary-total">
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(0)}</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 24, padding: '16px' }}
              onClick={handlePlace}
              disabled={placing}
            >
              {placing ? 'Placing Order...' : `Place Order · ₹${total.toFixed(0)}`}
              {!placing && <ChevronRight size={18} />}
            </button>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: 12 }}>
              🔒 Safe & secure checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
