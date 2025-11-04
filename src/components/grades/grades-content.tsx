
'use client';
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import type { Semester, GradeSubject } from '@/lib/types';
import { calculateCgpa } from '@/lib/grade-calculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import SemesterCard from './semester-card';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import SubjectForm from './subject-form';

const GradesContent = () => {
  const { grades, addGradeSubject } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);

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
  
  const handleSave = (subject: GradeSubject) => {
    addGradeSubject(subject);
    setIsFormOpen(false);
  }

  return (
    <div className="space-y-8">
       <div className="flex justify-end">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Subject</DialogTitle>
            </DialogHeader>
            <SubjectForm
              onSave={handleSave}
            />
          </DialogContent>
        </Dialog>
      </div>

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
