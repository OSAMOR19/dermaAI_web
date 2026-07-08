import { Instrument_Sans } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import CookieConsent from '@/components/CookieConsent';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WBH — AI-Powered Skin Analysis',
  description: 'Get clinical-grade skin analysis powered by artificial intelligence. Track your skin health, detect issues, and receive personalized recommendations.',
  icons: { icon: '/favicon.png' },
  openGraph: {
    title: 'WBH Skin — AI-Powered Skin Analysis',
    description: 'Get clinical-grade skin analysis powered by artificial intelligence. Track your skin health, detect issues, and receive personalized recommendations.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WBH Skin — AI-Powered Skin Analysis',
      },
    ],
    siteName: 'WBH Skin',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WBH Skin — AI-Powered Skin Analysis',
    description: 'Get clinical-grade skin analysis powered by artificial intelligence.',
    images: ['/images/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e84c88" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="WBH Skin" />
        <link rel="apple-touch-icon" href="/images/icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className={instrumentSans.className}>
        <ThemeProvider>
          {children}
          <CookieConsent />
        </ThemeProvider>
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
          }
        `}} />
      </body>
    </html>
  );
}
