
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
  
  const statusCardStyles = {
    attended: `bg-green-500/10 border-green-500/30`,
    missed: `bg-red-500/10 border-red-500/30`,
    holiday: `bg-gray-500/10 border-gray-500/30`,
    cancelled: `bg-yellow-500/10 border-yellow-500/30`,
  }

  return (
    <Card className={cn("p-4 flex items-center justify-between gap-4", session.status && statusCardStyles[session.status])}>
        <div className="flex items-center gap-3">
            <div className="w-1.5 h-16 rounded-full shrink-0" style={{ backgroundColor: color }}></div>
            <div>
                <h3 className="font-bold text-base">{session.subject}</h3>
                <p className="text-sm text-foreground/80">{session.teacher}</p>
                <div className="flex items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3"/> {session.startTime} - {session.endTime}</span>
                    {session.room && <span className="flex items-center gap-1.5"><DoorClosed className="w-3 h-3"/> {session.room}</span>}
                </div>
            </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-1.5 shrink-0">
            <Button size="sm" variant={session.status === 'attended' ? 'default' : 'outline'} className={cn("h-7 w-7 text-xs rounded-full", session.status === 'attended' && 'bg-green-500 text-white hover:bg-green-600')} onClick={() => handleStatusChange('attended')}>P</Button>
            <Button size="sm" variant={session.status === 'missed' ? 'destructive' : 'outline'} className={cn("h-7 w-7 text-xs rounded-full", session.status === 'missed' && 'bg-red-500 text-white hover:bg-red-600')} onClick={() => handleStatusChange('missed')}>A</Button>
            <Button size="sm" variant={session.status === 'holiday' ? 'secondary' : 'outline'} className={cn("h-7 w-7 text-xs rounded-full", session.status === 'holiday' && 'bg-gray-500 text-white hover:bg-gray-600')} onClick={() => handleStatusChange('holiday')}>H</Button>
            <Button size="sm" variant={session.status === 'cancelled' ? 'secondary' : 'outline'} className={cn("h-7 w-7 text-xs rounded-full", session.status === 'cancelled' && 'bg-yellow-500 text-white hover:bg-yellow-600')} onClick={() => handleStatusChange('cancelled')}>C</Button>
        </div>
    </Card>
  );
};

export default DailyAttendanceCard;
