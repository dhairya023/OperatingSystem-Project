
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonAssignments() {

  const SkeletonAssignmentItem = () => (
    <div className="flex items-start gap-4 p-4 border rounded-lg">
      <Skeleton className="h-5 w-5 mt-1 rounded-sm" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <Skeleton className="h-7 w-24 mb-2" />
                <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
                <SkeletonAssignmentItem />
                <SkeletonAssignmentItem />
                <SkeletonAssignmentItem />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <Skeleton className="h-7 w-32 mb-2" />
                <Skeleton className="h-4 w-52" />
            </CardHeader>
            <CardContent className="space-y-4">
                <SkeletonAssignmentItem />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
