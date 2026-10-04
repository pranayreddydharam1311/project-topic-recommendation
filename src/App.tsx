/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Header,
} from './components/Header.tsx';
import {
  StudentBanner,
} from './components/StudentBanner.tsx';
import {
  FilterBar,
} from './components/FilterBar.tsx';
import {
  TopicCard,
} from './components/TopicCard.tsx';
import {
  TopicDetailModal,
} from './components/TopicDetailModal.tsx';
import {
  ProfileModal,
} from './components/ProfileModal.tsx';
import {
  AlgorithmTuningModal,
} from './components/AlgorithmTuningModal.tsx';
import {
  TopicComparisonModal,
} from './components/TopicComparisonModal.tsx';
import {
  SavedTopicsDrawer,
} from './components/SavedTopicsDrawer.tsx';
import {
  AiTopicGeneratorModal,
} from './components/AiTopicGeneratorModal.tsx';
import {
  PeerCohortModal,
} from './components/PeerCohortModal.tsx';

import {
  StudentProfile,
  ProjectTopic,
  RecommendationResult,
  AlgorithmWeights,
} from './types/index.ts';
import {
  INITIAL_PROJECT_TOPICS,
  HISTORICAL_STUDENTS_COHORT,
} from './data/mockDatabase.ts';
import {
  PRESET_PROFILES,
} from './data/presetProfiles.ts';
import {
  generateRecommendations,
  DEFAULT_ALGORITHM_WEIGHTS,
} from './services/recommendationEngine.ts';
import {
  checkServerHealth,
} from './services/api.ts';
import {
  Sparkles,
  SlidersHorizontal,
  Compass,
  GraduationCap,
  Users,
  Search,
} from 'lucide-react';

