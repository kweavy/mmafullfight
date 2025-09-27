import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

const siteName = 'Watch UFC MMA Fight Free Online';
const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'https://mmafullfight.com';
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  'Watch full MMA fights online in HD.';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mmafullfight.com';

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  keywords: [
    'MMA',
    'UFC',
    'Bellator',
    'Cage Warriors',
    'BKFC',
    'Fight Videos',
    'Watch Fights Online',
    'MMAWatch',
    'Combat Sports',
  ],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: siteName,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    creator: '@yourtwitter', // opsional
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-3755129330024039" />

        {/* Google Tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-LWPG6JX7NZ"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LWPG6JX7NZ');
            `,
          }}
        />

        {/* Adsterra Popunder - Di dalam <head> */}
        <Script
          strategy="afterInteractive"
          src="//weptnastyturmoil.com/d6/9f/02/d69f02efd7c105444200dd1d7de34ee9.js"
        />
      </head>
      <body className={`${inter.className} bg-black`}>
        {children}

        {/* Adsterra Banner/Interstitial - Sebelum closing </body> */}
        <Script
          strategy="afterInteractive"
          src="//weptnastyturmoil.com/48/62/60/4862606d1a3cf67d461a8aacaf13bb07.js"
        />
      </body>
    </html>
  );
}
