
'use client';
import PageHeader from '@/components/page-header';
import { MOCK_CLASSES, MOCK_SUBJECTS_ATTENDANCE } from '@/lib/placeholder-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AttendanceCalendar from '@/components/attendance/attendance-calendar';
import { useMemo } from 'react';
import type { DailyAttendance } from '@/lib/types';
import { addDays, startOfDay } from 'date-fns';

export default function AttendancePage() {
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
    for (let i = 1; i < 180; i++) {
        const date = addDays(new Date(), -i);
        const dateStr = startOfDay(date).toISOString();
        if (Math.random() > 0.3) {
            const total = Math.floor(Math.random() * 4) + 1;
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
    <div className="flex flex-col gap-8">
      <PageHeader title="Attendance" description="Track your attendance for all subjects." />

      <Card>
        <CardHeader>
          <CardTitle>Attendance Calendar</CardTitle>
          <CardDescription>Your daily attendance summary for the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceCalendar data={dailyAttendance} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Attendance</CardTitle>
          <CardDescription>Detailed attendance for each subject.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {MOCK_SUBJECTS_ATTENDANCE.map((subject) => {
            const percentage = subject.total > 0 ? Math.round((subject.attended / subject.total) * 100) : 0;
            return (
              <div key={subject.subject} className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{subject.subject}</span>
                  <span className="text-muted-foreground">
                    {subject.attended} / {subject.total} classes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={percentage} className="h-2" />
                  <span className="text-xs font-semibold text-primary">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
