'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell, Clock, DoorClosed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/app-context";
import { format, isToday } from "date-fns";

export default function UpcomingClasses() {
  const { classes } = useAppContext();
  const upcomingClasses = classes.filter(c => isToday(c.date)).sort((a, b) => {
    const timeA = a.startTime.split(':');
    const timeB = b.startTime.split(':');
    return new Date(0,0,0, parseInt(timeA[0]), parseInt(timeA[1])).getTime() - new Date(0,0,0, parseInt(timeB[0]), parseInt(timeB[1])).getTime()
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Today's Classes</CardTitle>
        <CardDescription>Here are your classes for today.</CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingClasses.length > 0 ? (
          <div className="flex flex-col gap-4">
            {upcomingClasses.map((session, index) => (
              <div key={session.id}>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="font-semibold">{session.subject}</p>
                    <p className="text-sm text-muted-foreground">{session.teacher}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3"/> {session.startTime} - {session.endTime}</span>
                      <span className="flex items-center gap-1.5"><DoorClosed className="w-3 h-3"/> {session.room}</span>
                    </div>
                  </div>
                  <Badge variant={session.status === 'attended' ? "secondary" : session.status === 'holiday' ? "outline" : "destructive"}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </Badge>
                </div>
                {index < upcomingClasses.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center bg-muted/50 rounded-lg">
            <Bell className="w-8 h-8 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No classes scheduled for today.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
