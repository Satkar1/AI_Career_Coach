import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCareerData } from "@/hooks/use-career-data";
import { useToast } from "@/hooks/use-toast";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { 
  MessageSquare, Play, Pause, Square, Mic, 
  Clock, Star, TrendingUp, CheckCircle, AlertTriangle
} from "lucide-react";

const interviewSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().optional(),
});

type InterviewData = z.infer<typeof interviewSchema>;

interface Question {
  id: number;
  question: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export default function MockInterview() {
  const [currentInterview, setCurrentInterview] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [timer, setTimer] = useState(0);

  const { interviews, createInterview, isLoadingInterviews } = useCareerData();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InterviewData>({
    resolver: zodResolver(interviewSchema),
  });

  const handleStartInterview = async (data: InterviewData) => {
    try {
      const result = await createInterview.mutateAsync(data);
      setCurrentInterview(result);
      setInterviewStarted(true);
      setCurrentQuestionIndex(0);
      setTimer(0);
      
      toast({
        title: "Interview Started!",
        description: "Your mock interview session has begun.",
      });
    } catch (error) {
      toast({
        title: "Setup Error",
        description: "There was an issue starting your interview. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentInterview?.questions && currentQuestionIndex < currentInterview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleCompleteInterview = () => {
    setInterviewCompleted(true);
    setInterviewStarted(false);
    
    toast({
      title: "Interview Completed!",
      description: "Your responses have been recorded for analysis.",
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Recording Started",
        description: "Speak your answer clearly.",
      });
    } else {
      toast({
        title: "Recording Stopped",
        description: "Your response has been saved.",
      });
    }
  };

  const mockFeedback = {
    overallScore: 85,
    strengths: [
      "Clear communication and articulation",
      "Good understanding of technical concepts",
      "Confident delivery and body language"
    ],
    improvements: [
      "Provide more specific examples",
      "Elaborate on problem-solving approach",
      "Include quantifiable achievements"
    ],
    questionScores: [
      { question: "Tell me about yourself", score: 90, feedback: "Excellent introduction with clear career progression" },
      { question: "Why do you want this role?", score: 80, feedback: "Good motivation but could be more specific" },
      { question: "Describe a challenging project", score: 85, feedback: "Nice example but missing metrics" }
    ]
  };

  const renderInterviewSetup = () => (
    <GlassCard>
      <h3 className="text-xl font-bold text-foreground mb-6">Start Mock Interview</h3>
      <form onSubmit={handleSubmit(handleStartInterview)} className="space-y-6">
        <div>
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            placeholder="e.g., Software Engineer, Product Manager"
            {...register("jobTitle")}
            data-testid="job-title-input"
          />
          {errors.jobTitle && (
            <p className="text-destructive text-sm mt-1">{errors.jobTitle.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="company">Company (Optional)</Label>
          <Input
            id="company"
            placeholder="e.g., Google, Microsoft"
            {...register("company")}
            data-testid="company-input"
          />
        </div>

        <Button 
          type="submit" 
          disabled={createInterview.isPending}
          className="w-full"
          data-testid="start-interview-button"
        >
          {createInterview.isPending ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Generating Questions...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Interview
            </>
          )}
        </Button>
      </form>
    </GlassCard>
  );

  const renderInterviewSession = () => {
    if (!currentInterview?.questions || currentInterview.questions.length === 0) {
      return (
        <GlassCard className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Preparing Your Interview...</h3>
          <p className="text-muted-foreground">
            Generating personalized questions based on your job title and company.
          </p>
        </GlassCard>
      );
    }

    const currentQuestion = currentInterview.questions[currentQuestionIndex];
    const totalQuestions = currentInterview.questions.length;

    return (
      <div className="space-y-6">
        {/* Interview Header */}
        <GlassCard data-testid="interview-header">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Mock Interview</h2>
              <p className="text-muted-foreground">{currentInterview.jobTitle} at {currentInterview.company || "Your Target Company"}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </div>
              <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
            </div>
          </div>
          <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="mt-4" />
        </GlassCard>

        {/* Current Question */}
        <GlassCard data-testid="current-question">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{currentQuestion.category || "General"}</Badge>
              <Badge variant={currentQuestion.difficulty === "Hard" ? "destructive" : currentQuestion.difficulty === "Medium" ? "default" : "secondary"}>
                {currentQuestion.difficulty || "Medium"}
              </Badge>
            </div>
            
            <h3 className="text-xl font-semibold text-foreground">
              {currentQuestion.question || currentQuestion}
            </h3>

            {/* Recording Controls */}
            <div className="flex items-center space-x-4 pt-4">
              <Button
                onClick={toggleRecording}
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                data-testid="record-button"
              >
                {isRecording ? (
                  <>
                    <Square className="w-5 h-5 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
              
              {isRecording && (
                <div className="flex items-center space-x-2 text-destructive">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Recording...</span>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            data-testid="previous-question-button"
          >
            Previous Question
          </Button>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button onClick={handleNextQuestion} data-testid="next-question-button">
              Next Question
            </Button>
          ) : (
            <Button onClick={handleCompleteInterview} data-testid="complete-interview-button">
              Complete Interview
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderInterviewResults = () => (
    <div className="space-y-6">
      {/* Overall Score */}
      <GlassCard data-testid="interview-results">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">{mockFeedback.overallScore}</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Interview Score</h2>
          <Progress value={mockFeedback.overallScore} className="w-48 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-6">
            {mockFeedback.overallScore >= 80 ? "Excellent performance!" : mockFeedback.overallScore >= 60 ? "Good with room for improvement" : "Needs more practice"}
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => {
              setCurrentInterview(null);
              setInterviewCompleted(false);
              setInterviewStarted(false);
              setCurrentQuestionIndex(0);
              reset();
            }} data-testid="new-interview-button">
              Start New Interview
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Strengths and Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Strengths
          </h3>
          <ul className="space-y-3">
            {mockFeedback.strengths.map((strength, index) => (
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
            {mockFeedback.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start space-x-2" data-testid={`improvement-${index}`}>
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{improvement}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Question-by-Question Feedback */}
      <GlassCard>
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
          Question Analysis
        </h3>
        <div className="space-y-4">
          {mockFeedback.questionScores.map((item, index) => (
            <div key={index} className="p-4 border border-border rounded-lg" data-testid={`question-analysis-${index}`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-foreground">{item.question}</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(item.score / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{item.score}/100</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{item.feedback}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );

  if (isLoadingInterviews) {
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
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Mock Interview
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practice with AI-powered mock interviews tailored to your target role and get detailed feedback to improve your performance.
          </p>
        </div>

        {/* Previous Interviews */}
        {interviews.length > 0 && !interviewStarted && !interviewCompleted && (
          <GlassCard>
            <h3 className="text-lg font-semibold text-foreground mb-4">Previous Interviews</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {interviews.slice(0, 4).map((interview) => (
                <div key={interview.id} className="p-4 border border-border rounded-lg" data-testid={`previous-interview-${interview.id}`}>
                  <h4 className="font-medium text-foreground mb-2">
                    {interview.jobTitle} {interview.company && `at ${interview.company}`}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {interview.completedAt ? 
                        new Date(interview.completedAt).toLocaleDateString() : 
                        "In Progress"
                      }
                    </span>
                    {interview.score && (
                      <Badge variant="secondary">Score: {interview.score}/100</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Main Content */}
        {!interviewStarted && !interviewCompleted && renderInterviewSetup()}
        {interviewStarted && !interviewCompleted && renderInterviewSession()}
        {interviewCompleted && renderInterviewResults()}
      </div>
    </div>
  );
}
