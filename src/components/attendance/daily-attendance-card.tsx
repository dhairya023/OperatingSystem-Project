
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

  const handleStatusChange = (status: 'attended' | 'missed' | 'holiday' | 'cancelled') => {
    updateClass({ ...session, status }, 'single');
  };

  const statusStyles = {
    attended: 'bg-green-500 hover:bg-green-600 text-white',
    missed: 'bg-red-500 hover:bg-red-600 text-white',
    holiday: 'bg-gray-500 hover:bg-gray-600 text-white',
    cancelled: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  };
  
  const statusCardStyles = {
    attended: `bg-green-500/10 border-green-500/30`,
    missed: `bg-red-500/10 border-red-500/30`,
    holiday: `bg-gray-500/10 border-gray-500/30`,
    cancelled: `bg-yellow-500/10 border-yellow-500/30`,
  }

  return (
    <Card className={cn("p-4 flex flex-col gap-3", session.status && statusCardStyles[session.status])}>
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: color }}></div>
                <div>
                    <h3 className="font-bold">{session.subject}</h3>
                    <p className="text-sm text-foreground/80">{session.teacher}</p>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3"/> {session.startTime} - {session.endTime}</span>
                        {session.room && <span className="flex items-center gap-1.5"><DoorClosed className="w-3 h-3"/> {session.room}</span>}
                    </div>
                </div>
            </div>
        </div>
        <div className="flex items-center justify-end gap-1 shrink-0">
            <Button size="sm" variant={session.status === 'attended' ? 'default' : 'outline'} className={cn("h-7 w-7 text-xs", session.status === 'attended' && statusStyles.attended)} onClick={() => handleStatusChange('attended')}>P</Button>
            <Button size="sm" variant={session.status === 'missed' ? 'destructive' : 'outline'} className={cn("h-7 w-7 text-xs", session.status === 'missed' && statusStyles.missed)} onClick={() => handleStatusChange('missed')}>A</Button>
            <Button size="sm" variant={session.status === 'holiday' ? 'secondary' : 'outline'} className={cn("h-7 w-7 text-xs", session.status === 'holiday' && statusStyles.holiday)} onClick={() => handleStatusChange('holiday')}>H</Button>
            <Button size="sm" variant={session.status === 'cancelled' ? 'secondary' : 'outline'} className={cn("h-7 w-7 text-xs", session.status === 'cancelled' && statusStyles.cancelled)} onClick={() => handleStatusChange('cancelled')}>C</Button>
        </div>
    </Card>
  );
};

export default DailyAttendanceCard;
