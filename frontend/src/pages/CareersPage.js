import React from 'react';
import { Briefcase, MapPin, Search } from 'lucide-react';

export default function CareersPage() {
  const jobs = [
    { title: 'Delivery Partner', location: 'Multiple Cities', type: 'Full-time' },
    { title: 'Frontend Developer', location: 'Bengaluru (Remote)', type: 'Contract' },
    { title: 'Operations Manager', location: 'Mumbai', type: 'Full-time' },
  ];

  return (
    <div className="container section">
      <h1 className="section-title">Join the <span>Team</span></h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 40, textAlign: 'center' }}>Help us revolutionize food delivery in India.</p>
      
      <div className="grid-3">
        {jobs.map(job => (
          <div key={job.title} className="card" style={{ padding: 24 }}>
            <Briefcase size={24} style={{ color: 'var(--primary)', marginBottom: 16 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{job.title}</h3>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {job.location}</span>
              <span style={{ borderLeft: '1px solid currentColor', paddingLeft: 12 }}>{job.type}</span>
            </div>
            <button className="btn btn-outline" style={{ marginTop: 24, width: '100%' }}>Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
