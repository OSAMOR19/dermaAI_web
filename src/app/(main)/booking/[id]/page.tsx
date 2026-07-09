'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, Clock, Award, Video, Calendar, AlertCircle, MapPin, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

const DOCTORS: Record<
  string,
  {
    name: string;
    title: string;
    experience: string;
    rating: number;
    reviews: number;
    price: number;
    avatar: string;
    bio: string;
    email: string;
    location: string;
    credentials: string[];
  }
> = {
  evelyn: {
    name: 'Evelyn Badaiki',
    title: 'Resident Aesthetician',
    experience: '10+ Years',
    rating: 4.9,
    reviews: 184,
    price: 50,
    avatar: '/evelyn-badaiki.png',
    bio: 'With over 10 years of experience as a beautypreneur and a solid academic foundation in Biochemistry, Evelyn bridges the gap between complex cosmetic formulation and real, visible skin results. Her deepest passion lies in solving complex skin concerns for melanated skin, an underserved market that requires deep ingredient literacy and precise, safety-focused professional understanding.',
    email: 'info@wholesalebeautyhub.co.uk',
    location: '7 Dennington Mews',
    credentials: [
      'Authorized Partner with 25 Pskyn',
      'Level 4 in Aesthetic Practice & Skin Science',
      'Ofqual-regulated Level 3 VTCT (ITEC)',
    ],
  },
};

const TIME_SLOTS = [
  '09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM', '05:00 PM'
];

