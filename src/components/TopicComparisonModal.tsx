import React from 'react';
import { X, GitCompare, Check, Plus, Trash2, ArrowRight } from 'lucide-react';
import { RecommendationResult } from '../types/index.ts';

interface TopicComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedResults: RecommendationResult[];
  onRemoveFromComparison: (topicId: string) => void;
  onSelectTopic: (result: RecommendationResult) => void;
}

export const TopicComparisonModal: React.FC<TopicComparisonModalProps> = ({
  isOpen,
  onClose,
  comparedResults,
  onRemoveFromComparison,
  onSelectTopic,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Side-by-Side Topic Comparison</h2>
              <p className="text-xs text-slate-500">Compare {comparedResults.length} selected capstone project ideas</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto flex-1">
          {comparedResults.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No project topics added to comparison yet. Click the comparison icon on any topic card to compare.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {comparedResults.map((result) => {
                const { topic, overallScore, contentScore, collaborativeScore, trendScore, breakdown } = result;

                return (
                  <div
                    key={topic.id}
                    className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs flex flex-col justify-between space-y-4 text-xs"
                  >
                    <div>
                      {/* Top Header & Remove */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-semibold text-indigo-700 font-mono">
                          {topic.domain}
                        </span>
                        <button
                          onClick={() => onRemoveFromComparison(topic.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-snug mb-3">
                        {topic.title}
                      </h3>

                      {/* Scores Breakdown */}
                      <div className="p-3 bg-slate-50 rounded-xl space-y-2 mb-4">
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-semibold text-slate-700">Overall Match:</span>
                          <span className="font-bold text-indigo-600 text-sm">{overallScore}%</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                          <span>Content / Skill:</span>
                          <span>{contentScore}%</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                          <span>Peer Cohort:</span>
                          <span>{collaborativeScore}%</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                          <span>Trend Index:</span>
                          <span>{trendScore}/100</span>
                        </div>
                      </div>

                      {/* Project Meta Spec */}
                      <div className="space-y-2 text-slate-600 pb-3 border-b border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Difficulty:</span>
                          <span className="font-medium text-slate-800">{topic.difficulty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Duration:</span>
                          <span className="font-medium text-slate-800">{topic.estimatedDurationMonths} Months</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Team Size:</span>
                          <span className="font-medium text-slate-800">{topic.idealTeamSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Resources:</span>
                          <span className="font-medium text-slate-800 truncate max-w-[140px]" title={topic.resourceRequirements}>
                            {topic.resourceRequirements}
                          </span>
                        </div>
                      </div>

                      {/* Matched vs Missing Skills */}
                      <div className="py-3 border-b border-slate-100 space-y-2">
                        <div>
                          <span className="text-slate-400 block text-[11px] mb-1">Matched Skills:</span>
                          <div className="flex flex-wrap gap-1">
                            {breakdown.matchedSkills.map(s => (
                              <span key={s} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] rounded font-medium">
                                {s}
                              </span>
                            ))}
                            {breakdown.matchedSkills.length === 0 && (
                              <span className="text-slate-400 text-[11px]">None</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[11px] mb-1">Skills to Learn:</span>
                          <div className="flex flex-wrap gap-1">
                            {breakdown.missingSkills.map(s => (
                              <span key={s} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Peer Cohort Signal */}
                      <div className="pt-3 text-[11px] text-slate-600">
                        <strong className="block text-slate-800 mb-0.5">Cohort Signal:</strong>
                        {breakdown.cohortEndorsementStatement}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectTopic(result);
                        onClose();
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-indigo-600 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1 mt-3"
                    >
                      <span>View Full Project</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
