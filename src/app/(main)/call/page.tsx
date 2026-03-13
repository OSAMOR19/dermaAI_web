import Link from 'next/link';
import { ArrowLeft, Camera, Phone, Volume2, MicOff } from 'lucide-react';

export default function CallPage() {
  return (
    <div className="call-page">
      {/* Header */}
      <div className="call-header">
        <Link href="/dashboard" className="icon-btn" style={{ background: 'rgba(255,255,255,0.75)' }}>
          <ArrowLeft size={20} />
        </Link>
        <button className="icon-btn" style={{ background: 'rgba(255,255,255,0.75)' }}>
          <Camera size={20} />
        </button>
      </div>

      {/* Call Visual */}
      <div className="call-content">
        <div className="call-visual">
          <img src="/images/Call.svg" alt="Video call in progress" />
        </div>
      </div>

      {/* Controls */}
      <div className="call-controls">
        <button className="call-btn muted"><Camera size={22} /></button>
        <button className="call-btn end"><Phone size={24} style={{ transform: 'rotate(135deg)' }} /></button>
        <button className="call-btn muted"><Volume2 size={22} /></button>
        <button className="call-btn muted"><MicOff size={22} /></button>
      </div>
    </div>
  );
}
