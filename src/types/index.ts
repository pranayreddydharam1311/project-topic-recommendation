export type AcademicLevel = 
  | 'Undergraduate Final Year'
  | 'Masters Thesis'
  | 'PhD Research'
  | 'Diploma / Polytechnic';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced';

export type SkillCategory = 'languages' | 'frameworks' | 'tools' | 'concepts';

export interface StudentSkill {
  name: string;
  category: SkillCategory;
  level: SkillProficiency;
  weight?: number; // 1 for Beginner, 2 for Intermediate, 3 for Advanced
}

export interface ProjectPreferences {
  duration: '1_semester' | '2_semesters';
  teamSize: 'solo' | 'duo' | 'team_3_4';
  resourceType: 'software_only' | 'gpu_compute' | 'hardware_iot' | 'cloud_heavy';
  targetOutcome: 'publication' | 'industry_portfolio' | 'working_prototype' | 'open_source';
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar?: string;
  academicLevel: AcademicLevel;
  discipline: string; // e.g. "Computer Science", "Artificial Intelligence", "Cybersecurity"
  university?: string;
  gpaOrStanding?: string;
  interests: string[];
  skills: StudentSkill[];
  careerGoals: string[];
  projectPreferences: ProjectPreferences;
  bio?: string;
}

export interface LiteratureReference {
  title: string;
  authors: string;
  year: number;
  conferenceOrJournal?: string;
  doiOrUrl?: string;
}

export interface CollaborativeMetrics {
  historicalCompletions: number;
  averageGradeScore: number; // e.g. 4.7 out of 5.0
  facultyEndorsementRate: number; // percentage 0-100
  similarStudentSuccessRate: number; // percentage 0-100
  peerBookmarkCount: number;
}

export interface ProjectTopic {
  id: string;
  title: string;
  domain: string;
  academicLevel: AcademicLevel;
  difficulty: DifficultyLevel;
  abstract: string;
  problemStatement: string;
  methodology: string;
  expectedDeliverables: string;
  coreSkills: string[];
  secondarySkills: string[];
  targetCareerRoles: string[];
  resourceRequirements: string;
  estimatedDurationMonths: number;
  idealTeamSize: string;
  trendIndex: number; // 0 - 100
  industryDemand: string;
  collaborativeMetrics: CollaborativeMetrics;
  suggestedLiterature: LiteratureReference[];
  tags: string[];
  isCustomAiGenerated?: boolean;
}

export interface HistoricalStudent {
  id: string;
  name: string;
  discipline: string;
  academicLevel: AcademicLevel;
  skills: string[];
  interests: string[];
  careerGoals: string[];
  evaluatedProjects: Array<{
    projectId: string;
    rating: number; // 1 - 5
    gradeOutcome: 'A+' | 'A' | 'B+' | 'B';
    employedInField: boolean;
    publishedPaper: boolean;
  }>;
}

export interface CohortPeerNeighbor {
  student: HistoricalStudent;
  similarityScore: number; // 0 - 1
  sharedSkills: string[];
  sharedInterests: string[];
  projectRatingForCurrentTopic?: number;
}

export interface RecommendationScoreBreakdown {
  skillMatchScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  interestAlignmentScore: number; // 0 - 100
  matchedInterests: string[];
  careerGoalAlignmentScore: number; // 0 - 100
  matchedCareers: string[];
  feasibilityScore: number; // 0 - 100
  collaborativeCohortScore: number; // 0 - 100
  cohortNeighborsCount: number;
  cohortEndorsementStatement: string;
  topSimilarPeers: CohortPeerNeighbor[];
}

export interface RecommendationResult {
  topic: ProjectTopic;
  overallScore: number; // 0 - 100
  contentScore: number; // 0 - 100
  collaborativeScore: number; // 0 - 100
  trendScore: number; // 0 - 100
  breakdown: RecommendationScoreBreakdown;
  explanationReasoning: string[];
  rankBadge?: string;
}

export interface AlgorithmWeights {
  contentWeight: number; // e.g. 0.45
  collaborativeWeight: number; // e.g. 0.40
  trendWeight: number; // e.g. 0.15
}

export interface GeneratedProposal {
  projectTitle: string;
  executiveSummary: string;
  problemStatementDetailed: string;
  projectObjectives: string[];
  proposedMethodology: {
    systemArchitecture: string;
    algorithmsAndTechniques: string;
    evaluationMetrics: string;
  };
  technicalStack: {
    frontend?: string;
    backend?: string;
    aiAndData?: string;
    infrastructureAndTools?: string;
  };
  feasibilityAndRiskAssessment: Array<{
    risk: string;
    impact: 'High' | 'Medium' | 'Low';
    mitigationStrategy: string;
  }>;
  milestonePlan: Array<{
    phase: string;
    timeline: string;
    deliverable: string;
  }>;
  expectedOutcomes: string[];
}

export interface ImplementationRoadmap {
  durationWeeks: number;
  overallStrategy: string;
  weeks: Array<{
    weekNumber: number;
    title: string;
    focusArea: string;
    tasks: string[];
    recommendedTools: string[];
    exitCriteria: string;
  }>;
  keyMilestones: Array<{
    milestone: string;
    week: number;
  }>;
}

export interface AdvisorCritique {
  academicRigorScore: number;
  noveltyAssessment: string;
  strengths: string[];
  potentialPitfalls: string[];
  defenseQuestions: string[];
  recommendedExtensions: string[];
}
