'use client';

import { MOCK_CLASSES, MOCK_SUBJECTS_LIST, MOCK_ASSIGNMENTS, MOCK_EXAMS } from '@/lib/placeholder-data';
import type { ClassSession, Subject, SubjectAttendance, Assignment, Exam } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Helper to safely get data from localStorage
const getFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item, (k, v) => {
            // Revive dates from string format
            if (k === 'date' || k === 'dueDate') {
                return new Date(v);
            }
            return v;
        }) : defaultValue;
    } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

// Helper to safely set data in localStorage
const setInLocalStorage = <T,>(key: string, value: T) => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
    }
};


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
  assignments: Assignment[];
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (assignment: Assignment) => void;
  deleteAssignment: (id: string) => void;
  toggleAssignmentCompletion: (id: string) => void;
  exams: Exam[];
  addExam: (exam: Exam) => void;
  updateExam: (exam: Exam) => void;
  deleteExam: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [subjects, setSubjects] = useState<Subject[]>(() => getFromLocalStorage('subjects', MOCK_SUBJECTS_LIST));
  const [classes, setClasses] = useState<ClassSession[]>(() => getFromLocalStorage('classes', MOCK_CLASSES));
  const [assignments, setAssignments] = useState<Assignment[]>(() => getFromLocalStorage('assignments', MOCK_ASSIGNMENTS));
  const [exams, setExams] = useState<Exam[]>(() => getFromLocalStorage('exams', MOCK_EXAMS));
  
  useEffect(() => {
    setInLocalStorage('subjects', subjects);
  }, [subjects]);

  useEffect(() => {
    setInLocalStorage('classes', classes);
  }, [classes]);
  
  useEffect(() => {
    setInLocalStorage('assignments', assignments);
  }, [assignments]);

  useEffect(() => {
    setInLocalStorage('exams', exams);
  }, [exams]);

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
    const relevantClasses = subjectClasses.filter(c => c.status !== 'holiday' && c.status !== 'cancelled');
    const attended = relevantClasses.filter(c => c.status === 'attended').length;
    const total = relevantClasses.length;
    return { subject: subjectName, attended, total };
  }
  
  const addAssignment = (assignment: Assignment) => {
    setAssignments([...assignments, assignment]);
  };

  const updateAssignment = (updatedAssignment: Assignment) => {
    setAssignments(assignments.map((a) => (a.id === updatedAssignment.id ? updatedAssignment : a)));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };
  
  const toggleAssignmentCompletion = (id: string) => {
    setAssignments(assignments.map(a => a.id === id ? {...a, completed: !a.completed} : a));
  }

  const addExam = (exam: Exam) => {
    setExams([...exams, exam]);
  };

  const updateExam = (updatedExam: Exam) => {
    setExams(exams.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
  };

  const deleteExam = (id: string) => {
    setExams(exams.filter((e) => e.id !== id));
  };


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
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleAssignmentCompletion,
    exams,
    addExam,
    updateExam,
    deleteExam,
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
