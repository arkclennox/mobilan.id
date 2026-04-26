import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: {
    default: 'Mobilan.id - Kalkulator BBM Perjalanan Indonesia',
    template: '%s | Mobilan.id'
  },
  description: 'Rencanakan perjalanan Anda dengan kalkulator BBM pintar. Temukan rute terbaik dan estimasi biaya perjalanan antar kota di Indonesia.',
  keywords: ['kalkulator bbm', 'biaya perjalanan', 'rute indonesia', 'estimasi bbm', 'travel calculator'],
  authors: [{ name: 'Mobilan.id' }],
  creator: 'Mobilan.id',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://mobilan.id',
    title: 'Mobilan.id - Kalkulator BBM Perjalanan Indonesia',
    description: 'Rencanakan perjalanan Anda dengan kalkulator BBM pintar. Temukan rute terbaik dan estimasi biaya perjalanan antar kota di Indonesia.',
    siteName: 'Mobilan.id',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobilan.id - Kalkulator BBM Perjalanan Indonesia',
    description: 'Rencanakan perjalanan Anda dengan kalkulator BBM pintar.',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="flex min-h-screen flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}