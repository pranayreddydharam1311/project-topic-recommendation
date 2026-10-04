import React from 'react';
import {
  Bookmark,
  GitCompare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Check,
  Plus,
  Users,
} from 'lucide-react';
import { RecommendationResult } from '../types/index.ts';

interface TopicCardProps {
  recommendation: RecommendationResult;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: () => void;
  onToggleCompare: () => void;
  onSelectTopic: () => void;
  onGenerateProposalDirect: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  recommendation,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onSelectTopic,
  onGenerateProposalDirect,
}) => {
  const { topic, overallScore, contentScore, collaborativeScore, trendScore, breakdown, rankBadge } = recommendation;

  // Clean score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    if (score >= 70) return 'text-sky-700 bg-sky-50 border-sky-200';
    return 'text-slate-700 bg-slate-100 border-slate-200';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-6">
        {/* Quiet Top Kicker: Clean unboxed metadata with typographic separators */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="text-slate-800 font-semibold">{topic.domain}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{topic.academicLevel}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className={
              topic.difficulty === 'Advanced' ? 'text-amber-700' :
              topic.difficulty === 'Intermediate' ? 'text-indigo-600' : 'text-emerald-600'
            }>
              {topic.difficulty}
            </span>
          </div>

          {/* Rank Badge if present */}
          {rankBadge && (
            <span className="text-[11px] font-semibold text-indigo-700 font-mono tracking-tight">
              {rankBadge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={onSelectTopic}
          className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 cursor-pointer transition-colors mb-3"
        >
          {topic.title}
        </h3>

        {/* Abstract excerpt */}
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {topic.abstract}
        </p>

        {/* Skills Alignment Bar (Unboxed text with status dots) */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100 mb-4">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Skill Prerequisites Alignment</span>
            <span className="font-semibold text-slate-700">{breakdown.skillMatchScore}% Match</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {/* Matched core skills */}
            {breakdown.matchedSkills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 rounded"
              >
                <Check className="w-2.5 h-2.5 text-emerald-600" />
                {skill}
              </span>
            ))}

            {/* Missing skills (learning opportunity) */}
            {breakdown.missingSkills.slice(0, 2).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded"
                title="Skill to develop"
              >
                <Plus className="w-2.5 h-2.5 text-slate-400" />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Peer Cohort Endorsement Callout */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1.5 mb-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Collaborative Peer Signal</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-normal">
            {breakdown.cohortEndorsementStatement}
          </p>
        </div>
      </div>

      {/* Card Footer: Overall Match Score & Functional Action Buttons */}
      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Match Score Indicator with sub-scores */}
        <div className="flex items-center space-x-3">
          <div
            className={`px-3 py-1.5 rounded-xl border font-bold text-sm font-mono flex items-center gap-1.5 ${getScoreColor(
              overallScore
            )}`}
            title={`Overall Hybrid Match: ${overallScore}%\nContent Match: ${contentScore}%\nCollaborative Cohort: ${collaborativeScore}%\nIndustry Trend: ${trendScore}%`}
          >
            <span>{overallScore}%</span>
            <span className="text-[10px] font-sans font-medium text-slate-500">Match</span>
          </div>

          {/* Quiet sub-score indicators */}
          <div className="hidden sm:flex flex-col text-[10px] text-slate-500 font-mono">
            <span>CBF: {contentScore}%</span>
            <span>CF: {collaborativeScore}%</span>
          </div>
        </div>

        {/* Functional Buttons */}
        <div className="flex items-center space-x-1.5">
          {/* Compare Toggle */}
          <button
            onClick={onToggleCompare}
            className={`p-2 rounded-lg text-xs font-medium transition-colors ${
              isCompared
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/70'
            }`}
            title={isCompared ? 'Remove from comparison' : 'Add to side-by-side comparison'}
          >
            <GitCompare className="w-4 h-4" />
          </button>

          {/* Bookmark / Save */}
          <button
            onClick={onToggleSave}
            className={`p-2 rounded-lg text-xs font-medium transition-colors ${
              isSaved
                ? 'bg-amber-100 text-amber-800'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/70'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save to shortlist'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>

          {/* Proposal direct trigger */}
          <button
            onClick={onGenerateProposalDirect}
            className="p-2 rounded-lg text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Generate AI Project Proposal"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Details CTA */}
          <button
            onClick={onSelectTopic}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-lg shadow-xs transition-colors"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
