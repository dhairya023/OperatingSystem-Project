
'use client';
import DashboardSummary from "@/components/dashboard/dashboard-summary";
import ExamCountdown from "@/components/dashboard/exam-countdown";
import NextLecture from "@/components/dashboard/next-lecture";
import PendingAssignments from "@/components/dashboard/pending-assignments";
import UpcomingClasses from "@/components/dashboard/upcoming-classes";
import { useState, useEffect } from 'react';
import { useAppContext } from "@/context/app-context";

export default function Dashboard() {
  const { profile, setHeaderState } = useAppContext();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // This code runs only on the client, avoiding server/client mismatches.
    const hour = new Date().getHours();
    // Use the first name from the user's profile, or a generic greeting if not available.
    const name = profile?.fullName?.split(' ')[0] || 'there';
    
    let timeOfDay;
    if (hour < 12) {
      timeOfDay = 'Good morning';
    } else if (hour < 18) {
      timeOfDay = 'Good afternoon';
    } else {
      timeOfDay = 'Good evening';
    }
    const newGreeting = `${timeOfDay}, ${name} 👋`
    setGreeting(newGreeting);
    setHeaderState({title: newGreeting});

  }, [profile, setHeaderState]); // Rerun this effect if the profile data changes.

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      
      <DashboardSummary />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NextLecture />
        <ExamCountdown />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingClasses />
        <PendingAssignments />
      </div>
    </div>
  );
}
