import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCareerData } from "@/hooks/use-career-data";
import { useToast } from "@/hooks/use-toast";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { 
  Target, TrendingUp, Award, Plus, Edit, Trash2, 
  CheckCircle, AlertTriangle, Star, BookOpen
} from "lucide-react";

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().min(1, "Category is required"),
  level: z.array(z.number()).length(1),
});

type SkillData = z.infer<typeof skillSchema>;

const skillCategories = [
  "Technical", "Soft Skills", "Industry Knowledge", 
  "Leadership", "Communication", "Analysis", "Creative"
];

export default function SkillAnalysis() {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  
  const { skills, createSkill, updateSkill, isLoadingSkills } = useCareerData();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<SkillData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      level: [5]
    }
  });

  const skillLevel = watch("level");

  const handleAddSkill = async (data: SkillData) => {
    try {
      await createSkill.mutateAsync({
        name: data.name,
        category: data.category,
        level: data.level[0]
      });
      
      setIsAddingSkill(false);
      reset();
      
      toast({
        title: "Skill Added!",
        description: "Your skill has been added to your profile.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue adding your skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSkill = async (data: SkillData) => {
    if (!editingSkill) return;
    
    try {
      await updateSkill.mutateAsync({
        id: editingSkill.id,
        data: {
          name: data.name,
          category: data.category,
          level: data.level[0]
        }
      });
      
      setEditingSkill(null);
      reset();
      
      toast({
        title: "Skill Updated!",
        description: "Your skill has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue updating your skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getSkillColor = (level: number) => {
    if (level >= 8) return "text-green-600 bg-green-100 dark:bg-green-900/30";
    if (level >= 6) return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
    if (level >= 4) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
    return "text-red-600 bg-red-100 dark:bg-red-900/30";
  };

  const getSkillLabel = (level: number) => {
    if (level >= 9) return "Expert";
    if (level >= 7) return "Advanced";
    if (level >= 5) return "Intermediate";
    if (level >= 3) return "Beginner";
    return "Novice";
  };

  const skillsByCategory = skills.reduce((acc: Record<string, any[]>, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  const averageSkillLevel = skills.length > 0 
    ? Math.round(skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length)
    : 0;

  const skillGaps = [
    { skill: "Machine Learning", currentLevel: 3, targetLevel: 7, priority: "High" },
    { skill: "Public Speaking", currentLevel: 4, targetLevel: 8, priority: "Medium" },
    { skill: "Data Visualization", currentLevel: 5, targetLevel: 9, priority: "High" },
    { skill: "Team Leadership", currentLevel: 6, targetLevel: 8, priority: "Medium" },
  ];

  const recommendations = [
    {
      title: "Complete Python for Machine Learning Course",
      description: "Strengthen your ML foundation with hands-on projects",
      type: "Course",
      duration: "8 weeks",
      provider: "Coursera",
      rating: 4.8
    },
    {
      title: "Join Toastmasters International",
      description: "Improve public speaking and leadership skills",
      type: "Community",
      duration: "Ongoing",
      provider: "Toastmasters",
      rating: 4.7
    },
    {
      title: "Advanced Tableau Certification",
      description: "Master data visualization techniques",
      type: "Certification",
      duration: "4 weeks",
      provider: "Tableau",
      rating: 4.9
    }
  ];

  const renderSkillForm = () => (
    <GlassCard>
      <h3 className="text-xl font-bold text-foreground mb-6">
        {editingSkill ? "Edit Skill" : "Add New Skill"}
      </h3>
      <form onSubmit={handleSubmit(editingSkill ? handleUpdateSkill : handleAddSkill)} className="space-y-6">
        <div>
          <Label htmlFor="name">Skill Name</Label>
          <Input
            id="name"
            placeholder="e.g., JavaScript, Project Management"
            {...register("name")}
            data-testid="skill-name-input"
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={(value) => setValue("category", value)}>
            <SelectTrigger data-testid="skill-category-select">
              <SelectValue placeholder="Select skill category" />
            </SelectTrigger>
            <SelectContent>
              {skillCategories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-destructive text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="level">Skill Level: {skillLevel?.[0] || 5}/10</Label>
          <div className="space-y-2 mt-2">
            <Slider
              value={skillLevel}
              onValueChange={(value) => setValue("level", value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
              data-testid="skill-level-slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Novice</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button 
            type="submit" 
            disabled={createSkill.isPending || updateSkill.isPending}
            data-testid="save-skill-button"
          >
            {editingSkill ? "Update Skill" : "Add Skill"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setIsAddingSkill(false);
              setEditingSkill(null);
              reset();
            }}
            data-testid="cancel-skill-button"
          >
            Cancel
          </Button>
        </div>
      </form>
    </GlassCard>
  );

  if (isLoadingSkills) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 grid-background">
        <div className="max-w-6xl mx-auto">
          <LoadingSkeleton lines={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 grid-background">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Skill Analysis
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your skills, identify gaps, and get personalized recommendations for your career growth.
          </p>
        </div>

        {/* Skills Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard data-testid="total-skills-card">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{skills.length}</div>
              <p className="text-sm text-muted-foreground">Total Skills</p>
            </div>
          </GlassCard>

          <GlassCard data-testid="average-level-card">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{averageSkillLevel}/10</div>
              <p className="text-sm text-muted-foreground">Average Level</p>
            </div>
          </GlassCard>

          <GlassCard data-testid="validated-skills-card">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {skills.filter(s => s.validated).length}
              </div>
              <p className="text-sm text-muted-foreground">Validated</p>
            </div>
          </GlassCard>
        </div>

        {/* Add Skill Button */}
        {!isAddingSkill && !editingSkill && (
          <div className="text-center">
            <Button 
              onClick={() => setIsAddingSkill(true)} 
              size="lg"
              data-testid="add-skill-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Skill
            </Button>
          </div>
        )}

        {/* Skill Form */}
        {(isAddingSkill || editingSkill) && renderSkillForm()}

        {/* Skills by Category */}
        {Object.keys(skillsByCategory).length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Your Skills</h2>
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <GlassCard key={category}>
                <h3 className="text-xl font-semibold text-foreground mb-4">{category}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <div 
                      key={skill.id} 
                      className="p-4 border border-border rounded-lg"
                      data-testid={`skill-${skill.id}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-foreground">{skill.name}</h4>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingSkill(skill);
                              setValue("name", skill.name);
                              setValue("category", skill.category);
                              setValue("level", [skill.level]);
                            }}
                            data-testid={`edit-skill-${skill.id}`}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Level {skill.level}/10</span>
                          <Badge className={getSkillColor(skill.level)}>
                            {getSkillLabel(skill.level)}
                          </Badge>
                        </div>
                        <Progress value={skill.level * 10} className="h-2" />
                        {skill.validated && (
                          <div className="flex items-center text-green-600 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Validated
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Skill Gaps Analysis */}
        <GlassCard>
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            Identified Skill Gaps
          </h3>
          <div className="space-y-4">
            {skillGaps.map((gap, index) => (
              <div key={index} className="p-4 border border-border rounded-lg" data-testid={`skill-gap-${index}`}>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-foreground">{gap.skill}</h4>
                  <Badge variant={gap.priority === 'High' ? 'destructive' : 'default'}>
                    {gap.priority} Priority
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Current: {gap.currentLevel}/10</span>
                    <span>Target: {gap.targetLevel}/10</span>
                  </div>
                  <Progress value={(gap.currentLevel / gap.targetLevel) * 100} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Gap: {gap.targetLevel - gap.currentLevel} levels to reach target
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Learning Recommendations */}
        <GlassCard>
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
            Recommended Learning Resources
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-6 border border-border rounded-lg" data-testid={`recommendation-${index}`}>
                <Badge variant="outline" className="mb-3">{rec.type}</Badge>
                <h4 className="font-semibold text-foreground mb-2">{rec.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="text-foreground">{rec.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Provider:</span>
                    <span className="text-foreground">{rec.provider}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rating:</span>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-foreground">{rec.rating}/5</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
