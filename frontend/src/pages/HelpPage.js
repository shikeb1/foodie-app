import React from 'react';
export default function HelpPage() {
  const faqs = [
    { q: 'How do I track my order?', a: 'You can track your order in real-time from the "My Orders" section.' },
    { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 1 minute of placement for a full refund.' },
    { q: 'What are the delivery charges?', a: 'Delivery charges vary by distance but are usually between ₹20 and ₹50.' },
  ];
  return (
    <div className="container section">
      <h1 className="section-title">Help <span>Centre</span></h1>
      <div className="grid-2">
        {faqs.map(faq => (
          <div key={faq.q} className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 12, fontWeight: 700 }}>{faq.q}</h3>
            <p style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
