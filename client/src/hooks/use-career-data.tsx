import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Assessment, Resume, Interview, CareerPath, Skill, Goal } from "@shared/schema";

// Mock user ID for demo - in real app this would come from auth
const DEMO_USER_ID = "demo-user";

export function useCareerData() {
  const queryClient = useQueryClient();

  // Assessments
  const assessments = useQuery({
    queryKey: ["/api/users", DEMO_USER_ID, "assessments"],
    enabled: !!DEMO_USER_ID,
  });

  const createAssessment = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/assessments", {
        ...data,
        userId: DEMO_USER_ID,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", DEMO_USER_ID, "assessments"] });
    },
  });

  // Resumes
  const resumes = useQuery({
    queryKey: ["/api/users", DEMO_USER_ID, "resumes"],
    enabled: !!DEMO_USER_ID,
  });

  const createResume = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/resumes", {
        ...data,
        userId: DEMO_USER_ID,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", DEMO_USER_ID, "resumes"] });
    },
  });

  const updateResume = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest("PATCH", `/api/resumes/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", DEMO_USER_ID, "resumes"] });
    },
  });

  // Interviews
  const interviews = useQuery({
    queryKey: ["/api/users", DEMO_USER_ID, "interviews"],
    enabled: !!DEMO_USER_ID,
  });

  const createInterview = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/interviews", {
        ...data,
        userId: DEMO_USER_ID,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", DEMO_USER_ID, "interviews"] });
    },
  });

  // Career Paths
  const careerPaths = useQuery({
    queryKey: ["/api/users", DEMO_USER_ID, "career-paths"],
    enabled: !!DEMO_USER_ID,
  });

  const createCareerPath = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/career-paths", {
        ...data,
        userId: DEMO_USER_ID,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", DEMO_USER_ID, "career-paths"] });
    },
  });

  // Skills
  const skills = useQuery({
    queryKey: ["/api/users", DEMO_USER_ID, "skills"],
    enabled: !!DEMO_USER_ID,
  });

  const createSkill = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/skills", {
        ...data,
        userId: DEMO_USER_ID,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", DEMO_USER_ID, "skills"] });
    },
  });

  const updateSkill = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest("PATCH", `/api/skills/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", DEMO_USER_ID, "skills"] });
    },
  });

  // Goals
  const goals = useQuery({
    queryKey: ["/api/users", DEMO_USER_ID, "goals"],
    enabled: !!DEMO_USER_ID,
  });

  const createGoal = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/goals", {
        ...data,
        userId: DEMO_USER_ID,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", DEMO_USER_ID, "goals"] });
    },
  });

  return {
    // Data
    assessments: assessments.data || [],
    resumes: resumes.data || [],
    interviews: interviews.data || [],
    careerPaths: careerPaths.data || [],
    skills: skills.data || [],
    goals: goals.data || [],

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
