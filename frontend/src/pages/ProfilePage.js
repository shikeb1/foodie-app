import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, Save } from 'lucide-react';
import useAuthStore from '../context/authStore';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [newAddress, setNewAddress] = useState({ line1: '', city: '', pincode: '', type: 'home' });
  const [addingAddress, setAddingAddress] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (_) {}
    setSaving(false);
  };

  const addAddress = async () => {
    if (!newAddress.line1 || !newAddress.city || !newAddress.pincode) {
      toast.error('Fill all address fields'); return;
    }
    try {
      const { data } = await api.post('/users/addresses', newAddress);
      updateUser({ ...user, addresses: data.addresses });
      setNewAddress({ line1: '', city: '', pincode: '', type: 'home' });
      setAddingAddress(false);
      toast.success('Address added!');
    } catch (_) {}
  };

  const removeAddress = async (addressId) => {
    try {
      const { data } = await api.delete(`/users/addresses/${addressId}`);
      updateUser({ ...user, addresses: data.addresses });
      toast.success('Address removed');
    } catch (_) {}
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 700 }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 32 }}>My Profile</h1>

      {/* ── Profile Info ─────────────────────────────────────────── */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: '#000' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
            <span style={{ fontSize: '0.78rem', background: 'rgba(255,107,53,0.15)', color: 'var(--primary)', padding: '2px 10px', borderRadius: 20, fontWeight: 600, textTransform: 'capitalize' }}>
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Phone Number</label>
            <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email (read only)</label>
            <input className="form-input" value={user?.email} readOnly style={{ opacity: 0.6 }} />
          </div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={saveProfile} disabled={saving}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* ── Addresses ─────────────────────────────────────────────── */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            <MapPin size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} />
            Saved Addresses
          </h2>
          <button className="btn btn-outline btn-sm" onClick={() => setAddingAddress(!addingAddress)}>
            {addingAddress ? 'Cancel' : '+ Add Address'}
          </button>
        </div>

        {addingAddress && (
          <div style={{ background: 'var(--bg-3)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Address Line</label>
                <input className="form-input" placeholder="House no, Street" value={newAddress.line1}
                  onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
              </div>
              <div>
                <label className="form-label">City</label>
                <input className="form-input" placeholder="Bengaluru" value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Pincode</label>
                <input className="form-input" placeholder="560001" value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {['home', 'work', 'other'].map((t) => (
                <button key={t} className={`filter-chip ${newAddress.type === t ? 'active' : ''}`} style={{ padding: '6px 14px' }}
                  onClick={() => setNewAddress({ ...newAddress, type: t })}>
                  {t === 'home' ? '🏠' : t === 'work' ? '🏢' : '📍'} {t}
                </button>
              ))}
            </div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }} onClick={addAddress}>
              Save Address
            </button>
          </div>
        )}

        {(!user?.addresses || user.addresses.length === 0) && !addingAddress ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No saved addresses yet.</p>
        ) : (
          user?.addresses?.map((addr) => (
            <div key={addr.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <span style={{ fontSize: '0.78rem', background: 'rgba(255,107,53,0.15)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 20, fontWeight: 600, textTransform: 'capitalize', marginBottom: 6, display: 'inline-block' }}>
                  {addr.type}
                </span>
                <p style={{ fontSize: '0.9rem' }}>{addr.line1}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{addr.city} - {addr.pincode}</p>
              </div>
              <button onClick={() => removeAddress(addr.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
