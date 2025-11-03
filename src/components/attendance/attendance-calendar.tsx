'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { DailyAttendance } from '@/lib/types';
import { startOfWeek, startOfDay, addDays, format, getDay } from 'date-fns';

type AttendanceCalendarProps = {
  data: DailyAttendance[];
  days?: number;
  cellSize?: number;
};

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getLevelColor = (level: number) => {
  switch (level) {
    case 0:
      return 'bg-muted/30';
    case 1:
      return 'bg-primary/20';
    case 2:
      return 'bg-primary/40';
    case 3:
      return 'bg-primary/60';
    case 4:
      return 'bg-primary/80';
    case 5:
      return 'bg-primary';
    default:
      return 'bg-muted/30';
  }
};

export default function AttendanceCalendar({ data, days = 180, cellSize = 14 }: AttendanceCalendarProps) {
  const today = startOfDay(new Date());
  const startDate = startOfWeek(addDays(today, -days + 1));

  const attendanceMap = new Map<string, { present: number; total: number }>();
  data.forEach((d) => attendanceMap.set(startOfDay(d.date).toISOString(), d));

  const cells = Array.from({ length: days }).map((_, i) => {
    const date = addDays(startDate, i);
    if (date > today) return { date, level: -1 };

    const attendance = attendanceMap.get(date.toISOString());
    if (!attendance) return { date, level: 0 };

    const percentage = attendance.total > 0 ? (attendance.present / attendance.total) * 100 : 0;
    let level = 0;
    if (percentage > 0) level = 1;
    if (percentage >= 25) level = 2;
    if (percentage >= 50) level = 3;
    if (percentage >= 75) level = 4;
    if (percentage === 100) level = 5;

    return { date, level, ...attendance };
  });

  const weekDayCells = Array.from({ length: 7 }).map((_, i) => {
    // We want to show only Mon, Wed, Fri
    if (i % 2 !== 1) return <div key={`wd-${i}`} style={{ height: cellSize, minWidth: cellSize }} />;
    return (
      <div key={`wd-${i}`} className="text-xs text-muted-foreground" style={{ height: cellSize, minWidth: cellSize }}>
        {WEEK_DAYS[i]}
      </div>
    );
  });
  
  const getMonthLabel = (date: Date, firstDayOfMonth: number) => {
    // show month label only on first week of month
    if (firstDayOfMonth > 7) return null;
    return <div className="text-xs text-muted-foreground absolute -top-4">{format(date, 'MMM')}</div>
  }

  const numWeeks = Math.ceil(days / 7);
  const monthLabels = Array.from({ length: numWeeks }).map((_, weekIndex) => {
    const firstDayOfWeek = addDays(startDate, weekIndex * 7);
    const firstDayOfMonth = firstDayOfWeek.getDate();
    return <div key={`ml-${weekIndex}`} style={{ minWidth: cellSize, position: "relative" }}>{getMonthLabel(firstDayOfWeek, firstDayOfMonth)}</div>
  })

  return (
    <TooltipProvider>
      <div className="flex justify-center">
        <div className="flex flex-col gap-1" style={{ width: 'min-content' }}>
          <div className="flex gap-1" style={{ paddingLeft: cellSize + 4 }}>
            {monthLabels}
          </div>
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 justify-between pr-1">{weekDayCells}</div>
            <div className="flex flex-col flex-wrap gap-1" style={{ height: (cellSize + 4) * 7 - 4}}>
              {cells.map(({ date, level, present, total }, i) => {
                  if (level === -1) {
                      return <div key={i} style={{ width: cellSize, height: cellSize }} />;
                  }
                  
                  return (
                      <Tooltip key={i}>
                          <TooltipTrigger asChild>
                              <div
                                  className={cn('rounded-sm', getLevelColor(level))}
                                  style={{ width: cellSize, height: cellSize }}
                              />
                          </TooltipTrigger>
                          <TooltipContent>
                              {level === 0 ? (
                                  <p>{format(date, 'PPP')} - No classes</p>
                              ) : (
                                  <p>
                                      {format(date, 'PPP')} - Attended {present} of {total} classes
                                  </p>
                              )}
                          </TooltipContent>
                      </Tooltip>
                  )
              })}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
