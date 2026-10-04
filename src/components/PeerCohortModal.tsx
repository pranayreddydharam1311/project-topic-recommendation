import React from 'react';
import { X, Users, Award, BookOpen, Briefcase, CheckCircle2 } from 'lucide-react';
import { StudentProfile, HistoricalStudent, ProjectTopic } from '../types/index.ts';
import { calculateStudentSimilarity } from '../services/collaborativeFiltering.ts';

interface PeerCohortModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: StudentProfile;
  historicalCohort: HistoricalStudent[];
  allTopics: ProjectTopic[];
}

export const PeerCohortModal: React.FC<PeerCohortModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  historicalCohort,
  allTopics,
}) => {
  if (!isOpen) return null;

  // Calculate similarity against all historical students
  const analyzedCohort = historicalCohort.map((student) => {
    const { similarity, sharedSkills, sharedInterests } = calculateStudentSimilarity(
      activeProfile,
      student
    );
    return {
      student,
      similarity,
      sharedSkills,
      sharedInterests,
    };
  });

  // Sort descending by similarity
  analyzedCohort.sort((a, b) => b.similarity - a.similarity);

  // Topic lookup helper
  const topicMap = new Map(allTopics.map((t) => [t.id, t.title]));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Collaborative Filtering Peer Neighborhood
              </h2>
              <p className="text-xs text-slate-500">
                K-Nearest Neighbors (KNN) cluster of past students with matching skills & research trajectories
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Theory & Method Box */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5 text-slate-700">
            <div className="font-bold text-slate-900 text-xs">How Collaborative Filtering Works Here</div>
            <p className="leading-relaxed">
              The collaborative filtering algorithm models each student as a multi-dimensional profile vector across
              technical skills (weighted by proficiency), research domains, and career goals.
              Cosine & Jaccard distance metrics identify your top peer cohort. Topics favored and successfully completed
              by your nearest peers with Grade A/A+ ratings receive higher collaborative recommendation boost.
            </p>
          </div>

          {/* List of Peer Neighbors */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-xs flex items-center justify-between">
              <span>Top Peer Matches for {activeProfile.name}</span>
              <span className="text-slate-500 font-normal">Ranked by Vector Similarity</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyzedCohort.map((item, idx) => {
                const { student, similarity, sharedSkills, sharedInterests } = item;
                const similarityPercent = Math.round(similarity * 100);

                return (
                  <div
                    key={student.id}
                    className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {student.discipline} · {student.academicLevel}
                        </div>
                      </div>

                      <div className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-mono font-bold">
                        {similarityPercent}% Similarity
                      </div>
                    </div>

                    {/* Shared Skills & Interests */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400">Shared Skills:</span>
                        <span className="font-medium text-slate-700">
                          {sharedSkills.slice(0, 4).join(', ') || 'General STEM'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400">Interests:</span>
                        <span className="font-medium text-slate-700">
                          {sharedInterests.slice(0, 3).join(', ') || student.interests.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Capstones Evaluated by this Peer */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-600 block">
                        Completed Capstone Outcomes:
                      </span>
                      <div className="space-y-1.5">
                        {student.evaluatedProjects.map((ep, pidx) => {
                          const topicTitle = topicMap.get(ep.projectId) || ep.projectId;
                          return (
                            <div
                              key={pidx}
                              className="p-2 bg-slate-50 border border-slate-200/70 rounded-lg text-[11px] flex items-center justify-between gap-2"
                            >
                              <span className="font-medium text-slate-800 truncate" title={topicTitle}>
                                {topicTitle}
                              </span>
                              <div className="flex items-center space-x-2 flex-shrink-0 font-mono text-[10px]">
                                <span className="font-bold text-amber-600">{ep.rating}★</span>
                                <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold">
                                  {ep.gradeOutcome}
                                </span>
                                {ep.publishedPaper && (
                                  <span className="text-emerald-700 font-sans font-semibold">Published</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
