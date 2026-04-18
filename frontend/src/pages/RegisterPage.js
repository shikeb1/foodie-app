import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../context/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' });
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form.name, form.email, form.password, form.phone, form.role);
    if (result.success) navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎉</div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join thousands of FoodRush users</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Amit Kumar" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" type="tel" placeholder="9876543210" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" type={showPw ? 'text' : 'password'} placeholder="Min 8 characters"
                style={{ paddingRight: 42 }}
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">I am a</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ value: 'customer', label: '🛒 Customer' }, { value: 'restaurant_owner', label: '🍽️ Restaurant Owner' }].map((r) => (
                <label key={r.value} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 16px',
                  background: form.role === r.value ? 'rgba(255,107,53,0.1)' : 'var(--bg-3)',
                  border: `1px solid ${form.role === r.value ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}>
                  <input type="radio" name="role" value={r.value} checked={form.role === r.value}
                    onChange={() => setForm({ ...form, role: r.value })} style={{ display: 'none' }} />
                  {r.label}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
