import Link from 'next/link';
import { ArrowLeft, Star, Clock, Award, Video } from 'lucide-react';

const DOCTORS: Record<string, { name: string; title: string; experience: string; rating: number; reviews: number; price: number; avatar: string; bio: string }> = {
  carter: { name: 'Dr. Emily Carter', title: 'Board-Certified Dermatologist', experience: '8+ Years', rating: 4.8, reviews: 124, price: 40, avatar: '/images/Carter.svg', bio: 'Specialising in acne treatment, anti-aging solutions, and skin cancer screening. Dr. Carter combines cutting-edge technology with a patient-centered approach.' },
  reynolds: { name: 'Dr. Michael Reynolds', title: 'Board-Certified Dermatologist', experience: '12+ Years', rating: 4.9, reviews: 210, price: 55, avatar: '/images/Michael.svg', bio: 'Expert in cosmetic dermatology and complex skin conditions. Known for his thorough diagnostic approach and personalised treatment plans.' },
  thompson: { name: 'Dr. Aisha Thompson', title: 'Board-Certified Dermatologist', experience: '8+ Years', rating: 4.9, reviews: 156, price: 45, avatar: '/images/Aisha.svg', bio: 'Passionate about holistic skincare and treating diverse skin types. Specialises in eczema, psoriasis, and culturally-informed dermatology.' },
  kim: { name: 'Dr. Daniel Kim', title: 'Dermatology & Research Specialist', experience: '15 Years', rating: 4.8, reviews: 302, price: 60, avatar: '/images/Michael.svg', bio: 'Leading researcher in AI-assisted dermatology. Combines academic expertise with practical clinical experience for evidence-based treatments.' },
};

export default async function DermatologistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctor = DOCTORS[id] || DOCTORS.carter;

  return (
    <div className="booking" style={{ maxWidth: 700 }}>
      <Link href="/booking" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, color: 'var(--primary)', fontWeight: 600 }}>
        <ArrowLeft size={18} /> Back to Dermatologists
      </Link>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24 }}>
          <div className="doctor-card-avatar" style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden' }}>
            <img src={doctor.avatar} alt={doctor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{doctor.name}</h2>
            <div className="doctor-title">{doctor.title}</div>
            <div className="rating-row" style={{ marginTop: 8 }}>
              <Star size={16} fill="#FFD700" color="#FFD700" />
              <span className="rating-text" style={{ fontSize: '0.9rem' }}>{doctor.rating} ({doctor.reviews} Reviews)</span>
            </div>
          </div>
        </div>
        <p style={{ lineHeight: 1.7, marginBottom: 24 }}>{doctor.bio}</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <Clock size={16} /> {doctor.experience} Experience
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <Award size={16} /> Board Certified
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <Video size={16} /> Video Consultations
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', marginBottom: 24 }}>
          <span style={{ fontWeight: 600 }}>Consultation Fee</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>${doctor.price}<span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>/session</span></span>
        </div>
        <Link href="/call" className="btn btn-primary btn-block btn-lg">Book Appointment</Link>
      </div>
    </div>
  );
}
