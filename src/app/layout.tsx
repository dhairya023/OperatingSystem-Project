
'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/app-context';
import { FirebaseClientProvider } from '@/firebase';
import { useAppContext } from '@/context/app-context';
import { useFirebase } from '@/firebase';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SplashScreen from '@/components/splash-screen';
import { SkeletonSidebar } from '@/components/skeletons/skeleton-sidebar';
import { SkeletonHeader } from '@/components/skeletons/skeleton-header';

function AppBody({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useFirebase();
  const { isDataLoading, profile } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isUserLoading || isDataLoading) return;

    const isAuthPage = pathname === '/login' || pathname === '/profile-setup';
    const isImporting = pathname === '/timetable' && searchParams.has('importCode');
    
    if (isImporting) return; // Don't redirect if we are importing

    if (!user && !isAuthPage) {
      router.replace('/login');
    } else if (user && !profile?.profileCompleted && pathname !== '/profile-setup') {
        const importCode = searchParams.get('importCode');
        router.replace(`/profile-setup${importCode ? `?importCode=${importCode}` : ''}`);
    } else if (user && profile?.profileCompleted && isAuthPage) {
      const importCode = searchParams.get('importCode');
      router.replace(importCode ? `/timetable?importCode=${importCode}` : '/');
    }
  }, [user, profile, isUserLoading, isDataLoading, pathname, router, searchParams]);


  const showContent = () => {
    if (isUserLoading || isDataLoading) return false;

    const isAuthPage = pathname === '/login' || pathname === '/profile-setup';
    const isImporting = pathname === '/timetable' && searchParams.has('importCode');
    
    if (!user && (isAuthPage || isImporting)) return true;
    if (user && !profile?.profileCompleted && pathname === '/profile-setup') return true;
    if (user && profile?.profileCompleted && !isAuthPage) return true;

    return false;
  };

  if (!showContent()) {
    return (
       <div className="flex h-screen bg-background text-foreground">
        <div className="w-[17rem] p-2 hidden md:block">
            <SkeletonSidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-transparent flex flex-col">
            <SkeletonHeader />
            <div className="flex-1 flex items-center justify-center">
              <SplashScreen />
            </div>
        </main>
    </div>
    );
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

    