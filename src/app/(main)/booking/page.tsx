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
    <div className="booking">
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
          <Link href={`/booking/${doc.id}`} key={doc.id} className="doc-card">
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
          </Link>
        ))}
      </div>
    </div>
  );
}
