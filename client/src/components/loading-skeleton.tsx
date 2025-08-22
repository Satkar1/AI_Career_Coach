import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)} data-testid="loading-skeleton">
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "skeleton h-4 rounded",
            i === lines - 1 && "w-3/4" // Last line is shorter
          )}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4" data-testid="card-skeleton">
      <div className="skeleton h-6 w-1/3 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-10 w-1/4 rounded" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass rounded-2xl p-6" data-testid="chart-skeleton">
      <div className="skeleton h-6 w-1/3 rounded mb-6" />
      <div className="skeleton h-64 w-full rounded" />
    </div>
  );
}
