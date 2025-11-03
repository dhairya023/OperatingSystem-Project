"use client";

import { usePathname } from "next/navigation";
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
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/timetable", label: "Timetable", icon: CalendarDays },
  { href: "/subjects", label: "Subjects", icon: BookCopy },
  { href: "/assignments", label: "Assignments", icon: BookCheck },
  { href: "/exams", label: "Exams", icon: GraduationCap },
  { href: "/attendance", label: "Attendance", icon: UserCheck },
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
                <a href={item.href}>
                  <item.icon className={isActive ? 'neon-icon' : ''} />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
