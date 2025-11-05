
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonTimetable() {
  const SkeletonTimetableCard = () => (
    <div className="p-4 md:p-6 flex flex-col gap-2 rounded-xl border">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-1/4 mt-1" />
    </div>
  );

  return (
    <div className="flex flex-col gap-8 w-full p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-muted/50">
          <Skeleton className="h-10 w-10" />
          <div className="text-center space-y-1">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-10" />
        </div>

        <div className="pb-6">
          <div className="flex flex-col gap-3 md:gap-4">
            <SkeletonTimetableCard />
            <SkeletonTimetableCard />
            <SkeletonTimetableCard />
          </div>
        </div>
      </div>
    </div>
  );
}
