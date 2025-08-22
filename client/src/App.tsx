import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { AuthGuard } from "@/components/auth-guard";
import { Navigation } from "@/components/navigation";

// Pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Onboarding from "@/pages/onboarding";
import Assessment from "@/pages/assessment";
import ResumeAnalysis from "@/pages/resume-analysis";
import MockInterview from "@/pages/mock-interview";
import CareerPaths from "@/pages/career-paths";
import SkillAnalysis from "@/pages/skill-analysis";
import Progress from "@/pages/progress";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login">
        <AuthGuard requireAuth={false}>
          <Login />
        </AuthGuard>
      </Route>
      <Route path="/signup">
        <AuthGuard requireAuth={false}>
          <Signup />
        </AuthGuard>
      </Route>
      <Route path="/dashboard">
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      </Route>
      <Route path="/onboarding">
        <AuthGuard>
          <Onboarding />
        </AuthGuard>
      </Route>
      <Route path="/assessment">
        <AuthGuard>
          <Assessment />
        </AuthGuard>
      </Route>
      <Route path="/resume-analysis">
        <AuthGuard>
          <ResumeAnalysis />
        </AuthGuard>
      </Route>
      <Route path="/mock-interview">
        <AuthGuard>
          <MockInterview />
        </AuthGuard>
      </Route>
      <Route path="/career-paths">
        <AuthGuard>
          <CareerPaths />
        </AuthGuard>
      </Route>
      <Route path="/skill-analysis">
        <AuthGuard>
          <SkillAnalysis />
        </AuthGuard>
      </Route>
      <Route path="/progress">
        <AuthGuard>
          <Progress />
        </AuthGuard>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="ai-career-coach-theme">
          <TooltipProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Navigation />
              <main>
                <Router />
              </main>
              <Toaster />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
