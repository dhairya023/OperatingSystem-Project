export type ClassSession = {
  id: string;
  subject: string;
  teacher: string;
  time: string;
  room: string;
  attended: boolean;
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
