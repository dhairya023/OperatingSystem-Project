
'use client';
import { useAppContext } from "@/context/app-context";
import { isToday } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { BookCheck, CalendarDays, PercentCircle } from "lucide-react";

export default function DashboardSummary() {
    const { classes, assignments, profile } = useAppContext();

    if (!profile) return null;

    const lecturesToday = classes.filter(c => isToday(new Date(c.date))).length;
    const pendingAssignmentsCount = assignments.filter(a => !a.completed).length;

    const relevantClasses = classes.filter(c => c.status === 'attended' || c.status === 'missed');
    const attendedClasses = relevantClasses.filter(c => c.status === 'attended').length;
    const overallAttendance = relevantClasses.length > 0 ? Math.round((attendedClasses / relevantClasses.length) * 100) : 100;

    const summaryItems = [
        { icon: CalendarDays, label: "Lectures Today", value: lecturesToday },
        { icon: BookCheck, label: "Pending Assign.", value: pendingAssignmentsCount },
        { icon: PercentCircle, label: "Attendance", value: `${overallAttendance}%` },
    ]
    
    const firstName = profile.fullName ? profile.fullName.split(' ')[0] : 'there';

    return (
        <Card className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold font-headline">Hey {firstName}, ready for class?</h2>
                        <p className="text-muted-foreground">Here is your summary for today.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 md:gap-3 text-center w-full md:w-auto">
                        {summaryItems.map(item => (
                             <div key={item.label} className="p-2 rounded-lg bg-muted/50 flex flex-col items-center justify-center">
                                <item.icon className="w-5 h-5 mb-1 text-primary"/>
                                <div className="text-lg font-bold text-foreground">{item.value}</div>
                                <div className="text-xs text-muted-foreground">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
