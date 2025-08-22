import { useCareerData } from "@/hooks/use-career-data";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton, CardSkeleton } from "@/components/loading-skeleton";
import { ProgressChart } from "@/components/progress-chart";
import { Link } from "wouter";
import { 
  BarChart3, FileText, MessageSquare, TrendingUp, Target, 
  Zap, Clock, CheckCircle, AlertCircle, Trophy, 
  ArrowRight, Plus, Calendar, Star
} from "lucide-react";

export default function Dashboard() {
  const { 
    assessments, resumes, interviews, careerPaths, skills, goals,
    isLoadingAssessments, isLoadingResumes, isLoadingInterviews,
    isLoadingCareerPaths, isLoadingSkills, isLoadingGoals
  } = useCareerData();

  // Calculate overall progress
  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const overallProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  // Calculate career score based on various factors
  const latestAssessment = assessments[0];
  const careerScore = latestAssessment?.score || 75; // Default score

  // Mock progress data for chart
  const progressData = [
    { date: "Jan", score: 65, skills: 8, interviews: 2 },
    { date: "Feb", score: 70, skills: 10, interviews: 3 },
    { date: "Mar", score: 75, skills: 12, interviews: 4 },
    { date: "Apr", score: careerScore, skills: skills.length, interviews: interviews.length },
  ];

  const quickActions = [
    {
      title: "Take Assessment",
      description: "Complete your career assessment",
      icon: BarChart3,
      href: "/assessment",
      color: "blue"
    },
    {
      title: "Analyze Resume",
      description: "Get AI-powered resume feedback",
      icon: FileText,
      href: "/resume-analysis",
      color: "green"
    },
    {
      title: "Practice Interview",
      description: "Mock interview sessions",
      icon: MessageSquare,
      href: "/mock-interview",
      color: "purple"
    },
    {
      title: "Explore Careers",
      description: "Discover career paths",
      icon: TrendingUp,
      href: "/career-paths",
      color: "orange"
    }
  ];

  const upcomingTasks = [
    { id: 1, task: "Complete Python skills assessment", dueDate: "Tomorrow", priority: "high" },
    { id: 2, task: "Update LinkedIn profile", dueDate: "This week", priority: "medium" },
    { id: 3, task: "Practice behavioral questions", dueDate: "Next week", priority: "low" },
  ];

  const recentAchievements = [
    { id: 1, title: "Assessment Completed", description: "Career assessment scored 8.5/10", icon: Trophy },
    { id: 2, title: "Resume Optimized", description: "Resume score improved by 25%", icon: FileText },
    { id: 3, title: "Interview Practice", description: "Completed 3 mock interviews", icon: MessageSquare },
  ];

  if (isLoadingAssessments || isLoadingResumes || isLoadingInterviews || 
      isLoadingCareerPaths || isLoadingSkills || isLoadingGoals) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 grid-background">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 grid-background">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-foreground mb-2" data-testid="dashboard-title">
            Welcome back, Professional! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's your career development progress and recommendations
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard data-testid="career-score-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Career Score</h3>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{careerScore}/100</div>
              <Progress value={careerScore} className="h-2" />
              <p className="text-sm text-muted-foreground">+5 from last month</p>
            </div>
          </GlassCard>

          <GlassCard data-testid="skills-progress-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Skills Progress</h3>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{skills.length}</div>
              <p className="text-sm text-muted-foreground">Skills tracked</p>
              <div className="text-sm text-green-600">+3 this month</div>
            </div>
          </GlassCard>

          <GlassCard data-testid="goals-progress-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Goals Progress</h3>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{Math.round(overallProgress)}%</div>
              <Progress value={overallProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">{completedGoals} of {totalGoals} completed</p>
            </div>
          </GlassCard>

          <GlassCard data-testid="interview-readiness-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Interview Ready</h3>
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">8.5/10</div>
              <Progress value={85} className="h-2" />
              <p className="text-sm text-muted-foreground">{interviews.length} sessions completed</p>
            </div>
          </GlassCard>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Chart */}
          <div className="lg:col-span-2">
            <ProgressChart data={progressData} />
          </div>

          {/* Quick Actions */}
          <GlassCard data-testid="quick-actions-card">
            <h3 className="text-xl font-bold text-foreground mb-6">Quick Actions</h3>
            <div className="space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} href={action.href}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group" data-testid={`quick-action-${index}`}>
                      <div className={`w-10 h-10 bg-${action.color}-100 dark:bg-${action.color}-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-5 h-5 text-${action.color}-500`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{action.title}</h4>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Additional Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <GlassCard data-testid="upcoming-tasks-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Upcoming Tasks</h3>
              <Button variant="outline" size="sm" data-testid="add-task-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg" data-testid={`task-${task.id}`}>
                  <div className="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{task.task}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{task.dueDate}</span>
                      <Badge 
                        variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Recent Achievements */}
          <GlassCard data-testid="achievements-card">
            <h3 className="text-xl font-bold text-foreground mb-6">Recent Achievements</h3>
            <div className="space-y-4">
              {recentAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg" data-testid={`achievement-${achievement.id}`}>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* AI Recommendations */}
        <GlassCard className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20" data-testid="ai-recommendations-card">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">AI Recommendation</h3>
              <p className="text-muted-foreground mb-4">
                Based on your profile analysis, we recommend focusing on advanced data visualization skills 
                to strengthen your candidacy for Senior Data Analyst positions. Consider taking courses in 
                Tableau, Power BI, or D3.js to enhance your skillset.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Tableau</Badge>
                <Badge variant="secondary">Power BI</Badge>
                <Badge variant="secondary">D3.js</Badge>
                <Badge variant="secondary">Data Storytelling</Badge>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
