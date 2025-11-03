'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';
import type { ClassSession } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, DoorClosed } from 'lucide-react';

const DailyAttendanceCard = ({ session }: { session: ClassSession }) => {
  const { updateClass, subjects } = useAppContext();
  const subject = subjects.find(s => s.name === session.subject);
  const color = subject?.color || '#A1A1AA';

  const handleStatusChange = (status: 'attended' | 'missed' | 'holiday') => {
    updateClass({ ...session, status });
  };

  const statusStyles = {
    attended: {
      card: `bg-green-500/20 border-green-500/40`,
      button: 'bg-green-500 hover:bg-green-600 text-white',
    },
    missed: {
      card: `bg-red-500/20 border-red-500/40`,
      button: 'bg-red-500 hover:bg-red-600 text-white',
    },
    holiday: {
      card: `bg-gray-500/20 border-gray-500/40`,
      button: 'bg-gray-500 hover:bg-gray-600 text-white',
    },
  };

  return (
    <Card className={cn("p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4", statusStyles[session.status].card)}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
            <h3 className="font-bold text-lg">{session.subject}</h3>
        </div>
        <p className="text-sm text-foreground/80 pl-4">{session.teacher}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground pl-4">
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3"/> {session.startTime} - {session.endTime}</span>
            {session.room && <span className="flex items-center gap-1.5"><DoorClosed className="w-3 h-3"/> {session.room}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={session.status === 'attended' ? 'default' : 'outline'}
          className={cn(session.status === 'attended' && statusStyles.attended.button)}
          onClick={() => handleStatusChange('attended')}
        >
          P
        </Button>
        <Button
          size="sm"
          variant={session.status === 'missed' ? 'destructive' : 'outline'}
          className={cn(session.status === 'missed' && statusStyles.missed.button)}
          onClick={() => handleStatusChange('missed')}
        >
          A
        </Button>
        <Button
          size="sm"
          variant={session.status === 'holiday' ? 'secondary' : 'outline'}
          className={cn(session.status === 'holiday' && statusStyles.holiday.button)}
          onClick={() => handleStatusChange('holiday')}
        >
          X
        </Button>
      </div>
    </Card>
  );
};

export default DailyAttendanceCard;
