
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonGrades() {
  const SkeletonSemesterCard = () => (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center w-full">
            <div className="space-y-2">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex flex-col items-end space-y-1">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-6 w-12" />
            </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 bg-muted/50 rounded-xl">
            <div className="text-center space-y-2">
              <Skeleton className="h-4 w-10 mx-auto" />
              <Skeleton className="h-12 w-24 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="w-full space-y-4">
        <SkeletonSemesterCard />
        <SkeletonSemesterCard />
        <SkeletonSemesterCard />
      </div>
    </div>
  );
}
