export type ClassSession = {
  id: string;
  subject: string;
  teacher: string;
  time: string;
  room: string;
  attended: boolean;
  date: Date;
};

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  completed: boolean;
};

export type Exam = {
  id: string;
  subject: string;
  date: Date;
  venue: string;
  type: 'Mid-term' | 'Final' | 'Quiz';
};

export type SubjectAttendance = {
  subject: string;
  attended: number;
  total: number;
};

export type DailyAttendance = {
  date: Date;
  present: number;
  total: number;
};
