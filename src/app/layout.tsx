import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist_Sans
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ // Changed from Geist_Sans to Inter
  variable: '--font-inter', // Updated CSS variable name
  subsets: ['latin'],
});

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
    <html lang="en" className={inter.variable}> {/* Applied font variable to html tag */}
      <body className="font-sans antialiased"> {/* Tailwind's font-sans will use the variable */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
