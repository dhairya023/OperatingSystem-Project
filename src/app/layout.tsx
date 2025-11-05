
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
    // Wait until both Firebase auth and the app's data loading are fully resolved.
    if (isUserLoading || isDataLoading) {
      return;
    }

    const isProfileSetupPage = pathname === '/profile-setup';
    const isLoginPage = pathname === '/login';

    if (user) {
      // User is logged in.
      if (profile?.profileCompleted) {
        // Profile is complete, user should not be on login or setup page.
        if (isLoginPage || isProfileSetupPage) {
          router.push('/');
        }
      } else {
        // Profile is not complete, user must be on the setup page.
        if (!isProfileSetupPage) {
          router.push('/profile-setup');
        }
      }
    } else {
      // User is not logged in, they should only be on the login page.
      if (!isLoginPage) {
        router.push('/login');
      }
    }
  }, [user, profile, isUserLoading, isDataLoading, pathname, router]);


  // Determine if we should show the final content.
  // This prevents content flashes during initial load or redirects.
  const showContent = isSplashTimingComplete && !isUserLoading && !isDataLoading && (
    (user && profile?.profileCompleted) || // Regular authenticated user in the app
    (user && !profile?.profileCompleted && pathname === '/profile-setup') || // User is on the required profile setup page
    (!user && pathname === '/login') // User is on the login page
  );
  

  // While the app is not ready or content is not ready to be shown, we show the splash screen.
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
