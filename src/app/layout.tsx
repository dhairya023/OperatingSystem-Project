
'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/app-context';
import { FirebaseClientProvider } from '@/firebase';
import { useAppContext } from '@/context/app-context';
import { useFirebase } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { SkeletonAppLayout } from '@/components/skeletons/skeleton-app-layout';

function AppBody({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useFirebase();
  const { isDataLoading, profile } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading || isDataLoading) return;

    const isAuthPage = pathname === '/login' || pathname === '/profile-setup';

    if (!user && !isAuthPage) {
      router.replace('/login');
    } else if (user && !profile?.profileCompleted && pathname !== '/profile-setup') {
      router.replace('/profile-setup');
    } else if (user && profile?.profileCompleted && isAuthPage) {
      router.replace('/');
    }
  }, [user, profile, isUserLoading, isDataLoading, pathname, router]);


  const showContent = () => {
    if (isUserLoading || isDataLoading) return false;

    const isAuthPage = pathname === '/login' || pathname === '/profile-setup';

    if (!user && isAuthPage) return true;
    if (user && !profile?.profileCompleted && pathname === '/profile-setup') return true;
    if (user && profile?.profileCompleted && !isAuthPage) return true;

    return false;
  };

  if (!showContent()) {
    return <SkeletonAppLayout pathname={pathname} />;
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
