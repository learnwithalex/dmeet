import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Roboto_Serif as RobotoS } from 'next/font/google';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/providers/AuthProvider';

const roboto = RobotoS({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dmeet',
  description: 'Decentrlized Video calling App',
  icons: {
    icon: '/icons/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${roboto.className} bg-black`}>
          <Toaster />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
