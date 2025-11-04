
'use client';

import type { Metadata } from 'next';
import { useState, useEffect } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/app-context';
import { FirebaseClientProvider } from '@/firebase';
import { useAppContext } from '@/context/app-context';
import { useFirebase } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import SplashScreen from '@/components/splash-screen';

// This component is necessary to use client-side hooks like useState, useEffect, and the context hooks
// within the body, while still allowing the RootLayout to provide metadata.
function AppBody({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useFirebase();
  const { isDataLoading, profile } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  const [isSplashTimingComplete, setIsSplashTimingComplete] = useState(false);

  // This effect handles the minimum splash screen display time.
  useEffect(() => {
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      setIsSplashTimingComplete(true);
      return;
    }
    
    // Show splash screen for at least 1.2 seconds
    const timer = setTimeout(() => {
      setIsSplashTimingComplete(true);
      sessionStorage.setItem('splashShown', 'true');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // This effect handles the initial routing logic.
  useEffect(() => {
    // Wait until firebase auth is resolved and app data has been attempted to load.
    if (isUserLoading || isDataLoading) return;

    // If the user is not logged in, and they are not on a public page, redirect to login.
    if (!user && pathname !== '/login' && pathname !== '/profile-setup') {
      router.push('/login');
    }
    // If the user is logged in but hasn't completed their profile, send them to setup.
    else if (user && !profile?.profileCompleted && pathname !== '/profile-setup') {
      router.push('/profile-setup');
    }
    // If the user is logged in, profile is complete, but they land on a public-only page, send to dashboard.
    else if (user && profile?.profileCompleted && (pathname === '/login' || pathname === '/profile-setup')) {
      router.push('/');
    }

  }, [user, profile, isUserLoading, isDataLoading, pathname, router]);

  // Determine if the app is ready to be shown.
  // It's ready when the minimum splash time is over AND the initial data loading/routing checks are done.
  const isAppReady = isSplashTimingComplete && !isUserLoading && !isDataLoading;

  // Determine if we should show the final content.
  // This prevents content flashes during initial load or redirects.
  const showContent = isAppReady && (
    (user && profile?.profileCompleted) || // Regular authenticated user
    pathname === '/login' || // Login page is always accessible
    (user && !profile?.profileCompleted && pathname === '/profile-setup') // Profile setup is accessible
  );

  // While the app is not ready, we show the splash screen.
  // This prevents the black screen flash.
  if (!showContent) {
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
        <meta property="og:title" content="Grad" />
        <meta property="og:site_name" content="Grad" />
        <meta property="og:description" content="Your academic life, organized." />
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
