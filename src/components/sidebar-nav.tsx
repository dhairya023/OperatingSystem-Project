
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CalendarDays,
  BookCheck,
  GraduationCap,
  UserCheck,
  BookCopy,
  User,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/timetable", label: "Timetable", icon: CalendarDays },
  { href: "/attendance", label: "Attendance", icon: UserCheck },
  { href: "/assignments", label: "Assignments", icon: BookCheck },
  { href: "/exams", label: "Exams", icon: GraduationCap },
  { href: "/subjects", label: "Subjects", icon: BookCopy },
  { href: "/profile", label: "Profile", icon: User },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={{ children: item.label, side: "right", align: "center" }}
              >
                <Link href={item.href}>
                  <item.icon className={isActive ? 'neon-icon' : ''} />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
