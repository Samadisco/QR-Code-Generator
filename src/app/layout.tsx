import type { Metadata } from 'next';
import { Geist_Sans } from 'next/font/google'; // Corrected import name
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist_Sans({ // Corrected usage
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// Assuming Geist_Mono is not explicitly used, can be removed if not needed.
// For simplicity, we'll just use Geist_Sans for the body.
// If Geist_Mono is needed elsewhere, it can be kept.

export const metadata: Metadata = {
  title: 'QR Code Suite',
  description: 'Generate and customize QR codes easily.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
