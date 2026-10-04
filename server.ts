import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize shared Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: Generate custom project topics based on profile & prompt
app.post('/api/gemini/generate-topics', async (req, res) => {
  try {
    const { studentProfile, customPrompt, domain } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in Settings > Secrets.',
      });
    }

    const promptText = `
You are an expert Academic Capstone & Graduate Thesis Advisor in Engineering and Computer Science.
Analyze the following student profile and generate 2 to 3 cutting-edge, realistic, and highly compelling capstone/thesis project topics tailored to them.

Student Profile:
- Name: ${studentProfile?.name || 'Student'}
- Academic Level: ${studentProfile?.academicLevel || 'Undergraduate Final Year'}
- Discipline: ${studentProfile?.discipline || 'Computer Science'}
- Interests: ${(studentProfile?.interests || []).join(', ')}
- Skills: ${(studentProfile?.skills || []).map((s: any) => `${s.name} (${s.level})`).join(', ')}
- Career Goals: ${(studentProfile?.careerGoals || []).join(', ')}
- Duration: ${studentProfile?.projectPreferences?.duration || '2 semesters'}
- Team Size: ${studentProfile?.projectPreferences?.teamSize || 'solo'}
- Resource Type: ${studentProfile?.projectPreferences?.resourceType || 'software_only'}
${domain ? `- Preferred Domain: ${domain}` : ''}
${customPrompt ? `- Additional Student Requirements / Angle: ${customPrompt}` : ''}

Output strictly valid JSON (an array of objects) with this schema:
[
  {
    "id": "ai-gen-${Date.now()}-1",
    "title": "Clear, academic and modern project title",
    "domain": "e.g. Artificial Intelligence & Machine Learning, Distributed Systems, Cybersecurity, etc.",
    "academicLevel": "${studentProfile?.academicLevel || 'Undergraduate Final Year'}",
    "difficulty": "Intermediate",
    "abstract": "A compelling 3-4 sentence academic abstract describing the context, innovation, and impact.",
    "problemStatement": "Clear definition of the specific technical or real-world problem being addressed.",
    "methodology": "Brief architectural design, key algorithms or mathematical models, and implementation steps.",
    "expectedDeliverables": "e.g., Modular API backend, trained model weights, evaluation benchmark against baseline, web dashboard",
    "coreSkills": ["3-5 core technical skills"],
    "secondarySkills": ["2-3 supporting skills"],
    "targetCareerRoles": ["2-3 career paths this strengthens"],
    "resourceRequirements": "Software only / Cloud credits / GPU / Embedded hardware",
    "estimatedDurationMonths": 6,
    "idealTeamSize": "Solo or 2 members",
    "trendIndex": 95,
    "industryDemand": "High industry recruitment demand for this specialization",
    "suggestedLiterature": [
      {
        "title": "Realistic research paper title or foundational literature",
        "authors": "Author et al.",
        "year": 2024
      }
    ],
    "tags": ["relevant", "keywords"],
    "isCustomAiGenerated": true
  }
]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '[]';
    const parsedTopics = JSON.parse(text);
    return res.json({ topics: parsedTopics });
  } catch (error: any) {
    console.error('Error generating topics:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate custom topics via Gemini AI',
    });
  }
});

// Endpoint: Generate full academic project proposal
app.post('/api/gemini/generate-proposal', async (req, res) => {
  try {
    const { projectTopic, studentProfile } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in Settings > Secrets.',
      });
    }

    const promptText = `
You are a senior university capstone project supervisor and IEEE/ACM reviewer.
Generate an extensive, formal Academic Project Proposal Synopsis for the following capstone/thesis topic for a student.

Topic Details:
- Title: ${projectTopic.title}
- Domain: ${projectTopic.domain}
- Academic Level: ${projectTopic.academicLevel}
- Difficulty: ${projectTopic.difficulty}
- Abstract: ${projectTopic.abstract}
- Problem Statement: ${projectTopic.problemStatement}
- Core Skills: ${(projectTopic.coreSkills || []).join(', ')}

Student Information:
- Student: ${studentProfile?.name || 'Candidate'}
- Discipline: ${studentProfile?.discipline || 'Computer Science'}
- Career Goals: ${(studentProfile?.careerGoals || []).join(', ')}