export default function DermatologistPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const docId = (params?.id as string) || 'evelyn';
  const doctor = DOCTORS[docId] || DOCTORS.evelyn;

  // Form State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const convert12hTo24h = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
    return `${hours}:${minutes}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidation() || !user) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const time24 = convert12hTo24h(selectedTime);
      const eventStartTimeIso = `${selectedDate}T${time24}:00`;
      
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: docId,
          doctor_name: doctor.name,
          date: selectedDate,
          time: selectedTime,
          notes,
          invitee_email: user.email,
          invitee_name: user.user_metadata?.first_name 
            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name ?? ''}`.trim()
            : 'Valued Client',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Failed to book appointment');
      }

      router.push(`/booking/success?doctor_id=${docId}&event_start_time=${encodeURIComponent(eventStartTimeIso)}`);
    } catch (err: unknown) {
      setErrors({
        submit: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking" style={{ maxWidth: 560, margin: '0 auto', padding: '0 20px 120px' }}>
      {/* Back Link */}
      <Link 
        href="/booking" 
        style={{ 
          display: 'inline-flex', alignItems: 'center', gap: 8, 
          marginBottom: 20, color: 'var(--text-secondary)', fontWeight: 600, 
          fontSize: '0.88rem', textDecoration: 'none' 
        }}
      >
        <ArrowLeft size={16} /> Back
      </Link>

      {/* ---- Specialist Header ---- */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: 14, 
        marginBottom: 20, padding: '16px', 
        background: 'var(--bg-card)', borderRadius: 16, 
        border: '1px solid var(--border)' 
      }}>
        <div style={{ 
          width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', 
          flexShrink: 0, border: '2px solid var(--primary)' 
        }}>
          <img src={doctor.avatar} alt={doctor.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 2px', color: '#111' }}>{doctor.name}</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, margin: '0 0 4px' }}>{doctor.title}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <Star size={12} fill="#FFD700" color="#FFD700" /> {doctor.rating} ({doctor.reviews})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <MapPin size={11} /> {doctor.location}
            </span>
          </div>
        </div>
      </div>

      {/* ---- About Section ---- */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: 8 }}>
          About
        </h3>
        <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: '#444', margin: 0 }}>{doctor.bio}</p>
      </div>

      {/* ---- Quick Info Pills ---- */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {[
          { icon: Clock, label: `${doctor.experience} Experience` },
          { icon: Award, label: 'Certified Aesthetician' },
          { icon: Video, label: 'Online Consultations' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} style={{ 
            display: 'flex', alignItems: 'center', gap: 6, 
            padding: '7px 12px', borderRadius: 20, 
            background: 'rgba(252,101,209,0.06)', 
            fontSize: '0.78rem', color: '#555', fontWeight: 500 
          }}>
            <Icon size={13} style={{ color: 'var(--primary)' }} /> {label}
          </div>
        ))}
      </div>

      {/* ---- Credentials ---- */}
      {doctor.credentials && doctor.credentials.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: 10 }}>
            Credentials
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {doctor.credentials.map((cred) => (
              <div key={cred} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.84rem', color: '#444' }}>
                <CheckCircle size={14} style={{ color: '#4CAF50', flexShrink: 0, marginTop: 2 }} />
                <span>{cred}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- Consultation Fee Banner ---- */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '14px 18px', marginBottom: 24, 
        background: 'linear-gradient(135deg, rgba(252,101,209,0.08), rgba(252,101,209,0.03))', 
        borderRadius: 14, border: '1px solid rgba(252,101,209,0.12)' 
      }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>Consultation Fee</span>
        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
          £{doctor.price}
          <span style={{ fontSize: '0.78rem', fontWeight: 400, color: 'var(--text-muted)' }}>/session</span>
        </span>
      </div>

      {/* ---- Booking Form ---- */}
      <div className="card" style={{ borderRadius: 20, border: '1px solid var(--border)', padding: '20px' }}>
        <h3 style={{ 
          fontSize: '1rem', fontWeight: 800, marginBottom: 20, 
          paddingBottom: 14, borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Calendar size={18} style={{ color: 'var(--primary)' }} />
          Schedule Your Session
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {errors.submit && (
            <div style={{ display: 'flex', gap: 8, background: 'rgba(229,57,53,0.08)', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(229,57,53,0.18)' }}>
              <AlertCircle size={18} style={{ color: '#E53935', flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', color: '#E53935', margin: 0 }}>{errors.submit}</p>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: 8, color: '#333' }}>
              Preferred Date *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getTodayDateString()}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 12,
                border: `1.5px solid ${errors.date ? '#E53935' : 'var(--border)'}`,
                fontSize: '0.95rem', outline: 'none', background: '#fff',
                fontFamily: 'inherit', transition: 'border-color 0.2s',
              }}
            />
            {errors.date && (
              <p style={{ color: '#E53935', fontSize: '0.78rem', margin: '6px 0 0' }}>{errors.date}</p>
            )}
          </div>

          {/* Time Slots */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: 10, color: '#333' }}>
              Select Time *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    style={{
                      padding: '10px 0', borderRadius: 12,
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      background: isSelected ? 'rgba(252,101,209,0.06)' : '#fff',
                      color: isSelected ? 'var(--primary)' : '#444',
                      fontWeight: 600, fontSize: '0.82rem',
                      cursor: 'pointer', transition: 'all 0.2s',
                      textAlign: 'center',
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            {errors.time && (
              <p style={{ color: '#E53935', fontSize: '0.78rem', margin: '8px 0 0' }}>{errors.time}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: 8, color: '#333' }}>
              Skin concerns <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <textarea
              placeholder="e.g. Redness on cheeks, dry patches, looking for product recommendations."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 12,
                border: '1.5px solid var(--border)', fontSize: '0.88rem',
                lineHeight: 1.5, outline: 'none', background: '#fff',
                fontFamily: 'inherit', resize: 'none', transition: 'border-color 0.2s',
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%', padding: '14px', borderRadius: 14,
              background: 'var(--primary)', color: '#fff',
              fontWeight: 700, fontSize: '0.95rem', border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px var(--primary-glow)',
              transition: 'all 0.2s',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Confirming Appointment...' : `Book Consultation — £${doctor.price}`}
          </button>

          {/* Trust footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <Shield size={12} />
            <span>Secure booking · Confirmation sent via email</span>
          </div>
        </form>
      </div>
    </div>
  );
}
