
'use client'
import { SkeletonSidebar } from '@/components/skeletons/skeleton-sidebar';
import { SkeletonHeader } from '@/components/skeletons/skeleton-header';
import { Loader } from '@/components/ui/loader';

export function SkeletonAppLayout({ pathname }: { pathname: string }) {

  return (
    <div className="flex h-screen bg-black text-white">
        <div className="w-[17rem] p-2">
            <SkeletonSidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-transparent flex flex-col">
            <SkeletonHeader />
            <div className="flex-1 flex items-center justify-center">
              <Loader />
            </div>
        </main>
    </div>
  );
}
