
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import type { ClassSession } from '@/lib/types';
import DailyAttendanceCard from './daily-attendance-card';

type DailySubjectAttendanceCardProps = {
  subjectName: string;
  sessions: ClassSession[];
};

const DailySubjectAttendanceCard = ({ subjectName, sessions }: DailySubjectAttendanceCardProps) => {
  const { subjects, updateClassStatus } = useAppContext();
  const subject = subjects.find(s => s.name === subjectName);
  const color = subject?.color || '#A1A1AA';
  const teacher = sessions[0]?.teacher || '';
  
  const handleStatusChange = (sessionId: string, status: ClassSession['status']) => {
    updateClassStatus(sessionId, status);
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-3" style={{ backgroundColor: `${color}40` }}>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
          <div>
            <CardTitle className="text-base">{subjectName}</CardTitle>
            <p className="text-xs text-foreground/80">{teacher}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {sessions.sort((a,b) => a.startTime.localeCompare(b.startTime)).map((session) => (
            <DailyAttendanceCard key={session.id} session={session} />
        ))}
      </CardContent>
    </Card>
  );
};

export default DailySubjectAttendanceCard;
