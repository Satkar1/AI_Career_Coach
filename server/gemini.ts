import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || ""
});

// Career Assessment Analysis
export async function analyzeCareerFit(assessmentData: any): Promise<any> {
  try {
    const prompt = `You are a career counselor analyzing a professional's career assessment. 
    
Assessment Data:
- Interests: ${assessmentData.interests?.join(", ") || "Not specified"}
- Skills: ${assessmentData.skills?.join(", ") || "Not specified"}
- Values: ${assessmentData.values?.join(", ") || "Not specified"}
- Work Style: ${assessmentData.workStyle || "Not specified"}
- Experience: ${assessmentData.experience || "Not specified"}
- Education: ${assessmentData.education || "Not specified"}
- Goals: ${assessmentData.goals || "Not specified"}

Provide a comprehensive career analysis with specific, actionable recommendations.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            overallScore: { type: "number", minimum: 0, maximum: 100 },
            recommendedRoles: { 
              type: "array", 
              items: { type: "string" },
              maxItems: 5
            },
            strengths: { 
              type: "array", 
              items: { type: "string" },
              maxItems: 5
            },
            areasForImprovement: { 
              type: "array", 
              items: { type: "string" },
              maxItems: 5
            },
            careerSuggestions: { 
              type: "array", 
              items: { type: "string" },
              maxItems: 5
            }
          },
          required: ["overallScore", "recommendedRoles", "strengths", "areasForImprovement", "careerSuggestions"]
        }
      },
      contents: prompt
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    }
    
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Gemini career analysis error:", error);
    throw new Error(`Failed to analyze career fit: ${error}`);
  }
}

// Resume Analysis
export async function analyzeResume(resumeContent: string): Promise<any> {
  try {
    const prompt = `You are an expert resume reviewer and career coach. Analyze this resume and provide detailed feedback:

Resume Content:
${resumeContent}

Provide comprehensive analysis including strengths, weaknesses, specific improvement suggestions, and an overall score.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            score: { type: "number", minimum: 0, maximum: 100 },
            analysis: {
              type: "object",
              properties: {
                strengths: { 
                  type: "array", 
                  items: { type: "string" },
                  maxItems: 5
                },
                weaknesses: { 
                  type: "array", 
                  items: { type: "string" },
                  maxItems: 5
                },
                suggestions: { 
                  type: "array", 
                  items: { type: "string" },
                  maxItems: 5
                }
              },
              required: ["strengths", "weaknesses", "suggestions"]
            },
            suggestions: { 
              type: "array", 
              items: { type: "string" },
              maxItems: 8
            }
          },
          required: ["score", "analysis", "suggestions"]
        }
      },
      contents: prompt
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    }
    
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Gemini resume analysis error:", error);
    throw new Error(`Failed to analyze resume: ${error}`);
  }
}

// Interview Questions Generation
export async function generateInterviewQuestions(jobTitle: string, company: string = ""): Promise<any[]> {
  try {
    const prompt = `Generate comprehensive interview questions for a ${jobTitle} position${company ? ` at ${company}` : ""}.

Include:
- 3-4 behavioral questions
- 3-4 technical/role-specific questions  
- 2-3 situational questions
- 1-2 company/culture fit questions

Format each question with category and difficulty level.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              category: { 
                type: "string",
                enum: ["Behavioral", "Technical", "Situational", "Culture Fit", "General"]
              },
              difficulty: { 
                type: "string",
                enum: ["Easy", "Medium", "Hard"]
              }
            },
            required: ["question", "category", "difficulty"]
          },
          maxItems: 12
        }
      },
      contents: prompt
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    }
    
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Gemini interview questions error:", error);
    throw new Error(`Failed to generate interview questions: ${error}`);
  }
}

// Career Path Recommendations
export async function generateCareerRecommendations(
  currentRole: string, 
  targetRole: string, 
  industry: string = ""
): Promise<any> {
  try {
    const prompt = `Create a detailed career transition plan from ${currentRole || "current position"} to ${targetRole}${industry ? ` in the ${industry} industry` : ""}.

Provide:
- Step-by-step career progression plan
- Timeline for each step
- Skills gaps to address
- Specific learning resources and recommendations
- Milestones and checkpoints

Make it actionable and realistic.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  duration: { type: "string" },
                  tasks: { 
                    type: "array", 
                    items: { type: "string" },
                    maxItems: 5
                  }
                },
                required: ["title", "description", "duration"]
              },
              maxItems: 6
            },
            timeline: {
              type: "object",
              properties: {
                totalMonths: { type: "number" },
                phases: { 
                  type: "array", 
                  items: { type: "string" },
                  maxItems: 4
                }
              },
              required: ["totalMonths"]
            },
            skillGaps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  currentLevel: { type: "number", minimum: 1, maximum: 10 },
                  targetLevel: { type: "number", minimum: 1, maximum: 10 },
                  priority: { 
                    type: "string",
                    enum: ["High", "Medium", "Low"]
                  }
                },
                required: ["name", "priority"]
              },
              maxItems: 8
            },
            learningPlan: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  type: { 
                    type: "string",
                    enum: ["Course", "Certification", "Book", "Workshop", "Project", "Mentorship"]
                  },
                  duration: { type: "string" },
                  rating: { type: "number", minimum: 1, maximum: 5 }
                },
                required: ["title", "type"]
              },
              maxItems: 10
            }
          },
          required: ["steps", "timeline", "skillGaps", "learningPlan"]
        }
      },
      contents: prompt
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    }
    
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Gemini career recommendations error:", error);
    throw new Error(`Failed to generate career recommendations: ${error}`);
  }
}

