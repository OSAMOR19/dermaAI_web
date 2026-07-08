import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Consultation Registration — WBH Skin',
  description: 'Register with WBH Skin to get personalised skin advice from our experts. Fill in your details to secure your spot.',
  openGraph: {
    title: 'Consultation Registration — WBH Skin',
    description: 'Register with WBH Skin to get personalised skin advice from our experts.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WBH Skin Registration',
      },
    ],
    siteName: 'WBH Skin',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Consultation Registration — WBH Skin',
    description: 'Register with WBH Skin to get personalised skin advice from our experts.',
    images: ['/images/og-image.png'],
  },
};

export default function EventRegistrationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
