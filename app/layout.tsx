import './globals.css';
import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import AppShell from '@/components/AppShell';
import ThemeProvider from '@/components/ThemeProvider';
import AuthProvider from '@/components/AuthProvider';
import RegisterModal from '@/components/RegisterModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tentmakers.ph'),
  title: {
    default: 'Tentmakers Network — Member Portal',
    template: '%s | Tentmakers Network',
  },
  description:
    'Join the Tentmakers Network. Five ventures, one training hub, a 4.67-million-person market on Panay Island. Register to become a member and start your operator journey.',
  openGraph: {
    title: 'Tentmakers Network — Member Portal',
    description:
      'Join the Tentmakers Network. Five ventures. One training hub. A 4.67-million-person market on Panay Island where your journey as an operator begins.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tentmakers Network — Member Portal',
    description:
      'Five ventures. One training hub. A 4.67-million-person market on Panay Island.',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${display.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 rounded-lg bg-amber px-4 py-2 text-sm font-bold text-navy"
        >
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        <RegisterModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
