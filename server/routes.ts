import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertAssessmentSchema, insertResumeSchema,
  insertInterviewSchema, insertCareerPathSchema, insertSkillSchema,
  insertGoalSchema, insertRecommendationSchema
} from "@shared/schema";
import { analyzeCareerFit, analyzeResume, generateInterviewQuestions, generateCareerRecommendations } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      const user = await storage.createUser(validatedData);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, updates);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  // Assessment routes
  app.post("/api/assessments", async (req, res) => {
    try {
      const validatedData = insertAssessmentSchema.parse(req.body);
      let assessment = await storage.createAssessment(validatedData);
      
      // If it's a career assessment, analyze with AI
      if (validatedData.type === 'career') {
        try {
          const results = await analyzeCareerFit(validatedData.data);
          assessment = await storage.updateAssessment(assessment.id, { 
            results,
            score: results.overallScore,
            completedAt: new Date()
          });
        } catch (aiError) {
          console.error("AI analysis failed:", aiError);
        }
      }
      
      res.json(assessment);
    } catch (error) {
      res.status(400).json({ message: "Invalid assessment data" });
    }
  });

  app.get("/api/users/:userId/assessments", async (req, res) => {
    try {
      const assessments = await storage.getUserAssessments(req.params.userId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const assessment = await storage.getAssessment(req.params.id);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  // Resume routes
  app.post("/api/resumes", async (req, res) => {
    try {
      const validatedData = insertResumeSchema.parse(req.body);
      let resume = await storage.createResume(validatedData);
      
      // Analyze resume with AI
      try {
        const analysis = await analyzeResume(validatedData.content);
        resume = await storage.updateResume(resume.id, {
          analysis: analysis.analysis,
          score: analysis.score,
          suggestions: analysis.suggestions
        });
      } catch (aiError) {
        console.error("Resume analysis failed:", aiError);
      }
      
      res.json(resume);
    } catch (error) {
      res.status(400).json({ message: "Invalid resume data" });
    }
  });

  app.get("/api/users/:userId/resumes", async (req, res) => {
    try {
      const resumes = await storage.getUserResumes(req.params.userId);
      res.json(resumes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  app.get("/api/resumes/:id", async (req, res) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  app.patch("/api/resumes/:id", async (req, res) => {
    try {
      const updates = insertResumeSchema.partial().parse(req.body);
      
      // If content is updated, re-analyze
      if (updates.content) {
        try {
          const analysis = await analyzeResume(updates.content);
          updates.analysis = analysis.analysis;
          updates.score = analysis.score;
          updates.suggestions = analysis.suggestions;
        } catch (aiError) {
          console.error("Resume analysis failed:", aiError);
        }
      }
      
      const resume = await storage.updateResume(req.params.id, updates);
      res.json(resume);
    } catch (error) {
      res.status(400).json({ message: "Failed to update resume" });
    }
  });

  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      await storage.deleteResume(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // Interview routes
  app.post("/api/interviews", async (req, res) => {
    try {
      const validatedData = insertInterviewSchema.parse(req.body);
      
      // Generate interview questions with AI
      let questions;
      try {
        questions = await generateInterviewQuestions(validatedData.jobTitle, validatedData.company || '');
        validatedData.questions = questions;
      } catch (aiError) {
        console.error("Question generation failed:", aiError);
        validatedData.questions = []; // fallback
      }
      
      const interview = await storage.createInterview(validatedData);
      res.json(interview);
    } catch (error) {
      res.status(400).json({ message: "Invalid interview data" });
    }
  });

  app.get("/api/users/:userId/interviews", async (req, res) => {
    try {
      const interviews = await storage.getUserInterviews(req.params.userId);
      res.json(interviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interviews" });
    }
  });

  app.get("/api/interviews/:id", async (req, res) => {
    try {
      const interview = await storage.getInterview(req.params.id);
      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }
      res.json(interview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interview" });
    }
  });

  app.patch("/api/interviews/:id", async (req, res) => {
    try {
      const updates = insertInterviewSchema.partial().parse(req.body);
      const interview = await storage.updateInterview(req.params.id, updates);
      res.json(interview);
    } catch (error) {
      res.status(400).json({ message: "Failed to update interview" });
    }
  });

  // Career path routes
  app.post("/api/career-paths", async (req, res) => {
    try {
      const validatedData = insertCareerPathSchema.parse(req.body);
      let careerPath = await storage.createCareerPath(validatedData);
      
      // Generate recommendations with AI
      try {
        const recommendations = await generateCareerRecommendations(
          validatedData.currentRole || '',
          validatedData.targetRole,
          validatedData.industry || ''
        );
        careerPath = await storage.updateCareerPath(careerPath.id, {
          steps: recommendations.steps,
          timeline: recommendations.timeline,
          skillGaps: recommendations.skillGaps,
          learningPlan: recommendations.learningPlan
        });
      } catch (aiError) {
        console.error("Career path generation failed:", aiError);
      }
      
      res.json(careerPath);
    } catch (error) {
      res.status(400).json({ message: "Invalid career path data" });
    }
  });

  app.get("/api/users/:userId/career-paths", async (req, res) => {
    try {
      const careerPaths = await storage.getUserCareerPaths(req.params.userId);
      res.json(careerPaths);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch career paths" });
    }
  });

  // Skills routes
  app.post("/api/skills", async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      res.json(skill);
    } catch (error) {
      res.status(400).json({ message: "Invalid skill data" });
    }
  });

  app.get("/api/users/:userId/skills", async (req, res) => {
    try {
      const skills = await storage.getUserSkills(req.params.userId);
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.patch("/api/skills/:id", async (req, res) => {
    try {
      const updates = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(req.params.id, updates);
      res.json(skill);
    } catch (error) {
      res.status(400).json({ message: "Failed to update skill" });
    }
  });

  // Goals routes
  app.post("/api/goals", async (req, res) => {
    try {
      const validatedData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(validatedData);
      res.json(goal);
    } catch (error) {
      res.status(400).json({ message: "Invalid goal data" });
    }
  });

  app.get("/api/users/:userId/goals", async (req, res) => {
    try {
      const goals = await storage.getUserGoals(req.params.userId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.patch("/api/goals/:id", async (req, res) => {
    try {
      const updates = insertGoalSchema.partial().parse(req.body);
      const goal = await storage.updateGoal(req.params.id, updates);
      res.json(goal);
    } catch (error) {
      res.status(400).json({ message: "Failed to update goal" });
    }
  });

  // Recommendations routes
  app.get("/api/users/:userId/recommendations", async (req, res) => {
    try {
      const recommendations = await storage.getUserRecommendations(req.params.userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
