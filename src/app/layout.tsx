
import type {Metadata} from 'next';
import './globals.css';
import {Navbar} from '@/components/layout/Navbar';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'NexusHire | Connecting Talent with Opportunity',
  description: 'The premium job board for students and innovative employers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
