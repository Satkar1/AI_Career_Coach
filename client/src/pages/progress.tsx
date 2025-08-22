import { useCareerData } from "@/hooks/use-career-data";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { LoadingSkeleton, ChartSkeleton } from "@/components/loading-skeleton";
import { ProgressChart, SkillsChart } from "@/components/progress-chart";
import { 
  BarChart3, Target, TrendingUp, Award, Calendar, 
  Download, Share, RefreshCw, CheckCircle, Clock,
  Star, Trophy, Zap, ArrowUp, ArrowDown, Minus
} from "lucide-react";

export default function ProgressPage() {
  const { 
    assessments, resumes, interviews, careerPaths, skills, goals,
    isLoadingAssessments, isLoadingResumes, isLoadingInterviews,
    isLoadingCareerPaths, isLoadingSkills, isLoadingGoals
  } = useCareerData();

  // Calculate metrics
  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const goalCompletionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const averageSkillLevel = skills.length > 0 
    ? Math.round(skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length)
    : 0;

  const latestAssessment = assessments[0];
  const careerScore = latestAssessment?.score || 0;
  const previousScore = assessments[1]?.score || careerScore;
  const scoreChange = careerScore - previousScore;

  const completedInterviews = interviews.filter(interview => interview.completedAt).length;
  const averageInterviewScore = completedInterviews > 0
    ? Math.round(interviews
        .filter(interview => interview.score)
        .reduce((sum, interview) => sum + (interview.score || 0), 0) / completedInterviews)
    : 0;

  // Mock progress data for charts
  const progressData = [
    { date: "Jan", score: Math.max(0, careerScore - 15), skills: Math.max(0, skills.length - 3), interviews: Math.max(0, completedInterviews - 2) },
    { date: "Feb", score: Math.max(0, careerScore - 10), skills: Math.max(0, skills.length - 2), interviews: Math.max(0, completedInterviews - 1) },
    { date: "Mar", score: Math.max(0, careerScore - 5), skills: Math.max(0, skills.length - 1), interviews: completedInterviews },
    { date: "Apr", score: careerScore, skills: skills.length, interviews: completedInterviews },
  ];

  const skillsData = [
    { date: "Jan", skills: Math.max(0, averageSkillLevel - 2) },
    { date: "Feb", skills: Math.max(0, averageSkillLevel - 1.5) },
    { date: "Mar", skills: Math.max(0, averageSkillLevel - 0.5) },
    { date: "Apr", skills: averageSkillLevel },
  ];

  const milestones = [
    {
      id: 1,
      title: "First Career Assessment",
      description: "Completed comprehensive career analysis",
      date: assessments[0]?.completedAt ? new Date(assessments[0].completedAt).toLocaleDateString() : "Not completed",
      completed: !!assessments[0]?.completedAt,
      icon: BarChart3
    },
    {
      id: 2,
      title: "Resume Optimization",
      description: "Achieved 80+ resume score",
      date: resumes.find(r => (r.score || 0) >= 80)?.updatedAt ? new Date(resumes.find(r => (r.score || 0) >= 80)!.updatedAt).toLocaleDateString() : "Pending",
      completed: resumes.some(r => (r.score || 0) >= 80),
      icon: Target
    },
    {
      id: 3,
      title: "Interview Ready",
      description: "Completed 5 mock interviews",
      date: completedInterviews >= 5 ? new Date().toLocaleDateString() : "Pending",
      completed: completedInterviews >= 5,
      icon: Trophy
    },
    {
      id: 4,
      title: "Skill Master",
      description: "Reached advanced level in 3+ skills",
      date: skills.filter(s => s.level >= 7).length >= 3 ? new Date().toLocaleDateString() : "Pending",
      completed: skills.filter(s => s.level >= 7).length >= 3,
      icon: Award
    }
  ];

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  if (isLoadingAssessments || isLoadingResumes || isLoadingInterviews || 
      isLoadingCareerPaths || isLoadingSkills || isLoadingGoals) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 grid-background">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 grid-background">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4" data-testid="progress-title">
              Progress Tracking
            </h1>
            <p className="text-lg text-muted-foreground">
              Monitor your career development journey with comprehensive analytics and insights.
            </p>
          </div>
          <div className="flex space-x-4 mt-6 md:mt-0">
            <Button variant="outline" data-testid="refresh-data-button">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline" data-testid="download-report-button">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" data-testid="share-progress-button">
              <Share className="w-4 h-4 mr-2" />
              Share Progress
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard data-testid="career-score-metric">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Career Score</h3>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{careerScore}/100</div>
              <ProgressBar value={careerScore} className="h-2" />
              <div className="flex items-center space-x-1">
                {getChangeIcon(scoreChange)}
                <span className={`text-sm ${getChangeColor(scoreChange)}`}>
                  {scoreChange > 0 ? '+' : ''}{scoreChange} from last assessment
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard data-testid="goals-completion-metric">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Goals Completion</h3>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{Math.round(goalCompletionRate)}%</div>
              <ProgressBar value={goalCompletionRate} className="h-2" />
              <p className="text-sm text-muted-foreground">{completedGoals} of {totalGoals} goals achieved</p>
            </div>
          </GlassCard>

          <GlassCard data-testid="skills-average-metric">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Average Skill Level</h3>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{averageSkillLevel}/10</div>
              <ProgressBar value={averageSkillLevel * 10} className="h-2" />
              <p className="text-sm text-muted-foreground">{skills.length} skills tracked</p>
            </div>
          </GlassCard>

          <GlassCard data-testid="interview-performance-metric">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Interview Performance</h3>
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{averageInterviewScore}/100</div>
              <ProgressBar value={averageInterviewScore} className="h-2" />
              <p className="text-sm text-muted-foreground">{completedInterviews} interviews completed</p>
            </div>
          </GlassCard>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProgressChart 
            data={progressData} 
            title="Overall Progress"
            description="Track your career development over time"
          />
          <SkillsChart data={skillsData} />
        </div>

        {/* Milestones and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Career Milestones */}
          <GlassCard data-testid="career-milestones">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Career Milestones
            </h3>
            <div className="space-y-4">
              {milestones.map((milestone) => {
                const Icon = milestone.icon;
                return (
                  <div 
                    key={milestone.id} 
                    className={`flex items-start space-x-4 p-4 rounded-lg border ${
                      milestone.completed 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : 'bg-muted/30 border-border'
                    }`}
                    data-testid={`milestone-${milestone.id}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      milestone.completed 
                        ? 'bg-green-500' 
                        : 'bg-muted'
                    }`}>
                      {milestone.completed ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{milestone.date}</span>
                        {milestone.completed && (
                          <Badge variant="secondary" className="text-xs">Completed</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard data-testid="recent-activity">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {/* Recent Assessment */}
              {latestAssessment && (
                <div className="flex items-start space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg" data-testid="recent-assessment">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Career Assessment Completed</h4>
                    <p className="text-sm text-muted-foreground">Score: {latestAssessment.score}/100</p>
                    <p className="text-xs text-muted-foreground">
                      {latestAssessment.completedAt && new Date(latestAssessment.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Recent Resume */}
              {resumes[0] && (
                <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg" data-testid="recent-resume">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Resume Analyzed</h4>
                    <p className="text-sm text-muted-foreground">{resumes[0].title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(resumes[0].updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Recent Interview */}
              {interviews[0] && (
                <div className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg" data-testid="recent-interview">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Mock Interview</h4>
                    <p className="text-sm text-muted-foreground">{interviews[0].jobTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(interviews[0].createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Recent Skills */}
              {skills.slice(0, 2).map((skill) => (
                <div key={skill.id} className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg" data-testid={`recent-skill-${skill.id}`}>
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Skill Added</h4>
                    <p className="text-sm text-muted-foreground">{skill.name} - Level {skill.level}/10</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(skill.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Goals Progress */}
        {goals.length > 0 && (
          <GlassCard data-testid="goals-progress">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-500" />
              Goals Progress
            </h3>
            <div className="space-y-4">
              {goals.slice(0, 5).map((goal) => (
                <div key={goal.id} className="p-4 border border-border rounded-lg" data-testid={`goal-progress-${goal.id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{goal.title}</h4>
                    <Badge variant={goal.completed ? "default" : "secondary"}>
                      {goal.completed ? "Completed" : `${goal.progress}%`}
                    </Badge>
                  </div>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                  )}
                  <div className="space-y-2">
                    <ProgressBar value={goal.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress: {goal.progress}%</span>
                      {goal.targetDate && (
                        <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
