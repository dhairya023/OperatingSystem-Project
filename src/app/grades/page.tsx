
'use client';
import AppLayout from '@/components/app-layout';
import PageHeader from '@/components/page-header';
import GradesContent from '@/components/grades/grades-content';

export default function GradesPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        <PageHeader
          title="Grades"
          description="Track your academic performance, semester by semester."
        />
        <GradesContent />
      </div>
    </AppLayout>
  );
}
