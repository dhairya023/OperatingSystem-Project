'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import type { ClassSession, Subject, Assignment, Exam, UserProfile } from '@/lib/types';
import { useFirebase } from '@/firebase/provider';
import { Skeleton } from '@/components/ui/skeleton';

interface UserData {
  profile: UserProfile;
  subjects: Subject[];
  classes: ClassSession[];
  assignments: Assignment[];
  exams: Exam[];
}

interface AppContextType extends UserData {
  addSubject: (subject: Subject) => Promise<void>;
  updateSubject: (subject: Subject) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  addClass: (session: ClassSession) => Promise<void>;
  updateClass: (session: ClassSession) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  addAssignment: (assignment: Assignment) => Promise<void>;
  updateAssignment: (assignment: Assignment) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  toggleAssignmentCompletion: (id: string) => Promise<void>;
  addExam: (exam: Exam) => Promise<void>;
  updateExam: (exam: Exam) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  registerUser: (email: string, password: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  getSubjectAttendance: any; // Simplified for now
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user, isUserLoading, auth, firestore } = useFirebase();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      setIsLoading(false);
      // Let individual pages handle redirects if needed, except for a global one in a layout
      return;
    }

    const userDocRef = doc(firestore, 'users', user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();

          const parseDates = <T extends { dueDate?: any; date?: any }>(items: T[] = []): T[] => {
            return items.map(item => ({
              ...item,
              ...(item.dueDate && { dueDate: item.dueDate.toDate() }),
              ...(item.date && { date: item.date.toDate() }),
            }));
          };

          setUserData({
            profile: data.profile || { fullName: user.email },
            subjects: data.subjects || [],
            classes: parseDates(data.classes),
            assignments: parseDates(data.assignments),
            exams: parseDates(data.exams),
          });
        } else {
          // This case might happen briefly if a new user's doc hasn't been created yet
          console.log("User document doesn't exist yet.");
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error listening to user document:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isUserLoading, firestore, router]);
  
  const updateUserData = async (field: keyof UserData, value: any) => {
      if (!user) throw new Error('User not logged in');
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, { [field]: value });
  }

  const registerUser = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    const userDocRef = doc(firestore, 'users', newUser.uid);
    await setDoc(userDocRef, {
      uid: newUser.uid,
      email: newUser.email,
      createdAt: serverTimestamp(),
      profile: {
        fullName: newUser.email,
        email: newUser.email,
        rollNo: '',
        university: '',
        course: '',
        semester: '',
        department: '',
        profilePhotoUrl: '',
      },
      subjects: [],
      classes: [],
      assignments: [],
      exams: [],
      timetable: [],
      attendance: {},
      attendanceStats: { overallPercentage: 0, currentStreak: 0 },
      analytics: {},
    });
  };

  const loginUser = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };
  
  const createItemUpdater = <T extends {id: string}>(field: keyof UserData) => {
      const getItems = () => userData?.[field] as T[] || [];
      return {
          add: async (item: T) => updateUserData(field, [...getItems(), item]),
          update: async (updatedItem: T) => updateUserData(field, getItems().map(i => i.id === updatedItem.id ? updatedItem : i)),
          delete: async (id: string) => updateUserData(field, getItems().filter(i => i.id !== id)),
      }
  }
  
  const subjectUpdater = createItemUpdater<Subject>('subjects');
  const classUpdater = createItemUpdater<ClassSession>('classes');
  const assignmentUpdater = createItemUpdater<Assignment>('assignments');
  const examUpdater = createItemUpdater<Exam>('exams');

  if (isLoading || isUserLoading || (user && !userData)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="p-8 space-y-4 w-full max-w-lg">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="space-y-2 pt-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const value: AppContextType = {
    profile: userData?.profile!,
    subjects: userData?.subjects || [],
    classes: userData?.classes || [],
    assignments: userData?.assignments || [],
    exams: userData?.exams || [],
    updateProfile: (profile: UserProfile) => updateUserData('profile', profile),
    addSubject: subjectUpdater.add,
    updateSubject: subjectUpdater.update,
    deleteSubject: subjectUpdater.delete,
    addClass: classUpdater.add,
    updateClass: classUpdater.update,
    deleteClass: classUpdater.delete,
    addAssignment: assignmentUpdater.add,
    updateAssignment: assignmentUpdater.update,
    deleteAssignment: assignmentUpdater.delete,
    toggleAssignmentCompletion: async (id: string) => {
        const assignments = userData?.assignments || [];
        const assignment = assignments.find(a => a.id === id);
        if (assignment) {
            await assignmentUpdater.update({...assignment, completed: !assignment.completed });
        }
    },
    addExam: examUpdater.add,
    updateExam: examUpdater.update,
    deleteExam: examUpdater.delete,
    registerUser,
    loginUser,
    getSubjectAttendance: () => ({ attended: 0, total: 0 }), // Placeholder
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
