import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";

// Pages
import Home from "@/pages/home";
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
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/resume-analysis" component={ResumeAnalysis} />
      <Route path="/mock-interview" component={MockInterview} />
      <Route path="/career-paths" component={CareerPaths} />
      <Route path="/skill-analysis" component={SkillAnalysis} />
      <Route path="/progress" component={Progress} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
