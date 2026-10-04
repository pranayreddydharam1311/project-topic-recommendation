import {
  StudentProfile,
  ProjectTopic,
  GeneratedProposal,
  ImplementationRoadmap,
  AdvisorCritique,
} from '../types/index.ts';

export interface HealthResponse {
  status: string;
  hasApiKey: boolean;
  timestamp: string;
}

export async function checkServerHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (error) {
    return { status: 'offline', hasApiKey: false, timestamp: new Date().toISOString() };
  }
}

export async function generateAiCustomTopics(
  studentProfile: StudentProfile,
  customPrompt?: string,
  domain?: string
): Promise<ProjectTopic[]> {
  const res = await fetch('/api/gemini/generate-topics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentProfile, customPrompt, domain }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to generate custom topics');
  }

  const data = await res.json();
  return data.topics || [];
}

export async function generateProjectProposal(
  projectTopic: ProjectTopic,
  studentProfile: StudentProfile
): Promise<GeneratedProposal> {
  const res = await fetch('/api/gemini/generate-proposal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectTopic, studentProfile }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to generate proposal');
  }

  const data = await res.json();
  return data.proposal;
}

export async function generateProjectRoadmap(
  projectTopic: ProjectTopic,
  studentProfile: StudentProfile,
  durationWeeks: number = 12
): Promise<ImplementationRoadmap> {
  const res = await fetch('/api/gemini/generate-roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectTopic, studentProfile, durationWeeks }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to generate roadmap');
  }

  const data = await res.json();
  return data.roadmap;
}

export async function generateAdvisorCritique(
  projectTopic: ProjectTopic,
  studentProfile: StudentProfile
): Promise<AdvisorCritique> {
  const res = await fetch('/api/gemini/advisor-critique', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectTopic, studentProfile }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to generate advisor critique');
  }

  const data = await res.json();
  return data.critique;
}
