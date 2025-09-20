import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/components/app-provider';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { AnimatedBackground } from '@/components/animated-background';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });


export const metadata: Metadata = {
  title: 'Clarity Hub',
  description: 'A supportive web app for mental well-being.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} font-body antialiased`}>
        <AppProvider>
          <AnimatedBackground />
          <div className="relative z-10">
            {children}
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
