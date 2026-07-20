import { Cormorant_Garamond, Manrope } from 'next/font/google';

import './globals.css';

const display = Cormorant_Garamond({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const body = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hadassahlifestyle.com'),
  title: 'Hadassah Lifestyle | Beautifully Chosen, Effortlessly Yours',
  description:
    'Curated clothing, shoes, bags and kitchen pieces selected to make everyday living feel considered.',
  openGraph: {
    title: 'Hadassah Lifestyle',
    description: 'Dress well. Live beautifully. Find the pieces that make both feel effortless.',
    type: 'website',
    url: '/',
    siteName: 'Hadassah Lifestyle',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Hadassah Lifestyle' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hadassah Lifestyle',
    description: 'Dress well. Live beautifully. Find the pieces that make both feel effortless.',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
