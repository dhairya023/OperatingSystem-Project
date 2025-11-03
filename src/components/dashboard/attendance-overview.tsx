"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAttendancePercentage } from "@/lib/placeholder-data"
import { Label, Pie, PieChart, RadialBar, RadialBarChart } from "recharts"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import AttendanceCalendar from "../attendance/attendance-calendar"
import { useMemo } from "react"
import { MOCK_CLASSES } from "@/lib/placeholder-data"
import type { DailyAttendance } from "@/lib/types"
import { addDays, startOfDay } from "date-fns"


export default function AttendanceOverview() {
    const dailyAttendance: DailyAttendance[] = useMemo(() => {
    const attendanceMap = new Map<string, { present: number; total: number }>();

    MOCK_CLASSES.forEach((session) => {
      const dateStr = startOfDay(session.date).toISOString();
      const entry = attendanceMap.get(dateStr) || { present: 0, total: 0 };
      entry.total++;
      if (session.attended) {
        entry.present++;
      }
      attendanceMap.set(dateStr, entry);
    });

    // Add some random data for vis
    for (let i = 1; i < 90; i++) {
        const date = addDays(new Date(), -i);
         if (date.getDay() === 0 || date.getDay() === 6) continue;
        const dateStr = startOfDay(date).toISOString();
        if (Math.random() > 0.3) {
            const total = Math.floor(Math.random() * 2) + 1;
            const present = Math.floor(Math.random() * total) + 1;
            attendanceMap.set(dateStr, { present, total });
        }
    }


    return Array.from(attendanceMap.entries()).map(([date, counts]) => ({
      date: new Date(date),
      present: counts.present,
      total: counts.total,
    }));
  }, []);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
        <CardDescription>A quick look at your attendance.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        <AttendanceCalendar data={dailyAttendance} days={90} cellSize={12} />
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <Button variant="outline" className="w-full" asChild>
            <Link href="/attendance">
                View Details <ArrowRight className="ml-2" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