export default function App() {
  // 1. Core Profile & Recommendation States
  const [activeProfile, setActiveProfile] = useState<StudentProfile>(PRESET_PROFILES[0]);
  const [allTopics, setAllTopics] = useState<ProjectTopic[]>(INITIAL_PROJECT_TOPICS);
  const [historicalCohort] = useState(HISTORICAL_STUDENTS_COHORT);
  const [algorithmWeights, setAlgorithmWeights] = useState<AlgorithmWeights>(DEFAULT_ALGORITHM_WEIGHTS);

  // 2. Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState<'hybrid' | 'content' | 'collaborative' | 'trend'>('hybrid');

  // 3. Saved & Comparison Lists
  const [savedTopicIds, setSavedTopicIds] = useState<string[]>(['proj-01', 'proj-05']);
  const [comparedTopicIds, setComparedTopicIds] = useState<string[]>([]);

  // 4. Modal Triggers
  const [selectedTopicResult, setSelectedTopicResult] = useState<RecommendationResult | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAlgorithmModalOpen, setIsAlgorithmModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isPeerCohortModalOpen, setIsPeerCohortModalOpen] = useState(false);
  const [isAiGeneratorModalOpen, setIsAiGeneratorModalOpen] = useState(false);

  // 5. Server & API Key Status
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    checkServerHealth().then((health) => {
      setHasApiKey(health.hasApiKey);
    });
  }, []);

  // Compute recommendations dynamically using Content-Based + Collaborative Filtering Engine
  const allRecommendations = useMemo(() => {
    return generateRecommendations(allTopics, activeProfile, historicalCohort, algorithmWeights);
  }, [allTopics, activeProfile, historicalCohort, algorithmWeights]);

  // Lookup map for fast retrieval
  const recommendationMap = useMemo(() => {
    return new Map<string, RecommendationResult>(
      allRecommendations.map((r) => [r.topic.id, r])
    );
  }, [allRecommendations]);

  // Unique list of domains
  const availableDomains = useMemo(() => {
    return Array.from(new Set(allTopics.map((t) => t.domain))).sort();
  }, [allTopics]);

  // Filtered & Sorted recommendations
  const filteredRecommendations = useMemo(() => {
    return allRecommendations
      .filter((rec) => {
        const { topic } = rec;

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = topic.title.toLowerCase().includes(q);
          const matchesDomain = topic.domain.toLowerCase().includes(q);
          const matchesAbstract = topic.abstract.toLowerCase().includes(q);
          const matchesSkills = [...topic.coreSkills, ...topic.secondarySkills].some((s) =>
            s.toLowerCase().includes(q)
          );
          const matchesTags = topic.tags.some((t) => t.toLowerCase().includes(q));

          if (!matchesTitle && !matchesDomain && !matchesAbstract && !matchesSkills && !matchesTags) {
            return false;
          }
        }

        // Domain filter
        if (selectedDomain !== 'all' && topic.domain !== selectedDomain) {
          return false;
        }

        // Difficulty filter
        if (selectedDifficulty !== 'all' && topic.difficulty !== selectedDifficulty) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'content') return b.contentScore - a.contentScore;
        if (sortBy === 'collaborative') return b.collaborativeScore - a.collaborativeScore;
        if (sortBy === 'trend') return b.trendScore - a.trendScore;
        return b.overallScore - a.overallScore;
      });
  }, [allRecommendations, searchQuery, selectedDomain, selectedDifficulty, sortBy]);

  // Handlers
  const handleToggleSave = (topicId: string) => {
    setSavedTopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const handleToggleCompare = (topicId: string) => {
    setComparedTopicIds((prev) => {
      if (prev.includes(topicId)) {
        return prev.filter((id) => id !== topicId);
      }
      if (prev.length >= 3) {
        // limit to 3 items
        return [prev[1], prev[2], topicId];
      }
      return [...prev, topicId];
    });
  };

  const handleAddGeneratedTopics = (newTopics: ProjectTopic[]) => {
    setAllTopics((prev) => [...newTopics, ...prev]);
  };

  // Saved topics list
  const savedTopicsList = useMemo(() => {
    return allTopics.filter((t) => savedTopicIds.includes(t.id));
  }, [allTopics, savedTopicIds]);

  // Compared topics list
  const comparedResultsList = useMemo(() => {
    return comparedTopicIds
      .map((id) => recommendationMap.get(id))
      .filter((r): r is RecommendationResult => Boolean(r));
  }, [comparedTopicIds, recommendationMap]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header Bar */}
      <Header
        activeProfile={activeProfile}
        presetProfiles={PRESET_PROFILES}
        onSelectProfile={setActiveProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAlgorithmModal={() => setIsAlgorithmModalOpen(true)}
        onOpenAiGeneratorModal={() => setIsAiGeneratorModalOpen(true)}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenComparisonModal={() => setIsComparisonModalOpen(true)}
        onOpenPeerCohortModal={() => setIsPeerCohortModalOpen(true)}
        savedCount={savedTopicIds.length}
        compareCount={comparedTopicIds.length}
        hasApiKey={hasApiKey}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Banner */}
        <StudentBanner
          profile={activeProfile}
          onEditProfile={() => setIsProfileModalOpen(true)}
        />

        {/* Algorithm Weights & Strategy Banner */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Recommendation Strategy
              </div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>
                  {Math.round(algorithmWeights.contentWeight * 100)}% Content & NLP Match
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-emerald-700">
                  {Math.round(algorithmWeights.collaborativeWeight * 100)}% Peer Cohort (KNN)
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-amber-700">
                  {Math.round(algorithmWeights.trendWeight * 100)}% Industry Trends
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-center">
            <button
              onClick={() => setIsAlgorithmModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Adjust Weights</span>
            </button>

            <button
              onClick={() => setIsPeerCohortModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>View KNN Cohort</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDomain={selectedDomain}
          onDomainChange={setSelectedDomain}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          availableDomains={availableDomains}
          totalResultsCount={filteredRecommendations.length}
          onResetFilters={() => {
            setSearchQuery('');
            setSelectedDomain('all');
            setSelectedDifficulty('all');
            setSortBy('hybrid');
          }}
        />

        {/* Results Grid */}
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl p-8 space-y-4">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-slate-800">No project topics match your filters</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Try clearing your search query, switching domain filters, or using the AI Synthesizer to create bespoke
                topics tailored to your parameters.
              </p>
            </div>
            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDomain('all');
                  setSelectedDifficulty('all');
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsAiGeneratorModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Synthesize Topics with AI</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((rec) => (
              <TopicCard
                key={rec.topic.id}
                recommendation={rec}
                isSaved={savedTopicIds.includes(rec.topic.id)}
                isCompared={comparedTopicIds.includes(rec.topic.id)}
                onToggleSave={() => handleToggleSave(rec.topic.id)}
                onToggleCompare={() => handleToggleCompare(rec.topic.id)}
                onSelectTopic={() => setSelectedTopicResult(rec)}
                onGenerateProposalDirect={() => {
                  setSelectedTopicResult(rec);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-800">SynapseTopic</span>
            <span>· Academic Capstone & Thesis Recommendation Engine</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>Dual-Algorithm: Content-Based TF-IDF + UBCF Collaborative Filtering</span>
            <span>·</span>
            <span>Powered by Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {selectedTopicResult && (
        <TopicDetailModal
          recommendation={selectedTopicResult}
          studentProfile={activeProfile}
          isSaved={savedTopicIds.includes(selectedTopicResult.topic.id)}
          isCompared={comparedTopicIds.includes(selectedTopicResult.topic.id)}
          onToggleSave={() => handleToggleSave(selectedTopicResult.topic.id)}
          onToggleCompare={() => handleToggleCompare(selectedTopicResult.topic.id)}
          onClose={() => setSelectedTopicResult(null)}
          hasApiKey={hasApiKey}
        />
      )}

      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentProfile={activeProfile}
          onSaveProfile={(updated) => setActiveProfile(updated)}
        />
      )}

      {isAlgorithmModalOpen && (
        <AlgorithmTuningModal
          isOpen={isAlgorithmModalOpen}
          onClose={() => setIsAlgorithmModalOpen(false)}
          weights={algorithmWeights}
          onChangeWeights={setAlgorithmWeights}
        />
      )}

      {isComparisonModalOpen && (
        <TopicComparisonModal
          isOpen={isComparisonModalOpen}
          onClose={() => setIsComparisonModalOpen(false)}
          comparedResults={comparedResultsList}
          onRemoveFromComparison={handleToggleCompare}
          onSelectTopic={(result) => setSelectedTopicResult(result)}
        />
      )}

      {isSavedDrawerOpen && (
        <SavedTopicsDrawer
          isOpen={isSavedDrawerOpen}
          onClose={() => setIsSavedDrawerOpen(false)}
          savedTopics={savedTopicsList}
          recommendationMap={recommendationMap}
          onRemoveSaved={handleToggleSave}
          onSelectTopic={(result) => setSelectedTopicResult(result)}
          studentProfile={activeProfile}
        />
      )}

      {isAiGeneratorModalOpen && (
        <AiTopicGeneratorModal
          isOpen={isAiGeneratorModalOpen}
          onClose={() => setIsAiGeneratorModalOpen(false)}
          studentProfile={activeProfile}
          onAddGeneratedTopics={handleAddGeneratedTopics}
          hasApiKey={hasApiKey}
        />
      )}

      {isPeerCohortModalOpen && (
        <PeerCohortModal
          isOpen={isPeerCohortModalOpen}
          onClose={() => setIsPeerCohortModalOpen(false)}
          activeProfile={activeProfile}
          historicalCohort={historicalCohort}
          allTopics={allTopics}
        />
      )}
    </div>
  );
}
