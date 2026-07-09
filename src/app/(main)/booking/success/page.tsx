'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Download, Calendar, ShieldAlert, ArrowRight, User } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

const DOCTORS: Record<string, { name: string; title: string; price: number; avatar: string }> = {
  evelyn: { name: 'Evelyn Badaiki', title: 'Resident Aesthetician · WBH Skin', price: 50, avatar: '/evelyn-badaiki.png' },
};

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const docId = searchParams.get('doctor_id') || 'evelyn';
  const eventUuid = searchParams.get('event_uuid') || '';
  const inviteeUuid = searchParams.get('invitee_uuid') || '';
  
  // Try to parse dates from Calendly redirect URL if present
  const eventStartTime = searchParams.get('event_start_time') || '';
  
  const doctor = DOCTORS[docId] || DOCTORS.evelyn;

  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

  // Generate formatting values
  useEffect(() => {
    const d = eventStartTime ? new Date(eventStartTime) : new Date();
    setDateStr(d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
    setTimeStr(d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  }, [eventStartTime]);

  const handleDownloadPng = () => {
    const svgElement = document.getElementById('booking-pass-svg');
    if (!svgElement) return;

    // Serialize SVG element to string
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 340 * 2; // double size for high-res PNG
      canvas.height = 530 * 2;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `wbh-booking-pass-${docId}-${eventUuid || 'receipt'}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  };

  return (
    <div className="booking" style={{ maxWidth: 560, margin: '24px auto 100px', padding: '0 20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'stretch' }}>
        
        {/* Success Card Left */}
        <div className="card" style={{ padding: '36px 30px', borderRadius: 24, boxShadow: '0 16px 40px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}>
          
          {/* Centered animated checkmark & title */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 28 }}>
            <div className="animate-scale-in" style={{ 
              width: 76, 
              height: 76, 
              background: 'rgba(76,175,80,0.1)', 
              color: '#4CAF50', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: 20,
              position: 'relative'
            }}>
              {/* Outer pulsing ring */}
              <div className="animate-pulse-ring" style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '50%',
                border: '2px solid rgba(76,175,80,0.2)',
              }} />
              <CheckCircle2 size={42} />
            </div>
            
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: 10, color: '#111' }}>Booking Confirmed!</h2>
            <p style={{ color: '#555', fontSize: '0.92rem', lineHeight: 1.6, margin: 0, maxWidth: 460 }}>
              Thank you for scheduling your session. Your consultation with <strong>{doctor.name}</strong> has been successfully booked. Both you and the specialist will receive a confirmation email shortly.
            </p>
          </div>

          <div style={{ background: 'var(--primary-light)', padding: '16px 20px', borderRadius: 16, textAlign: 'left', marginBottom: 24, border: '1px solid rgba(252,101,209,0.15)' }}>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)', fontWeight: 700, margin: '0 0 10px' }}>Session Summary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: '#666' }}>Specialist:</span>
                <strong style={{ color: '#111' }}>{doctor.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: '#666' }}>Date:</span>
                <strong style={{ color: '#111' }}>{dateStr || 'Loading...'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: '#666' }}>Time Slot:</span>
                <strong style={{ color: '#111' }}>{timeStr || 'Loading...'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: '#666' }}>Consultation Fee:</span>
                <strong style={{ color: 'var(--primary)' }}>£{doctor.price} (Paid)</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button 
              onClick={handleDownloadPng}
              className="btn btn-primary btn-block btn-lg" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 20px', borderRadius: 12, fontWeight: 700 }}
            >
              <Download size={18} /> Download Booking Pass (PNG)
            </button>
            <Link href="/dashboard" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 20px', borderRadius: 12, fontWeight: 600 }}>
              Return to Dashboard
            </Link>
          </div>
        </div>

        {/* SVG Live Preview Right */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ 
            background: '#0d0d12', 
            borderRadius: 24, 
            padding: 16, 
            boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            {/* SVG Ticket Design */}
            <svg 
              id="booking-pass-svg" 
              width="340" 
              height="530" 
              viewBox="0 0 340 530" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block', borderRadius: 16, background: '#09090b', fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {/* Outer Card Gradient & Background */}
              <rect width="340" height="530" fill="url(#bg-gradient)" rx="16" />
              
              {/* Ticket Border */}
              <rect x="10" y="10" width="320" height="510" rx="14" stroke="rgba(252, 101, 209, 0.25)" strokeWidth="1.5" />
              
              {/* Top Section - Brand Logo */}
              <image 
                href={typeof window !== 'undefined' ? `${window.location.origin}/wbh-logo.png` : '/wbh-logo.png'} 
                x="125" 
                y="22" 
                width="90" 
                height="42" 
                style={{ opacity: 0.95 }} 
              />
              <text x="170" y="72" fill="#8e8e93" fontSize="9" fontWeight="600" letterSpacing="1" textAnchor="middle">CONSULTATION TICKET</text>
              
              {/* Divider Tear-line */}
              <line x1="20" y1="80" x2="320" y2="80" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="6 4" />
              
              {/* Main Ticket Info */}
              {/* Doctor Details */}
              <text x="30" y="120" fill="#aeaeb2" fontSize="10" fontWeight="600">SPECIALIST</text>
              <text x="30" y="140" fill="#ffffff" fontSize="15" fontWeight="700">{doctor.name}</text>
              <text x="30" y="156" fill="#fc65d1" fontSize="11" fontWeight="600">{doctor.title}</text>
              
              {/* Client Info */}
              <text x="30" y="200" fill="#aeaeb2" fontSize="10" fontWeight="600">CLIENT / BOOKER</text>
              <text x="30" y="220" fill="#ffffff" fontSize="14" fontWeight="700">
                {user?.user_metadata?.first_name 
                  ? `${user.user_metadata.first_name} ${user.user_metadata.last_name ?? ''}`.trim()
                  : user?.email || 'Valued Client'}
              </text>
              <text x="30" y="236" fill="#8e8e93" fontSize="11" fontWeight="500">{user?.email || ''}</text>
              
              {/* Date & Time */}
              <g transform="translate(0, 270)">
                <text x="30" y="0" fill="#aeaeb2" fontSize="10" fontWeight="600">APPOINTMENT DATE &amp; TIME</text>
                <text x="30" y="20" fill="#ffffff" fontSize="14" fontWeight="700">{dateStr || 'Loading Date...'}</text>
                <text x="30" y="38" fill="#fc65d1" fontSize="13" fontWeight="700">{timeStr || 'Loading Time...'}</text>
              </g>
              
              {/* Lower Divider Tear-line */}
              <line x1="20" y1="340" x2="320" y2="340" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="6 4" />
              
              {/* Reference ID / Barcode Area */}
              <text x="170" y="375" fill="#aeaeb2" fontSize="9" fontWeight="600" textAnchor="middle">BOOKING REFERENCE</text>
              <text x="170" y="392" fill="#ffffff" fontSize="12" fontWeight="700" letterSpacing="1" textAnchor="middle">
                {eventUuid ? eventUuid.substring(0, 12).toUpperCase() : 'WBH-CONSULT'}
              </text>
              
              {/* Simulated Barcode */}
              <g transform="translate(80, 410)" fill="#ffffff" opacity="0.8">
                <rect x="0" width="3" height="30" />
                <rect x="6" width="1" height="30" />
                <rect x="10" width="4" height="30" />
                <rect x="17" width="2" height="30" />
                <rect x="22" width="1" height="30" />
                <rect x="26" width="3" height="30" />
                <rect x="32" width="5" height="30" />
                <rect x="40" width="2" height="30" />
                <rect x="45" width="1" height="30" />
                <rect x="49" width="4" height="30" />
                <rect x="56" width="2" height="30" />
                <rect x="61" width="1" height="30" />
                <rect x="65" width="3" height="30" />
                <rect x="71" width="5" height="30" />
                <rect x="79" width="1" height="30" />
                <rect x="83" width="2" height="30" />
                <rect x="88" width="4" height="30" />
                <rect x="95" width="2" height="30" />
                <rect x="100" width="3" height="30" />
                <rect x="106" width="1" height="30" />
                <rect x="110" width="5" height="30" />
                <rect x="118" width="2" height="30" />
                <rect x="123" width="1" height="30" />
                <rect x="127" width="4" height="30" />
                <rect x="134" width="2" height="30" />
                <rect x="139" width="3" height="30" />
                <rect x="145" width="1" height="30" />
                <rect x="149" width="5" height="30" />
                <rect x="157" width="2" height="30" />
                <rect x="162" width="1" height="30" />
                <rect x="166" width="4" height="30" />
                <rect x="173" width="2" height="30" />
                <rect x="178" width="2" height="30" />
              </g>
              
              {/* Medical Disclaimer Banner */}
              <text x="170" y="475" fill="#8e8e93" fontSize="7" fontWeight="500" textAnchor="middle">FOR INFORMATIONAL PURPOSES ONLY. NOT MEDICAL ADVICE.</text>
              <text x="170" y="487" fill="#8e8e93" fontSize="7" fontWeight="500" textAnchor="middle">PRESENT TICKET OR CONFIRMATION ON ARRIVAL / LOG IN.</text>
              
              {/* Definitions for Gradient & Filters */}
              <defs>
                <linearGradient id="bg-gradient" x1="0" y1="0" x2="340" y2="530" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#09090b" />
                  <stop offset="50%" stopColor="#120612" />
                  <stop offset="100%" stopColor="#06060c" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
            Preview of your official Consultation Booking Pass
          </span>
        </div>

      </div>
      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.6; }
          100% { transform: scale(0.95); opacity: 0.3; }
        }
        .animate-scale-in {
          animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pulse-ring {
          animation: pulseRing 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="booking" style={{ maxWidth: 600, margin: '100px auto', textAlign: 'center', padding: '0 20px' }}>
        <div className="card" style={{ padding: 48, borderRadius: 24, boxShadow: '0 16px 40px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 10 }}>Loading Booking Details...</h2>
          <p style={{ color: '#666' }}>Please wait while we verify your consultation.</p>
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}
