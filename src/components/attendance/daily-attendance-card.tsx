
'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ClassSession } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, DoorClosed } from 'lucide-react';

const DailyAttendanceCard = ({
  session,
  onStatusChange,
}: {
  session: ClassSession;
  onStatusChange: (sessionId: string, status: ClassSession['status']) => void;
}) => {
  const statusCardStyles = {
    attended: 'bg-green-500/10 border-green-500/30',
    missed: 'bg-red-500/10 border-red-500/30',
    holiday: 'bg-gray-500/10 border-gray-500/30',
    cancelled: 'bg-yellow-500/10 border-yellow-500/30',
  };

  const statusButtonStyles = {
    attended: 'bg-green-500/20 text-green-700 dark:text-green-300',
    missed: 'bg-red-500/20 text-red-700 dark:text-red-300',
    holiday: 'bg-gray-500/20 text-gray-700 dark:text-gray-300',
    cancelled: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
  }

  const attendanceOptions: ClassSession['status'][] = ['attended', 'missed', 'holiday', 'cancelled'];
  const attendanceLabels = {
      'attended': 'P',
      'missed': 'A',
      'holiday': 'H',
      'cancelled': 'C',
  }

  return (
    <Card
      className={cn(
        'p-3 transition-all w-full',
        session.status && statusCardStyles[session.status]
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {session.startTime} - {session.endTime}
            </span>
            {session.room && (
              <span className="flex items-center gap-1">
                <DoorClosed className="w-3 h-3" /> {session.room}
              </span>
            )}
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex items-center gap-1">
          {attendanceOptions.map((status) => (
            status &&
            <Button
              key={status}
              variant="ghost"
              size="icon"
              className={cn(
                'w-7 h-7 rounded-full text-xs',
                session.status === status && statusButtonStyles[status]
              )}
              onClick={() => onStatusChange(session.id, session.status === status ? undefined : status)}
            >
              {attendanceLabels[status]}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default DailyAttendanceCard;
