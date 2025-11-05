
'use client';
import AppLayout from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useState, useMemo, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SubjectAttendanceCalendar from '@/components/attendance/subject-attendance-calendar';
import { useAppContext } from '@/context/app-context';
import { addDays, subDays, format, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import DailySubjectAttendanceCard from '@/components/attendance/daily-subject-attendance-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ClassSession } from '@/lib/types';

function AttendanceContent() {
  const { subjects, getSubjectAttendance, classes, setHeaderState } = useAppContext();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0].name);
    }
  }, [subjects, selectedSubject]);

  useEffect(() => {
    setHeaderState({
      title: 'Attendance',
      description: 'Track your attendance for all subjects.'
    });
  }, [setHeaderState]);

  const subjectAttendance = subjects.map(s => getSubjectAttendance(s.name));
  
  const subjectData = subjectAttendance.find(s => s.subject === selectedSubject);

  const subjectClasses = classes.filter(c => c.subject === selectedSubject);

  const handlePrevDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };
  
  const dailyClassesBySubject = useMemo(() => {
    const daily = classes
      .filter((c) => format(new Date(c.date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd'));

    return daily.reduce((acc, session) => {
      if (!acc[session.subject]) {
        acc[session.subject] = [];
      }
      acc[session.subject].push(session);
      return acc;
    }, {} as Record<string, ClassSession[]>);
  }, [classes, currentDate]);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 80) return 'text-yellow-500';
    return 'text-red-500';
  }

  if (subjects.length === 0) {
    return (
       <div className="flex flex-col gap-8 w-full p-4 md:p-6 lg:p-8">
         <div className="flex h-[60vh] items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50">
           <div className="text-center">
             <p className="text-lg font-medium text-muted-foreground">No subjects found.</p>
             <p className="text-sm text-muted-foreground/80">Please add subjects in the 'Subjects' page first.</p>
           </div>
         </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 w-full p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
              <Card className="h-full">
                  <CardHeader>
                      <CardTitle>Daily Attendance</CardTitle>
                      <CardDescription>{format(currentDate, "PPP")}</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                  {Object.keys(dailyClassesBySubject).length > 0 ? (
                      <ScrollArea className="h-96 pr-3">
                          <div className="flex flex-col gap-3">
                          {Object.entries(dailyClassesBySubject).map(([subject, sessions]) => (
                              <DailySubjectAttendanceCard key={subject} subjectName={subject} sessions={sessions} />
                          ))}
                          </div>
                      </ScrollArea>
                  ) : (
                      <div className="flex h-96 flex-col items-center justify-center text-center bg-card/50 rounded-lg">
                      <p className="text-muted-foreground">No classes scheduled.</p>
                      </div>
                  )}
                  </CardContent>
              </Card>
          </div>
          
          <div className="lg:col-span-3">
               <Card>
                  <CardHeader>
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                          <div>
                          <CardTitle>Subject-Wise Details</CardTitle>
                          <CardDescription>Select a subject to view its details.</CardDescription>
                          </div>
                          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                          <SelectTrigger className="w-full md:w-[200px]">
                              <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                              {subjects.map((subject) => (
                              <SelectItem key={subject.id} value={subject.name}>
                                  {subject.name}
                              </SelectItem>
                              ))}
                          </SelectContent>
                          </Select>
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      {subjectData && (
                          <div className="flex flex-col gap-2">
                              <div className="flex justify-between text-sm">
                              <span className="font-medium">{subjectData.subject}</span>
                              <span className="text-muted-foreground">
                                  {subjectData.attended} / {subjectData.total} classes
                              </span>
                              </div>
                              <div className="flex items-center gap-2">
                              <Progress 
                                  value={subjectData.total > 0 ? Math.round((subjectData.attended / subjectData.total) * 100) : 0} 
                                  className="h-2"
                                  indicatorClassName={getProgressColor(subjectData.total > 0 ? Math.round((subjectData.attended / subjectData.total) * 100) : 0)}
                              />
                              <span className={cn("text-xs font-semibold", getTextColor(subjectData.total > 0 ? Math.round((subjectData.attended / subjectData.total) * 100) : 0))}>
                                  {subjectData.total > 0 ? Math.round((subjectData.attended / subjectData.total) * 100) : 0}%
                              </span>
                              </div>
                          </div>
                      )}
                      <SubjectAttendanceCalendar 
                        classes={subjectClasses} 
                        viewingDate={currentDate} 
                        setViewingDate={setCurrentDate} 
                      />
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}


export default function AttendancePage() {
    return (
        <AppLayout>
            <AttendanceContent />
        </AppLayout>
    )
}
