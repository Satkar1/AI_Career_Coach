import { ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSkeleton } from "@/components/loading-skeleton";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 grid-background">
        <div className="max-w-4xl mx-auto">
          <LoadingSkeleton lines={3} />
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    setLocation("/dashboard");
    return null;
  }

  return <>{children}</>;
}
