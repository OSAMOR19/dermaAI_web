import Link from 'next/link';
import { ArrowLeft, ScanLine, FileText } from 'lucide-react';

export default function AnalysisPage() {
  return (
    <div className="analysis-page">
      {/* Header */}
      <div className="analysis-header">
        <Link href="/dashboard" className="icon-btn" style={{ background: 'rgba(255,255,255,0.8)' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1>Facial Analysis</h1>
        <button className="icon-btn" style={{ background: 'rgba(255,255,255,0.8)' }}>
          <ScanLine size={20} />
        </button>
      </div>

      {/* Main Analysis Visual */}
      <div className="analysis-content">
        <div className="analysis-face">
          <img src="/images/facial.svg" alt="Facial analysis results" />
          <div className="detection-label acne">Acne Detected</div>
          <div className="detection-label rash">Skin Rashes Detected</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="analysis-buttons">
        <Link href="/scan" className="btn btn-primary btn-lg" style={{ flex: 1, maxWidth: 220 }}>
          <ScanLine size={18} /> Scan Again
        </Link>
        <Link href="/dashboard" className="btn btn-outline btn-lg" style={{ flex: 1, maxWidth: 220 }}>
          <FileText size={18} /> View Results
        </Link>
      </div>
    </div>
  );
}
