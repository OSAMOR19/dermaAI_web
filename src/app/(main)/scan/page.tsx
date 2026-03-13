import Link from 'next/link';
import { ScanLine } from 'lucide-react';

export default function ScanPage() {
  return (
    <div className="scan-page">
      <div className="scan-container">
        <div className="scan-visual">
          <div className="scan-line" />
          <img src="/images/Onboarding1.svg" alt="Scan preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
        </div>
        <h1>Skin Scan</h1>
        <p>Position your face within the frame for an accurate AI-powered skin analysis.</p>
        <Link href="/analysis" className="btn btn-primary btn-lg">
          <ScanLine size={20} /> Start Scan
        </Link>
      </div>
    </div>
  );
}
