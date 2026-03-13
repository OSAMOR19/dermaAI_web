import Link from 'next/link';
import { ScanLine, BarChart3, UserRound, FileText, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div>
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo">DERMA<span>AI</span></div>
        <div className="landing-nav-links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/booking">Booking</Link>
          <Link href="/login" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <ScanLine size={16} /> AI-Powered Skin Analysis
            </div>
            <h1>
              Your Skin,<br />
              <span className="hero-gradient">Analyzed In Seconds</span>
            </h1>
            <p>
              Receive a detailed skin health score, problem detection heatmaps,
              and custom care recommendations tailored to your skin type.
            </p>
            <div className="hero-buttons">
              <Link href="/signup" className="btn btn-primary btn-lg">
                Start Free Analysis <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                View Demo
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-glow" />
            <div className="hero-mockup">
              <img src="/images/Onboarding1.svg" alt="DermaAI skin scanning interface" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Everything You Need For <span>Healthy Skin</span></h2>
        <p>Advanced AI technology combined with dermatologist expertise to give you the most accurate skin analysis available.</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon pink"><ScanLine size={28} /></div>
            <h3>AI Facial Scanning</h3>
            <p>Advanced AI detects skin conditions, acne zones, dark spots, and dryness areas in real time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue"><BarChart3 size={28} /></div>
            <h3>Health Score</h3>
            <p>Get a comprehensive skin health score with a detailed breakdown of each area analyzed.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon pink"><UserRound size={28} /></div>
            <h3>Expert Consultation</h3>
            <p>Connect with board-certified dermatologists for personalised guidance and treatment plans.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue"><FileText size={28} /></div>
            <h3>Custom Recommendations</h3>
            <p>Receive tailored skincare routines and product recommendations based on your unique skin profile.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="how-inner">
          <h2>How It <span>Works</span></h2>
          <div className="how-steps">
            <div className="how-step">
              <div className="step-number">1</div>
              <h3>Scan Your Face</h3>
              <p>Use your camera to take a quick scan of your skin. It only takes a few seconds.</p>
            </div>
            <div className="how-step">
              <div className="step-number">2</div>
              <h3>AI Analyzes</h3>
              <p>Our AI engine processes your scan and detects skin conditions with clinical accuracy.</p>
            </div>
            <div className="how-step">
              <div className="step-number">3</div>
              <h3>Get Results</h3>
              <p>View your health score, detected areas, and personalised care recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Ready to Transform Your Skincare?</h2>
          <p>Join thousands of users who trust DermaAI for their skin health journey.</p>
          <div className="hero-buttons">
            <Link href="/signup" className="btn btn-primary btn-lg">
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} DermaAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
