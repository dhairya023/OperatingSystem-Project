import type { Assignment, ClassSession, Exam, SubjectAttendance } from './types';

const today = new Date();

export const MOCK_CLASSES: ClassSession[] = [
  {
    id: 'cls1',
    subject: 'Quantum Physics',
    teacher: 'Dr. Evelyn Reed',
    time: '09:00 - 10:30',
    room: 'Physics Lab 3',
    attended: true,
    date: new Date(),
  },
  {
    id: 'cls2',
    subject: 'Advanced Algorithms',
    teacher: 'Prof. Ken Thompson',
    time: '11:00 - 12:30',
    room: 'CS Building, Room 101',
    attended: true,
    date: new Date(),
  },
  {
    id: 'cls3',
    subject: 'Modernist Literature',
    teacher: 'Dr. Helena Shaw',
    time: '14:00 - 15:30',
    room: 'Literature Hall 2B',
    attended: false,
    date: new Date(),
  },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg1',
    title: 'Problem Set 5',
    subject: 'Quantum Physics',
    dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
    completed: false,
  },
  {
    id: 'asg2',
    title: 'Data Structures Implementation',
    subject: 'Advanced Algorithms',
    dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
    completed: false,
  },
  {
    id: 'asg3',
    title: 'Essay on Virginia Woolf',
    subject: 'Modernist Literature',
    dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
    completed: true,
  },
    {
    id: 'asg4',
    title: 'Lab Report 2',
    subject: 'Organic Chemistry',
    dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
    completed: false,
  },
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'exm1',
    subject: 'Advanced Algorithms',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14, 10, 0, 0),
    venue: 'Exam Hall A',
    type: 'Mid-term',
  },
  {
    id: 'exm2',
    subject: 'Quantum Physics',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 21, 14, 30, 0),
    venue: 'Physics Auditorium',
    type: 'Mid-term',
  },
];

export const MOCK_SUBJECTS_ATTENDANCE: SubjectAttendance[] = [
  { subject: 'Quantum Physics', attended: 18, total: 20 },
  { subject: 'Advanced Algorithms', attended: 22, total: 24 },
  { subject: 'Modernist Literature', attended: 15, total: 20 },
  { subject: 'Organic Chemistry', attended: 25, total: 25 },
  { subject: 'Data Science', attended: 28, total: 30 },
  { subject: 'Machine Learning', attended: 23, total: 26 },
];


export const getAttendancePercentage = () => {
  const totalClasses = MOCK_CLASSES.length;
  if (totalClasses === 0) return 0;
  const attendedClasses = MOCK_CLASSES.filter(c => c.attended).length;
  return Math.round((attendedClasses / totalClasses) * 100);
}
