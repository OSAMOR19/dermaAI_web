import { Instrument_Sans } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DermaAI — AI-Powered Skin Analysis',
  description: 'Get clinical-grade skin analysis powered by artificial intelligence. Track your skin health, detect issues, and receive personalized recommendations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={instrumentSans.className}>
        {children}
      </body>
    </html>
  );
}
