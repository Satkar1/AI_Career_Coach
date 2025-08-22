import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCareerData } from "@/hooks/use-career-data";
import { useToast } from "@/hooks/use-toast";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { 
  FileText, Upload, CheckCircle, AlertTriangle, 
  TrendingUp, Target, Star, RefreshCw, Download
} from "lucide-react";

const resumeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(100, "Resume content must be at least 100 characters"),
});

type ResumeData = z.infer<typeof resumeSchema>;

export default function ResumeAnalysis() {
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { resumes, createResume, updateResume, isLoadingResumes } = useCareerData();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
  });

  const handleResumeSubmit = async (data: ResumeData) => {
    try {
      setIsAnalyzing(true);
      const result = await createResume.mutateAsync(data);
      setSelectedResume(result);
      reset();
      
      toast({
        title: "Resume Analyzed!",
        description: "Your resume has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "There was an issue analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReanalyze = async (resumeId: string, content: string) => {
    try {
      setIsAnalyzing(true);
      const result = await updateResume.mutateAsync({
        id: resumeId,
        data: { content }
      });
      setSelectedResume(result);
      
      toast({
        title: "Resume Re-analyzed!",
        description: "Your resume analysis has been updated.",
      });
    } catch (error) {
      toast({
        title: "Re-analysis Error",
        description: "There was an issue re-analyzing your resume.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderAnalysisResults = (resume: any) => {
    if (!resume.analysis || !resume.score) {
      return (
        <GlassCard className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Analyzing Your Resume...</h3>
          <p className="text-muted-foreground">
            Our AI is reviewing your resume to provide detailed feedback.
          </p>
        </GlassCard>
      );
    }

    const analysis = resume.analysis;
    const score = resume.score;

    return (
      <div className="space-y-6">
        {/* Overall Score */}
        <GlassCard data-testid="resume-score-card">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">{score}</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Resume Score</h2>
            <Progress value={score} className="w-48 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-6">
              {score >= 80 ? "Excellent resume!" : score >= 60 ? "Good resume with room for improvement" : "Needs significant improvements"}
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => handleReanalyze(resume.id, resume.content)}
                disabled={isAnalyzing}
                data-testid="reanalyze-button"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-analyze
              </Button>
              <Button variant="outline" data-testid="download-report-button">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Strengths and Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Strengths
            </h3>
            <ul className="space-y-3">
              {analysis.strengths?.map((strength: string, index: number) => (
                <li key={index} className="flex items-start space-x-2" data-testid={`strength-${index}`}>
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard>
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {analysis.weaknesses?.map((weakness: string, index: number) => (
                <li key={index} className="flex items-start space-x-2" data-testid={`weakness-${index}`}>
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{weakness}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

        {/* Detailed Suggestions */}
        <GlassCard>
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            Improvement Suggestions
          </h3>
          <div className="space-y-4">
            {resume.suggestions?.map((suggestion: string, index: number) => (
              <div key={index} className="p-4 bg-primary/5 border border-primary/20 rounded-lg" data-testid={`suggestion-${index}`}>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-foreground">{suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Keywords and ATS Optimization */}
        <GlassCard>
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
            ATS Optimization
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Keyword Density</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Technical Skills</span>
                  <Badge variant="secondary">Good</Badge>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">ATS Compatibility</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Format Compatibility</span>
                  <Badge variant="secondary">Excellent</Badge>
                </div>
                <Progress value={90} className="h-2" />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  };

  if (isLoadingResumes) {
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
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Resume Analysis
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get AI-powered feedback to optimize your resume for better job opportunities and ATS compatibility.
          </p>
        </div>

        {/* Previous Resumes */}
        {resumes.length > 0 && (
          <GlassCard>
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Resumes</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map((resume) => (
                <div 
                  key={resume.id} 
                  className="p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedResume(resume)}
                  data-testid={`resume-${resume.id}`}
                >
                  <h4 className="font-medium text-foreground mb-2">{resume.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </span>
                    {resume.score && (
                      <Badge variant="secondary">Score: {resume.score}/100</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Upload New Resume */}
        {!selectedResume && (
          <GlassCard>
            <h3 className="text-xl font-bold text-foreground mb-6">Upload New Resume</h3>
            <form onSubmit={handleSubmit(handleResumeSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="title">Resume Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Software Engineer Resume 2024"
                  {...register("title")}
                  data-testid="resume-title-input"
                />
                {errors.title && (
                  <p className="text-destructive text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="content">Resume Content</Label>
                <Textarea
                  id="content"
                  placeholder="Paste your resume content here..."
                  className="min-h-64"
                  {...register("content")}
                  data-testid="resume-content-textarea"
                />
                {errors.content && (
                  <p className="text-destructive text-sm mt-1">{errors.content.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isAnalyzing || createResume.isPending}
                className="w-full"
                data-testid="analyze-resume-button"
              >
                {isAnalyzing || createResume.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </form>
          </GlassCard>
        )}

        {/* Analysis Results */}
        {selectedResume && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
              <Button 
                variant="outline" 
                onClick={() => setSelectedResume(null)}
                data-testid="upload-new-resume-button"
              >
                Upload New Resume
              </Button>
            </div>
            {renderAnalysisResults(selectedResume)}
          </div>
        )}
      </div>
    </div>
  );
}
