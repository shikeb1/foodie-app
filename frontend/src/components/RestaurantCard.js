import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Bike } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  return (
    <div className="restaurant-card" onClick={() => navigate(`/restaurants/${restaurant.id}`)}>
      <div style={{ position: 'relative' }}>
        {restaurant.coverImage ? (
          <img src={restaurant.coverImage} alt={restaurant.name} className="restaurant-card-img" />
        ) : (
          <div className="restaurant-card-img-placeholder">🍽️</div>
        )}
        {!restaurant.isOpen && (
          <div className="closed-overlay">CLOSED</div>
        )}
        {restaurant.offerBadge && (
          <div style={{
            position: 'absolute', bottom: 10, left: 10,
            background: 'var(--primary)', color: 'white',
            padding: '4px 10px', borderRadius: 6,
            fontSize: '0.78rem', fontWeight: 700
          }}>
            {restaurant.offerBadge}
          </div>
        )}
      </div>

      <div className="restaurant-card-body">
        <div className="restaurant-card-header">
          <span className="restaurant-card-name">{restaurant.name}</span>
          <span className="rating-badge">
            <Star size={12} fill="currentColor" />
            {parseFloat(restaurant.rating).toFixed(1)}
          </span>
        </div>

        <div className="restaurant-card-cuisine">
          {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(' • ') : restaurant.cuisine}
        </div>

        <div className="restaurant-card-meta">
          <span className="meta-item">
            <Clock size={13} /> {restaurant.deliveryTime} min
          </span>
          <span className="meta-item">
            <Bike size={13} />
            {parseFloat(restaurant.deliveryFee) === 0 ? 'Free delivery' : `₹${restaurant.deliveryFee} delivery`}
          </span>
          <span className="meta-item">
            Min ₹{restaurant.minOrder}
          </span>
        </div>
      </div>
    </div>
  );
}
