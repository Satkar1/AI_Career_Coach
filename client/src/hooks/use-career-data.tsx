import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import type { Assessment, Resume, Interview, CareerPath, Skill, Goal } from "@shared/schema";

export function useCareerData() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Use authenticated user ID or fallback to demo for testing
  const userId = user?.id || "demo-user";

  // Assessments
  const assessments = useQuery({
    queryKey: ["/api/users", userId, "assessments"],
    enabled: !!userId,
  });

  const createAssessment = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/assessments", {
        ...data,
        userId: userId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "assessments"] });
    },
  });

  // Resumes
  const resumes = useQuery({
    queryKey: ["/api/users", userId, "resumes"],
    enabled: !!userId,
  });

  const createResume = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/resumes", {
        ...data,
        userId: userId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "resumes"] });
    },
  });

  const updateResume = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest("PATCH", `/api/resumes/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "resumes"] });
    },
  });

  // Interviews
  const interviews = useQuery({
    queryKey: ["/api/users", userId, "interviews"],
    enabled: !!userId,
  });

  const createInterview = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/interviews", {
        ...data,
        userId: userId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "interviews"] });
    },
  });

  // Career Paths
  const careerPaths = useQuery({
    queryKey: ["/api/users", userId, "career-paths"],
    enabled: !!userId,
  });

  const createCareerPath = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/career-paths", {
        ...data,
        userId: userId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "career-paths"] });
    },
  });

  // Skills
  const skills = useQuery({
    queryKey: ["/api/users", userId, "skills"],
    enabled: !!userId,
  });

  const createSkill = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/skills", {
        ...data,
        userId: userId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "skills"] });
    },
  });

  const updateSkill = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest("PATCH", `/api/skills/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "skills"] });
    },
  });

  // Goals
  const goals = useQuery({
    queryKey: ["/api/users", userId, "goals"],
    enabled: !!userId,
  });

  const createGoal = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/goals", {
        ...data,
        userId: userId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "goals"] });
    },
  });

  return {
    // Data
    assessments: Array.isArray(assessments.data) ? assessments.data : [],
    resumes: Array.isArray(resumes.data) ? resumes.data : [],
    interviews: Array.isArray(interviews.data) ? interviews.data : [],
    careerPaths: Array.isArray(careerPaths.data) ? careerPaths.data : [],
    skills: Array.isArray(skills.data) ? skills.data : [],
    goals: Array.isArray(goals.data) ? goals.data : [],

    // Loading states
    isLoadingAssessments: assessments.isLoading,
    isLoadingResumes: resumes.isLoading,
    isLoadingInterviews: interviews.isLoading,
    isLoadingCareerPaths: careerPaths.isLoading,
    isLoadingSkills: skills.isLoading,
    isLoadingGoals: goals.isLoading,

    // Mutations
    createAssessment,
    createResume,
    updateResume,
    createInterview,
    createCareerPath,
    createSkill,
    updateSkill,
    createGoal,
  };
}
