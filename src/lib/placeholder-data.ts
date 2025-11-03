import type { Assignment, ClassSession, Exam, Subject, SubjectAttendance, UserProfile } from './types';

// This file is now mostly a reference for types, as data will come from Firestore.

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
