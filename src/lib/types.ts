export type ClassSession = {
  id: string;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
  room: string;
  status: 'attended' | 'missed' | 'holiday';
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
  id:string;
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

export type Subject = {
    id: string;
    name: string;
    teacher: string;
    color: string;
}
