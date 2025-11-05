
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonHeader() {
  return (
    <header className="flex items-center justify-between p-4 md:p-6 lg:p-8 sticky top-0 z-10 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
    </header>
  );
}
