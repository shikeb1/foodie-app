import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import api from '../utils/api';

function StatusBadge({ status }) {
  const labels = {
    pending: 'Pending', confirmed: 'Confirmed', preparing: 'Preparing',
    out_for_delivery: 'On the Way', delivered: 'Delivered', cancelled: 'Cancelled'
  };
  return <span className={`status-badge status-${status}`}>{labels[status] || status}</span>;
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    api.get(`/orders?page=${page}&limit=10`)
      .then(({ data }) => { setOrders(data.orders); setPagination(data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 800 }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 32 }}>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📦</div>
          <h3>No orders yet</h3>
          <p>Looks like you haven't ordered anything yet. Let's fix that!</p>
          <button className="btn btn-primary" onClick={() => navigate('/restaurants')}>
            Order Now
          </button>
        </div>
      ) : (
        <>
          {orders.map((order) => (
            <div
              key={order.id}
              className="card"
              style={{ padding: 24, marginBottom: 16, cursor: 'pointer' }}
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                    {order.restaurant?.name || 'Restaurant'}
                  </div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: 2 }}>
                    #{order.orderNumber} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <StatusBadge status={order.status} />
                  <ChevronRight size={16} color="var(--text-dim)" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  {Array.isArray(order.items) ? order.items.map(i => i.name).slice(0, 3).join(', ') : ''}
                  {Array.isArray(order.items) && order.items.length > 3 ? ` +${order.items.length - 3} more` : ''}
                </div>
                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                  ₹{parseFloat(order.total).toFixed(0)}
                </div>
              </div>
            </div>
          ))}

          {pagination.pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
