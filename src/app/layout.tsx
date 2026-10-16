import '../index.css';
import WebsiteShell from '../components/layout/WebsiteShell';

export const metadata = {
  metadataBase: new URL('https://alghafcollective.com'),
  title: 'AlGhaf Collective — Design Smarter. Build Precisely.',
  description: 'UAE-based integrated design, prefabrication, and modular construction company creating smarter, more sustainable homes through one integrated system.',
  keywords: 'AlGhaf Collective, modular homes UAE, prefabrication Dubai, luxury modular architecture, MOVA, PENTA, ENTRA, sustainable pre-built homes',
  icons: {
    icon: '/assets/logos/AlGhaf_logo_-10.png',
  },
  openGraph: {
    title: 'AlGhaf Collective — Design Smarter. Build Precisely.',
    description: 'Smarter, more sustainable homes designed, engineered, prefabricated, and delivered through one integrated system.',
    images: ['/assets/images/ax.jpg'],
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#294633',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <WebsiteShell>{children}</WebsiteShell>
      </body>
    </html>
  );
}
