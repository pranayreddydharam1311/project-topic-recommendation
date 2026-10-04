import React, { useState } from 'react';
import {
  X,
  Bookmark,
  GitCompare,
  Sparkles,
  BookOpen,
  Cpu,
  Users,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Copy,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import {
  RecommendationResult,
  StudentProfile,
  GeneratedProposal,
  ImplementationRoadmap,
  AdvisorCritique,
} from '../types/index.ts';
import {
  generateProjectProposal,
  generateProjectRoadmap,
  generateAdvisorCritique,
} from '../services/api.ts';

interface TopicDetailModalProps {
  recommendation: RecommendationResult | null;
  studentProfile: StudentProfile;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: () => void;
  onToggleCompare: () => void;
  onClose: () => void;
  hasApiKey: boolean;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  recommendation,
  studentProfile,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onClose,
  hasApiKey,
}) => {
  if (!recommendation) return null;

  const { topic, overallScore, contentScore, collaborativeScore, trendScore, breakdown, rankBadge } = recommendation;

  type ActiveTab = 'overview' | 'algorithm' | 'cohort' | 'proposal' | 'roadmap' | 'critique';
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // AI Generation States
  const [proposal, setProposal] = useState<GeneratedProposal | null>(null);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [proposalError, setProposalError] = useState<string | null>(null);

  const [roadmap, setRoadmap] = useState<ImplementationRoadmap | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);

  const [critique, setCritique] = useState<AdvisorCritique | null>(null);
  const [isGeneratingCritique, setIsGeneratingCritique] = useState(false);
  const [critiqueError, setCritiqueError] = useState<string | null>(null);

  const [copiedProposal, setCopiedProposal] = useState(false);

  // Handlers for AI features
  const handleGenerateProposal = async () => {
    setIsGeneratingProposal(true);
    setProposalError(null);
    try {
      const result = await generateProjectProposal(topic, studentProfile);
      setProposal(result);
    } catch (err: any) {
      setProposalError(err.message || 'Failed to generate proposal');
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    setRoadmapError(null);
    try {
      const result = await generateProjectRoadmap(topic, studentProfile, 12);
      setRoadmap(result);
    } catch (err: any) {
      setRoadmapError(err.message || 'Failed to generate roadmap');
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const handleGenerateCritique = async () => {
    setIsGeneratingCritique(true);
    setCritiqueError(null);
    try {
      const result = await generateAdvisorCritique(topic, studentProfile);
      setCritique(result);
    } catch (err: any) {
      setCritiqueError(err.message || 'Failed to generate critique');
    } finally {
      setIsGeneratingCritique(false);
    }
  };

  const handleCopyProposal = () => {
    if (!proposal) return;
    const markdown = `
# Project Proposal: ${proposal.projectTitle}

## 1. Executive Summary
${proposal.executiveSummary}

## 2. Detailed Problem Statement
${proposal.problemStatementDetailed}

## 3. Project Objectives
${proposal.projectObjectives.map(o => `- ${o}`).join('\n')}

## 4. Proposed Methodology & Architecture
### System Architecture
${proposal.proposedMethodology.systemArchitecture}

### Algorithms & Techniques
${proposal.proposedMethodology.algorithmsAndTechniques}

### Evaluation Metrics
${proposal.proposedMethodology.evaluationMetrics}

## 5. Technical Stack
- **Frontend:** ${proposal.technicalStack.frontend || 'N/A'}
- **Backend:** ${proposal.technicalStack.backend || 'N/A'}
- **AI & Data:** ${proposal.technicalStack.aiAndData || 'N/A'}
- **Infrastructure:** ${proposal.technicalStack.infrastructureAndTools || 'N/A'}

## 6. Feasibility & Risk Assessment
${proposal.feasibilityAndRiskAssessment.map(r => `- **${r.risk}** (Impact: ${r.impact}): ${r.mitigationStrategy}`).join('\n')}

## 7. Milestone Plan
${proposal.milestonePlan.map(m => `- **${m.phase}** (${m.timeline}): ${m.deliverable}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(markdown);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              {/* Unboxed metadata line with typographic separators */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium mb-1.5">
                <span className="text-slate-800 font-bold">{topic.domain}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{topic.academicLevel}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-semibold text-indigo-700">{topic.difficulty} Difficulty</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{topic.estimatedDurationMonths} Months</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{topic.idealTeamSize}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                {topic.title}
              </h2>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={onToggleCompare}
                className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
                  isCompared
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="Toggle Compare"
              >
                <GitCompare className="w-4 h-4" />
              </button>

              <button
                onClick={onToggleSave}
                className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
                  isSaved
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="Bookmark topic"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-400">Hybrid Match:</span>
                <span className="font-bold text-indigo-600 text-sm">{overallScore}%</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-400">Content:</span>
                <span className="font-semibold text-slate-700">{contentScore}%</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-400">Peer Cohort:</span>
                <span className="font-semibold text-emerald-700">{collaborativeScore}%</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-400">Trend Index:</span>
                <span className="font-semibold text-amber-700">{trendScore}/100</span>
              </div>
            </div>

            {rankBadge && (
              <span className="font-semibold text-indigo-700 text-xs">
                {rankBadge}
              </span>
            )}
          </div>

          {/* Navigation Tabs (Functional segmented button controls) */}
          <div className="flex items-center space-x-1 mt-4 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview & Architecture
            </button>

            <button
              onClick={() => setActiveTab('algorithm')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'algorithm'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Algorithmic Match ({overallScore}%)
            </button>

            <button
              onClick={() => setActiveTab('cohort')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'cohort'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Peer Cohort Evidence
            </button>

            <button
              onClick={() => {
                setActiveTab('proposal');
                if (!proposal && !isGeneratingProposal) handleGenerateProposal();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'proposal'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>AI Proposal</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('roadmap');
                if (!roadmap && !isGeneratingRoadmap) handleGenerateRoadmap();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'roadmap'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Roadmap</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('critique');
                if (!critique && !isGeneratingCritique) handleGenerateCritique();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'critique'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-slate-500" />
              <span>Advisor Critique</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW & ARCHITECTURE */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Abstract */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Academic Abstract
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {topic.abstract}
                </p>
              </div>

              {/* Problem Statement */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Problem Statement
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {topic.problemStatement}
                </p>
              </div>

              {/* Methodology & Architecture */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Technical Methodology & System Architecture
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {topic.methodology}
                </p>
              </div>

              {/* Expected Deliverables */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Expected Deliverables & Artifacts
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/60">
                  {topic.expectedDeliverables}
                </p>
              </div>

              {/* Skills and Roles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 mb-2">Core Technical Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.coreSkills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs text-slate-800 font-medium">
                        {skill}
                      </span>
                    ))}
                    {topic.secondarySkills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-50 border border-slate-200/80 rounded text-xs text-slate-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-700 mb-2">Career Trajectory Alignment</h4>
                  <div className="flex flex-col gap-1 text-xs text-slate-700">
                    {topic.targetCareerRoles.map(role => (
                      <span key={role} className="flex items-center gap-1.5 font-medium">
                        <ChevronRight className="w-3 h-3 text-indigo-500" />
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Literature References */}
              {topic.suggestedLiterature && topic.suggestedLiterature.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>Suggested Foundational Literature</span>
                  </h3>
                  <div className="space-y-2">
                    {topic.suggestedLiterature.map((lit, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs">
                        <div className="font-semibold text-slate-800">{lit.title}</div>
                        <div className="text-slate-500 mt-0.5">
                          {lit.authors} ({lit.year}) {lit.conferenceOrJournal ? `· ${lit.conferenceOrJournal}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALGORITHM BREAKDOWN */}
          {activeTab === 'algorithm' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                <h3 className="text-xs font-semibold text-slate-700 mb-1">
                  Why Was This Topic Recommended To You?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our hybrid recommendation engine blended Content-Based NLP Filtering ({contentScore}%),
                  Collaborative Peer Signals ({collaborativeScore}%), and Market Trends ({trendScore}%) to yield an overall match of{' '}
                  <strong className="text-slate-900 font-bold">{overallScore}%</strong>.
                </p>
              </div>

              {/* Sub-Score Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">Skill Prerequisites Overlap</span>
                    <span className="font-mono font-bold text-slate-800">{breakdown.skillMatchScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${breakdown.skillMatchScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">Thematic Interest Overlap</span>
                    <span className="font-mono font-bold text-slate-800">{breakdown.interestAlignmentScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${breakdown.interestAlignmentScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">Career Goal Alignment</span>
                    <span className="font-mono font-bold text-slate-800">{breakdown.careerGoalAlignmentScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-600 h-2 rounded-full transition-all"
                      style={{ width: `${breakdown.careerGoalAlignmentScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">Collaborative Peer Cohort Success</span>
                    <span className="font-mono font-bold text-slate-800">{breakdown.collaborativeCohortScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${breakdown.collaborativeCohortScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Skills Analysis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                  <div className="text-xs font-semibold text-emerald-800 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Skills You Possess ({breakdown.matchedSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {breakdown.matchedSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-white border border-emerald-200 text-[11px] text-emerald-900 rounded font-medium">
                        {s}
                      </span>
                    ))}
                    {breakdown.matchedSkills.length === 0 && (
                      <span className="text-xs text-slate-400">None yet</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span>Skills You'll Master ({breakdown.missingSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {breakdown.missingSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-white border border-slate-200 text-[11px] text-slate-700 rounded">
                        {s}
                      </span>
                    ))}
                    {breakdown.missingSkills.length === 0 && (
                      <span className="text-xs text-slate-400">All prerequisites met!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Explanation Log */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 mb-2">Algorithmic Match Reasoning</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {recommendation.explanationReasoning.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: PEER COHORT EVIDENCE */}
          {activeTab === 'cohort' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700">
                <div className="font-semibold text-slate-900 mb-1">
                  Collaborative Filtering (KNN Peer Neighborhood)
                </div>
                <p className="leading-relaxed">
                  The algorithm searched the historical student capstone archive and identified the closest matching
                  student profiles based on skill vectors, research interests, and career tracks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {breakdown.topSimilarPeers.map((peer, idx) => (
                  <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{peer.student.name}</span>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[11px] font-mono font-semibold">
                        {Math.round(peer.similarityScore * 100)}% Profile Similarity
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      {peer.student.discipline} · {peer.student.academicLevel}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600">Shared Skills:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[160px]">
                        {peer.sharedSkills.join(', ') || 'General CS'}
                      </span>
                    </div>

                    {peer.projectRatingForCurrentTopic !== undefined ? (
                      <div className="p-2 bg-emerald-50/70 border border-emerald-100 rounded text-[11px] text-emerald-900 flex items-center justify-between">
                        <span>Cohort Project Rating:</span>
                        <strong className="font-bold font-mono">{peer.projectRatingForCurrentTopic}/5.0 ★</strong>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">
                        Took similar domain project
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AI FORMAL PROPOSAL */}
          {activeTab === 'proposal' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Formal Academic Project Proposal
                  </h3>
                  <p className="text-xs text-slate-500">
                    Structured IEEE/ACM style proposal generated with Gemini
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {proposal && (
                    <button
                      onClick={handleCopyProposal}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedProposal ? 'Copied Markdown!' : 'Copy Proposal'}</span>
                    </button>
                  )}

                  <button
                    onClick={handleGenerateProposal}
                    disabled={isGeneratingProposal}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingProposal ? 'Generating Proposal...' : proposal ? 'Regenerate' : 'Generate Proposal'}</span>
                  </button>
                </div>
              </div>

              {proposalError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Failed to generate AI proposal</div>
                    <div>{proposalError}</div>
                  </div>
                </div>
              )}

              {isGeneratingProposal && (
                <div className="p-12 text-center space-y-3">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-indigo-600 border-t-transparent" />
                  <p className="text-xs text-slate-600 font-medium">
                    Synthesizing formal capstone proposal, methodology, and risk mitigation plan...
                  </p>
                </div>
              )}

              {proposal && !isGeneratingProposal && (
                <div className="space-y-6 text-xs text-slate-700 border border-slate-200 rounded-xl p-5 bg-white shadow-xs">
                  {/* Executive Summary */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5">1. Executive Summary</h4>
                    <p className="leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                      {proposal.executiveSummary}
                    </p>
                  </div>

                  {/* Problem Statement */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5">2. Problem Formulation & Research Gap</h4>
                    <p className="leading-relaxed">{proposal.problemStatementDetailed}</p>
                  </div>

                  {/* Objectives */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5">3. Project Objectives</h4>
                    <ul className="space-y-1 list-disc list-inside">
                      {proposal.projectObjectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Proposed Methodology */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5">4. Proposed Methodology & Architecture</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <strong className="text-slate-900 block mb-1">System Architecture:</strong>
                        <p>{proposal.proposedMethodology.systemArchitecture}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <strong className="text-slate-900 block mb-1">Algorithms & Techniques:</strong>
                        <p>{proposal.proposedMethodology.algorithmsAndTechniques}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <strong className="text-slate-900 block mb-1">Empirical Evaluation Metrics:</strong>
                        <p>{proposal.proposedMethodology.evaluationMetrics}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5">5. Recommended Technical Stack</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 border border-slate-100 rounded-lg">
                        <span className="text-slate-400 block text-[10px]">Frontend:</span>
                        <span className="font-medium text-slate-800">{proposal.technicalStack.frontend || 'N/A'}</span>
                      </div>
                      <div className="p-2.5 border border-slate-100 rounded-lg">
                        <span className="text-slate-400 block text-[10px]">Backend:</span>
                        <span className="font-medium text-slate-800">{proposal.technicalStack.backend || 'N/A'}</span>
                      </div>
                      <div className="p-2.5 border border-slate-100 rounded-lg">
                        <span className="text-slate-400 block text-[10px]">AI / Data:</span>
                        <span className="font-medium text-slate-800">{proposal.technicalStack.aiAndData || 'N/A'}</span>
                      </div>
                      <div className="p-2.5 border border-slate-100 rounded-lg">
                        <span className="text-slate-400 block text-[10px]">Infrastructure:</span>
                        <span className="font-medium text-slate-800">{proposal.technicalStack.infrastructureAndTools || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Risks */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5">6. Feasibility & Risk Assessment</h4>
                    <div className="space-y-2">
                      {proposal.feasibilityAndRiskAssessment.map((risk, i) => (
                        <div key={i} className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-800">{risk.risk}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              risk.impact === 'High' ? 'bg-rose-100 text-rose-700' :
                              risk.impact === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                            }`}>
                              Impact: {risk.impact}
                            </span>
                          </div>
                          <p className="text-slate-600">{risk.mitigationStrategy}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5">7. Milestone Timeline</h4>
                    <div className="space-y-2">
                      {proposal.milestonePlan.map((m, i) => (
                        <div key={i} className="flex items-start justify-between p-2.5 bg-slate-50 rounded-lg">
                          <div>
                            <span className="font-semibold text-slate-800 block">{m.phase}</span>
                            <span className="text-slate-500 text-[11px]">{m.deliverable}</span>
                          </div>
                          <span className="font-mono text-slate-500 font-medium whitespace-nowrap ml-3">
                            {m.timeline}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: IMPLEMENTATION ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Week-by-Week Implementation Plan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Iterative sprint roadmap with measurable completion criteria
                  </p>
                </div>

                <button
                  onClick={handleGenerateRoadmap}
                  disabled={isGeneratingRoadmap}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isGeneratingRoadmap ? 'Formulating...' : roadmap ? 'Regenerate' : 'Generate Roadmap'}</span>
                </button>
              </div>

              {roadmapError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {roadmapError}
                </div>
              )}

              {isGeneratingRoadmap && (
                <div className="p-12 text-center space-y-3">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-indigo-600 border-t-transparent" />
                  <p className="text-xs text-slate-600 font-medium">
                    Structuring 12-week development sprints and exit criteria...
                  </p>
                </div>
              )}

              {roadmap && !isGeneratingRoadmap && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs text-indigo-900">
                    <strong className="block mb-0.5">Development Strategy:</strong>
                    {roadmap.overallStrategy}
                  </div>

                  <div className="space-y-3">
                    {roadmap.weeks.map((w) => (
                      <div key={w.weekNumber} className="p-4 bg-white border border-slate-200 rounded-xl text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            Sprint {w.weekNumber}: {w.title}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px]">
                            {w.focusArea}
                          </span>
                        </div>

                        <ul className="space-y-1 list-disc list-inside text-slate-600">
                          {w.tasks.map((task, tidx) => (
                            <li key={tidx}>{task}</li>
                          ))}
                        </ul>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">
                            Tools: {w.recommendedTools.join(', ')}
                          </span>
                          <span className="font-semibold text-emerald-700">
                            Checkpoint: {w.exitCriteria}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: ADVISOR CRITIQUE */}
          {activeTab === 'critique' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Faculty Defense Committee Critique
                  </h3>
                  <p className="text-xs text-slate-500">
                    AI evaluation of academic novelty, potential bottlenecks, and expected defense questions
                  </p>
                </div>

                <button
                  onClick={handleGenerateCritique}
                  disabled={isGeneratingCritique}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{isGeneratingCritique ? 'Evaluating...' : critique ? 'Re-evaluate' : 'Run Advisor Review'}</span>
                </button>
              </div>

              {critiqueError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {critiqueError}
                </div>
              )}

              {isGeneratingCritique && (
                <div className="p-12 text-center space-y-3">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-indigo-600 border-t-transparent" />
                  <p className="text-xs text-slate-600 font-medium">
                    Reviewing topic novelty, methodological rigor, and generating oral defense questions...
                  </p>
                </div>
              )}

              {critique && !isGeneratingCritique && (
                <div className="space-y-4 text-xs">
                  {/* Rigor Score */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Academic Rigor & Feasibility Score</div>
                      <div className="text-slate-500 text-[11px]">Evaluated against undergraduate capstone / graduate standards</div>
                    </div>
                    <div className="text-xl font-bold font-mono text-indigo-700">
                      {critique.academicRigorScore} / 100
                    </div>
                  </div>

                  {/* Novelty Assessment */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-slate-800">Novelty Assessment</div>
                    <p className="text-slate-600 leading-relaxed">{critique.noveltyAssessment}</p>
                  </div>

                  {/* Defense Questions */}
                  <div className="p-4 bg-amber-50/50 border border-amber-200/70 rounded-xl space-y-2">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Likely Committee Defense Questions</span>
                    </div>
                    <div className="space-y-2">
                      {critique.defenseQuestions.map((q, idx) => (
                        <div key={idx} className="p-2.5 bg-white/90 border border-amber-100 rounded-lg text-slate-800">
                          <strong className="text-amber-900">Q{idx + 1}:</strong> {q}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pitfalls & Strengths */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5">
                      <div className="font-semibold text-emerald-900">Project Strengths</div>
                      <ul className="space-y-1 text-slate-700 list-disc list-inside">
                        {critique.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1.5">
                      <div className="font-semibold text-rose-900">Potential Pitfalls & Failure Modes</div>
                      <ul className="space-y-1 text-slate-700 list-disc list-inside">
                        {critique.potentialPitfalls.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex-shrink-0 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Topic ID: <span className="font-mono">{topic.id}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleSave}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
              <span>{isSaved ? 'Bookmarked' : 'Save to Shortlist'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
