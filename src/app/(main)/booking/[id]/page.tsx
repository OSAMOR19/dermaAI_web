'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star, Clock, Award, Video, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

const DOCTORS: Record<string, { name: string; title: string; experience: string; rating: number; reviews: number; price: number; avatar: string; bio: string }> = {
  carter: { name: 'Dr. Emily Carter', title: 'Board-Certified Dermatologist', experience: '8+ Years', rating: 4.8, reviews: 124, price: 40, avatar: '/images/Carter.svg', bio: 'Specialising in acne treatment, anti-aging solutions, and skin cancer screening. Dr. Carter combines cutting-edge technology with a patient-centered approach.' },
  reynolds: { name: 'Dr. Michael Reynolds', title: 'Board-Certified Dermatologist', experience: '12+ Years', rating: 4.9, reviews: 210, price: 55, avatar: '/images/Michael.svg', bio: 'Expert in cosmetic dermatology and complex skin conditions. Known for his thorough diagnostic approach and personalised treatment plans.' },
  thompson: { name: 'Dr. Aisha Thompson', title: 'Board-Certified Dermatologist', experience: '8+ Years', rating: 4.9, reviews: 156, price: 45, avatar: '/images/Aisha.svg', bio: 'Passionate about holistic skincare and treating diverse skin types. Specialises in eczema, psoriasis, and culturally-informed dermatology.' },
  kim: { name: 'Dr. Daniel Kim', title: 'Dermatology & Research Specialist', experience: '15 Years', rating: 4.8, reviews: 302, price: 60, avatar: '/images/Michael.svg', bio: 'Leading researcher in AI-assisted dermatology. Combines academic expertise with practical clinical experience for evidence-based treatments.' },
};

const TIME_SLOTS = [
  '09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM', '05:00 PM'
];

