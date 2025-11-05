
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarProvider, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarTrigger } from '@/components/ui/sidebar';
import { GraduationCap, LogOut } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { cn } from "@/lib/utils"
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
import { Button } from "@/components/ui/button"

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

  const isLoading = isUserLoading || (user && isDataLoading);
  
  if (isLoading || !user) {
      return null;
  }
  
  if (!profile?.profileCompleted && pathname !== '/profile-setup') {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-black">
        <Sidebar
          className="p-2"
          variant="inset"
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-card/50 backdrop-blur-md border border-border/40 rounded-3xl shadow-xl overflow-hidden"
          >
            <SidebarHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-2 p-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                        <GraduationCap className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-xl font-bold font-headline">Grad</h1>
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
                          <Link href={route.href}>
                            <SidebarMenuButton
                              className={cn(
                                "flex w-full items-center gap-4 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ease-out md:text-sm md:py-3 md:gap-3",
                                isActive
                                  ? "bg-black/50 text-white"
                                  : "text-muted-foreground hover:bg-black/20 hover:text-white"
                              )}
                              isActive={isActive}
                              tooltip={route.label}
                            >
                              <route.icon
                                className={cn(
                                  "h-5 w-5",
                                )}
                              />
                              <span>{route.label}</span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-border/40 mt-auto">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Avatar className="h-8 w-8">
                       <AvatarImage src={profile?.profilePhotoUrl} />
                       <AvatarFallback>{profile?.fullName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
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
                  variant="secondary"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
              )}
            </SidebarFooter>
          </div>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-y-auto bg-transparent text-white">
          <header className="md:hidden flex items-center justify-start mb-4 p-4 sticky top-0 bg-black/50 backdrop-blur-sm z-10">
            <SidebarTrigger />
          </header>
           <main className="flex-1">
            {children}
           </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
