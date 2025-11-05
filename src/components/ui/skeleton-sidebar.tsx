
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonSidebar() {
  return (
    <div className="flex flex-col h-full p-4 border-r">
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
      <div className="mt-auto">
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