Return a JSON object with this exact structure:
{
  "projectTitle": "${projectTopic.title}",
  "executiveSummary": "A polished 1-2 paragraph formal executive summary.",
  "problemStatementDetailed": "Deep analysis of why existing systems fail and what this project solves.",
  "projectObjectives": [
    "Primary objective 1",
    "Primary objective 2",
    "Technical objective 3",
    "Evaluation objective 4"
  ],
  "proposedMethodology": {
    "systemArchitecture": "Detailed description of system modules, data pipelines, and interaction flow.",
    "algorithmsAndTechniques": "Algorithms, loss functions, distributed consensus, or framework design used.",
    "evaluationMetrics": "Specific empirical metrics (e.g. F1-score, Latency p99, Throughput, Memory footprint, User Study SUS score)"
  },
  "technicalStack": {
    "frontend": "e.g. React, Tailwind CSS, TypeScript",
    "backend": "e.g. FastAPI / Node.js Express",
    "aiAndData": "e.g. PyTorch, Hugging Face, Scikit-Learn, Pandas",
    "infrastructureAndTools": "e.g. Docker, PostgreSQL, Redis, GitHub Actions"
  },
  "feasibilityAndRiskAssessment": [
    {
      "risk": "Potential risk (e.g. dataset scarcity, GPU cost, latency bottleneck)",
      "impact": "High",
      "mitigationStrategy": "Concrete engineering mitigation step"
    }
  ],
  "milestonePlan": [
    { "phase": "Phase 1: Literature Review & Dataset Pipeline", "timeline": "Weeks 1-3", "deliverable": "Literature report & cleaned benchmark data" },
    { "phase": "Phase 2: Core Algorithm & Baseline Implementation", "timeline": "Weeks 4-7", "deliverable": "Functional MVP & baseline comparative results" },
    { "phase": "Phase 3: Optimization, UI & System Integration", "timeline": "Weeks 8-10", "deliverable": "Full end-to-end integrated application" },
    { "phase": "Phase 4: Empirical Evaluation, Thesis & Defense Prep", "timeline": "Weeks 11-12", "deliverable": "Final project report, codebase release & presentation deck" }
  ],
  "expectedOutcomes": [
    "Open-source repository with documentation",
    "Conference paper draft / preprint",
    "Live demonstrable software prototype"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const text = response.text || '{}';
    const parsedProposal = JSON.parse(text);
    return res.json({ proposal: parsedProposal });
  } catch (error: any) {
    console.error('Error generating proposal:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate proposal via Gemini AI',
    });
  }
});

// Endpoint: Generate implementation roadmap
app.post('/api/gemini/generate-roadmap', async (req, res) => {
  try {
    const { projectTopic, studentProfile, durationWeeks = 12 } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in Settings > Secrets.',
      });
    }

    const promptText = `
You are an Engineering Tech Lead and Thesis Advisor.
Create a structured, week-by-week implementation roadmap for the project: "${projectTopic.title}".
Academic discipline: ${studentProfile?.discipline || 'Engineering'}.
Total duration: ${durationWeeks} weeks.

Provide a JSON object with:
{
  "durationWeeks": ${durationWeeks},
  "overallStrategy": "Summary of iterative development strategy (agile sprints, prototype milestones).",
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Sprint/Module title",
      "focusArea": "e.g. Architecture & Environment Setup",
      "tasks": ["Task 1", "Task 2", "Task 3"],
      "recommendedTools": ["Tool A", "Tool B"],
      "exitCriteria": "Measurable checkpoint by end of this sprint"
    }
  ],
  "keyMilestones": [
    { "milestone": "Architecture Sign-off", "week": 3 },
    { "milestone": "Alpha Baseline Evaluation", "week": 6 },
    { "milestone": "Beta End-to-End System", "week": 9 },
    { "milestone": "Final Defense & Showcase Ready", "week": 12 }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const text = response.text || '{}';
    return res.json({ roadmap: JSON.parse(text) });
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate roadmap via Gemini AI',
    });
  }
});

// Endpoint: AI Advisor Feedback & Defense Questions
app.post('/api/gemini/advisor-critique', async (req, res) => {
  try {
    const { projectTopic, studentProfile } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in Settings > Secrets.',
      });
    }

    const promptText = `
You are an Academic Defense Committee Chair evaluating this project proposal for a student:
Topic: ${projectTopic.title}
Abstract: ${projectTopic.abstract}
Student Skills: ${(studentProfile?.skills || []).map((s: any) => s.name).join(', ')}

Provide an honest, constructive academic critique formatted as JSON:
{
  "academicRigorScore": 88,
  "noveltyAssessment": "Detailed paragraph on what makes this novel vs standard textbook projects.",
  "strengths": [
    "Key strength 1",
    "Key strength 2"
  ],
  "potentialPitfalls": [
    "Common failure mode 1",
    "Technical hurdle 2"
  ],
  "defenseQuestions": [
    "Challenging technical question a committee member will likely ask",
    "Question regarding baseline comparison or data validity",
    "Question regarding scalability or ethical implications"
  ],
  "recommendedExtensions": [
    "Future work or stretch goal 1",
    "Stretch goal 2"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const text = response.text || '{}';
    return res.json({ critique: JSON.parse(text) });
  } catch (error: any) {
    console.error('Error generating critique:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate critique via Gemini AI',
    });
  }
});

// Serve frontend in dev via Vite middlewares, or static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
