
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
  const { isDataLoading, profile } = useAppContext();
  const [isSplashActive, setIsSplashActive] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // This effect handles showing the splash screen only on initial load.
  useEffect(() => {
    // Wait until both user and app data are done loading.
    if (!isUserLoading && !isDataLoading) {
      const timer = setTimeout(() => setIsSplashActive(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isUserLoading, isDataLoading]);

  // This effect handles the initial routing logic.
  useEffect(() => {
    // Don't do anything until all data is loaded.
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

  // Determine if we should show the splash screen or the content.
  // This prevents content flashes during initial load or redirects.
  const showContent = !isSplashActive && (
    (user && profile?.profileCompleted) || // Regular authenticated user
    pathname === '/login' || // Login page is always accessible
    (user && !profile?.profileCompleted && pathname === '/profile-setup') // Profile setup is accessible
  );

  if (isSplashActive) {
    return <SplashScreen />;
  }
  
  if (!showContent) {
    // Render nothing while waiting for auth state or during redirects to prevent flashes.
    return null;
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
