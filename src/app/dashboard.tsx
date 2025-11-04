'use client';
import AttendanceOverview from "@/components/dashboard/attendance-overview";
import DashboardSummary from "@/components/dashboard/dashboard-summary";
import ExamCountdown from "@/components/dashboard/exam-countdown";
import NextLecture from "@/components/dashboard/next-lecture";
import PendingAssignments from "@/components/dashboard/pending-assignments";
import UpcomingClasses from "@/components/dashboard/upcoming-classes";
import PageHeader from "@/components/page-header";
import { useState, useEffect } from 'react';
import { useAppContext } from "@/context/app-context";

export default function Dashboard() {
  const { profile } = useAppContext();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    const name = profile?.fullName?.split(' ')[0] || '';
    let timeOfDay;
    if (hour < 12) {
      timeOfDay = 'Good morning';
    } else if (hour < 18) {
      timeOfDay = 'Good afternoon';
    } else {
      timeOfDay = 'Good evening';
    }
    setGreeting(`${timeOfDay}, ${name} 👋`);
  }, [profile]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <PageHeader title="Dashboard" description={greeting} />
      
      <DashboardSummary />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NextLecture />
        <ExamCountdown />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingClasses />
        <AttendanceOverview />
      </div>

      <div className="grid gap-6">
          <PendingAssignments />
      </div>
    </div>
  );
}
