
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonExams() {
  const SkeletonExamItem = () => (
    <div className="flex items-start gap-4 p-4 border rounded-lg">
      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="grid gap-8 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <SkeletonExamItem />
            <SkeletonExamItem />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <SkeletonExamItem />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
