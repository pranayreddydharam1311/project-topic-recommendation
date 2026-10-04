import {
  StudentProfile,
  ProjectTopic,
  HistoricalStudent,
  RecommendationResult,
  AlgorithmWeights,
} from '../types/index.ts';
import { computeContentBasedFiltering } from './contentBasedFiltering.ts';
import { computeCollaborativeFiltering } from './collaborativeFiltering.ts';

export const DEFAULT_ALGORITHM_WEIGHTS: AlgorithmWeights = {
  contentWeight: 0.45,
  collaborativeWeight: 0.40,
  trendWeight: 0.15,
};

/**
 * Generate hybrid recommendations for a student profile against a database of project topics
 */
export function generateRecommendations(
  topics: ProjectTopic[],
  student: StudentProfile,
  historicalCohort: HistoricalStudent[],
  weights: AlgorithmWeights = DEFAULT_ALGORITHM_WEIGHTS
): RecommendationResult[] {
  // Normalize weights so sum is 1.0
  const weightSum = weights.contentWeight + weights.collaborativeWeight + weights.trendWeight;
  const normalizedWeights: AlgorithmWeights = weightSum > 0 ? {
    contentWeight: weights.contentWeight / weightSum,
    collaborativeWeight: weights.collaborativeWeight / weightSum,
    trendWeight: weights.trendWeight / weightSum,
  } : DEFAULT_ALGORITHM_WEIGHTS;

  const results: RecommendationResult[] = [];

  for (const topic of topics) {
    // 1. Content-Based Matching
    const cbf = computeContentBasedFiltering(topic, student);

    // 2. Collaborative Filtering Matching
    const cf = computeCollaborativeFiltering(topic, student, historicalCohort, 6);

    // 3. Trend Score
    const trendScore = topic.trendIndex || 85;

    // 4. Hybrid Overall Score
    const overallScore = Math.min(
      99,
      Math.max(
        15,
        Math.round(
          normalizedWeights.contentWeight * cbf.contentScore +
          normalizedWeights.collaborativeWeight * cf.collaborativeScore +
          normalizedWeights.trendWeight * trendScore
        )
      )
    );

    // Formulate comprehensive explanation reasoning
    const explanationReasoning: string[] = [
      ...cbf.reasoningNotes,
      cf.endorsementStatement,
      `Industry demand index: ${trendScore}/100 trending in current capstone & research recruitment.`,
    ];

    results.push({
      topic,
      overallScore,
      contentScore: cbf.contentScore,
      collaborativeScore: cf.collaborativeScore,
      trendScore,
      breakdown: {
        skillMatchScore: cbf.skillMatchScore,
        matchedSkills: cbf.matchedSkills,
        missingSkills: cbf.missingSkills,
        interestAlignmentScore: cbf.interestAlignmentScore,
        matchedInterests: cbf.matchedInterests,
        careerGoalAlignmentScore: cbf.careerGoalAlignmentScore,
        matchedCareers: cbf.matchedCareers,
        feasibilityScore: cbf.feasibilityScore,
        collaborativeCohortScore: cf.collaborativeScore,
        cohortNeighborsCount: cf.peerNeighbors.length,
        cohortEndorsementStatement: cf.endorsementStatement,
        topSimilarPeers: cf.peerNeighbors,
      },
      explanationReasoning,
    });
  }

  // Sort descending by overall hybrid score
  results.sort((a, b) => b.overallScore - a.overallScore);

  // Assign ranking badges
  return results.map((res, index) => {
    let rankBadge: string | undefined;
    if (index === 0) rankBadge = 'Top Recommended Match';
    else if (index === 1) rankBadge = 'Strong Cohort Pick';
    else if (index === 2) rankBadge = 'High Growth Alignment';

    return {
      ...res,
      rankBadge,
    };
  });
}
