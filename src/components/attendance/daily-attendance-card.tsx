
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

  return (
    <Card
      className={cn(
        'p-3 transition-all w-full max-w-full',
        session.status && statusCardStyles[session.status]
      )}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Info Section */}
        <div className="flex items-start gap-3 w-full flex-grow min-w-0">
          <div
            className="w-1.5 h-full rounded-full shrink-0 self-stretch"
            style={{ backgroundColor: color }}
          ></div>
          <div className="flex-grow min-w-0">
            <h3 className="font-bold text-base truncate">{session.subject}</h3>
            <p className="text-sm text-foreground/80 truncate">{session.teacher}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> {session.startTime} - {session.endTime}
              </span>
              {session.room && (
                <span className="flex items-center gap-1.5">
                  <DoorClosed className="w-3 h-3" /> {session.room}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Button Section */}
        <div
          className="flex items-center shrink-0 gap-1.5"
        >
          <Button
            size="icon"
            variant={session.status === 'attended' ? 'default' : 'outline'}
            className={cn(
              'h-8 w-8 text-xs',
              session.status === 'attended' && 'bg-green-500 text-white hover:bg-green-600'
            )}
            onClick={() => handleStatusChange('attended')}
          >
            P
          </Button>

          <Button
            size="icon"
            variant={session.status === 'missed' ? 'destructive' : 'outline'}
            className={cn(
              'h-8 w-8 text-xs',
              session.status === 'missed' && 'bg-red-500 text-white hover:bg-red-600'
            )}
            onClick={() => handleStatusChange('missed')}
          >
            A
          </Button>

          <Button
            size="icon"
            variant={session.status === 'holiday' ? 'secondary' : 'outline'}
            className={cn(
              'h-8 w-8 text-xs',
              session.status === 'holiday' && 'bg-gray-500 text-white hover:bg-gray-600'
            )}
            onClick={() => handleStatusChange('holiday')}
          >
            H
          </Button>

          <Button
            size="icon"
            variant={session.status === 'cancelled' ? 'secondary' : 'outline'}
            className={cn(
              'h-8 w-8 text-xs',
              session.status === 'cancelled' && 'bg-yellow-500 text-white hover:bg-yellow-600'
            )}
            onClick={() => handleStatusChange('cancelled')}
          >
            C
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DailyAttendanceCard;
