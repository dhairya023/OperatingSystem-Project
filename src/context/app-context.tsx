'use client';

import { MOCK_CLASSES, MOCK_SUBJECTS_LIST } from '@/lib/placeholder-data';
import type { ClassSession, Subject, SubjectAttendance } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  subjects: Subject[];
  addSubject: (subject: Subject) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;
  classes: ClassSession[];
  addClass: (session: ClassSession) => void;
  updateClass: (session: ClassSession) => void;
  deleteClass: (id: string) => void;
  getSubjectAttendance: (subjectName: string) => SubjectAttendance;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS_LIST);
  const [classes, setClasses] = useState<ClassSession[]>(MOCK_CLASSES);

  const addSubject = (subject: Subject) => {
    setSubjects([...subjects, subject]);
  };

  const updateSubject = (updatedSubject: Subject) => {
    setSubjects(subjects.map((s) => (s.id === updatedSubject.id ? updatedSubject : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };
  
  const addClass = (session: ClassSession) => {
    setClasses([...classes, session]);
  }

  const updateClass = (updatedSession: ClassSession) => {
    setClasses(classes.map(c => c.id === updatedSession.id ? updatedSession : c));
  }

  const deleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  }

  const getSubjectAttendance = (subjectName: string) : SubjectAttendance => {
    const subjectClasses = classes.filter(c => c.subject === subjectName);
    const relevantClasses = subjectClasses.filter(c => c.status !== 'holiday');
    const attended = relevantClasses.filter(c => c.status === 'attended').length;
    const total = relevantClasses.length;
    return { subject: subjectName, attended, total };
  }

  const value = {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    classes,
    addClass,
    updateClass,
    deleteClass,
    getSubjectAttendance,
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
