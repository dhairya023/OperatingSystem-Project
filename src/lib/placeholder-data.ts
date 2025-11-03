import type { Assignment, ClassSession, Exam, Subject, SubjectAttendance } from './types';
import { addDays, subDays, set } from 'date-fns';

const today = new Date();

export const MOCK_SUBJECTS_LIST: Subject[] = [
    { id: 'sub1', name: 'Quantum Physics', teacher: 'Dr. Evelyn Reed', color: '#3B82F6' },
    { id: 'sub2', name: 'Advanced Algorithms', teacher: 'Prof. Ken Thompson', color: '#F59E0B' },
    { id: 'sub3', name: 'Modernist Literature', teacher: 'Dr. Helena Shaw', color: '#10B981' },
    { id: 'sub4', name: 'Organic Chemistry', teacher: 'Dr. Aaron Gable', color: '#6366F1' },
    { id: 'sub5', name: 'Data Science', teacher: 'Prof. Jane Goodall', color: '#EC4899' },
    { id: 'sub6', name: 'Machine Learning', teacher: 'Dr. Alan Turing', color: '#EF4444' },
];

export const MOCK_CLASSES: ClassSession[] = [
  // Today's classes
  {
    id: 'cls1',
    subject: 'Quantum Physics',
    teacher: 'Dr. Evelyn Reed',
    startTime: '08:00',
    endTime: '09:30',
    room: 'Physics Lab 3',
    status: 'attended',
    date: set(today, { hours: 8, minutes: 0, seconds: 0, milliseconds: 0 }),
  },
  {
    id: 'cls2',
    subject: 'Advanced Algorithms',
    teacher: 'Prof. Ken Thompson',
    startTime: '09:30',
    endTime: '11:00',
    room: 'CS Building, Room 101',
    status: 'attended',
    date: set(today, { hours: 9, minutes: 30, seconds: 0, milliseconds: 0 }),
  },
  {
    id: 'cls3',
    subject: 'Modernist Literature',
    teacher: 'Dr. Helena Shaw',
    startTime: '11:00',
    endTime: '12:30',
    room: 'Room 5.1.2',
    status: 'missed',
    date: set(today, { hours: 11, minutes: 0, seconds: 0, milliseconds: 0 }),
  },
   {
    id: 'cls11',
    subject: 'Machine Learning',
    teacher: 'Dr. Alan Turing',
    startTime: '14:00',
    endTime: '15:30',
    room: 'Lab 9b',
    status: 'attended',
    date: set(today, { hours: 14, minutes: 0, seconds: 0, milliseconds: 0 }),
  },
    {
    id: 'cls12',
    subject: 'Data Science',
    teacher: 'Prof. Jane Goodall',
    startTime: '15:30',
    endTime: '17:00',
    room: 'Building A2',
    status: 'attended',
    date: set(today, { hours: 15, minutes: 30, seconds: 0, milliseconds: 0 }),
  },
    {
    id: 'cls13',
    subject: 'Organic Chemistry',
    teacher: 'Dr. Aaron Gable',
    startTime: '17:00',
    endTime: '18:00',
    room: 'Room 3.4.1',
    status: 'attended',
    date: set(today, { hours: 17, minutes: 0, seconds: 0, milliseconds: 0 }),
  },

  // Yesterday's classes
  { id: 'cls4', subject: 'Quantum Physics', teacher: 'Dr. Evelyn Reed', startTime: '09:00', endTime: '10:30', room: 'Physics Lab 3', status: 'attended', date: set(subDays(today, 1), { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }) },
  { id: 'cls5', subject: 'Advanced Algorithms', teacher: 'Prof. Ken Thompson', startTime: '11:00', endTime: '12:30', room: 'CS Building, Room 101', status: 'missed', date: set(subDays(today, 1), { hours: 11, minutes: 0, seconds: 0, milliseconds: 0 }) },
  { id: 'cls6', subject: 'Modernist Literature', teacher: 'Dr. Helena Shaw', startTime: '14:00', endTime: '15:30', room: 'Literature Hall 2B', status: 'attended', date: set(subDays(today, 1), { hours: 14, minutes: 0, seconds: 0, milliseconds: 0 }) },
  
  // Two days ago
  { id: 'cls7', subject: 'Organic Chemistry', teacher: 'Dr. Aaron Gable', startTime: '09:00', endTime: '10:30', room: 'Chem Lab 1', status: 'attended', date: set(subDays(today, 2), { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }) },
  { id: 'cls8', subject: 'Data Science', teacher: 'Prof. Jane Goodall', startTime: '11:00', endTime: '12:30', room: 'Data Hub', status: 'holiday', date: set(subDays(today, 3), { hours: 11, minutes: 0, seconds: 0, milliseconds: 0 }) },
  { id: 'cls9', subject: 'Machine Learning', teacher: 'Dr. Alan Turing', startTime: '14:00', endTime: '15:30', room: 'AI Center', status: 'attended', date: set(subDays(today, 4), { hours: 14, minutes: 0, seconds: 0, milliseconds: 0 }) },

  // Tomorrow's classes
  { id: 'cls10', subject: 'Quantum Physics', teacher: 'Dr. Evelyn Reed', startTime: '08:00', endTime: '09:30', room: 'Physics Lab 3', status: 'missed', date: set(addDays(today, 1), { hours: 8, minutes: 0, seconds: 0, milliseconds: 0 }) },
  { id: 'cls14', subject: 'Advanced Algorithms', teacher: 'Prof. Ken Thompson', startTime: '09:30', endTime: '11:00', room: 'CS Building, Room 101', status: 'attended', date: set(addDays(today, 1), { hours: 9, minutes: 30, seconds: 0, milliseconds: 0 })},
  { id: 'cls15', subject: 'Modernist Literature', teacher: 'Dr. Helena Shaw', startTime: '11:00', endTime: '14:00', room: 'Room 5.1.2', status: 'attended', date: set(addDays(today, 1), { hours: 11, minutes: 0, seconds: 0, milliseconds: 0 })},
  { id: 'cls16', subject: 'Organic Chemistry', teacher: 'Dr. Aaron Gable', startTime: '14:00', endTime: '15:30', room: 'Lab 9b', status: 'attended', date: set(addDays(today, 1), { hours: 14, minutes: 0, seconds: 0, milliseconds: 0 })},
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
  { subject: 'Quantum Physics', attended: 19, total: 22 },
  { subject: 'Advanced Algorithms', attended: 23, total: 25 },
  { subject: 'Modernist Literature', attended: 16, total: 21 },
  { subject: 'Organic Chemistry', attended: 26, total: 26 },
  { subject: 'Data Science', attended: 28, total: 30 },
  { subject: 'Machine Learning', attended: 24, total: 26 },
];


export const getAttendancePercentage = () => {
  const totalClasses = MOCK_CLASSES.length;
  if (totalClasses === 0) return 0;
  const attendedClasses = MOCK_CLASSES.filter(c => c.status === 'attended').length;
  return Math.round((attendedClasses / totalClasses) * 100);
}
