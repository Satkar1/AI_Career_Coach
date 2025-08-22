import { useState } from "react";
import { CareerAssessmentForm } from "@/components/career-assessment-form";
import { GlassCard } from "@/components/glass-card";
import { useCareerData } from "@/hooks/use-career-data";
import { useToast } from "@/hooks/use-toast";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  BarChart3, CheckCircle, TrendingUp, Target, 
  ArrowRight, RefreshCw, FileText, Star
} from "lucide-react";

export default function Assessment() {
  const [, setLocation] = useLocation();
  const [showResults, setShowResults] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  
  const { createAssessment, assessments, isLoadingAssessments } = useCareerData();
  const { toast } = useToast();

  const handleAssessmentSubmit = async (data: any) => {
    try {
      const result = await createAssessment.mutateAsync({
        type: "career",
        data: data,
      });

      setAssessmentResults(result);
      setShowResults(true);

      toast({
        title: "Assessment Complete!",
        description: "Your career assessment has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Assessment Error",
        description: "There was an issue processing your assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderResults = () => {
    if (!assessmentResults || !assessmentResults.results) {
      return (
        <GlassCard className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Analyzing Your Assessment...</h3>
          <p className="text-muted-foreground">
            Our AI is processing your responses to generate personalized career insights.
          </p>
        </GlassCard>
      );
    }

    const results = assessmentResults.results;

    return (
      <div className="space-y-6">
        {/* Overall Score */}
        <GlassCard data-testid="assessment-results">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">{results.overallScore}</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Your Career Score</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Based on your responses, here's your personalized career analysis
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => setLocation("/dashboard")} data-testid="view-dashboard-button">
                View Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowResults(false)}
                data-testid="retake-assessment-button"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake Assessment
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Recommended Roles */}
        <GlassCard>
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Recommended Career Paths
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {results.recommendedRoles?.map((role: string, index: number) => (
              <div key={index} className="p-4 border border-border rounded-lg" data-testid={`recommended-role-${index}`}>
                <h4 className="font-semibold text-foreground">{role}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  High compatibility based on your interests and skills
                </p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Badge variant="secondary">95% Match</Badge>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Strengths and Areas for Improvement */}
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Your Strengths
            </h3>
            <ul className="space-y-3">
              {results.strengths?.map((strength: string, index: number) => (
                <li key={index} className="flex items-start space-x-2" data-testid={`strength-${index}`}>
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard>
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-500" />
              Areas for Growth
            </h3>
            <ul className="space-y-3">
              {results.areasForImprovement?.map((area: string, index: number) => (
                <li key={index} className="flex items-start space-x-2" data-testid={`improvement-area-${index}`}>
                  <Target className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{area}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

        {/* Career Suggestions */}
        <GlassCard>
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            Personalized Recommendations
          </h3>
          <div className="space-y-3">
            {results.careerSuggestions?.map((suggestion: string, index: number) => (
              <div key={index} className="p-4 bg-primary/5 border border-primary/20 rounded-lg" data-testid={`career-suggestion-${index}`}>
                <p className="text-foreground">{suggestion}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  };

  if (isLoadingAssessments) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 grid-background">
        <div className="max-w-4xl mx-auto">
          <LoadingSkeleton lines={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 grid-background">
      <div className="max-w-4xl mx-auto">
        {!showResults ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                Career Assessment
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover your ideal career path with our comprehensive AI-powered assessment. 
                Get personalized insights based on your interests, skills, and values.
              </p>
            </div>

            {/* Previous Assessments */}
            {assessments.length > 0 && (
              <GlassCard className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Previous Assessments</h3>
                <div className="space-y-3">
                  {assessments.slice(0, 3).map((assessment) => (
                    <div key={assessment.id} className="flex items-center justify-between p-3 border border-border rounded-lg" data-testid={`previous-assessment-${assessment.id}`}>
                      <div>
                        <h4 className="font-medium text-foreground">
                          {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)} Assessment
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {assessment.completedAt ? 
                            `Completed ${new Date(assessment.completedAt).toLocaleDateString()}` : 
                            "In Progress"
                          }
                        </p>
                      </div>
                      {assessment.score && (
                        <Badge variant="secondary">Score: {assessment.score}/100</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Assessment Form */}
            <CareerAssessmentForm 
              onSubmit={handleAssessmentSubmit}
              isLoading={createAssessment.isPending}
            />
          </>
        ) : (
          renderResults()
        )}
      </div>
    </div>
  );
}
