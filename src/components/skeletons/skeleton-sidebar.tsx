
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonSidebar() {
  return (
    <div className="flex h-full w-full flex-col bg-card/50 backdrop-blur-md border border-border/40 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-border/40">
            <div className="flex items-center gap-2 p-2">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-7 w-24" />
            </div>
        </div>

        <div className="flex-1 px-3 py-4 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
                 <div key={i} className="flex items-center gap-4 rounded-lg px-4 py-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-full" />
                </div>
            ))}
        </div>

        <div className="p-4 border-t border-border/40 mt-auto">
            <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 flex-1" />
            </div>
        </div>
    </div>
  );
}
