'use client';
import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { addDays, subDays, format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ClassSession } from '@/lib/types';

const TimetableCard = ({ session }: { session: ClassSession }) => {
  const { subjects } = useAppContext();
  const subject = subjects.find(s => s.name === session.subject);
  const color = subject?.color || '#A1A1AA'; // A default gray color

  return (
    <Card
      className="p-4 flex flex-col gap-2 rounded-xl"
      style={{ backgroundColor: `${color}40`, borderColor: `${color}80` }}
    >
      <h3 className="font-bold text-lg">{session.subject}</h3>
      <p className="text-sm text-foreground/80">{session.time}</p>
      {session.room && (
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          <MapPin className="w-4 h-4" />
          <span>{session.room}</span>
        </div>
      )}
    </Card>
  );
};

export default function TimetablePage() {
  const { subjects, classes } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };
  
  const getRelativeDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE');
  }

  const dailyClasses = classes
    .filter((c) => format(c.date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd'))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (subjects.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader title="Timetable" description="Manage your class schedule." />
        <div className="flex h-[60vh] items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">No subjects found.</p>
            <p className="text-sm text-muted-foreground/80">Add subjects in the 'Subjects' page to build your timetable.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Timetable" description="Your weekly class schedule." />
      
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handlePrevDay}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="text-center">
          <p className="text-xl font-bold">{format(currentDate, 'EEEE')}</p>
          <p className="text-muted-foreground text-sm">{getRelativeDate(currentDate)}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleNextDay}>
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {dailyClasses.length > 0 ? (
        <div className="flex flex-col gap-4">
          {dailyClasses.map(session => (
            <TimetableCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="flex h-[50vh] flex-col items-center justify-center text-center bg-card/50 rounded-lg">
          <p className="text-muted-foreground">No classes scheduled for this day.</p>
        </div>
      )}
    </div>
  );
}
