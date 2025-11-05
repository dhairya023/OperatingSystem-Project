

export type ClassSession = {
  id: string;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
  room: string;
  status?: 'attended' | 'missed' | 'holiday' | 'cancelled';
  date: any; // Allow any for Firestore Timestamps
  rrule?: string; // Recurrence rule ID
  repeatUntil?: any; // End date for recurrence
};

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  description?: string;
  dueDate: any; // Allow any for Firestore Timestamps
  completed: boolean;
};

export type Exam = {
  id:string;
  subject: string;
  date: any; // Allow any for Firestore Timestamps
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
    teacher?: string;
    color: string;
}

export type UserProfile = {
  fullName: string;
  email: string;
  course: string;
  branch: string;
  semester: string;
  collegeName: string;
  rollNumber: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  profilePhotoUrl?: string;
  profileCompleted?: boolean;
};

export type GradeSubject = {
  id: string;
  semester: number;
  subjectName: string;
  credits: number;
  midSemMarks?: number;
  iaMarks?: number;
  endSemMarks?: number;
};

export type Semester = {
  semester: number;
  subjects: GradeSubject[];
  sgpa?: number;
};
