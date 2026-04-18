import React from 'react';
export default function AboutPage() {
  return (
    <div className="container section">
      <h1 className="section-title">About <span>FoodRush</span></h1>
      <div className="card" style={{ padding: 40, lineHeight: 1.8 }}>
        <p>FoodRush is India's most loved food delivery platform. We connect hungry customers with the best restaurants in their neighborhood.</p>
        <h3 style={{ marginTop: 24, marginBottom: 16 }}>Our Mission</h3>
        <p>Our mission is to make food delivery lightning fast, extremely fresh, and accessible to everyone. We work with thousands of partners across the country to bring variety and quality to your doorstep.</p>
        <h3 style={{ marginTop: 24, marginBottom: 16 }}>Why we started?</h3>
        <p>We saw a gap in the market for a truly secure and fast delivery service that cares as much about the restaurant owners as it does about the customers. FoodRush was built to bridge that gap.</p>
      </div>
    </div>
  );
}
