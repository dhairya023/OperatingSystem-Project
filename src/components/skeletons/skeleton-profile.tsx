
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonProfile() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="w-5 h-5 rounded mt-1" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card className="border-destructive/50">
          <CardHeader>
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 mt-2" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-40" />
          </CardFooter>
      </Card>
    </div>
  );
}
