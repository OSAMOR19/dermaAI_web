'use client';

import Link from 'next/link';
import { Search, Filter, Star, Clock, MapPin } from 'lucide-react';

const DOCTORS = [
  { id: 'carter', name: 'Dr. Emily Carter', title: 'Dermatologist', experience: '8+ yrs', rating: 4.8, reviews: 124, price: 40, nextAvailable: 'Today, 3:30 PM', avatar: '/images/Carter.svg' },
  { id: 'reynolds', name: 'Dr. Michael Reynolds', title: 'Dermatologist', experience: '12+ yrs', rating: 4.9, reviews: 210, price: 55, nextAvailable: 'Tomorrow, 10 AM', avatar: '/images/Michael.svg' },
  { id: 'thompson', name: 'Dr. Aisha Thompson', title: 'Dermatologist', experience: '8+ yrs', rating: 4.9, reviews: 156, price: 45, nextAvailable: 'Today, 6:15 PM', avatar: '/images/Aisha.svg' },
  { id: 'kim', name: 'Dr. Daniel Kim', title: 'Research Specialist', experience: '15 yrs', rating: 4.8, reviews: 302, price: 60, nextAvailable: 'Tomorrow, 2 PM', avatar: '/images/Michael.svg' },
];

export default function BookingPage() {
  return (
    <div className="booking" style={{ position: 'relative' }}>
      
      {/* Blurred Content */}
      <div style={{ filter: 'blur(8px)', opacity: 0.6, pointerEvents: 'none', userSelect: 'none' }}>
        <div className="booking-header">
          <h1>Book a Consultation</h1>
          <p>Get expert guidance based on your AI skin analysis.</p>
        </div>

        {/* Search */}
        <div className="search-bar">
          <Search size={20} color="#888" />
          <input type="text" placeholder="Search dermatologists..." />
          <button><Filter size={20} color="#888" /></button>
        </div>

        {/* Section Header */}
        <div className="section-header">
          <h2>Dermatologists</h2>
          <button className="see-all">See all</button>
        </div>

        {/* Doctor Cards */}
        <div className="doc-list">
          {DOCTORS.map((doc) => (
            <div key={doc.id} className="doc-card">
              <div className="doc-card-left">
                <img src={doc.avatar} alt={doc.name} className="doc-avatar" />
              </div>
              <div className="doc-card-body">
                <div className="doc-card-head">
                  <h3 className="doc-name">{doc.name}</h3>
                  <span className="doc-price">${doc.price}</span>
                </div>
                <p className="doc-specialty">{doc.title} · {doc.experience}</p>
                <div className="doc-meta">
                  <span className="doc-rating">
                    <Star size={12} fill="#FFD700" color="#FFD700" />
                    {doc.rating} <span className="doc-reviews">({doc.reviews})</span>
                  </span>
                  <span className="doc-next">
                    <Clock size={12} /> {doc.nextAvailable}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Overlay */}
      <div style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 20, textAlign: 'center', zIndex: 10 
      }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
          padding: '30px 24px', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          maxWidth: 320, border: '1px solid rgba(252,101,209,0.2)'
        }}>
          <div style={{ background: 'rgba(252,101,209,0.1)', color: 'var(--primary)', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <MapPin size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 10, color: '#111' }}>Coming Soon</h2>
          <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.5, margin: 0 }}>
            We're partnering with top dermatologists to construct a seamless consultation experience. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}
