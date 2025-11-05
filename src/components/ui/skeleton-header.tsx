
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonHeader() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
  );
}
