import React from 'react';
import { Search, ArrowUpDown, Filter, Sparkles, X } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedDomain: string;
  onDomainChange: (d: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (diff: string) => void;
  sortBy: 'hybrid' | 'content' | 'collaborative' | 'trend';
  onSortByChange: (sort: 'hybrid' | 'content' | 'collaborative' | 'trend') => void;
  availableDomains: string[];
  totalResultsCount: number;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDomain,
  onDomainChange,
  selectedDifficulty,
  onDifficultyChange,
  sortBy,
  onSortByChange,
  availableDomains,
  totalResultsCount,
  onResetFilters,
}) => {
  const isFiltered = searchQuery !== '' || selectedDomain !== 'all' || selectedDifficulty !== 'all';

  return (
    <div className="space-y-4 mb-6">
      {/* Top Search Bar & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by topic title, keyword, required skill (e.g. PyTorch, Raft, eBPF, zk-SNARKs)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort and Difficulty Selection */}
        <div className="flex items-center space-x-2">
          {/* Difficulty Segmented Button */}
          <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                className={`px-2.5 py-1 rounded-md transition-colors capitalize ${
                  selectedDifficulty === diff
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {diff === 'all' ? 'All Levels' : diff}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="hybrid">Overall Match Score</option>
              <option value="content">Content & Skill Match</option>
              <option value="collaborative">Peer Cohort Success</option>
              <option value="trend">Industry Trend Index</option>
            </select>
          </div>
        </div>
      </div>

      {/* Domain Segmented Filter Bar (Zero-pill discipline: styled as functional interactive segmented buttons) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => onDomainChange('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedDomain === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Domains
          </button>

          {availableDomains.map((domain) => {
            const isSelected = selectedDomain === domain;
            // Short label helper
            const shortLabel = domain
              .replace('Artificial Intelligence & Machine Learning', 'AI & ML')
              .replace('Distributed Systems & Cloud Infrastructure', 'Cloud & Systems')
              .replace('Cybersecurity, Privacy & Cryptography', 'Security & Crypto')
              .replace('Healthcare, Biomedical & Computational Biology', 'Health & Biotech')
              .replace('Internet of Things, Robotics & Edge Computing', 'Robotics & IoT')
              .replace('FinTech, Quantitative Finance & Web3', 'FinTech & Quant')
              .replace('Climate Tech, Clean Energy & Smart Cities', 'Climate Tech')
              .replace('Human-Computer Interaction, Accessibility & AR/VR', 'HCI & Assistive');

            return (
              <button
                key={domain}
                onClick={() => onDomainChange(domain)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={domain}
              >
                {shortLabel}
              </button>
            );
          })}
        </div>

        {/* Count & Reset */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 whitespace-nowrap pl-2">
          <span>{totalResultsCount} projects</span>
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="text-indigo-600 hover:text-indigo-800 font-medium underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
