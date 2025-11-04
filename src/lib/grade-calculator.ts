
import type { GradeSubject, Semester } from './types';

type GradeDetails = {
  status: 'Completed' | 'In Progress';
  total?: number;
  grade?: string;
  gradePoint?: number;
};

export const getGradeDetails = (subject: GradeSubject): GradeDetails => {
  const { midSemMarks, iaMarks, endSemMarks } = subject;

  if (midSemMarks === undefined || iaMarks === undefined || endSemMarks === undefined) {
    return { status: 'In Progress' };
  }
  
  const total = midSemMarks + iaMarks + (endSemMarks / 2);

  if (total >= 90) return { status: 'Completed', total, grade: 'A+', gradePoint: 10 };
  if (total >= 80) return { status: 'Completed', total, grade: 'A', gradePoint: 9 };
  if (total >= 70) return { status: 'Completed', total, grade: 'B+', gradePoint: 8 };
  if (total >= 60) return { status: 'Completed', total, grade: 'B', gradePoint: 7 };
  if (total >= 50) return { status: 'Completed', total, grade: 'C', gradePoint: 6 };
  if (total >= 40) return { status: 'Completed', total, grade: 'D', gradePoint: 5 };
  
  return { status: 'Completed', total, grade: 'F', gradePoint: 0 };
};

export const calculateSgpa = (subjects: GradeSubject[]): number | undefined => {
  let totalCredits = 0;
  let totalGradePoints = 0;

  for (const subject of subjects) {
    const gradeDetails = getGradeDetails(subject);
    if (gradeDetails.status === 'In Progress' || gradeDetails.gradePoint === undefined) {
      return undefined; // SGPA cannot be calculated if any subject is incomplete
    }
    totalCredits += subject.credits;
    totalGradePoints += gradeDetails.gradePoint * subject.credits;
  }

  if (totalCredits === 0) {
    return 0; // Avoid division by zero
  }

  return totalGradePoints / totalCredits;
};

export const calculateCgpa = (semesters: Semester[]): number => {
  const completedSemesters = semesters.filter(sem => sem.sgpa !== undefined);
  if (completedSemesters.length === 0) {
    return 0;
  }

  const totalSgpa = completedSemesters.reduce((acc, sem) => acc + (sem.sgpa || 0), 0);
  return totalSgpa / completedSemesters.length;
};
