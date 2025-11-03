import AttendanceOverview from "@/components/dashboard/attendance-overview";
import ExamCountdown from "@/components/dashboard/exam-countdown";
import PendingAssignments from "@/components/dashboard/pending-assignments";
import UpcomingClasses from "@/components/dashboard/upcoming-classes";
import PageHeader from "@/components/page-header";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Dashboard" description="Welcome back! Here's an overview of your academic life." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ExamCountdown />
        </div>
        <div className="lg:col-span-1">
          <AttendanceOverview />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingClasses />
        <PendingAssignments />
      </div>
    </div>
  );
}
