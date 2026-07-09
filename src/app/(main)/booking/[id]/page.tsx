'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, Clock, Award, Video, Calendar, AlertCircle } from 'lucide-react';
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
    price: 45,
    avatar: '/evelyn-badaiki.png',
    bio: 'With over 10 years of experience as a beautypreneur and a solid academic foundation in Biochemistry, Evelyn bridges the gap between complex cosmetic formulation and real, visible skin results. Her deepest passion lies in solving complex skin concerns for melanated skin, an underserved market that requires deep ingredient literacy and precise, safety-focused professional understanding. She founded WBH Skin AI — a cutting-edge BeautyTech solution driven by advanced AI that analyses skin concerns and seamlessly directs users to targeted product routines or expert consultations.',
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

  const convert12hTo24h = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
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
    <div className="booking" style={{ maxWidth: 700, margin: '0 auto 100px', padding: '0 20px' }}>
      <Link href="/booking" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
        <ArrowLeft size={18} /> Back to Aestheticians
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
            <Award size={16} /> Certified Aesthetician
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <Video size={16} /> Online Consultations
          </div>
        </div>

        {/* Credentials */}
        {doctor.credentials && doctor.credentials.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Credentials</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {doctor.credentials.map((cred) => (
                <div key={cred} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#444' }}>
                  <Award size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span>{cred}</span>
                </div>
              ))}
            </div>
          </div>
        )}



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
