
'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell, Clock, DoorClosed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/app-context";
import { format, isToday } from "date-fns";
import Link from "next/link";

const formatTime12h = (time: string) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${period}`;
};

export default function UpcomingClasses() {
  const { classes } = useAppContext();
  const upcomingClasses = classes.filter(c => isToday(new Date(c.date))).sort((a, b) => {
    const timeA = a.startTime.split(':');
    const timeB = b.startTime.split(':');
    return new Date(0,0,0, parseInt(timeA[0]), parseInt(timeA[1])).getTime() - new Date(0,0,0, parseInt(timeB[0]), parseInt(timeB[1])).getTime()
  });

  return (
    <Link href="/timetable" className="block h-full">
        <Card className="h-full hover:border-primary/50 transition-colors">
        <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base">Today's Classes</CardTitle>
            <CardDescription className="text-xs">Here are your classes for today.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            {upcomingClasses.length > 0 ? (
            <div className="flex flex-col gap-3">
                {upcomingClasses.slice(0,3).map((session, index) => (
                <div key={session.id}>
                    <div className="flex items-start gap-3">
                    <div className="flex-1">
                        <p className="font-semibold text-sm">{session.subject}</p>
                        <p className="text-xs text-muted-foreground">{session.teacher}</p>
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3"/> {formatTime12h(session.startTime)} - {formatTime12h(session.endTime)}</span>
                        {session.room && <span className="flex items-center gap-1.5"><DoorClosed className="w-3 h-3"/> {session.room}</span>}
                        </div>
                    </div>
                    {session.status && (
                        <Badge variant={session.status === 'attended' ? "secondary" : session.status === 'holiday' ? "outline" : "destructive"}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </Badge>
                    )}
                    </div>
                    {index < upcomingClasses.slice(0,3).length - 1 && <Separator className="mt-3" />}
                </div>
                ))}
            </div>
            ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[140px] text-center bg-muted/50 rounded-lg">
                <Bell className="w-8 h-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">No classes scheduled for today.</p>
            </div>
            )}
        </CardContent>
        </Card>
    </Link>
  );
}
