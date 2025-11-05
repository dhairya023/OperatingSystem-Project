
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonSubjects() {
  const SkeletonSubjectItem = () => (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div className="flex items-center gap-4">
        <Skeleton className="w-4 h-4 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SkeletonSubjectItem />
            <SkeletonSubjectItem />
            <SkeletonSubjectItem />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
