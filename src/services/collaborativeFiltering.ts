import { StudentProfile, HistoricalStudent, ProjectTopic, CohortPeerNeighbor } from '../types/index.ts';
import { jaccardSimilarity, checkTermMatch } from './nlpSimilarity.ts';

/**
 * Computes multi-attribute similarity between an active student and a historical student
 * Combines Skill Similarity, Interest Overlap, and Career Goal alignment.
 */
export function calculateStudentSimilarity(
  activeStudent: StudentProfile,
  historicalStudent: HistoricalStudent
): {
  similarity: number;
  sharedSkills: string[];
  sharedInterests: string[];
} {
  const activeSkillNames = activeStudent.skills.map(s => s.name);
  const histSkillNames = historicalStudent.skills;

  // 1. Skill overlap (with proficiency bonus)
  const sharedSkills: string[] = [];
  let skillWeightSum = 0;
  let activeWeightTotal = 0;

  for (const sk of activeStudent.skills) {
    const w = sk.weight || (sk.level === 'Advanced' ? 3 : sk.level === 'Intermediate' ? 2 : 1);
    activeWeightTotal += w;
    if (checkTermMatch(sk.name, histSkillNames)) {
      sharedSkills.push(sk.name);
      skillWeightSum += w;
    }
  }

  const skillScore = activeWeightTotal > 0 ? (skillWeightSum / activeWeightTotal) : 0;

  // 2. Interest similarity (Jaccard)
  const sharedInterests = activeStudent.interests.filter(i =>
    checkTermMatch(i, historicalStudent.interests)
  );
  const interestScore = jaccardSimilarity(activeStudent.interests, historicalStudent.interests);

  // 3. Career goal alignment
  const careerScore = jaccardSimilarity(activeStudent.careerGoals, historicalStudent.careerGoals);

  // 4. Academic level / discipline match bonus
  let disciplineBonus = 0;
  if (
    activeStudent.discipline.toLowerCase().includes(historicalStudent.discipline.toLowerCase()) ||
    historicalStudent.discipline.toLowerCase().includes(activeStudent.discipline.toLowerCase())
  ) {
    disciplineBonus = 0.15;
  }

  // Weighted total student-student similarity [0 - 1]
  const totalSim = Math.min(
    1,
    0.50 * skillScore +
    0.30 * interestScore +
    0.15 * careerScore +
    disciplineBonus
  );

  return {
    similarity: Math.round(totalSim * 100) / 100,
    sharedSkills,
    sharedInterests,
  };
}

/**
 * Executes K-Nearest Neighbors User-Based Collaborative Filtering (UBCF)
 * Returns the predicted collaborative score (0 - 100) for a project,
 * along with the peer evidence and cohort neighbors.
 */
export function computeCollaborativeFiltering(
  topic: ProjectTopic,
  student: StudentProfile,
  historicalCohort: HistoricalStudent[],
  kNeighbors: number = 6
): {
  collaborativeScore: number;
  peerNeighbors: CohortPeerNeighbor[];
  endorsementStatement: string;
} {
  // 1. Calculate similarity between active student and all historical students
  const neighborEvaluations: Array<{
    student: HistoricalStudent;
    similarity: number;
    sharedSkills: string[];
    sharedInterests: string[];
    rating?: number;
    gradeOutcome?: string;
    employed?: boolean;
    published?: boolean;
  }> = [];

  for (const hist of historicalCohort) {
    const { similarity, sharedSkills, sharedInterests } = calculateStudentSimilarity(student, hist);
    const evalData = hist.evaluatedProjects.find(p => p.projectId === topic.id);

    neighborEvaluations.push({
      student: hist,
      similarity,
      sharedSkills,
      sharedInterests,
      rating: evalData?.rating,
      gradeOutcome: evalData?.gradeOutcome,
      employed: evalData?.employedInField,
      published: evalData?.publishedPaper,
    });
  }

  // Sort by similarity descending
  neighborEvaluations.sort((a, b) => b.similarity - a.similarity);

  // Pick top K neighbors
  const topK = neighborEvaluations.slice(0, kNeighbors);

  // Filter those top neighbors who took or evaluated this project
  const relevantWithRatings = topK.filter(n => n.rating !== undefined);

  let predictedRating = 0;
  let endorsement = '';
  const topSimilarPeers: CohortPeerNeighbor[] = topK.map(n => ({
    student: n.student,
    similarityScore: n.similarity,
    sharedSkills: n.sharedSkills,
    sharedInterests: n.sharedInterests,
    projectRatingForCurrentTopic: n.rating,
  }));

  if (relevantWithRatings.length > 0) {
    // Similarity-weighted average rating
    let weightedRatingSum = 0;
    let simSum = 0;
    let gradeACount = 0;

    for (const r of relevantWithRatings) {
      const weight = Math.max(r.similarity, 0.1);
      weightedRatingSum += weight * (r.rating || 4);
      simSum += weight;

      if (r.gradeOutcome === 'A+' || r.gradeOutcome === 'A') {
        gradeACount++;
      }
    }

    predictedRating = simSum > 0 ? (weightedRatingSum / simSum) : 4.0;
    const aRatePercent = Math.round((gradeACount / relevantWithRatings.length) * 100);

    endorsement = `${aRatePercent}% of senior peers with similar skillsets achieved Grade A/A+ on this topic (Cohort avg: ${predictedRating.toFixed(1)}/5.0).`;
  } else {
    // If no direct neighbor in top K evaluated this exact topic, fallback to topic's global collaborative metrics
    predictedRating = (topic.collaborativeMetrics.averageGradeScore / 5.0) * 4.5;
    endorsement = `Highly endorsed by academic faculty (${topic.collaborativeMetrics.facultyEndorsementRate}%) with ${topic.collaborativeMetrics.historicalCompletions} successful capstone completions.`;
  }

  // Normalize predicted rating (out of 5) to 0 - 100 score
  // E.g., rating of 5.0 -> 98, 4.0 -> 80, 3.0 -> 60
  const baseCollabScore = Math.min(100, Math.max(30, (predictedRating / 5.0) * 98));

  // Factor in global student success rate
  const blendedCollabScore = Math.round(
    baseCollabScore * 0.70 + (topic.collaborativeMetrics.similarStudentSuccessRate) * 0.30
  );

  return {
    collaborativeScore: blendedCollabScore,
    peerNeighbors: topSimilarPeers,
    endorsementStatement: endorsement,
  };
}
