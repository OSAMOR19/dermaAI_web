import Link from 'next/link';
import { Search, Filter, Star } from 'lucide-react';

const DOCTORS = [
  { id: 'carter', name: 'Dr. Emily Carter', title: 'Board-Certified Dermatologist', experience: '8+ Years Experience', rating: 4.8, reviews: 124, price: 40, nextAvailable: 'Today, 3:30pm', avatar: '/images/Carter.svg' },
  { id: 'reynolds', name: 'Dr. Michael Reynolds', title: 'Board-Certified Dermatologist', experience: '12+ Years Experience', rating: 4.9, reviews: 210, price: 55, nextAvailable: 'Tomorrow, 10:00 AM', avatar: '/images/Michael.svg' },
  { id: 'thompson', name: 'Dr. Aisha Thompson', title: 'Board-Certified Dermatologist', experience: '8+ Years Experience', rating: 4.9, reviews: 156, price: 45, nextAvailable: 'Today, 6:15 PM', avatar: '/images/Aisha.svg' },
  { id: 'kim', name: 'Dr. Daniel Kim', title: 'Dermatology & Research Specialist', experience: '15 Years Experience', rating: 4.8, reviews: 302, price: 60, nextAvailable: 'Tomorrow, 2:00 PM', avatar: '/images/Michael.svg' },
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
      <div className="doctors-grid">
        {DOCTORS.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <div className="doctor-card-top">
              <div className="doctor-card-avatar">
                <img src={doctor.avatar} alt={doctor.name} />
              </div>
              <div className="doctor-card-info">
                <div className="doctor-name">{doctor.name}</div>
                <div className="doctor-title">{doctor.title}</div>
                <div className="experience">{doctor.experience}</div>
                <div className="rating-row">
                  <Star size={14} fill="#FFD700" color="#FFD700" />
                  <span className="rating-text">{doctor.rating} ({doctor.reviews} Reviews)</span>
                </div>
                <div className="next-available">Next Available: {doctor.nextAvailable}</div>
              </div>
              <div className="doctor-card-price">${doctor.price}/Sess</div>
            </div>
            <Link href={`/booking/${doctor.id}`} className="btn btn-primary btn-block">
              Book Appointment
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
