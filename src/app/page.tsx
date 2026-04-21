import LandingNavbar from '@/landing/components/LandingNavbar';
import LandingHero from '@/landing/components/LandingHero';
import LandingWhyChooseUs from '@/landing/components/LandingWhyChooseUs';
import LandingSkinAnalysis from '@/landing/components/LandingSkinAnalysis';
import LandingServices from '@/landing/components/LandingServices';
import LandingImageGallery from '@/landing/components/LandingImageGallery';
import LandingFooter from '@/landing/components/LandingFooter';

export const metadata = {
  title: 'Wholesale Beauty Hub — AI Skin Analysis & Professional Skincare',
  description: 'Transform your skin with AI-powered analysis and clinical expertise. Trusted by 10,000+ patients worldwide.',
};

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <LandingNavbar />
      <LandingHero />
      <LandingWhyChooseUs />
      <LandingSkinAnalysis />
      <LandingServices />
      <LandingImageGallery />
      <LandingFooter />
    </main>
  );
}
