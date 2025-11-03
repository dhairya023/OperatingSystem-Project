'use client';
import AttendanceOverview from "@/components/dashboard/attendance-overview";
import DashboardSummary from "@/components/dashboard/dashboard-summary";
import ExamCountdown from "@/components/dashboard/exam-countdown";
import PendingAssignments from "@/components/dashboard/pending-assignments";
import UpcomingClasses from "@/components/dashboard/upcoming-classes";
import PageHeader from "@/components/page-header";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <PageHeader title="Dashboard" description="Welcome back! Here's an overview of your academic life." />
      
      <DashboardSummary />

      <div className="grid gap-6 lg:grid-cols-2">
        <ExamCountdown />
        <AttendanceOverview />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingClasses />
        <PendingAssignments />
      </div>
    </div>
  );
}
