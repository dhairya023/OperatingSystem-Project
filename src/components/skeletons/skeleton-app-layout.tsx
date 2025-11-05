
'use client'
import { SkeletonSidebar } from '@/components/skeletons/skeleton-sidebar';
import { SkeletonHeader } from '@/components/skeletons/skeleton-header';
import { SkeletonDashboard } from '@/components/skeletons/skeleton-dashboard';
import { SkeletonTimetable } from './skeleton-timetable';
import { SkeletonAssignments } from './skeleton-assignments';
import { SkeletonAttendance } from './skeleton-attendance';
import { SkeletonExams } from './skeleton-exams';
import { SkeletonGrades } from './skeleton-grades';
import { SkeletonSubjects } from './skeleton-subjects';
import { SkeletonProfile } from './skeleton-profile';


export function SkeletonAppLayout({ pathname }: { pathname: string }) {

  const renderContentSkeleton = () => {
    switch(pathname) {
      case '/': return <SkeletonDashboard />;
      case '/timetable': return <SkeletonTimetable />;
      case '/assignments': return <SkeletonAssignments />;
      case '/attendance': return <SkeletonAttendance />;
      case '/exams': return <SkeletonExams />;
      case '/grades': return <SkeletonGrades />;
      case '/subjects': return <SkeletonSubjects />;
      case '/profile': return <SkeletonProfile />;
      default: return <SkeletonDashboard />;
    }
  }

  return (
    <div className="flex h-screen bg-black text-white">
        <div className="w-[17rem] p-2">
            <SkeletonSidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-transparent">
            <SkeletonHeader />
            {renderContentSkeleton()}
        </main>
    </div>
  );
}
