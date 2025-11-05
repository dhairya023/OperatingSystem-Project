
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonAttendance() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
              <Card>
                  <CardHeader>
                      <Skeleton className="h-7 w-36 mb-2" />
                      <Skeleton className="h-4 w-44" />
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className="flex flex-col gap-3 h-96">
                        <div className='p-3 border rounded-lg space-y-2'>
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                         <div className='p-3 border rounded-lg space-y-2'>
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                         <div className='p-3 border rounded-lg space-y-2'>
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                  </CardContent>
              </Card>
          </div>
          
          <div className="lg:col-span-3">
               <Card>
                  <CardHeader>
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                          <div>
                            <Skeleton className="h-7 w-40 mb-2" />
                            <Skeleton className="h-4 w-52" />
                          </div>
                          <Skeleton className="h-10 w-full md:w-[200px]" />
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                    </div>
                    <div className="space-y-2">
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 35 }).map((_, i) => (
                                <Skeleton key={i} className="h-9 w-9 rounded-full" />
                            ))}
                        </div>
                    </div>
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}
