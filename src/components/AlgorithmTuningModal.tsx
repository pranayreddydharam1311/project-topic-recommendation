import React from 'react';
import { X, Sliders, CheckCircle2, RotateCcw } from 'lucide-react';
import { AlgorithmWeights } from '../types/index.ts';
import { DEFAULT_ALGORITHM_WEIGHTS } from '../services/recommendationEngine.ts';

interface AlgorithmTuningModalProps {
  isOpen: boolean;
  onClose: () => void;
  weights: AlgorithmWeights;
  onChangeWeights: (weights: AlgorithmWeights) => void;
}

export const AlgorithmTuningModal: React.FC<AlgorithmTuningModalProps> = ({
  isOpen,
  onClose,
  weights,
  onChangeWeights,
}) => {
  if (!isOpen) return null;

  // Percentage representations
  const contentPct = Math.round(weights.contentWeight * 100);
  const collabPct = Math.round(weights.collaborativeWeight * 100);
  const trendPct = Math.round(weights.trendWeight * 100);

  const handleSliderChange = (type: 'content' | 'collab' | 'trend', newPct: number) => {
    // When one changes, rebalance the remaining two proportionally
    const val = Math.max(0, Math.min(100, newPct)) / 100;

    if (type === 'content') {
      const remaining = 1 - val;
      const currentOthers = weights.collaborativeWeight + weights.trendWeight;
      const cRatio = currentOthers > 0 ? weights.collaborativeWeight / currentOthers : 0.7;
      const tRatio = currentOthers > 0 ? weights.trendWeight / currentOthers : 0.3;

      onChangeWeights({
        contentWeight: val,
        collaborativeWeight: remaining * cRatio,
        trendWeight: remaining * tRatio,
      });
    } else if (type === 'collab') {
      const remaining = 1 - val;
      const currentOthers = weights.contentWeight + weights.trendWeight;
      const cRatio = currentOthers > 0 ? weights.contentWeight / currentOthers : 0.75;
      const tRatio = currentOthers > 0 ? weights.trendWeight / currentOthers : 0.25;

      onChangeWeights({
        contentWeight: remaining * cRatio,
        collaborativeWeight: val,
        trendWeight: remaining * tRatio,
      });
    } else {
      const remaining = 1 - val;
      const currentOthers = weights.contentWeight + weights.collaborativeWeight;
      const cRatio = currentOthers > 0 ? weights.contentWeight / currentOthers : 0.55;
      const colRatio = currentOthers > 0 ? weights.collaborativeWeight / currentOthers : 0.45;

      onChangeWeights({
        contentWeight: remaining * cRatio,
        collaborativeWeight: remaining * colRatio,
        trendWeight: val,
      });
    }
  };

  const applyPreset = (presetWeights: AlgorithmWeights) => {
    onChangeWeights(presetWeights);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Recommendation Algorithm Tuning</h2>
              <p className="text-xs text-slate-500">Configure the Hybrid Scoring blend weights</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders & Math Section */}
        <div className="p-6 space-y-6">
          {/* Formula Callout */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs font-mono text-slate-700 leading-relaxed">
            <div className="text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Hybrid Scoring Formula
            </div>
            Score = ({contentPct}% × ContentMatch) + ({collabPct}% × CollaborativeCohort) + ({trendPct}% × TrendIndex)
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Preset Strategies</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => applyPreset({ contentWeight: 0.45, collaborativeWeight: 0.40, trendWeight: 0.15 })}
                className="px-2.5 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50/50 transition-colors text-left"
              >
                <div className="font-semibold text-slate-800">Balanced</div>
                <div className="text-[10px] text-slate-500">45% / 40% / 15%</div>
              </button>

              <button
                onClick={() => applyPreset({ contentWeight: 0.75, collaborativeWeight: 0.15, trendWeight: 0.10 })}
                className="px-2.5 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50/50 transition-colors text-left"
              >
                <div className="font-semibold text-slate-800">Skill Focused</div>
                <div className="text-[10px] text-slate-500">75% / 15% / 10%</div>
              </button>

              <button
                onClick={() => applyPreset({ contentWeight: 0.20, collaborativeWeight: 0.70, trendWeight: 0.10 })}
                className="px-2.5 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50/50 transition-colors text-left"
              >
                <div className="font-semibold text-slate-800">Peer Driven</div>
                <div className="text-[10px] text-slate-500">20% / 70% / 10%</div>
              </button>

              <button
                onClick={() => applyPreset({ contentWeight: 0.30, collaborativeWeight: 0.25, trendWeight: 0.45 })}
                className="px-2.5 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50/50 transition-colors text-left"
              >
                <div className="font-semibold text-slate-800">Trend First</div>
                <div className="text-[10px] text-slate-500">30% / 25% / 45%</div>
              </button>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-4">
            {/* 1. Content-Based Weight */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-slate-800">Content-Based Filtering (Skills & NLP Overlap)</span>
                <span className="font-bold text-indigo-600 font-mono">{contentPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={contentPct}
                onChange={(e) => handleSliderChange('content', Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Matches required project skills, research interests, career trajectory, and TF-IDF cosine similarity.
              </p>
            </div>

            {/* 2. Collaborative Filtering Weight */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-slate-800">Collaborative Filtering (Peer Cohort Signals)</span>
                <span className="font-bold text-emerald-600 font-mono">{collabPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={collabPct}
                onChange={(e) => handleSliderChange('collab', Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Weights recommendations based on historical capstone ratings and Grade A outcomes from similar seniors.
              </p>
            </div>

            {/* 3. Trend Index Weight */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-slate-800">Industry & Academic Trend Index</span>
                <span className="font-bold text-amber-600 font-mono">{trendPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={trendPct}
                onChange={(e) => handleSliderChange('trend', Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Prioritizes state-of-the-art topics that currently command top industry recruitment and conference interest.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => onChangeWeights(DEFAULT_ALGORITHM_WEIGHTS)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Weights</span>
          </button>
        </div>
      </div>
    </div>
  );
};
