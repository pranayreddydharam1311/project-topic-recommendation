import { StudentProfile, ProjectTopic } from '../types/index.ts';
import {
  tokenizeText,
  computeTF,
  cosineSimilarity,
  jaccardSimilarity,
  checkTermMatch,
} from './nlpSimilarity.ts';

export interface ContentMatchBreakdown {
  contentScore: number; // 0 - 100
  skillMatchScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  interestAlignmentScore: number; // 0 - 100
  matchedInterests: string[];
  careerGoalAlignmentScore: number; // 0 - 100
  matchedCareers: string[];
  feasibilityScore: number; // 0 - 100
  nlpSemanticCosine: number; // 0 - 1
  reasoningNotes: string[];
}

export function computeContentBasedFiltering(
  topic: ProjectTopic,
  student: StudentProfile
): ContentMatchBreakdown {
  const reasoningNotes: string[] = [];

  // 1. Skill Match Analysis
  const studentSkillNames = student.skills.map(s => s.name);
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  let coreMatchCount = 0;
  for (const coreSkill of topic.coreSkills) {
    if (checkTermMatch(coreSkill, studentSkillNames)) {
      matchedSkills.push(coreSkill);
      coreMatchCount++;
    } else {
      missingSkills.push(coreSkill);
    }
  }

  let secondaryMatchCount = 0;
  for (const secSkill of topic.secondarySkills) {
    if (checkTermMatch(secSkill, studentSkillNames)) {
      if (!matchedSkills.includes(secSkill)) {
        matchedSkills.push(secSkill);
      }
      secondaryMatchCount++;
    }
  }

  const coreRatio = topic.coreSkills.length > 0 ? (coreMatchCount / topic.coreSkills.length) : 0;
  const secondaryRatio = topic.secondarySkills.length > 0 ? (secondaryMatchCount / topic.secondarySkills.length) : 0;

  // Weight core skills 75%, secondary skills 25%
  const skillMatchScore = Math.min(100, Math.round((coreRatio * 0.75 + secondaryRatio * 0.25) * 100));

  if (coreRatio >= 0.75) {
    reasoningNotes.push(`Strong core skill alignment: you possess ${coreMatchCount} of ${topic.coreSkills.length} required prerequisite technologies.`);
  } else if (coreRatio >= 0.4) {
    reasoningNotes.push(`Moderate skill foundation: good opportunity to level up in ${missingSkills.slice(0, 2).join(', ')}.`);
  } else {
    reasoningNotes.push(`Challenging technical curve: would require learning ${missingSkills.slice(0, 2).join(', ')}.`);
  }

  // 2. Interest Alignment Analysis
  const matchedInterests: string[] = [];
  const allTopicInterestTerms = [
    topic.domain,
    ...topic.tags,
    ...topic.coreSkills,
  ];

  for (const interest of student.interests) {
    if (checkTermMatch(interest, allTopicInterestTerms) || topic.abstract.toLowerCase().includes(interest.toLowerCase())) {
      matchedInterests.push(interest);
    }
  }

  const interestJaccard = jaccardSimilarity(student.interests, topic.tags);
  const interestCoverage = student.interests.length > 0 ? (matchedInterests.length / student.interests.length) : 0;
  const interestAlignmentScore = Math.min(100, Math.round((interestCoverage * 0.6 + interestJaccard * 0.4) * 100));

  if (matchedInterests.length > 0) {
    reasoningNotes.push(`High thematic overlap with your interest in ${matchedInterests.slice(0, 2).join(' & ')}.`);
  }

  // 3. Career Goal Alignment
  const matchedCareers: string[] = [];
  for (const career of student.careerGoals) {
    if (checkTermMatch(career, topic.targetCareerRoles)) {
      matchedCareers.push(career);
    }
  }

  const careerAlignmentScore = topic.targetCareerRoles.length > 0
    ? Math.min(100, Math.round((matchedCareers.length > 0 ? 85 + (matchedCareers.length * 5) : 35)))
    : 50;

  if (matchedCareers.length > 0) {
    reasoningNotes.push(`Directly targets your career goal: ${matchedCareers[0]}.`);
  }

  // 4. NLP Semantic Cosine Similarity (TF Vector Representation)
  const studentCorpus = [
    student.discipline,
    ...student.interests,
    ...studentSkillNames,
    ...student.careerGoals,
    student.bio || '',
  ].join(' ');

  const topicCorpus = [
    topic.title,
    topic.domain,
    topic.abstract,
    topic.problemStatement,
    ...topic.coreSkills,
    ...topic.tags,
    ...topic.targetCareerRoles,
  ].join(' ');

  const studentTokens = tokenizeText(studentCorpus);
  const topicTokens = tokenizeText(topicCorpus);

  const studentTF = computeTF(studentTokens);
  const topicTF = computeTF(topicTokens);

  const nlpSemanticCosine = cosineSimilarity(studentTF, topicTF);
  const nlpScoreNormalized = Math.min(100, Math.round(nlpSemanticCosine * 140)); // Boost typical TF cosine range

  // 5. Feasibility Score
  let feasibilityScore = 80;

  // Check student proficiency vs topic difficulty
  const advancedSkillCount = student.skills.filter(s => s.level === 'Advanced').length;
  if (topic.difficulty === 'Advanced' && advancedSkillCount < 2) {
    feasibilityScore -= 15;
  }
  if (topic.difficulty === 'Beginner' && advancedSkillCount >= 3) {
    feasibilityScore -= 5; // Might be too simple for an advanced student
  }

  // Resource preference check
  if (student.projectPreferences) {
    if (student.projectPreferences.resourceType === 'software_only' && topic.resourceRequirements.toLowerCase().includes('hardware')) {
      feasibilityScore -= 20;
    }
  }
  feasibilityScore = Math.max(30, Math.min(100, feasibilityScore));

  // Composite Content-Based Score
  const compositeContentScore = Math.min(
    100,
    Math.round(
      0.35 * skillMatchScore +
      0.25 * interestAlignmentScore +
      0.20 * careerAlignmentScore +
      0.10 * nlpScoreNormalized +
      0.10 * feasibilityScore
    )
  );

  return {
    contentScore: compositeContentScore,
    skillMatchScore,
    matchedSkills,
    missingSkills,
    interestAlignmentScore,
    matchedInterests,
    careerGoalAlignmentScore: careerAlignmentScore,
    matchedCareers,
    feasibilityScore,
    nlpSemanticCosine: Math.round(nlpSemanticCosine * 100) / 100,
    reasoningNotes,
  };
}
