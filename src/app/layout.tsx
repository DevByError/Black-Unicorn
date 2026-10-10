import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BOOTSTRAP_SCRIPT } from '@/lib/bootstrap';
import { site } from '@/content/site';
import { SkipLinks } from '@/components/shell/SkipLinks';
import { Intro } from '@/components/intro/Intro';
import { IntroController } from '@/components/intro/IntroController';
import { Header } from '@/components/shell/Header';
import { Footer } from '@/components/shell/Footer';
import { Consent } from '@/components/shell/Consent';
import { RouteAnnouncer } from '@/components/shell/RouteAnnouncer';
import { Reveals } from '@/components/ui/Reveals';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  manifest: '/site.webmanifest',
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }] },
};

export const viewport: Viewport = {
  themeColor: '#0A0A10', // matches --bu-ink-900 and the manifest
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the pre-paint script sets data-theme / data-intro / classes before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP_SCRIPT }} />
        <link rel="preload" href="/fonts/cinzel-600-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/manrope-latin-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <SkipLinks />
        <Intro />
        <IntroController />
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <Consent />
        <RouteAnnouncer />
        <Reveals />
        <div id="live-region" className="visually-hidden" aria-live="polite" role="status" />
      </body>
    </html>
  );
}