export default function DermatologistPage() {
  const params = useParams();
  const docId = (params?.id as string) || 'carter';
  const doctor = DOCTORS[docId] || DOCTORS.carter;

  // Form State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<{ date: string; time: string } | null>(null);

  // Get today's date in YYYY-MM-DD format for date limit
  const getTodayDateString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleValidation = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedDate) {
      newErrors.date = 'Please select a preferred date.';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const chosen = new Date(selectedDate);
      if (chosen < today) {
        newErrors.date = 'Date cannot be in the past.';
      }
    }

    if (!selectedTime) {
      newErrors.time = 'Please select an appointment time slot.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidation()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: docId,
          doctor_name: doctor.name,
          date: selectedDate,
          time: selectedTime,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Failed to book appointment');
      }

      setSubmittedBooking({ date: selectedDate, time: selectedTime });
      setIsSuccess(true);
    } catch (err: unknown) {
      setErrors({
        submit: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && submittedBooking) {
    return (
      <div className="booking" style={{ maxWidth: 600, margin: '40px auto 100px', padding: '0 20px' }}>
        <div className="card" style={{ padding: '40px 32px', textAlign: 'center', borderRadius: 24, boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ width: 72, height: 72, background: 'rgba(76,175,80,0.1)', color: '#4CAF50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12, color: '#111' }}>Booking Confirmed!</h2>
          <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 32 }}>
            Your consultation appointment with <strong>{doctor.name}</strong> has been successfully booked. A confirmation email has been sent to your account.
          </p>

          <div style={{ background: 'var(--primary-light)', padding: '20px 24px', borderRadius: 16, textAlign: 'left', marginBottom: 36, border: '1px solid rgba(252,101,209,0.15)' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)', fontWeight: 700, margin: '0 0 12px' }}>Appointment Details</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                <span style={{ color: '#666' }}>Specialist:</span>
                <strong style={{ color: '#111' }}>{doctor.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                <span style={{ color: '#666' }}>Date:</span>
                <strong style={{ color: '#111' }}>{new Date(submittedBooking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                <span style={{ color: '#666' }}>Time:</span>
                <strong style={{ color: '#111' }}>{submittedBooking.time}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                <span style={{ color: '#666' }}>Consultation Fee:</span>
                <strong style={{ color: 'var(--primary)' }}>${doctor.price} (Paid)</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/call" className="btn btn-primary btn-block btn-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 20px', borderRadius: 12, fontWeight: 700 }}>
              <Video size={18} /> Join Video Consultation Call
            </Link>
            <Link href="/dashboard" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 20px', borderRadius: 12, fontWeight: 600 }}>
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking" style={{ maxWidth: 700, margin: '0 auto 100px', padding: '0 20px' }}>
      <Link href="/booking" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
        <ArrowLeft size={18} /> Back to Dermatologists
      </Link>

      {/* Doctor Info Card */}
      <div className="card" style={{ marginBottom: 24, borderRadius: 20, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
          <div className="doctor-card-avatar" style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', background: '#f0f0f0' }}>
            <img src={doctor.avatar} alt={doctor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 4, fontWeight: 800 }}>{doctor.name}</h2>
            <div className="doctor-title" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>{doctor.title}</div>
            <div className="rating-row" style={{ marginTop: 6 }}>
              <Star size={16} fill="#FFD700" color="#FFD700" />
              <span className="rating-text" style={{ fontSize: '0.88rem', fontWeight: 600 }}>{doctor.rating} ({doctor.reviews} Reviews)</span>
            </div>
          </div>
        </div>
        <p style={{ lineHeight: 1.7, marginBottom: 20, color: '#444', fontSize: '0.92rem' }}>{doctor.bio}</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <Clock size={16} /> {doctor.experience} Experience
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <Award size={16} /> Board Certified
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <Video size={16} /> Video Consultations
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontWeight: 600, color: '#222' }}>Consultation Fee</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>${doctor.price}<span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>/session</span></span>
        </div>
      </div>

      {/* Booking Form Card */}
      <div className="card" style={{ borderRadius: 20, border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
          <Calendar size={18} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--primary)' }} />
          Schedule Consultation
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {errors.submit && (
            <div style={{ display: 'flex', gap: 8, background: 'rgba(229,57,53,0.08)', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(229,57,53,0.18)' }}>
              <AlertCircle size={18} style={{ color: '#E53935', flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', color: '#E53935', margin: 0 }}>{errors.submit}</p>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 8, color: '#333' }}>
              Preferred Appointment Date *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getTodayDateString()}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                fontSize: '1rem',
                outline: 'none',
                background: '#fff',
                fontFamily: 'inherit',
                borderColor: errors.date ? '#E53935' : 'var(--border)',
              }}
            />
            {errors.date && (
              <p style={{ color: '#E53935', fontSize: '0.78rem', marginTop: 6, margin: '6px 0 0' }}>{errors.date}</p>
            )}
          </div>

          {/* Time Slot Selector */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 10, color: '#333' }}>
              Select Time Slot *
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 20,
                      border: '1.5px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                      background: isSelected ? 'rgba(252,101,209,0.06)' : '#fff',
                      color: isSelected ? 'var(--primary)' : '#444',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            {errors.time && (
              <p style={{ color: '#E53935', fontSize: '0.78rem', marginTop: 8, margin: '8px 0 0' }}>{errors.time}</p>
            )}
          </div>

          {/* Notes Textarea */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 8, color: '#333' }}>
              Describe your skin concerns or symptoms (Optional)
            </label>
            <textarea
              placeholder="e.g. Redness on cheeks, occasional dry patches, looking for customized product recommendations."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                fontSize: '0.92rem',
                lineHeight: 1.5,
                outline: 'none',
                background: '#fff',
                fontFamily: 'inherit',
                resize: 'none',
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px var(--primary-glow)',
              transition: 'all 0.2s',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Confirming Appointment...' : `Book Consultation Call — $${doctor.price}`}
          </button>
        </form>
      </div>
    </div>
  );
}
