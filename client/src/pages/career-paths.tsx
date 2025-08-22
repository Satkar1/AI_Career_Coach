import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCareerData } from "@/hooks/use-career-data";
import { useToast } from "@/hooks/use-toast";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { 
  TrendingUp, Target, Clock, CheckCircle, 
  ArrowRight, BookOpen, Star, Users, Award
} from "lucide-react";

const careerPathSchema = z.object({
  currentRole: z.string().optional(),
  targetRole: z.string().min(1, "Target role is required"),
  industry: z.string().optional(),
});

type CareerPathData = z.infer<typeof careerPathSchema>;

const industries = [
  "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
  "Retail", "Consulting", "Marketing", "Government", "Non-Profit"
];

export default function CareerPaths() {
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { careerPaths, createCareerPath, isLoadingCareerPaths } = useCareerData();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CareerPathData>({
    resolver: zodResolver(careerPathSchema),
  });

  const handleGeneratePath = async (data: CareerPathData) => {
    try {
      setIsGenerating(true);
      const result = await createCareerPath.mutateAsync(data);
      setSelectedPath(result);
      
      toast({
        title: "Career Path Generated!",
        description: "Your personalized career roadmap is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation Error",
        description: "There was an issue generating your career path. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderPathDetails = (path: any) => {
    if (!path.steps || !path.timeline) {
      return (
        <GlassCard className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Generating Your Career Path...</h3>
          <p className="text-muted-foreground">
            Our AI is creating a personalized roadmap for your career transition.
          </p>
        </GlassCard>
      );
    }

    return (
      <div className="space-y-6">
        {/* Path Overview */}
        <GlassCard data-testid="career-path-overview">
          <div className="text-center py-8">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">{path.currentRole || "Current Role"}</p>
              </div>
              <ArrowRight className="w-8 h-8 text-primary" />
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-2">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm font-semibold text-foreground">{path.targetRole}</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Your Career Path</h2>
            <p className="text-lg text-muted-foreground mb-6">
              {path.industry && `Transitioning within ${path.industry}`}
            </p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{path.progress || 0}%</div>
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{path.timeline?.totalMonths || 12}</div>
                <p className="text-sm text-muted-foreground">Months</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{path.steps?.length || 0}</div>
                <p className="text-sm text-muted-foreground">Steps</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Career Steps Timeline */}
        <GlassCard>
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Career Roadmap
          </h3>
          <div className="space-y-6">
            {path.steps?.map((step: any, index: number) => (
              <div key={index} className="flex items-start space-x-4" data-testid={`career-step-${index}`}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  {index < path.steps.length - 1 && (
                    <div className="w-0.5 h-16 bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{step.title || `Step ${index + 1}`}</h4>
                    <Badge variant="secondary">{step.duration || "3-6 months"}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{step.description}</p>
                  {step.tasks && (
                    <ul className="space-y-1">
                      {step.tasks.map((task: string, taskIndex: number) => (
                        <li key={taskIndex} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{task}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Skill Gaps */}
        {path.skillGaps && (
          <GlassCard>
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-500" />
              Skills to Develop
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {path.skillGaps.map((skill: any, index: number) => (
                <div key={index} className="p-4 border border-border rounded-lg" data-testid={`skill-gap-${index}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">{skill.name || skill}</h4>
                    <Badge variant={skill.priority === 'high' ? 'destructive' : skill.priority === 'medium' ? 'default' : 'secondary'}>
                      {skill.priority || 'Medium'}
                    </Badge>
                  </div>
                  {skill.currentLevel && skill.targetLevel && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current: {skill.currentLevel}/10</span>
                        <span className="text-muted-foreground">Target: {skill.targetLevel}/10</span>
                      </div>
                      <Progress value={(skill.currentLevel / skill.targetLevel) * 100} className="h-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Learning Plan */}
        {path.learningPlan && (
          <GlassCard>
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
              Recommended Learning Resources
            </h3>
            <div className="space-y-4">
              {path.learningPlan.map((resource: any, index: number) => (
                <div key={index} className="p-4 bg-primary/5 border border-primary/20 rounded-lg" data-testid={`learning-resource-${index}`}>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{resource.title || resource}</h4>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                      )}
                      <div className="flex items-center space-x-4">
                        {resource.type && (
                          <Badge variant="outline">{resource.type}</Badge>
                        )}
                        {resource.duration && (
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {resource.duration}
                          </span>
                        )}
                        {resource.rating && (
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm text-muted-foreground">{resource.rating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    );
  };

  if (isLoadingCareerPaths) {
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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Career Path Planning
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get a personalized career roadmap with step-by-step guidance to reach your professional goals.
          </p>
        </div>

        {/* Existing Career Paths */}
        {careerPaths.length > 0 && !selectedPath && (
          <GlassCard>
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Career Paths</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {careerPaths.map((path) => (
                <div 
                  key={path.id} 
                  className="p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedPath(path)}
                  data-testid={`career-path-${path.id}`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    {path.currentRole && (
                      <>
                        <span className="text-sm text-muted-foreground">{path.currentRole}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </>
                    )}
                    <span className="font-medium text-foreground">{path.targetRole}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(path.updatedAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Progress value={path.progress} className="w-16 h-2" />
                      <span className="text-sm text-muted-foreground">{path.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Generate New Career Path */}
        {!selectedPath && (
          <GlassCard>
            <h3 className="text-xl font-bold text-foreground mb-6">Create New Career Path</h3>
            <form onSubmit={handleSubmit(handleGeneratePath)} className="space-y-6">
              <div>
                <Label htmlFor="currentRole">Current Role (Optional)</Label>
                <Input
                  id="currentRole"
                  placeholder="e.g., Junior Developer, Marketing Coordinator"
                  {...register("currentRole")}
                  data-testid="current-role-input"
                />
              </div>

              <div>
                <Label htmlFor="targetRole">Target Role</Label>
                <Input
                  id="targetRole"
                  placeholder="e.g., Senior Software Engineer, Product Manager"
                  {...register("targetRole")}
                  data-testid="target-role-input"
                />
                {errors.targetRole && (
                  <p className="text-destructive text-sm mt-1">{errors.targetRole.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="industry">Industry (Optional)</Label>
                <Select onValueChange={(value) => setValue("industry", value)}>
                  <SelectTrigger data-testid="industry-select">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                disabled={isGenerating || createCareerPath.isPending}
                className="w-full"
                data-testid="generate-path-button"
              >
                {isGenerating || createCareerPath.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Generating Career Path...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Generate Career Path
                  </>
                )}
              </Button>
            </form>
          </GlassCard>
        )}

        {/* Career Path Details */}
        {selectedPath && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Career Path Details</h2>
              <Button 
                variant="outline" 
                onClick={() => setSelectedPath(null)}
                data-testid="create-new-path-button"
              >
                Create New Path
              </Button>
            </div>
            {renderPathDetails(selectedPath)}
          </div>
        )}
      </div>
    </div>
  );
}
