
'use client';
import { Card } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import type { ClassSession } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, DoorClosed } from 'lucide-react';
import { Button } from '../ui/button';

const DailyAttendanceCard = ({ session }: { session: ClassSession }) => {
  const { subjects, updateClassStatus } = useAppContext();
  const subject = subjects.find(s => s.name === session.subject);
  const color = subject?.color || '#A1A1AA';

  const statusCardStyles = {
    attended: 'bg-green-500/10 border-green-500/30',
    missed: 'bg-red-500/10 border-red-500/30',
    holiday: 'bg-gray-500/10 border-gray-500/30',
    cancelled: 'bg-yellow-500/10 border-yellow-500/30',
  };

  const handleStatusChange = (status: 'attended' | 'missed' | 'holiday' | 'cancelled') => {
    updateClassStatus(session.id, status);
  };

  const attendanceButtons: { status: 'attended' | 'missed' | 'holiday' | 'cancelled', label: string, style: string, variant: 'default' | 'destructive' | 'outline' | 'secondary' }[] = [
    { status: 'attended', label: 'P', style: 'bg-green-500 text-white hover:bg-green-600', variant: 'default'},
    { status: 'missed', label: 'A', style: 'bg-red-500 text-white hover:bg-red-600', variant: 'destructive'},
    { status: 'holiday', label: 'H', style: 'bg-gray-500 text-white hover:bg-gray-600', variant: 'secondary'},
    { status: 'cancelled', label: 'C', style: 'bg-yellow-500 text-white hover:bg-yellow-600', variant: 'secondary'},
  ]

  return (
    <Card
      className={cn(
        'p-3 transition-all w-full',
        session.status && statusCardStyles[session.status]
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Info Section */}
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <div
            className="w-1 rounded-full shrink-0 self-stretch mt-1"
            style={{ backgroundColor: color }}
          ></div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xs truncate">{session.subject}</h3>
            <p className="text-[10px] text-foreground/80 truncate">{session.teacher}</p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> {session.startTime} - {session.endTime}
              </span>
              {session.room && (
                <span className="flex items-center gap-1">
                  <DoorClosed className="w-2.5 h-2.5" /> {session.room}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Button Section */}
        <div className="flex items-center shrink-0 gap-1">
            {attendanceButtons.map(btn => (
                 <Button
                    key={btn.status}
                    size="icon"
                    variant={session.status === btn.status ? btn.variant : 'outline'}
                    className={cn(
                        'h-6 w-6 rounded-full text-[10px] font-semibold',
                        session.status === btn.status && btn.style
                    )}
                    onClick={() => handleStatusChange(btn.status)}
                    >
                    {btn.label}
                </Button>
            ))}
        </div>
      </div>
    </Card>
  );
};

export default DailyAttendanceCard;
