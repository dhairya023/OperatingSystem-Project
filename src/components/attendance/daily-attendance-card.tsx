
'use client';
import { Card } from '@/components/ui/card';
import type { ClassSession } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, DoorClosed } from 'lucide-react';
import { Badge } from '../ui/badge';

const DailyAttendanceCard = ({ session }: { session: ClassSession }) => {
  const statusCardStyles = {
    attended: 'bg-green-500/10 border-green-500/30',
    missed: 'bg-red-500/10 border-red-500/30',
    holiday: 'bg-gray-500/10 border-gray-500/30',
    cancelled: 'bg-yellow-500/10 border-yellow-500/30',
  };

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

        {/* Status Badge Section */}
        {session.status && (
            <Badge variant={session.status === 'attended' ? "secondary" : session.status === 'holiday' ? "outline" : "destructive"}>
                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </Badge>
        )}
      </div>
    </Card>
  );
};

export default DailyAttendanceCard;
