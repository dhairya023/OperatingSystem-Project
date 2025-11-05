

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
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  deleteUser,
  signOut,
} from 'firebase/auth';
import { addDays, addMonths, startOfDay, getDay } from 'date-fns';

import type { ClassSession, Subject, Assignment, Exam, UserProfile, GradeSubject } from '@/lib/types';
import { useFirebase } from '@/firebase/provider';

interface HeaderState {
  title: string;
  description?: string;
  children?: React.ReactNode;
}
interface UserData {
  profile: UserProfile;
  subjects: Subject[];
  classes: ClassSession[];
  assignments: Assignment[];
  exams: Exam[];
  grades: GradeSubject[];
}

interface AppContextType extends UserData {
  isDataLoading: boolean;
  headerState: HeaderState;
  setHeaderState: (state: HeaderState) => void;
  addSubject: (subject: Subject) => Promise<void>;
  updateSubject: (subject: Subject) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  addClass: (session: ClassSession) => Promise<void>;
  updateClass: (session: ClassSession, scope: 'single' | 'future' | 'all') => Promise<void>;
  updateClassStatus: (sessionId: string, status: ClassSession['status']) => Promise<void>;
  deleteClass: (session: ClassSession, scope: 'single' | 'future' | 'all') => Promise<void>;
  addAssignment: (assignment: Assignment) => Promise<void>;
  updateAssignment: (assignment: Assignment) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  toggleAssignmentCompletion: (id: string) => Promise<void>;
  addExam: (exam: Exam) => Promise<void>;
  updateExam: (exam: Exam) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  completeProfileSetup: () => Promise<void>;
  getSubjectAttendance: any; // Simplified for now
  addGradeSubject: (subject: GradeSubject) => Promise<void>;
  updateGradeSubject: (subject: GradeSubject) => Promise<void>;
  deleteGradeSubject: (id: string) => Promise<void>;
  shareTimetable: () => Promise<string>;
  getSharedTimetable: (code: string) => Promise<{ subjects: Subject[], classes: ClassSession[] } | null>;
  importTimetable: (subjects: Subject[], classes: ClassSession[]) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialProfile: Omit<UserProfile, 'dateOfBirth'> = {
  fullName: '',
  email: '',
  course: '',
  branch: '',
  semester: '',
  collegeName: '',
  rollNumber: '',
  phoneNumber: '',
  profilePhotoUrl: '',
  profileCompleted: false,
};


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user, isUserLoading, auth, firestore } = useFirebase();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [headerState, setHeaderState] = useState<HeaderState>({ title: '' });
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
            profile: parseProfile(data.profile) || { ...(initialProfile as UserProfile), fullName: user.displayName, email: user.email },
            subjects: data.subjects || [],
            classes: parseDates(data.classes),
            assignments: parseDates(data.assignments),
            exams: parseDates(data.exams),
            grades: data.grades || [],
          });
        } else {
           setUserData({
            profile: { ...(initialProfile as UserProfile), fullName: user.displayName, email: user.email },
            subjects: [],
            classes: [],
            assignments: [],
            exams: [],
            grades: [],
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

  const loginUser = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };
  
  const registerUser = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    if (newUser) {
      const userDocRef = doc(firestore, 'users', newUser.uid);
      await setDoc(userDocRef, { 
          profile: {
            ...initialProfile,
            email: newUser.email,
            fullName: newUser.displayName || '',
          },
          subjects: [],
          classes: [],
          assignments: [],
          exams: [],
          grades: [],
      });
    }
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logoutUser = async () => {
    await signOut(auth);
    router.push('/login');
  }

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
    if (!user) throw new Error('User not logged in');
    let newClasses = [...(userData?.classes || [])];
  
    const baseSession = {
      subject: session.subject,
      teacher: session.teacher,
      startTime: session.startTime,
      endTime: session.endTime,
      room: session.room,
    };
  
    if (session.rrule) {
      const rruleId = session.rrule;
      const endDate = session.repeatUntil || addMonths(new Date(session.date), 3);
      let loopDate = startOfDay(new Date(session.date));
  
      while (loopDate <= endDate) {
        // Avoid adding duplicates
        if (!newClasses.some(c => c.rrule === rruleId && startOfDay(new Date(c.date)).getTime() === loopDate.getTime())) {
             newClasses.push({
                ...baseSession,
                id: crypto.randomUUID(),
                date: new Date(loopDate),
                rrule: rruleId,
                repeatUntil: endDate,
            });
        }
        loopDate = addDays(loopDate, 7);
      }
    } else {
      newClasses.push({
        ...baseSession,
        id: session.id,
        date: new Date(session.date),
      });
    }
    
    await updateUserData('classes', newClasses);
  };


  const updateClass = async (session: ClassSession, scope: 'single' | 'future' | 'all') => {
      let currentClasses = [...(userData?.classes || [])];
      
      if (scope === 'single' || !session.rrule) {
          // If it's a single instance or made to be single, just update it.
          // Also remove recurrence info if it was part of a series but now is a single instance.
          const updatedSession = { ...session, rrule: undefined, repeatUntil: undefined };
          currentClasses = currentClasses.map(c => c.id === session.id ? updatedSession : c);
      } else {
          const sessionDate = startOfDay(new Date(session.date));
          currentClasses = currentClasses.map(c => {
              if (c.rrule === session.rrule) {
                  const cDate = startOfDay(new Date(c.date));
                  const shouldUpdate = 
                      (scope === 'all') ||
                      (scope === 'future' && (cDate.getTime() >= sessionDate.getTime()));
                  
                  if (shouldUpdate) {
                      // Preserve original date and id, but update other details
                      return {
                          ...c,
                          subject: session.subject,
                          teacher: session.teacher,
                          startTime: session.startTime,
                          endTime: session.endTime,
                          room: session.room,
                      };
                  }
              }
              return c;
          });
      }
      await updateUserData('classes', currentClasses);
  };
  
  const updateClassStatus = async (sessionId: string, status: ClassSession['status']) => {
    const currentClasses = [...(userData?.classes || [])];
    const classIndex = currentClasses.findIndex(c => c.id === sessionId);
    if (classIndex !== -1) {
        currentClasses[classIndex].status = status;
        await updateUserData('classes', currentClasses);
    }
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

  const shareTimetable = async (): Promise<string> => {
    if (!user || !userData) throw new Error('User not logged in or data not loaded');
    
    const shortCode = crypto.randomUUID().substring(0, 8);
    const shareDocRef = doc(firestore, 'sharedTimetables', shortCode);
    
    await setDoc(shareDocRef, {
      ownerId: user.uid,
      createdAt: serverTimestamp(),
      timetableData: {
        subjects: userData.subjects,
        classes: userData.classes,
      }
    });
    
    return shortCode;
  };

  const getSharedTimetable = async (code: string): Promise<{ subjects: Subject[], classes: ClassSession[] } | null> => {
    const shareDocRef = doc(firestore, 'sharedTimetables', code);
    const docSnap = await getDoc(shareDocRef);
    if (docSnap.exists()) {
      return docSnap.data().timetableData;
    }
    return null;
  };
  
  const importTimetable = async (subjects: Subject[], classes: ClassSession[]) => {
    if (!user) throw new Error('User not logged in');
    const userDocRef = doc(firestore, 'users', user.uid);
    await updateDoc(userDocRef, {
      subjects: subjects,
      classes: classes.map(c => ({...c, date: new Date(c.date)})) // Ensure dates are Date objects
    });
  };
  
  const subjectUpdater = createItemUpdater<Subject>('subjects');
  const assignmentUpdater = createItemUpdater<Assignment>('assignments');
  const examUpdater = createItemUpdater<Exam>('exams');
  const gradeUpdater = createItemUpdater<GradeSubject>('grades');


  const value: AppContextType = {
    isDataLoading,
    headerState,
    setHeaderState,
    profile: userData?.profile!,
    subjects: userData?.subjects || [],
    classes: userData?.classes || [],
    assignments: userData?.assignments || [],
    exams: userData?.exams || [],
    grades: userData?.grades || [],
    updateProfile: (profile: Partial<UserProfile>) => updateUserData('profile', {...(userData?.profile || {}), ...profile}),
    addSubject: subjectUpdater.add,
    updateSubject: subjectUpdater.update,
    deleteSubject: subjectUpdater.delete,
    addClass,
    updateClass,
    updateClassStatus,
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
    loginUser,
    registerUser,
    sendPasswordReset,
    logoutUser,
    deleteAccount,
    completeProfileSetup,
    getSubjectAttendance: (subjectName: string) => {
        const subjectClasses = (userData?.classes || []).filter(c => c.subject === subjectName && (c.status === 'attended' || c.status === 'missed'));
        const attended = subjectClasses.filter(c => c.status === 'attended').length;
        const total = subjectClasses.length;
        return { subject: subjectName, attended, total };
    },
    addGradeSubject: gradeUpdater.add,
    updateGradeSubject: gradeUpdater.update,
    deleteGradeSubject: gradeUpdater.delete,
    shareTimetable,
    getSharedTimetable,
    importTimetable,
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

    