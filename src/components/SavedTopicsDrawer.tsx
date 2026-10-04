import React, { useState } from 'react';
import { X, Bookmark, Trash2, ArrowRight, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { ProjectTopic, RecommendationResult, StudentProfile } from '../types/index.ts';

interface SavedTopicsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedTopics: ProjectTopic[];
  recommendationMap: Map<string, RecommendationResult>;
  onRemoveSaved: (topicId: string) => void;
  onSelectTopic: (result: RecommendationResult) => void;
  studentProfile: StudentProfile;
}

export const SavedTopicsDrawer: React.FC<SavedTopicsDrawerProps> = ({
  isOpen,
  onClose,
  savedTopics,
  recommendationMap,
  onRemoveSaved,
  onSelectTopic,
  studentProfile,
}) => {
  if (!isOpen) return null;

  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleStatusChange = (topicId: string, status: string) => {
    setStatuses(prev => ({ ...prev, [topicId]: status }));
  };

  const handleExportSummary = () => {
    const lines = [
      `# Capstone Project Topic Shortlist`,
      `**Student:** ${studentProfile.name} (${studentProfile.discipline}, ${studentProfile.academicLevel})`,
      `**Date:** ${new Date().toLocaleDateString()}`,
      `**Total Shortlisted Topics:** ${savedTopics.length}`,
      '',
      '---',
      '',
    ];

    savedTopics.forEach((t, idx) => {
      const rec = recommendationMap.get(t.id);
      const status = statuses[t.id] || 'Shortlisted';

      lines.push(`### ${idx + 1}. ${t.title}`);
      lines.push(`- **Domain:** ${t.domain} | **Level:** ${t.academicLevel} | **Difficulty:** ${t.difficulty}`);
      lines.push(`- **Status:** ${status}`);
      if (rec) {
        lines.push(`- **Match Score:** ${rec.overallScore}% (Content: ${rec.contentScore}%, Peer Cohort: ${rec.collaborativeScore}%)`);
      }
      lines.push(`- **Core Skills:** ${t.coreSkills.join(', ')}`);
      lines.push(`- **Abstract:** ${t.abstract}`);
      lines.push(`- **Methodology:** ${t.methodology}`);
      lines.push('');
    });

    const content = lines.join('\n');
    navigator.clipboard.writeText(content);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Bookmark className="w-4 h-4 fill-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Saved Projects ({savedTopics.length})</h2>
              <p className="text-xs text-slate-500">Track and manage your shortlisted capstones</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {savedTopics.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              <Bookmark className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p>You haven't bookmarked any project topics yet.</p>
              <p className="mt-1">Click the bookmark icon on any project card to save it here.</p>
            </div>
          ) : (
            savedTopics.map((topic) => {
              const rec = recommendationMap.get(topic.id);
              const status = statuses[topic.id] || 'Shortlisted';

              return (
                <div
                  key={topic.id}
                  className="p-4 border border-slate-200 rounded-xl bg-white shadow-xs space-y-2.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500">{topic.domain}</span>
                    <button
                      onClick={() => onRemoveSaved(topic.id)}
                      className="text-slate-400 hover:text-rose-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 leading-snug">
                    {topic.title}
                  </h3>

                  {rec && (
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-600">
                      <span className="font-bold text-indigo-600">{rec.overallScore}% Match</span>
                      <span>·</span>
                      <span>{topic.difficulty}</span>
                      <span>·</span>
                      <span>{topic.estimatedDurationMonths}mo</span>
                    </div>
                  )}

                  {/* Status Dropdown */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500">Stage:</span>
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(topic.id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] font-medium text-slate-700"
                    >
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Proposal Drafted">Proposal Drafted</option>
                      <option value="Discussed with Advisor">Discussed with Advisor</option>
                      <option value="Selected for Capstone">Selected for Capstone</option>
                    </select>
                  </div>

                  {rec && (
                    <button
                      onClick={() => {
                        onSelectTopic(rec);
                        onClose();
                      }}
                      className="w-full mt-2 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-600 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Explore Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {savedTopics.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleExportSummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Copied Synopsis!' : 'Export Shortlist Synopsis'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
