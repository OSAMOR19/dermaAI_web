'use client';

import Link from 'next/link';
import { Star, Clock, Award, MapPin, Sparkles, ArrowRight } from 'lucide-react';

const SPECIALIST = {
  id: 'evelyn',
  name: 'Evelyn Badaiki',
  title: 'Resident Aesthetician',
  location: '7 Dennington Mews',
  brand: 'WBH SKIN',
  experience: '10+ yrs',
  rating: 4.9,
  reviews: 184,
  price: 45,
  nextAvailable: 'Today, 2:30 PM',
  avatar: '/evelyn-badaiki.png',
  services: [
    'Dissolving Patch Test',
    'Facial Aesthetics Consultation',
    'Fat Dissolving Consultation',
    'Full Body Laser Hair Removal',
    'Eye Brow Lift',
  ],
};

export default function BookingPage() {
  return (
    <div className="booking" style={{ position: 'relative' }}>
      
      <div>
        <div className="booking-header">
          <h1>Book a Consultation</h1>
          <p>Get expert guidance based on your AI skin analysis.</p>
        </div>

        {/* Specialist Profile Card */}
        <div className="doc-list">
          <Link href={`/booking/${SPECIALIST.id}`} className="doc-card" style={{ flexDirection: 'column', gap: 0, padding: 0, overflow: 'hidden' }}>
            {/* Hero Image */}
            <div style={{ width: '100%', height: 220, overflow: 'hidden', position: 'relative', background: '#1a1a2e' }}>
              <img 
                src={SPECIALIST.avatar} 
                alt={SPECIALIST.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} 
              />
              <div style={{ 
                position: 'absolute', bottom: 0, left: 0, right: 0, 
                height: 80, 
                background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' 
              }} />
              <div style={{ 
                position: 'absolute', top: 12, left: 12, 
                background: 'rgba(252,101,209,0.9)', 
                color: '#fff', 
                padding: '4px 12px', 
                borderRadius: 20, 
                fontSize: '0.75rem', 
                fontWeight: 700,
                backdropFilter: 'blur(8px)',
                letterSpacing: '0.5px',
              }}>
                {SPECIALIST.brand}
              </div>
            </div>

            {/* Info Body */}
            <div style={{ padding: '16px 20px 20px' }}>
              <div className="doc-card-head" style={{ marginBottom: 4 }}>
                <h3 className="doc-name" style={{ fontSize: '1.15rem' }}>{SPECIALIST.name}</h3>
              </div>
              <p className="doc-specialty" style={{ marginBottom: 8, fontSize: '0.88rem' }}>{SPECIALIST.title} · {SPECIALIST.experience}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <MapPin size={13} />
                <span>{SPECIALIST.location}</span>
              </div>

              <div className="doc-meta" style={{ marginBottom: 14 }}>
                <span className="doc-rating">
                  <Star size={12} fill="#FFD700" color="#FFD700" />
                  {SPECIALIST.rating} <span className="doc-reviews">({SPECIALIST.reviews})</span>
                </span>
                <span className="doc-next">
                  <Clock size={12} /> {SPECIALIST.nextAvailable}
                </span>
              </div>

              {/* Services */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Services Offered</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {SPECIALIST.services.map((service) => (
                    <span key={service} style={{ 
                      fontSize: '0.78rem', 
                      padding: '5px 12px', 
                      background: 'var(--primary-light)', 
                      color: 'var(--primary)', 
                      borderRadius: 20, 
                      fontWeight: 600,
                      border: '1px solid rgba(252,101,209,0.15)',
                    }}>
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px 16px', 
                background: 'var(--primary)', 
                borderRadius: 14, 
                color: '#fff',
              }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Book Consultation</span>
                <ArrowRight size={18} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
