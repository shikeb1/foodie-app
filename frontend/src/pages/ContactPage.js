import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container section">
      <div className="card" style={{ maxWidth: 800, margin: '0 auto', padding: 40 }}>
        <h1 className="section-title">Contact <span>Us</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Got questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        
        <div className="grid-2" style={{ gap: 40 }}>
          <div>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={18} /> Email</h3>
              <p>support@foodrush.com</p>
            </div>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={18} /> Phone</h3>
              <p>+91 98765 43210</p>
            </div>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={18} /> Office</h3>
              <p>123 Food Street, Tech Park, Bengaluru, India</p>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-input" placeholder="Your name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-input" placeholder="Your email" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="form-input" rows="4" placeholder="How can we help?"></textarea>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Send Message <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
