
'use client';

import type { Metadata } from 'next';
import { useState, useEffect } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/app-context';
import { FirebaseClientProvider } from '@/firebase';
import SplashScreen from '@/components/splash-screen';
import { useAppContext } from '@/context/app-context';
import { useFirebase } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';

// This component is necessary to use client-side hooks like useState, useEffect, and the context hooks
// within the body, while still allowing the RootLayout to provide metadata.
function AppBody({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useFirebase();
  const { isDataLoading } = useAppContext();
  const [isSplashActive, setIsSplashActive] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // This effect handles showing the splash screen only on initial load.
  useEffect(() => {
    if (!isUserLoading && !isDataLoading) {
      const timer = setTimeout(() => setIsSplashActive(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isUserLoading, isDataLoading, user]);
  
  // This logic handles routing and prevents content flashes, but doesn't control the splash screen.
  useEffect(() => {
    if (isUserLoading || isDataLoading) return;

    if (!user && pathname !== '/login' && pathname !== '/profile-setup') {
        router.push('/login');
    }
  }, [user, isUserLoading, isDataLoading, pathname, router]);


  if (isSplashActive) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
        <title>Grad</title>
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseClientProvider>
            <AppProvider>
                <AppBody>
                    {children}
                </AppBody>
            </AppProvider>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
