'use client';
import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorClosed, Clock, Bell } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const formatTime12h = (time: string) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${period}`;
};


export default function NextLecture() {
    const { classes, subjects } = useAppContext();
    const now = new Date();

    const upcomingClasses = classes
        .map(c => {
            const [endHours, endMinutes] = c.endTime.split(':').map(Number);
            const classEndDate = new Date(c.date);
            classEndDate.setHours(endHours, endMinutes, 0, 0);
            return { ...c, endDateTime: classEndDate };
        })
        .filter(c => c.endDateTime > now)
        .sort((a, b) => {
             const timeA = new Date(a.date).setHours(...a.startTime.split(':').map(Number) as [number, number]);
             const timeB = new Date(b.date).setHours(...b.startTime.split(':').map(Number) as [number, number]);
             return timeA - timeB;
        });

    const nextClass = upcomingClasses[0];
    const subject = nextClass ? subjects.find(s => s.name === nextClass.subject) : null;
    const color = subject?.color || '#A1A1AA';

    if (!nextClass) {
        return (
             <Card className="flex flex-col h-full">
                <CardHeader>
                    <CardTitle>Next Lecture</CardTitle>
                    <CardDescription>What's next on your schedule.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col items-center justify-center text-center gap-2">
                    <Bell className="w-10 h-10 text-muted-foreground" />
                    <p className="text-muted-foreground">No upcoming classes found.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Link href="/timetable">
            <Card className="h-full hover:border-primary/50 transition-colors" style={{ backgroundColor: `${color}20`, borderColor: `${color}60` }}>
                <CardHeader>
                    <CardTitle>Next Lecture</CardTitle>
                    <CardDescription>{format(new Date(nextClass.date), "EEEE, LLLL d")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-primary" style={{color: color}}>{nextClass.subject}</h3>
                        <p className="text-sm text-foreground/80">{nextClass.teacher}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {formatTime12h(nextClass.startTime)} - {formatTime12h(nextClass.endTime)}</span>
                    </div>
                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {nextClass.room && <span className="flex items-center gap-1.5"><DoorClosed className="w-4 h-4"/> {nextClass.room}</span>}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
