import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Phone, Package, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

const STATUS_STEPS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
const STATUS_LABELS = {
  pending: 'Order Placed', confirmed: 'Confirmed', preparing: 'Being Prepared',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered'
};
const STATUS_ICONS = { pending: '📋', confirmed: '✅', preparing: '👨‍🍳', out_for_delivery: '🛵', delivered: '🎉' };

function StatusBadge({ status }) {
  const labels = {
    pending: 'Pending', confirmed: 'Confirmed', preparing: 'Preparing',
    out_for_delivery: 'On the Way', delivered: 'Delivered', cancelled: 'Cancelled'
  };
  return <span className={`status-badge status-${status}`}>{labels[status] || status}</span>;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false));
  }, [id]);

  const cancelOrder = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const { data } = await api.post(`/orders/${id}/cancel`, { reason: 'Cancelled by user' });
      setOrder(data.order);
    } catch (_) {}
    setCancelling(false);
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;
  if (!order) return null;

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 800 }}>
      <button className="btn btn-secondary btn-sm" style={{ marginBottom: 24 }} onClick={() => navigate('/orders')}>
        <ArrowLeft size={14} /> Back to Orders
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Order #{order.orderNumber}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* ── Progress Tracker ─────────────────────────────────────── */}
      {!isCancelled && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, marginBottom: 20 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 24 }}>Order Tracking</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {/* Progress line */}
            <div style={{ position: 'absolute', top: 20, left: '10%', right: '10%', height: 3, background: 'var(--border)', zIndex: 0 }} />
            <div style={{
              position: 'absolute', top: 20, left: '10%',
              width: `${Math.min((currentStep / (STATUS_STEPS.length - 1)) * 80, 80)}%`,
              height: 3, background: 'var(--primary)', zIndex: 1, transition: 'width 0.5s'
            }} />

            {STATUS_STEPS.map((step, i) => (
              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2, flex: 1 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i <= currentStep ? 'var(--primary)' : 'var(--bg-3)',
                  border: `2px solid ${i <= currentStep ? 'var(--primary)' : 'var(--border)'}`,
                  fontSize: '1.1rem', transition: 'all 0.3s'
                }}>
                  {STATUS_ICONS[step]}
                </div>
                <span style={{ fontSize: '0.72rem', textAlign: 'center', color: i <= currentStep ? 'var(--text)' : 'var(--text-dim)', fontWeight: i === currentStep ? 700 : 400, lineHeight: 1.3 }}>
                  {STATUS_LABELS[step]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isCancelled && order.cancelReason && (
        <div style={{ background: 'rgba(239,71,111,0.1)', border: '1px solid rgba(239,71,111,0.3)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 20 }}>
          <strong style={{ color: 'var(--error)' }}>Order Cancelled</strong>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: '0.9rem' }}>{order.cancelReason}</p>
        </div>
      )}

      {/* ── Items ─────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>
          <Package size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} />
          Items Ordered
        </h2>
        {Array.isArray(order.items) && order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.92rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>{item.name} <strong style={{ color: 'var(--text)' }}>× {item.quantity}</strong></span>
            <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(0)}</span>
          </div>
        ))}

        <div style={{ marginTop: 16 }}>
          <div className="summary-row"><span style={{ color: 'var(--text-muted)' }}>Subtotal</span><span>₹{parseFloat(order.subtotal).toFixed(0)}</span></div>
          <div className="summary-row"><span style={{ color: 'var(--text-muted)' }}>Delivery</span><span>₹{parseFloat(order.deliveryFee).toFixed(0)}</span></div>
          <div className="summary-row"><span style={{ color: 'var(--text-muted)' }}>Tax</span><span>₹{parseFloat(order.tax).toFixed(0)}</span></div>
          {parseFloat(order.discount) > 0 && (
            <div className="summary-row" style={{ color: 'var(--success)' }}><span>Discount</span><span>-₹{parseFloat(order.discount).toFixed(0)}</span></div>
          )}
          <div className="summary-total">
            <span>Total Paid</span>
            <span style={{ color: 'var(--primary)' }}>₹{parseFloat(order.total).toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* ── Address & Actions ─────────────────────────────────────── */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>
          <MapPin size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} />
          Delivery Address
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          {order.deliveryAddress?.line1}{order.deliveryAddress?.line2 ? `, ${order.deliveryAddress.line2}` : ''}<br />
          {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
        </p>
      </div>

      {/* Cancel button */}
      {['pending', 'confirmed'].includes(order.status) && (
        <button className="btn btn-secondary" style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
          onClick={cancelOrder} disabled={cancelling}>
          {cancelling ? 'Cancelling...' : 'Cancel Order'}
        </button>
      )}

      {order.status === 'delivered' && (
        <button className="btn btn-primary" onClick={() => navigate(`/restaurants/${order.restaurantId}`)}>
          Reorder from {order.restaurant?.name}
        </button>
      )}
    </div>
  );
}
