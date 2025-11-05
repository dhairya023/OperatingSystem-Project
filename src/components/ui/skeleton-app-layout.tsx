
'use client'
import { SkeletonSidebar } from '@/components/ui/skeleton-sidebar';
import { SkeletonHeader } from '@/components/ui/skeleton-header';
import { SkeletonDashboard } from '@/components/ui/skeleton-dashboard';

export function SkeletonAppLayout() {
  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 fixed h-full">
        <SkeletonSidebar />
      </div>
      <main className="flex-1 ml-64">
        <SkeletonHeader />
        <SkeletonDashboard />
      </main>
    </div>
  );
}
