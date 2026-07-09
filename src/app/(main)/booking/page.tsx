'use client';

import Link from 'next/link';
import { Star, Clock, MapPin, ArrowRight, Award, Video, CheckCircle } from 'lucide-react';

const SPECIALIST = {
  id: 'evelyn',
  name: 'Evelyn Badaiki',
  title: 'Resident Aesthetician',
  location: '7 Dennington Mews',
  brand: 'WBH SKIN',
  experience: '10+ yrs',
  rating: 4.9,
  reviews: 184,
  price: 50,
  nextAvailable: 'Today, 2:30 PM',
  avatar: '/evelyn-badaiki.png',
  highlights: [
    'Specialises in melanated skin concerns',
    
    'Personalised product recommendations',
  ],
};

export default function BookingPage() {
  return (
    <div className="booking" style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Book a Consultation</h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
          Get expert guidance based on your AI skin analysis.
        </p>
      </div>

      {/* Specialist Card */}
      <Link href={`/booking/${SPECIALIST.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 20, border: '1px solid var(--border)', transition: 'all 0.25s' }}>
          
          {/* Hero Image */}
          <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', position: 'relative', background: '#1a1a2e' }}>
            <img 
              src={SPECIALIST.avatar} 
              alt={SPECIALIST.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} 
            />
            {/* Gradient overlay */}
            <div style={{ 
              position: 'absolute', bottom: 0, left: 0, right: 0, 
              height: 100, 
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' 
            }} />
            {/* Brand badge */}
            <div style={{ 
              position: 'absolute', top: 14, left: 14, 
              background: 'rgba(252,101,209,0.9)', 
              color: '#fff', 
              padding: '5px 14px', 
              borderRadius: 20, 
              fontSize: '0.72rem', 
              fontWeight: 700,
              backdropFilter: 'blur(8px)',
              letterSpacing: '0.5px',
            }}>
              {SPECIALIST.brand}
            </div>
            {/* Price badge */}
            <div style={{ 
              position: 'absolute', top: 14, right: 14, 
              background: 'rgba(0,0,0,0.6)', 
              color: '#fff', 
              padding: '5px 14px', 
              borderRadius: 20, 
              fontSize: '0.82rem', 
              fontWeight: 700,
              backdropFilter: 'blur(8px)',
            }}>
              £{SPECIALIST.price}<span style={{ fontWeight: 400, fontSize: '0.72rem', opacity: 0.8 }}>/session</span>
            </div>
            {/* Name overlay on image */}
            <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>{SPECIALIST.name}</h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                {SPECIALIST.title} · {SPECIALIST.experience}
              </p>
            </div>
          </div>

          {/* Info Body */}
          <div style={{ padding: '16px 18px 18px' }}>
            {/* Rating & Location row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={14} fill="#FFD700" color="#FFD700" />
                <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{SPECIALIST.rating}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({SPECIALIST.reviews})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <MapPin size={12} />
                <span>{SPECIALIST.location}</span>
              </div>
            </div>

            {/* Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {SPECIALIST.highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={14} style={{ color: '#4CAF50', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', color: '#444' }}>{h}</span>
                </div>
              ))}
            </div>

            {/* Next available & CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <Clock size={13} />
                <span>Next: <strong style={{ color: '#222' }}>{SPECIALIST.nextAvailable}</strong></span>
              </div>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', 
                background: 'var(--primary)', 
                borderRadius: 12, 
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}>
                Book Now <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Trust Indicators */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, 
        marginTop: 20, padding: '14px 16px', 
        background: 'rgba(252,101,209,0.04)', borderRadius: 14 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <Video size={14} style={{ color: 'var(--primary)' }} />
          <span>Online Sessions</span>
        </div>
        <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <Award size={14} style={{ color: 'var(--primary)' }} />
          <span>Certified</span>
        </div>
        <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <Star size={14} style={{ color: '#FFD700' }} />
          <span>Top Rated</span>
        </div>
      </div>
    </div>
  );
}
