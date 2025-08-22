import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { GlassCard } from "@/components/glass-card";
import { useCareerData } from "@/hooks/use-career-data";
import { useToast } from "@/hooks/use-toast";
import { 
  User, Briefcase, GraduationCap, Target, 
  ArrowLeft, ArrowRight, CheckCircle, Sparkles
} from "lucide-react";

interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  currentRole: string;
  experience: string;
  industry: string;
  education: string;
  goals: string[];
  interests: string[];
}

const experienceLevels = [
  "Entry Level (0-2 years)",
  "Mid Level (3-5 years)", 
  "Senior Level (6-10 years)",
  "Lead/Manager (10+ years)",
  "Executive (C-Level)"
];

const industries = [
  "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
  "Retail", "Consulting", "Marketing", "Government", "Non-Profit", "Other"
];

const goalOptions = [
  "Advance to senior role", "Switch industries", "Increase salary",
  "Improve work-life balance", "Start own business", "Learn new skills",
  "Leadership development", "Remote work opportunities"
];

const interestOptions = [
  "Data Analysis", "Project Management", "Software Development", "Design",
  "Marketing", "Sales", "Operations", "Strategy", "Research", "Teaching"
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    email: "",
    currentRole: "",
    experience: "",
    industry: "",
    education: "",
    goals: [],
    interests: []
  });

  const { createGoal, createSkill } = useCareerData();
  const { toast } = useToast();
  const totalSteps = 4;

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: "goals" | "interests", value: string) => {
    const currentArray = formData[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Create initial goals
      for (const goal of formData.goals) {
        await createGoal.mutateAsync({
          title: goal,
          description: `Initial goal set during onboarding`,
          category: "career",
          progress: 0
        });
      }

      // Create initial skills based on interests
      for (const interest of formData.interests) {
        await createSkill.mutateAsync({
          name: interest,
          category: "technical",
          level: 5 // Default mid-level
        });
      }

      toast({
        title: "Welcome to AI Career Coach!",
        description: "Your profile has been set up successfully.",
      });

      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Setup Error",
        description: "There was an issue setting up your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <GlassCard data-testid="personal-info-step">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Personal Information</CardTitle>
              <CardDescription>Let's start with some basic information about you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    placeholder="Enter your first name"
                    data-testid="first-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    placeholder="Enter your last name"
                    data-testid="last-name-input"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="Enter your email address"
                  data-testid="email-input"
                />
              </div>
            </CardContent>
          </GlassCard>
        );

      case 1:
        return (
          <GlassCard data-testid="professional-info-step">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Professional Background</CardTitle>
              <CardDescription>Tell us about your current professional situation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="currentRole">Current Role/Title</Label>
                <Input
                  id="currentRole"
                  value={formData.currentRole}
                  onChange={(e) => updateFormData("currentRole", e.target.value)}
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  data-testid="current-role-input"
                />
              </div>
              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <Select onValueChange={(value) => updateFormData("experience", value)}>
                  <SelectTrigger data-testid="experience-select">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={(value) => updateFormData("industry", value)}>
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
            </CardContent>
          </GlassCard>
        );

      case 2:
        return (
          <GlassCard data-testid="education-step">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Education & Goals</CardTitle>
              <CardDescription>Share your educational background and career aspirations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="education">Education Background</Label>
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={(e) => updateFormData("education", e.target.value)}
                  placeholder="Describe your educational background (degree, school, certifications, etc.)"
                  data-testid="education-textarea"
                />
              </div>
              <div>
                <Label>Career Goals (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {goalOptions.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.goals.includes(goal)}
                        onCheckedChange={() => handleArrayToggle("goals", goal)}
                        data-testid={`goal-${goal.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <Label htmlFor={goal} className="text-sm font-normal cursor-pointer">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </GlassCard>
        );

      case 3:
        return (
          <GlassCard data-testid="interests-step">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Areas of Interest</CardTitle>
              <CardDescription>What professional areas interest you the most?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Professional Interests (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {interestOptions.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={() => handleArrayToggle("interests", interest)}
                        data-testid={`interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <Label htmlFor={interest} className="text-sm font-normal cursor-pointer">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  What happens next?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Based on your responses, we'll create a personalized dashboard with career recommendations, 
                  skill assessments, and a customized learning path to help you achieve your goals.
                </p>
              </div>
            </CardContent>
          </GlassCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 grid-background">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Welcome to AI Career Coach
          </h1>
          <p className="text-lg text-muted-foreground">
            Let's set up your profile to provide personalized career guidance
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8" data-testid="onboarding-progress">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={((currentStep + 1) / totalSteps) * 100} className="h-2" />
        </div>

        {/* Current Step */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            data-testid="prev-step-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button onClick={nextStep} data-testid="next-step-button">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={createGoal.isPending || createSkill.isPending}
              data-testid="complete-onboarding-button"
            >
              {createGoal.isPending || createSkill.isPending ? "Setting up..." : "Complete Setup"}
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
