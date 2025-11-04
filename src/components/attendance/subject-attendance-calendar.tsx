
'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, getDate, isSameMonth, addMonths, subMonths, isToday, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClassSession } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type SubjectAttendanceCalendarProps = {
  classes: ClassSession[];
  isMini?: boolean;
  viewingDate: Date;
  setViewingDate: (date: Date) => void;
};

const statusColors = {
  attended: 'bg-green-500/80 text-white',
  missed: 'bg-red-500/80 text-white',
  holiday: 'bg-gray-700 text-white',
  cancelled: 'bg-yellow-500/80 text-black',
  default: 'bg-card',
};

const statusRingColors = {
    attended: 'ring-green-500/50',
    missed: 'ring-red-500/50',
    holiday: 'ring-gray-500/50',
    cancelled: 'ring-yellow-500/50',
    default: 'ring-transparent',
}


export default function SubjectAttendanceCalendar({ classes, isMini = false, viewingDate, setViewingDate }: SubjectAttendanceCalendarProps) {
  const [calendarMonth, setCalendarMonth] = useState(viewingDate);

  const firstDay = startOfMonth(calendarMonth);
  const lastDay = endOfMonth(calendarMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
  const startingDay = getDay(firstDay);

  const classesByDate = classes.reduce((acc, cls) => {
    const dateKey = format(new Date(cls.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(cls);
    return acc;
  }, {} as Record<string, ClassSession[]>);

  const handlePrevMonth = () => setCalendarMonth(subMonths(calendarMonth, 1));
  const handleNextMonth = () => setCalendarMonth(addMonths(calendarMonth, 1));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isMini) {
    return (
        <div className="w-full">
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                {weekDays.map((day) => <div key={day} className="w-full aspect-square flex items-center justify-center">{day.charAt(0)}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 mt-1">
                {Array.from({ length: startingDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {daysInMonth.map((day) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayClasses = classesByDate[dateKey];
                    const status = dayClasses?.[0]?.status || 'default';
                    return (
                        <div key={day.toString()} className={cn(
                            "w-full aspect-square rounded-full flex items-center justify-center text-xs",
                            isToday(day) && "ring-1 ring-primary ring-offset-1 ring-offset-background",
                        )}>
                            {getDate(day)}
                        </div>
                    );
                })}
            </div>
        </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{format(calendarMonth, 'MMMM yyyy')}</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {weekDays.map((day) => <div key={day}>{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1 mt-2">
          {Array.from({ length: startingDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {daysInMonth.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayClasses = classesByDate[dateKey];
            const status = dayClasses?.[0]?.status;

            return (
              <Tooltip key={day.toString()}>
                <TooltipTrigger asChild>
                    <div
                        onClick={() => setViewingDate(day)}
                        className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border text-xs',
                         isSameDay(day, viewingDate) && 'border-primary border-2',
                        !isSameMonth(day, calendarMonth) && 'text-muted-foreground',
                         status && statusColors[status]
                        )}
                    >
                        {getDate(day)}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{format(day, 'PPP')}</p>
                    {dayClasses && dayClasses.length > 0 ? (
                        dayClasses.map(dc => (
                             <p key={dc.id} className='text-xs'>{dc.subject}: {dc.status}</p>
                        ))
                    ): (
                        <p className='text-xs'>No classes</p>
                    )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
