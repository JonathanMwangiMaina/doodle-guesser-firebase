import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Keep for general toast notifications if any

export const metadata: Metadata = {
  title: 'Doodle Guesser',
  description: 'An interactive doodling app with AI guessing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <div
          className="fixed inset-0 -z-10 opacity-10"
          style={{
            backgroundImage: "url('https://placehold.co/100x100.png')", // This will be a tiny gray square repeated.
            backgroundRepeat: 'repeat',
          }}
          data-ai-hint="smiley face doodle pattern" // Hint for actual image generation
        ></div>
        <main className="flex-grow">
          {children}
        </main>
        <Toaster /> {/* Retained for potential future general app notifications */}
      </body>
    </html>
  );
}
