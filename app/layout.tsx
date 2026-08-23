import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SWACHHAI AI — Smart Municipal Waste Platform',
  description:
    'AI-Powered Smart Municipal Waste & Circular Economy Platform for Gujarat municipalities. Report, track, and resolve waste issues intelligently.',
  keywords: ['waste management', 'Gujarat', 'municipal', 'AI', 'smart city'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
