
import { SkeletonCard } from '@/components/ui/skeleton-card';

export function SkeletonDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
      {[...Array(8)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
