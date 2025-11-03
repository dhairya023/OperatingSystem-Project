'use client';
import PageHeader from '@/components/page-header';
import { MOCK_CLASSES } from '@/lib/placeholder-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SubjectAttendanceCalendar from '@/components/attendance/subject-attendance-calendar';
import { useAppContext } from '@/context/app-context';

export default function AttendancePage() {
  const { subjects, getSubjectAttendance, classes } = useAppContext();
  const [selectedSubject, setSelectedSubject] = useState(subjects.length > 0 ? subjects[0].name : '');

  const subjectAttendance = subjects.map(s => getSubjectAttendance(s.name));
  
  const subjectData = subjectAttendance.find(s => s.subject === selectedSubject);

  const subjectClasses = classes.filter(c => c.subject === selectedSubject);

  if (subjects.length === 0) {
    return (
       <div className="flex flex-col gap-8">
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
    <div className="flex flex-col gap-8">
      <PageHeader title="Attendance" description="Track your attendance for all subjects." />

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
                  {subjectAttendance.map((subject) => (
                    <SelectItem key={subject.subject} value={subject.subject}>
                      {subject.subject}
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
  );
}
