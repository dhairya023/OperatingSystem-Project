
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonDashboard() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        {/* Summary Card */}
        <div className="relative rounded-2xl p-[2px] bg-muted/50">
            <Card className="border-none">
                <CardContent className="p-4 md:p-6 bg-background rounded-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0 space-y-2">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 md:gap-3 text-center w-full md:w-auto">
                            {Array.from({ length: 3 }).map((_, i) => (
                                 <div key={i} className="p-2 md:p-3 rounded-lg bg-muted/50 flex flex-col items-center justify-center gap-1 w-24 h-24">
                                    <Skeleton className="h-5 w-5 rounded-full" />
                                    <Skeleton className="h-6 w-10" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
        </div>
    </div>
  );
}
