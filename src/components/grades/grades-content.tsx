
'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import type { Semester, GradeSubject } from '@/lib/types';
import { calculateCgpa, calculateSgpa, getGradeDetails } from '@/lib/grade-calculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion } from '@/components/ui/accordion';
import SemesterCard from './semester-card';

const GradesContent = () => {
  const { grades } = useAppContext();

  const semesters: Semester[] = useMemo(() => {
    const semesterData: Semester[] = Array.from({ length: 8 }, (_, i) => ({
      semester: i + 1,
      subjects: [],
    }));

    grades.forEach((subject) => {
      if (subject.semester >= 1 && subject.semester <= 8) {
        semesterData[subject.semester - 1].subjects.push(subject);
      }
    });

    return semesterData.map((sem) => {
      const sgpa = calculateSgpa(sem.subjects);
      return { ...sem, sgpa };
    });
  }, [grades]);

  const cgpa = useMemo(() => calculateCgpa(semesters), [semesters]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
          <CardDescription>Your cumulative grade point average (CGPA) across all completed semesters.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 bg-muted/50 rounded-xl">
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">CGPA</p>
              <p className="text-5xl font-bold text-primary">{cgpa.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {semesters.map((semester) => (
          <SemesterCard key={semester.semester} semester={semester} />
        ))}
      </Accordion>
    </div>
  );
};

export default GradesContent;
