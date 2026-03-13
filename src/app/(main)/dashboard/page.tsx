import Link from 'next/link';
import { ScanLine, Star, Bell } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dash-header">
        <div className="dash-header-left">
          <div className="dash-avatar">
            <img src="/images/DP.svg" alt="Tina" />
          </div>
          <div>
            <div className="dash-greeting">Good Morning Tina,</div>
            <div className="dash-subgreeting">Here&apos;s your skin update for today.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="icon-btn"><Bell size={20} /></button>
          <Link href="/scan" className="icon-btn"><ScanLine size={20} /></Link>
        </div>
      </div>

      {/* Skin Health Score Card */}
      <div className="score-card">
        <div className="score-left">
          <h3>Skin Health Score: 78/100</h3>
          <p>Healthy, but some areas need attention.</p>
          <Link href="/scan" className="btn btn-white btn-sm">Scan Again</Link>
        </div>
        <div className="score-right">
          <img src="/images/HomeImage.svg" alt="Facial scan results" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {/* Areas Detected */}
        <div className="card" style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(0,180,250,0.06) 100%)' }}>
          <div className="card-title">Areas Detected</div>
          <div className="areas-row">
            <div className="area-item">
              <div className="area-dot red" />
              <span className="area-label">Acne Zones</span>
            </div>
            <div className="area-item">
              <div className="area-dot orange" />
              <span className="area-label">Dark Spots</span>
            </div>
            <div className="area-item">
              <div className="area-dot blue" />
              <span className="area-label">Dryness Areas</span>
            </div>
          </div>
        </div>

        {/* Recent Analysis */}
        <div className="card">
          <div className="recent-header">
            <div className="card-title" style={{ marginBottom: 0 }}>Recent Analysis</div>
            <span className="recent-time">2 days ago</span>
          </div>
          <div className="recent-image">
            <img src="/images/HomeImage2.svg" alt="Recent analysis" />
          </div>
          <Link href="/analysis" className="btn btn-primary btn-block">View Full Report</Link>
        </div>
      </div>

      {/* Dermatologist Consultation */}
      <div className="card">
        <div className="card-title">Dermatologist Consultation</div>
        <div className="doctor-row">
          <div className="doctor-avatar">SJ</div>
          <div style={{ flex: 1 }}>
            <div className="doctor-name">Dr. Sarah Johnson</div>
            <div className="doctor-title">Dermatology Specialist</div>
            <div className="rating-row">
              <Star size={14} fill="#FFD700" color="#FFD700" />
              <span className="rating-text">4.9 (127 Reviews)</span>
            </div>
            <div className="online-badge">
              <div className="online-dot" />
              <span className="online-text">online</span>
            </div>
          </div>
        </div>
        <Link href="/call" className="btn btn-primary btn-block">Start Chat Consultation</Link>
      </div>
    </div>
  );
}
