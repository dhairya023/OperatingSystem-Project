
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarInset, 
  SidebarProvider, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GraduationCap, LogOut } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import {
  LayoutDashboard,
  CalendarDays,
  BookCheck,
  UserCheck,
  BookCopy,
  User,
  BarChart,
  GraduationCap as ExamIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SplashScreen from './splash-screen';
import { SkeletonSidebar } from './skeletons/skeleton-sidebar';
import { SkeletonHeader } from './skeletons/skeleton-header';

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/timetable", label: "Timetable", icon: CalendarDays },
  { href: "/attendance", label: "Attendance", icon: UserCheck },
  { href: "/assignments", label: "Assignments", icon: BookCheck },
  { href: "/exams", label: "Exams", icon: ExamIcon },
  { href: "/grades", label: "Grades", icon: BarChart },
  { href: "/subjects", label: "Subjects", icon: BookCopy },
  { href: "/profile", label: "Profile", icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useFirebase();
  const { isDataLoading, profile, logoutUser, headerState } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

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

  const getInitials = (name?: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar
          className="p-2"
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-card rounded-3xl shadow-neumorphic dark:shadow-dark-neumorphic overflow-hidden"
          >
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3 p-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm">
                        <GraduationCap className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold font-headline">Grad</h1>
                </div>
            </SidebarHeader>

            <SidebarContent className="flex-1 px-3 py-4 overflow-y-auto">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navItems.map((route) => {
                      const isActive = pathname === route.href
                      return (
                        <SidebarMenuItem key={route.href}>
                                <SidebarMenuButton
                                  asChild
                                  variant={isActive ? 'outline' : 'ghost'}
                                  className={cn(
                                    "flex w-full items-center gap-4 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ease-in-out md:text-sm md:py-3 md:gap-3 text-muted-foreground",
                                    isActive && "font-semibold text-primary border-transparent shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset"
                                  )}
                                >
                                  <Link href={route.href}>
                                    <route.icon
                                      className={cn(
                                        "h-5 w-5",
                                      )}
                                    />
                                    <span>{route.label}</span>
                                  </Link>
                                </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 mt-auto">
              {user ? (
                <div className="flex items-center justify-between p-2 rounded-xl shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset">
                  <div className="flex items-center gap-3">
                     <Avatar className="h-8 w-8 shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm">
                       <AvatarImage src={profile?.profilePhotoUrl} />
                       <AvatarFallback>{getInitials(profile?.fullName)}</AvatarFallback>
                     </Avatar>
                    <span className="text-sm text-foreground truncate">
                      {profile?.fullName || "User"}
                    </span>
                  </div>
                  <Button
                    onClick={logoutUser}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
              )}
            </SidebarFooter>
          </div>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-y-auto bg-transparent">
          <header className="flex items-center justify-between p-4 md:p-6 lg:p-8 sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className='hidden md:block'>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight font-headline truncate">
                  {headerState.title}
                </h1>
                {headerState.description && <p className="text-sm text-muted-foreground">{headerState.description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {headerState.children}
            </div>
          </header>
           <main className="flex-1">
            {children}
           </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
