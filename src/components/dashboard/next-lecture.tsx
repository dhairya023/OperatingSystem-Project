
'use client';
import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorClosed, Clock, Bell, User } from "lucide-react";
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
             <Card className="flex flex-col h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                    <CardTitle className="text-base">Next Lecture</CardTitle>
                    <CardDescription className="text-xs">What's next on your schedule.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col items-center justify-center text-center gap-2">
                    <Bell className="w-10 h-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">No upcoming classes found.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Link href="/timetable">
            <Card className="h-full hover:border-primary/50 transition-colors flex flex-col" style={{ backgroundColor: `${color}20`, borderColor: `${color}60` }}>
                <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-base">Next Lecture</CardTitle>
                    <CardDescription className="text-xs">{format(new Date(nextClass.date), "EEEE, LLLL d")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 p-4 pt-0 md:p-6 md:pt-0 flex-1 flex flex-col justify-center">
                    <div className="space-y-1">
                        <h3 className="text-2xl md:text-4xl font-bold leading-tight" style={{color: color}}>{nextClass.subject}</h3>
                    </div>
                    <div className="flex flex-col gap-2.5 text-sm md:text-base text-muted-foreground">
                        {nextClass.teacher && (
                          <span className="flex items-center gap-2 font-medium"><User className="w-5 h-5"/> {nextClass.teacher}</span>
                        )}
                        <span className="flex items-center gap-2 font-medium"><Clock className="w-5 h-5"/> {formatTime12h(nextClass.startTime)} - {formatTime12h(nextClass.endTime)}</span>
                        {nextClass.room && <span className="flex items-center gap-2 font-medium"><DoorClosed className="w-5 h-5"/> {nextClass.room}</span>}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
