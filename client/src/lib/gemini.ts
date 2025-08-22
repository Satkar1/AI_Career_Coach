interface CareerAssessmentData {
  interests: string[];
  skills: string[];
  values: string[];
  workStyle: string;
  experience: string;
  education: string;
}

interface CareerAnalysisResult {
  overallScore: number;
  recommendedRoles: string[];
  strengths: string[];
  areasForImprovement: string[];
  careerSuggestions: string[];
}

interface ResumeAnalysisResult {
  score: number;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
  suggestions: string[];
}

export const analyzeCareerFitClient = async (data: CareerAssessmentData): Promise<CareerAnalysisResult> => {
  const response = await fetch('/api/ai/analyze-career', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze career fit');
  }

  return response.json();
};

export const analyzeResumeClient = async (content: string): Promise<ResumeAnalysisResult> => {
  const response = await fetch('/api/ai/analyze-resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze resume');
  }

  return response.json();
};

export const generateInterviewQuestionsClient = async (jobTitle: string, company?: string) => {
  const response = await fetch('/api/ai/generate-questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobTitle, company }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate interview questions');
  }

  return response.json();
};
