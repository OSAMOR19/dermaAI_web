import LandingNavbar from '@/landing/components/LandingNavbar';
import LandingHero from '@/landing/components/LandingHero';
import LandingWhyChooseUs from '@/landing/components/LandingWhyChooseUs';
import LandingSkinAnalysis from '@/landing/components/LandingSkinAnalysis';
import LandingServices from '@/landing/components/LandingServices';
import LandingImageGallery from '@/landing/components/LandingImageGallery';
import LandingFooter from '@/landing/components/LandingFooter';

// Force dynamic rendering — prevents Vercel/CDN from caching a stale redirect
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Wholesale Beauty Hub — AI Skin Analysis & Premium Beauty Products UK',
  description: 'Shop premium Makeup, Skincare & beauty products online. AI-powered skin analysis with next-day UK delivery & worldwide shipping.',
};

export default function LandingPage() {
  return (
    <>
      {/* Google Fonts for the WBH brand */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@300;400&display=swap"
        rel="stylesheet"
      />
      <main style={{
        minHeight: '100vh',
        fontFamily: "'DM Sans', sans-serif",
        background: '#fefcfa',
        color: '#1a1109',
        overflowX: 'hidden',
      }}>
        <LandingNavbar />
        <LandingHero />
        <LandingWhyChooseUs />
        <LandingSkinAnalysis />
        <LandingServices />
        <LandingImageGallery />
        <LandingFooter />
      </main>
    </>
  );
}