// Interview Performance Analysis
export async function analyzeInterviewPerformance(
  questions: any[], 
  responses: any[]
): Promise<any> {
  try {
    const prompt = `Analyze this mock interview performance and provide detailed feedback:

Questions and Responses:
${questions.map((q, i) => `
Q${i + 1}: ${q.question || q}
Response: ${responses[i] || "No response provided"}
`).join("\n")}

Provide comprehensive feedback with scores and improvement suggestions.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            overallScore: { type: "number", minimum: 0, maximum: 100 },
            feedback: {
              type: "object",
              properties: {
                strengths: { 
                  type: "array", 
                  items: { type: "string" },
                  maxItems: 5
                },
                improvements: { 
                  type: "array", 
                  items: { type: "string" },
                  maxItems: 5
                },
                recommendations: { 
                  type: "array", 
                  items: { type: "string" },
                  maxItems: 5
                }
              },
              required: ["strengths", "improvements", "recommendations"]
            },
            questionScores: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  score: { type: "number", minimum: 0, maximum: 100 },
                  feedback: { type: "string" }
                },
                required: ["question", "score", "feedback"]
              }
            }
          },
          required: ["overallScore", "feedback", "questionScores"]
        }
      },
      contents: prompt
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    }
    
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Gemini interview analysis error:", error);
    throw new Error(`Failed to analyze interview performance: ${error}`);
  }
}

// Skill Gap Analysis
export async function analyzeSkillGaps(
  currentSkills: any[], 
  targetRole: string, 
  industry: string = ""
): Promise<any> {
  try {
    const prompt = `Analyze skill gaps for transitioning to ${targetRole}${industry ? ` in ${industry}` : ""}.

Current Skills:
${currentSkills.map(skill => `- ${skill.name}: Level ${skill.level}/10 (${skill.category})`).join("\n")}

Identify missing skills, improvement areas, and provide learning recommendations.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            analysis: {
              type: "object",
              properties: {
                strengthAreas: { 
                  type: "array", 
                  items: { type: "string" },
                  maxItems: 5
                },
                gapAreas: { 
                  type: "array", 
                  items: { type: "string" },
                  maxItems: 5
                },
                recommendations: { 
                  type: "array", 
                  items: { type: "string" },
                  maxItems: 5
                }
              },
              required: ["strengthAreas", "gapAreas", "recommendations"]
            },
            skillGaps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  skill: { type: "string" },
                  importance: { 
                    type: "string",
                    enum: ["Critical", "Important", "Nice to Have"]
                  },
                  difficulty: { 
                    type: "string",
                    enum: ["Beginner", "Intermediate", "Advanced"]
                  },
                  timeToLearn: { type: "string" }
                },
                required: ["skill", "importance", "difficulty"]
              },
              maxItems: 10
            },
            learningPath: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  phase: { type: "string" },
                  skills: { 
                    type: "array", 
                    items: { type: "string" },
                    maxItems: 3
                  },
                  duration: { type: "string" },
                  resources: { 
                    type: "array", 
                    items: { type: "string" },
                    maxItems: 3
                  }
                },
                required: ["phase", "skills", "duration"]
              },
              maxItems: 4
            }
          },
          required: ["analysis", "skillGaps", "learningPath"]
        }
      },
      contents: prompt
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    }
    
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Gemini skill gap analysis error:", error);
    throw new Error(`Failed to analyze skill gaps: ${error}`);
  }
}
