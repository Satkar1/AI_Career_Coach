import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

const assessmentSchema = z.object({
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  values: z.array(z.string()).min(1, "Please select at least one value"),
  workStyle: z.string().min(1, "Please select a work style"),
  experience: z.string().min(10, "Please provide more detail about your experience"),
  education: z.string().min(5, "Please provide your education background"),
  goals: z.string().min(10, "Please describe your career goals"),
});

type AssessmentData = z.infer<typeof assessmentSchema>;

interface CareerAssessmentFormProps {
  onSubmit: (data: AssessmentData) => void;
  isLoading?: boolean;
}

const interestOptions = [
  "Technology & Programming", "Creative Arts & Design", "Business & Management",
  "Healthcare & Medicine", "Education & Training", "Finance & Accounting",
  "Marketing & Sales", "Science & Research", "Engineering", "Writing & Communication"
];

const skillOptions = [
  "Leadership", "Communication", "Problem Solving", "Project Management",
  "Data Analysis", "Programming", "Design", "Sales", "Research", "Teaching"
];

const valueOptions = [
  "Work-Life Balance", "High Salary", "Job Security", "Creative Freedom",
  "Making a Difference", "Career Growth", "Autonomy", "Team Collaboration",
  "Innovation", "Prestige"
];

const workStyleOptions = [
  { value: "independent", label: "Independent - I prefer working alone" },
  { value: "collaborative", label: "Collaborative - I thrive in team environments" },
  { value: "leadership", label: "Leadership - I enjoy leading and managing others" },
  { value: "supportive", label: "Supportive - I like helping and supporting others" }
];

export function CareerAssessmentForm({ onSubmit, isLoading = false }: CareerAssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 6;

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm<AssessmentData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      interests: [],
      skills: [],
      values: [],
      workStyle: "",
      experience: "",
      education: "",
      goals: ""
    }
  });

  const watchedInterests = watch("interests") || [];
  const watchedSkills = watch("skills") || [];
  const watchedValues = watch("values") || [];

  const nextStep = async () => {
    let fieldsToValidate: (keyof AssessmentData)[] = [];
    
    switch (currentStep) {
      case 0:
        fieldsToValidate = ["interests"];
        break;
      case 1:
        fieldsToValidate = ["skills"];
        break;
      case 2:
        fieldsToValidate = ["values"];
        break;
      case 3:
        fieldsToValidate = ["workStyle"];
        break;
      case 4:
        fieldsToValidate = ["experience", "education"];
        break;
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleArrayChange = (value: string, fieldName: "interests" | "skills" | "values", checked: boolean) => {
    const currentValues = watch(fieldName) || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(item => item !== value);
    setValue(fieldName, newValues);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card data-testid="interests-step">
            <CardHeader>
              <CardTitle>What are your interests?</CardTitle>
              <CardDescription>Select all areas that interest you professionally</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={watchedInterests.includes(interest)}
                    onCheckedChange={(checked) => handleArrayChange(interest, "interests", checked as boolean)}
                    data-testid={`interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label htmlFor={interest} className="font-normal cursor-pointer">
                    {interest}
                  </Label>
                </div>
              ))}
              {errors.interests && (
                <p className="text-destructive text-sm" data-testid="interests-error">
                  {errors.interests.message}
                </p>
              )}
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card data-testid="skills-step">
            <CardHeader>
              <CardTitle>What are your key skills?</CardTitle>
              <CardDescription>Select your strongest skills and abilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillOptions.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={watchedSkills.includes(skill)}
                    onCheckedChange={(checked) => handleArrayChange(skill, "skills", checked as boolean)}
                    data-testid={`skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label htmlFor={skill} className="font-normal cursor-pointer">
                    {skill}
                  </Label>
                </div>
              ))}
              {errors.skills && (
                <p className="text-destructive text-sm" data-testid="skills-error">
                  {errors.skills.message}
                </p>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card data-testid="values-step">
            <CardHeader>
              <CardTitle>What do you value most in work?</CardTitle>
              <CardDescription>Select what matters most to you in your career</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {valueOptions.map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={value}
                    checked={watchedValues.includes(value)}
                    onCheckedChange={(checked) => handleArrayChange(value, "values", checked as boolean)}
                    data-testid={`value-${value.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label htmlFor={value} className="font-normal cursor-pointer">
                    {value}
                  </Label>
                </div>
              ))}
              {errors.values && (
                <p className="text-destructive text-sm" data-testid="values-error">
                  {errors.values.message}
                </p>
              )}
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card data-testid="work-style-step">
            <CardHeader>
              <CardTitle>What's your preferred work style?</CardTitle>
              <CardDescription>Choose the work environment where you thrive</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={watch("workStyle")} 
                onValueChange={(value) => setValue("workStyle", value)}
                className="space-y-4"
              >
                {workStyleOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={option.value} 
                      id={option.value}
                      data-testid={`work-style-${option.value}`}
                    />
                    <Label htmlFor={option.value} className="font-normal cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.workStyle && (
                <p className="text-destructive text-sm mt-2" data-testid="work-style-error">
                  {errors.workStyle.message}
                </p>
              )}
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card data-testid="background-step">
            <CardHeader>
              <CardTitle>Tell us about your background</CardTitle>
              <CardDescription>Help us understand your experience and education</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="experience">Work Experience</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your work experience, including roles, responsibilities, and achievements..."
                  {...register("experience")}
                  className="mt-2"
                  data-testid="experience-textarea"
                />
                {errors.experience && (
                  <p className="text-destructive text-sm mt-1" data-testid="experience-error">
                    {errors.experience.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  placeholder="Your educational background (degree, school, field of study)..."
                  {...register("education")}
                  className="mt-2"
                  data-testid="education-input"
                />
                {errors.education && (
                  <p className="text-destructive text-sm mt-1" data-testid="education-error">
                    {errors.education.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card data-testid="goals-step">
            <CardHeader>
              <CardTitle>What are your career goals?</CardTitle>
              <CardDescription>Share your aspirations and where you want to be in the future</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="goals"
                placeholder="Describe your career goals, dream job, desired industry, timeline, etc..."
                {...register("goals")}
                className="min-h-32"
                data-testid="goals-textarea"
              />
              {errors.goals && (
                <p className="text-destructive text-sm mt-1" data-testid="goals-error">
                  {errors.goals.message}
                </p>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="space-y-2" data-testid="assessment-progress">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
        </div>
        <Progress value={((currentStep + 1) / totalSteps) * 100} className="h-2" />
      </div>

      {/* Current Step */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            data-testid="prev-step-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button 
              type="button" 
              onClick={nextStep}
              data-testid="next-step-button"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isLoading}
              data-testid="submit-assessment-button"
            >
              {isLoading ? "Analyzing..." : "Complete Assessment"}
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
