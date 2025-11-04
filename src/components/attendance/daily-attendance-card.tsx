'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';
import type { ClassSession } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, DoorClosed } from 'lucide-react';
import { Separator } from '../ui/separator';

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
    <Card className={cn("p-4 flex flex-col gap-3", session.status && statusCardStyles[session.status])}>
        <div className="flex items-start gap-3">
            <div className="w-1.5 h-full rounded-full shrink-0 self-stretch" style={{ backgroundColor: color }}></div>
            <div className='flex-grow'>
                <h3 className="font-bold text-base">{session.subject}</h3>
                <p className="text-sm text-foreground/80">{session.teacher}</p>
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3"/> {session.startTime} - {session.endTime}</span>
                    {session.room && <span className="flex items-center gap-1.5"><DoorClosed className="w-3 h-3"/> {session.room}</span>}
                </div>
            </div>
        </div>
        <Separator />
        <div className="flex items-center justify-around gap-1.5 w-full">
            <Button size="sm" variant={session.status === 'attended' ? 'default' : 'outline'} className={cn("h-8 flex-1 text-xs", session.status === 'attended' && 'bg-green-500 text-white hover:bg-green-600')} onClick={() => handleStatusChange('attended')}>
                <span className="hidden sm:inline">Present</span>
                <span className="sm:hidden">P</span>
            </Button>
            <Button size="sm" variant={session.status === 'missed' ? 'destructive' : 'outline'} className={cn("h-8 flex-1 text-xs", session.status === 'missed' && 'bg-red-500 text-white hover:bg-red-600')} onClick={() => handleStatusChange('missed')}>
                <span className="hidden sm:inline">Absent</span>
                <span className="sm:hidden">A</span>
            </Button>
            <Button size="sm" variant={session.status === 'holiday' ? 'secondary' : 'outline'} className={cn("h-8 flex-1 text-xs", session.status === 'holiday' && 'bg-gray-500 text-white hover:bg-gray-600')} onClick={() => handleStatusChange('holiday')}>
                <span className="hidden sm:inline">Holiday</span>
                <span className="sm:hidden">H</span>
            </Button>
            <Button size="sm" variant={session.status === 'cancelled' ? 'secondary' : 'outline'} className={cn("h-8 flex-1 text-xs", session.status === 'cancelled' && 'bg-yellow-500 text-white hover:bg-yellow-600')} onClick={() => handleStatusChange('cancelled')}>
                <span className="hidden sm:inline">Cancel</span>
                <span className="sm:hidden">C</span>
            </Button>
        </div>
    </Card>
  );
};

export default DailyAttendanceCard;
