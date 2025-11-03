
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  onSnapshot,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
} from 'firebase/auth';
import { addDays, addMonths, startOfDay, getDay } from 'date-fns';

import type { ClassSession, Subject, Assignment, Exam, UserProfile } from '@/lib/types';
import { useFirebase } from '@/firebase/provider';

interface UserData {
  profile: UserProfile;
  subjects: Subject[];
  classes: ClassSession[];
  assignments: Assignment[];
  exams: Exam[];
}

interface AppContextType extends UserData {
  isDataLoading: boolean;
  addSubject: (subject: Subject) => Promise<void>;
  updateSubject: (subject: Subject) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  addClass: (session: ClassSession) => Promise<void>;
  updateClass: (session: ClassSession, scope: 'single' | 'future' | 'all') => Promise<void>;
  deleteClass: (session: ClassSession, scope: 'single' | 'future' | 'all') => Promise<void>;
  addAssignment: (assignment: Assignment) => Promise<void>;
  updateAssignment: (assignment: Assignment) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  toggleAssignmentCompletion: (id: string) => Promise<void>;
  addExam: (exam: Exam) => Promise<void>;
  updateExam: (exam: Exam) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  registerUser: (email: string, password: string, fullName: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  completeProfileSetup: () => Promise<void>;
  getSubjectAttendance: any; // Simplified for now
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialProfile: UserProfile = {
  fullName: '',
  email: '',
  course: '',
  branch: '',
  semester: '',
  collegeName: '',
  rollNumber: '',
  phoneNumber: '',
  dateOfBirth: undefined,
  profilePhotoUrl: '',
  profileCompleted: false,
};


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user, isUserLoading, auth, firestore } = useFirebase();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      setUserData(null);
      setIsDataLoading(false);
      return;
    }

    setIsDataLoading(true);
    const userDocRef = doc(firestore, 'users', user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const parseDates = <T extends { dueDate?: any; date?: any; dateOfBirth?: any; repeatUntil?: any }>(items: T[] = []): T[] => {
            return items.map(item => ({
              ...item,
              ...(item.dueDate && item.dueDate.toDate && { dueDate: item.dueDate.toDate() }),
              ...(item.date && item.date.toDate && { date: item.date.toDate() }),
              ...(item.repeatUntil && item.repeatUntil.toDate && { repeatUntil: item.repeatUntil.toDate() }),
            }));
          };

          const parseProfile = (profile: any) => {
              if (profile && profile.dateOfBirth && profile.dateOfBirth.toDate) {
                  return {...profile, dateOfBirth: profile.dateOfBirth.toDate() };
              }
              return profile;
          }

          setUserData({
            profile: parseProfile(data.profile) || { ...initialProfile, fullName: user.displayName, email: user.email },
            subjects: data.subjects || [],
            classes: parseDates(data.classes),
            assignments: parseDates(data.assignments),
            exams: parseDates(data.exams),
          });
        } else {
           setUserData({
            profile: { ...initialProfile, fullName: user.displayName, email: user.email },
            subjects: [],
            classes: [],
            assignments: [],
            exams: [],
          });
        }
        setIsDataLoading(false);
      },
      (error) => {
        console.error('Error listening to user document:', error);
        setIsDataLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isUserLoading, firestore]);
  
  const updateUserData = async (field: keyof UserData | string, value: any) => {
      if (!user) throw new Error('User not logged in');
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, { [field]: value });
  }

  const registerUser = async (email: string, password: string, fullName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    const userDocRef = doc(firestore, 'users', newUser.uid);
    await setDoc(userDocRef, {
      uid: newUser.uid,
      email: newUser.email,
      createdAt: serverTimestamp(),
      profile: {
          ...initialProfile,
          fullName: fullName,
          email: newUser.email,
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
  
  const deleteAccount = async () => {
    if (!user) throw new Error("No user is logged in to delete.");

    const userDocRef = doc(firestore, "users", user.uid);
    try {
      // First, delete Firestore document
      await deleteDoc(userDocRef);
      // Then, delete the user from Firebase Auth
      await deleteUser(user);
      router.push('/login');
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  const completeProfileSetup = async () => {
    if (!user) throw new Error('User not logged in');
    const userDocRef = doc(firestore, 'users', user.uid);
    await updateDoc(userDocRef, { 'profile.profileCompleted': true });
  }

  const createItemUpdater = <T extends {id: string}>(field: keyof UserData) => {
      const getItems = () => userData?.[field] as T[] || [];
      return {
          add: async (item: T) => updateUserData(field, [...getItems(), item]),
          update: async (updatedItem: T) => updateUserData(field, getItems().map(i => i.id === updatedItem.id ? updatedItem : i)),
          delete: async (id: string) => updateUserData(field, getItems().filter(i => i.id !== id)),
      }
  }

  const addClass = async (session: ClassSession) => {
    const newClasses: ClassSession[] = [];
    const baseSession = {
      subject: session.subject,
      teacher: session.teacher,
      startTime: session.startTime,
      endTime: session.endTime,
      room: session.room,
      status: undefined, // Always start as undefined
    };

    if (session.rrule) {
      // Logic for weekly recurring classes
      let loopDate = startOfDay(new Date(session.date));
      const endDate = addMonths(loopDate, 3); // Repeats for 3 months
      const rruleId = crypto.randomUUID();

      while (loopDate <= endDate) {
        newClasses.push({
          ...baseSession,
          id: crypto.randomUUID(),
          date: new Date(loopDate),
          rrule: rruleId,
          repeatUntil: endDate,
        });
        loopDate = addDays(loopDate, 7);
      }
    } else {
      // Logic for a single, non-recurring class
      newClasses.push({
        ...baseSession,
        id: crypto.randomUUID(),
        date: new Date(session.date),
      });
    }

    const currentClasses = userData?.classes || [];
    const updatedClassList = [...currentClasses, ...newClasses];
    await updateUserData('classes', updatedClassList);
  };


  const updateClass = async (session: ClassSession, scope: 'single' | 'future' | 'all') => {
      let currentClasses = [...(userData?.classes || [])];
      
      if (scope === 'single' || !session.rrule) {
          currentClasses = currentClasses.map(c => c.id === session.id ? session : c);
      } else {
          const sessionDate = startOfDay(new Date(session.date));
          currentClasses = currentClasses.map(c => {
              if (c.rrule === session.rrule) {
                  const cDate = startOfDay(new Date(c.date));
                  const shouldUpdate = 
                      (scope === 'all') ||
                      (scope === 'future' && (cDate.getTime() >= sessionDate.getTime()));
                  
                  if (shouldUpdate) {
                      return {
                          ...c,
                          subject: session.subject,
                          teacher: session.teacher,
                          startTime: session.startTime,
                          endTime: session.endTime,
                          room: session.room,
                          repeatUntil: session.repeatUntil
                      };
                  }
              }
              return c;
          });
      }
      await updateUserData('classes', currentClasses);
  };
  
  const deleteClass = async (session: ClassSession, scope: 'single' | 'future' | 'all') => {
    let currentClasses = [...(userData?.classes || [])];

    if (scope === 'single' || !session.rrule) {
        currentClasses = currentClasses.filter(c => c.id !== session.id);
    } else {
        const sessionDate = startOfDay(new Date(session.date));
        currentClasses = currentClasses.filter(c => {
            if (c.rrule === session.rrule) {
                const cDate = startOfDay(new Date(c.date));
                const shouldDelete =
                    (scope === 'all') ||
                    (scope === 'future' && (cDate.getTime() >= sessionDate.getTime()));
                return !shouldDelete;
            }
            return true;
        });
    }
    await updateUserData('classes', currentClasses);
  };
  
  const subjectUpdater = createItemUpdater<Subject>('subjects');
  const assignmentUpdater = createItemUpdater<Assignment>('assignments');
  const examUpdater = createItemUpdater<Exam>('exams');

  const value: AppContextType = {
    isDataLoading,
    profile: userData?.profile!,
    subjects: userData?.subjects || [],
    classes: userData?.classes || [],
    assignments: userData?.assignments || [],
    exams: userData?.exams || [],
    updateProfile: (profile: Partial<UserProfile>) => updateUserData('profile', {...(userData?.profile || {}), ...profile}),
    addSubject: subjectUpdater.add,
    updateSubject: subjectUpdater.update,
    deleteSubject: subjectUpdater.delete,
    addClass,
    updateClass,
    deleteClass,
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
    deleteAccount,
    completeProfileSetup,
    getSubjectAttendance: (subjectName: string) => {
        const subjectClasses = (userData?.classes || []).filter(c => c.subject === subjectName && (c.status === 'attended' || c.status === 'missed'));
        const attended = subjectClasses.filter(c => c.status === 'attended').length;
        const total = subjectClasses.length;
        return { subject: subjectName, attended, total };
    },
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
