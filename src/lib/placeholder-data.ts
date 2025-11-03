import type { Assignment, ClassSession, Exam, Subject, SubjectAttendance, UserProfile } from './types';
import { addDays, subDays, set } from 'date-fns';

const today = new Date();

export const MOCK_SUBJECTS_LIST: Subject[] = [];

export const MOCK_CLASSES: ClassSession[] = [];

export const MOCK_ASSIGNMENTS: Assignment[] = [];

export const MOCK_EXAMS: Exam[] = [];

export const MOCK_PROFILE: UserProfile = {
    fullName: "Alex Doe",
    email: "alex.doe@example.com",
    rollNo: "STU12345",
    university: "Stanford University",
    course: "B.Sc. Computer Science",
    semester: "4th",
    department: "Computer Science",
    profilePhotoUrl: "",
};


export const MOCK_SUBJECTS_ATTENDANCE: SubjectAttendance[] = [];


export const getAttendancePercentage = () => {
  const totalClasses = MOCK_CLASSES.length;
  if (totalClasses === 0) return 0;
  const attendedClasses = MOCK_CLASSES.filter(c => c.status === 'attended').length;
  return Math.round((attendedClasses / totalClasses) * 100);
}
