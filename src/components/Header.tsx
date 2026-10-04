import React from 'react';
import {
  SlidersHorizontal,
  Bookmark,
  Sparkles,
  UserCheck,
  GitCompare,
  GraduationCap,
  Users,
} from 'lucide-react';
import { StudentProfile } from '../types/index.ts';

interface HeaderProps {
  activeProfile: StudentProfile;
  presetProfiles: StudentProfile[];
  onSelectProfile: (profile: StudentProfile) => void;
  onOpenProfileModal: () => void;
  onOpenAlgorithmModal: () => void;
  onOpenAiGeneratorModal: () => void;
  onOpenSavedDrawer: () => void;
  onOpenComparisonModal: () => void;
  onOpenPeerCohortModal: () => void;
  savedCount: number;
  compareCount: number;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeProfile,
  presetProfiles,
  onSelectProfile,
  onOpenProfileModal,
  onOpenAlgorithmModal,
  onOpenAiGeneratorModal,
  onOpenSavedDrawer,
  onOpenComparisonModal,
  onOpenPeerCohortModal,
  savedCount,
  compareCount,
  hasApiKey,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Subtitle */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">SynapseTopic</span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">v2.4</span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden md:block">
                AI Project Topic Recommender & Collaborative Filtering
              </p>
            </div>
          </div>

          {/* Center: Quick Persona Switcher */}
          <div className="hidden lg:flex items-center space-x-1.5 p-1 bg-slate-100 rounded-lg">
            <span className="text-xs font-medium text-slate-500 px-2 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> Persona:
            </span>
            {presetProfiles.map((p) => {
              const isSelected = p.id === activeProfile.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProfile(p)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={`${p.name} - ${p.discipline}`}
                >
                  {p.name.split(' ')[0]}
                </button>
              );
            })}
            <button
              onClick={onOpenProfileModal}
              className="px-2 py-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
            >
              Custom...
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2">
            {/* Algorithm Tuning Trigger */}
            <button
              onClick={onOpenAlgorithmModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Tune Collaborative vs Content-Based Weights"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Algorithm Weights</span>
            </button>

            {/* Peer Cohort Explorer Trigger */}
            <button
              onClick={onOpenPeerCohortModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="View Collaborative Filtering Peer Cohort KNN Cluster"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Peer Cohort</span>
            </button>

            {/* Compare Button */}
            {compareCount > 0 && (
              <button
                onClick={onOpenComparisonModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
              >
                <GitCompare className="w-3.5 h-3.5 text-indigo-600" />
                <span>Compare ({compareCount})</span>
              </button>
            )}

            {/* Saved Topics Drawer */}
            <button
              onClick={onOpenSavedDrawer}
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="View Bookmarked Topics"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            {/* AI Custom Brainstorm Button */}
            <button
              onClick={onOpenAiGeneratorModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>AI Synthesizer</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
