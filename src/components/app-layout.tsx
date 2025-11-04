
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

  // Determine if we are in a state where content shouldn't be shown yet.
  const isLoading = isUserLoading || (user && isDataLoading);
  
  // If we are loading data, or if the user is not yet available, don't render the layout.
  // The RootLayout will handle showing the splash screen or nothing.
  if (isLoading || !user) {
      return null;
  }
  
  // If the user is logged in, but the profile isn't complete, and they aren't on the setup page,
  // we also render nothing to prevent a flash of the wrong content before the redirect happens.
  if (!profile?.profileCompleted && pathname !== '/profile-setup') {
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
