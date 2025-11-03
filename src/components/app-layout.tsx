'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { GraduationCap } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import SplashScreen from './splash-screen';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useFirebase();
  const { isDataLoading, profile } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const [isSplashActive, setIsSplashActive] = useState(true);

  useEffect(() => {
    if (isUserLoading || isDataLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (user && !profile?.profileCompleted && pathname !== '/profile-setup') {
      router.push('/profile-setup');
    } else if (user && profile?.profileCompleted && pathname === '/profile-setup') {
      router.push('/');
    }

  }, [user, isUserLoading, isDataLoading, profile, pathname, router]);

  useEffect(() => {
    // Hide splash screen after the initial load is done.
    if (!isUserLoading && !(user && isDataLoading)) {
        // Wait for animation to complete
        const timer = setTimeout(() => setIsSplashActive(false), 1000); 
        return () => clearTimeout(timer);
    }
  }, [isUserLoading, isDataLoading, user]);


  const showLoadingContent = isUserLoading || (user && isDataLoading) || (user && !profile?.profileCompleted && pathname !== '/profile-setup');
  
  if (isSplashActive) {
      return <SplashScreen />;
  }

  // If user is not logged in and we are not on the login page, we show nothing to prevent flashes of content.
  if (!user) {
    return null;
  }
  
  if (showLoadingContent) {
      return null; // Show nothing, as splash screen has just finished or we are redirecting
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar className="border-r border-border/20">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold font-headline">ScholarSphere</h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-0">
            <SidebarNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
            {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
