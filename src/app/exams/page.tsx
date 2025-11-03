import PageHeader from '@/components/page-header';

export default function ExamsPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <PageHeader title="Exams" description="Schedule and prepare for your upcoming exams." />
      <div className="flex h-[60vh] items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">Coming Soon</p>
          <p className="text-sm text-muted-foreground/80">The exam scheduler is under construction.</p>
        </div>
      </div>
    </div>
  );
}
