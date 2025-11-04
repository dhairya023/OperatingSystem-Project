
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarProvider, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { GraduationCap, LogOut } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import SplashScreen from './splash-screen';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useFirebase();
  const { isDataLoading, profile, logoutUser } = useAppContext();
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
    } else if (user && profile?.profileCompleted && (pathname === '/profile-setup' || pathname === '/login')) {
      router.push('/');
    }

  }, [user, isUserLoading, isDataLoading, profile, pathname, router]);

  // Determine if we should show a loading state or content.
  // This helps prevent flashes of content during redirects or initial data load.
  const isRedirecting = 
    (isUserLoading || (user && isDataLoading)) || 
    (!user && pathname !== '/login') || 
    (user && !profile?.profileCompleted && pathname !== '/profile-setup') ||
    (user && profile?.profileCompleted && (pathname === '/login' || pathname === '/profile-setup'));

  // If we are redirecting or loading critical data, render nothing to avoid content flashes.
  if (isRedirecting) {
      return null;
  }
  
  // If not logged in, and we are on a page that doesn't need the full AppLayout (like login)
  // we can just show the children directly. This case is mostly handled by redirection, but
  // it is a safe fallback.
  if (!user) {
    return <>{children}</>;
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
              <h1 className="text-xl font-bold font-headline">Grad</h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-0">
            <SidebarNav />
          </SidebarContent>
           <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logoutUser} tooltip={{ children: 'Log Out', side: 'right', align: 'center' }}>
                  <LogOut />
                  <span>Log Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
