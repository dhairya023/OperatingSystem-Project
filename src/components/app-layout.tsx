'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { GraduationCap } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useAppContext } from '@/context/app-context';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useFirebase();
  const { isDataLoading, profile } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

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

  const showLoading = isUserLoading || (user && isDataLoading) || (user && !profile?.profileCompleted && pathname !== '/profile-setup');

  if (showLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="p-8 space-y-4 w-full max-w-lg">
              <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                      <Skeleton className="h-6 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                  </div>
              </div>
              <div className="space-y-2 pt-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
              </div>
          </div>
      </div>
    )
  }

  // If user is not logged in and we are not on the login page, we show nothing to prevent flashes of content.
  if (!user) {
    return null;
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
