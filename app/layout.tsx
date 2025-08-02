import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { TopNavBar } from '@/components/layout/TopNavBar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Hermes - Personal Trading Bot for Decentralized Exchanges',
  description: 'Next-generation personal trading bot for decentralized exchanges, leveraging advanced algorithms and machine learning technology for intelligent, secure, and efficient trading strategies'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <TopNavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
