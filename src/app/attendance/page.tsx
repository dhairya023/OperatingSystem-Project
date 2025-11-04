'use client';
import AppLayout from '@/components/app-layout';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SubjectAttendanceCalendar from '@/components/attendance/subject-attendance-calendar';
import { useAppContext } from '@/context/app-context';
import { addDays, subDays, format, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import DailyAttendanceCard from '@/components/attendance/daily-attendance-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

function AttendanceContent() {
  const { subjects, getSubjectAttendance, classes } = useAppContext();
  const [selectedSubject, setSelectedSubject] = useState(subjects.length > 0 ? subjects[0].name : '');
  const [currentDate, setCurrentDate] = useState(new Date());

  const subjectAttendance = subjects.map(s => getSubjectAttendance(s.name));
  
  const subjectData = subjectAttendance.find(s => s.subject === selectedSubject);

  const subjectClasses = classes.filter(c => c.subject === selectedSubject);

  const handlePrevDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };
  
  const dailyClasses = classes
    .filter((c) => format(new Date(c.date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd'))
    .sort((a, b) => {
        const timeA = a.startTime.split(':');
        const timeB = b.startTime.split(':');
        return new Date(0,0,0, parseInt(timeA[0]), parseInt(timeA[1])).getTime() - new Date(0,0,0, parseInt(timeB[0]), parseInt(timeB[1])).getTime()
    });

  if (subjects.length === 0) {
    return (
       <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        <PageHeader title="Attendance" description="Track your attendance for all subjects." />
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
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <PageHeader title="Attendance" description="Track your attendance for all subjects." />

        <Card>
            <CardHeader>
                <CardTitle>Daily Attendance</CardTitle>
                <CardDescription>Mark your attendance for each class.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <Button variant="ghost" size="icon" onClick={handlePrevDay}><ChevronLeft className="w-6 h-6" /></Button>
                  <Popover>
                      <PopoverTrigger asChild>
                          <Button
                          variant={"outline"}
                          className={cn("w-full max-w-[240px] justify-start text-left font-normal",!currentDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {currentDate ? format(currentDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={currentDate} onSelect={(d) => d && setCurrentDate(d)} initialFocus/>
                      </PopoverContent>
                  </Popover>
                  <Button variant="ghost" size="icon" onClick={handleNextDay}><ChevronRight className="w-6 h-6" /></Button>
              </div>
               {dailyClasses.length > 0 ? (
                  <div className="flex flex-col gap-4">
                  {dailyClasses.map(session => (
                      <DailyAttendanceCard key={session.id} session={session} />
                  ))}
                  </div>
              ) : (
                  <div className="flex h-40 flex-col items-center justify-center text-center bg-card/50 rounded-lg">
                  <p className="text-muted-foreground">No classes scheduled for this day.</p>
                  </div>
              )}
            </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Subject-wise Attendance</CardTitle>
                  <CardDescription>Select a subject to view detailed attendance.</CardDescription>
                </div>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full md:w-[280px]">
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
                      <Progress value={subjectData.total > 0 ? Math.round((subjectData.attended / subjectData.total) * 100) : 0} className="h-2" />
                      <span className="text-xs font-semibold text-primary">{subjectData.total > 0 ? Math.round((subjectData.attended / subjectData.total) * 100) : 0}%</span>
                      </div>
                  </div>
              )}
             
            <SubjectAttendanceCalendar classes={subjectClasses} />
          </CardContent>
        </Card>
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
