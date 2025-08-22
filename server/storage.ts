import { 
  users, assessments, resumes, interviews, careerPaths, skills, goals, recommendations,
  type User, type InsertUser, type Assessment, type InsertAssessment,
  type Resume, type InsertResume, type Interview, type InsertInterview,
  type CareerPath, type InsertCareerPath, type Skill, type InsertSkill,
  type Goal, type InsertGoal, type Recommendation, type InsertRecommendation
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User>;

  // Assessment methods
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessment(id: string): Promise<Assessment | undefined>;
  getUserAssessments(userId: string): Promise<Assessment[]>;
  updateAssessment(id: string, data: Partial<InsertAssessment>): Promise<Assessment>;

  // Resume methods
  createResume(resume: InsertResume): Promise<Resume>;
  getResume(id: string): Promise<Resume | undefined>;
  getUserResumes(userId: string): Promise<Resume[]>;
  updateResume(id: string, data: Partial<InsertResume>): Promise<Resume>;
  deleteResume(id: string): Promise<void>;

  // Interview methods
  createInterview(interview: InsertInterview): Promise<Interview>;
  getInterview(id: string): Promise<Interview | undefined>;
  getUserInterviews(userId: string): Promise<Interview[]>;
  updateInterview(id: string, data: Partial<InsertInterview>): Promise<Interview>;

  // Career path methods
  createCareerPath(careerPath: InsertCareerPath): Promise<CareerPath>;
  getCareerPath(id: string): Promise<CareerPath | undefined>;
  getUserCareerPaths(userId: string): Promise<CareerPath[]>;
  updateCareerPath(id: string, data: Partial<InsertCareerPath>): Promise<CareerPath>;

  // Skill methods
  createSkill(skill: InsertSkill): Promise<Skill>;
  getUserSkills(userId: string): Promise<Skill[]>;
  updateSkill(id: string, data: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: string): Promise<void>;

  // Goal methods
  createGoal(goal: InsertGoal): Promise<Goal>;
  getUserGoals(userId: string): Promise<Goal[]>;
  updateGoal(id: string, data: Partial<InsertGoal>): Promise<Goal>;
  deleteGoal(id: string): Promise<void>;

  // Recommendation methods
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  getUserRecommendations(userId: string): Promise<Recommendation[]>;
  updateRecommendation(id: string, data: Partial<InsertRecommendation>): Promise<Recommendation>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Assessment methods
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db
      .insert(assessments)
      .values(assessment)
      .returning();
    return newAssessment;
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment || undefined;
  }

  async getUserAssessments(userId: string): Promise<Assessment[]> {
    return await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.createdAt));
  }

  async updateAssessment(id: string, data: Partial<InsertAssessment>): Promise<Assessment> {
    const [assessment] = await db
      .update(assessments)
      .set(data)
      .where(eq(assessments.id, id))
      .returning();
    return assessment;
  }

  // Resume methods
  async createResume(resume: InsertResume): Promise<Resume> {
    const [newResume] = await db
      .insert(resumes)
      .values(resume)
      .returning();
    return newResume;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume || undefined;
  }

  async getUserResumes(userId: string): Promise<Resume[]> {
    return await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.updatedAt));
  }

  async updateResume(id: string, data: Partial<InsertResume>): Promise<Resume> {
    const [resume] = await db
      .update(resumes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(resumes.id, id))
      .returning();
    return resume;
  }

  async deleteResume(id: string): Promise<void> {
    await db.delete(resumes).where(eq(resumes.id, id));
  }

  // Interview methods
  async createInterview(interview: InsertInterview): Promise<Interview> {
    const [newInterview] = await db
      .insert(interviews)
      .values(interview)
      .returning();
    return newInterview;
  }

  async getInterview(id: string): Promise<Interview | undefined> {
    const [interview] = await db.select().from(interviews).where(eq(interviews.id, id));
    return interview || undefined;
  }

  async getUserInterviews(userId: string): Promise<Interview[]> {
    return await db
      .select()
      .from(interviews)
      .where(eq(interviews.userId, userId))
      .orderBy(desc(interviews.createdAt));
  }

  async updateInterview(id: string, data: Partial<InsertInterview>): Promise<Interview> {
    const [interview] = await db
      .update(interviews)
      .set(data)
      .where(eq(interviews.id, id))
      .returning();
    return interview;
  }

  // Career path methods
  async createCareerPath(careerPath: InsertCareerPath): Promise<CareerPath> {
    const [newCareerPath] = await db
      .insert(careerPaths)
      .values(careerPath)
      .returning();
    return newCareerPath;
  }

  async getCareerPath(id: string): Promise<CareerPath | undefined> {
    const [careerPath] = await db.select().from(careerPaths).where(eq(careerPaths.id, id));
    return careerPath || undefined;
  }

  async getUserCareerPaths(userId: string): Promise<CareerPath[]> {
    return await db
      .select()
      .from(careerPaths)
      .where(eq(careerPaths.userId, userId))
      .orderBy(desc(careerPaths.updatedAt));
  }

  async updateCareerPath(id: string, data: Partial<InsertCareerPath>): Promise<CareerPath> {
    const [careerPath] = await db
      .update(careerPaths)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(careerPaths.id, id))
      .returning();
    return careerPath;
  }

  // Skill methods
  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db
      .insert(skills)
      .values(skill)
      .returning();
    return newSkill;
  }

  async getUserSkills(userId: string): Promise<Skill[]> {
    return await db
      .select()
      .from(skills)
      .where(eq(skills.userId, userId))
      .orderBy(desc(skills.updatedAt));
  }

  async updateSkill(id: string, data: Partial<InsertSkill>): Promise<Skill> {
    const [skill] = await db
      .update(skills)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(skills.id, id))
      .returning();
    return skill;
  }

  async deleteSkill(id: string): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  // Goal methods
  async createGoal(goal: InsertGoal): Promise<Goal> {
    const [newGoal] = await db
      .insert(goals)
      .values(goal)
      .returning();
    return newGoal;
  }

  async getUserGoals(userId: string): Promise<Goal[]> {
    return await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId))
      .orderBy(desc(goals.updatedAt));
  }

  async updateGoal(id: string, data: Partial<InsertGoal>): Promise<Goal> {
    const [goal] = await db
      .update(goals)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(goals.id, id))
      .returning();
    return goal;
  }

  async deleteGoal(id: string): Promise<void> {
    await db.delete(goals).where(eq(goals.id, id));
  }

  // Recommendation methods
  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const [newRecommendation] = await db
      .insert(recommendations)
      .values(recommendation)
      .returning();
    return newRecommendation;
  }

  async getUserRecommendations(userId: string): Promise<Recommendation[]> {
    return await db
      .select()
      .from(recommendations)
      .where(eq(recommendations.userId, userId))
      .orderBy(desc(recommendations.createdAt));
  }

  async updateRecommendation(id: string, data: Partial<InsertRecommendation>): Promise<Recommendation> {
    const [recommendation] = await db
      .update(recommendations)
      .set(data)
      .where(eq(recommendations.id, id))
      .returning();
    return recommendation;
  }
}

export const storage = new DatabaseStorage();
