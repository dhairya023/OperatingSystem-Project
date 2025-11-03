'use client';
import PageHeader from '@/components/page-header';
import { useAppContext } from '@/context/app-context';

export default function TimetablePage() {
  const { subjects } = useAppContext();
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Timetable" description="Manage your class schedule." />
      {subjects.length === 0 ? (
        <div className="flex h-[60vh] items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">No subjects found.</p>
            <p className="text-sm text-muted-foreground/80">Add subjects in the 'Subjects' page to build your timetable.</p>
          </div>
        </div>
      ) : (
        <div className="flex h-[60vh] items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">Coming Soon</p>
            <p className="text-sm text-muted-foreground/80">The timetable management feature is under construction.</p>
          </div>
        </div>
      )}
    </div>
  );
}
