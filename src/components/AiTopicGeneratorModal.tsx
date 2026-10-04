import React, { useState } from 'react';
import { X, Sparkles, AlertTriangle, Check, BookOpen, Layers } from 'lucide-react';
import { StudentProfile, ProjectTopic } from '../types/index.ts';
import { generateAiCustomTopics } from '../services/api.ts';

interface AiTopicGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: StudentProfile;
  onAddGeneratedTopics: (newTopics: ProjectTopic[]) => void;
  hasApiKey: boolean;
}

export const AiTopicGeneratorModal: React.FC<AiTopicGeneratorModalProps> = ({
  isOpen,
  onClose,
  studentProfile,
  onAddGeneratedTopics,
  hasApiKey,
}) => {
  if (!isOpen) return null;

  const [customPrompt, setCustomPrompt] = useState('');
  const [preferredDomain, setPreferredDomain] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedTopics, setGeneratedTopics] = useState<ProjectTopic[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const topics = await generateAiCustomTopics(
        studentProfile,
        customPrompt,
        preferredDomain || undefined
      );

      // Enhance with collaborative default metrics
      const enrichedTopics: ProjectTopic[] = topics.map((t, idx) => ({
        ...t,
        id: `ai-gen-${Date.now()}-${idx}`,
        collaborativeMetrics: {
          historicalCompletions: 15,
          averageGradeScore: 4.8,
          facultyEndorsementRate: 95,
          similarStudentSuccessRate: 90,
          peerBookmarkCount: 45,
        },
      }));

      setGeneratedTopics(enrichedTopics);
    } catch (err: any) {
      setError(err.message || 'Failed to synthesize topics');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleIngestAndClose = () => {
    if (generatedTopics.length > 0) {
      onAddGeneratedTopics(generatedTopics);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Topic Synthesizer</h2>
              <p className="text-xs text-slate-500">Brainstorm bespoke capstone topics customized to your niche requirements</p>
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
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Profile context notice */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600">
            <strong className="text-slate-800 font-semibold block mb-0.5">Synthesizing for: {studentProfile.name}</strong>
            <span>{studentProfile.discipline} · {studentProfile.academicLevel} · Top Skills: {studentProfile.skills.slice(0, 4).map(s => s.name).join(', ')}</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Custom Angle or Special Requirements (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. I want to build a project at the intersection of Zero-Knowledge Proofs and Healthcare records, or an edge robotics project with low power requirements..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Preferred Research Domain (Optional)
            </label>
            <select
              value={preferredDomain}
              onChange={(e) => setPreferredDomain(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="">Any Domain (Best Fit for Profile)</option>
              <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
              <option value="Distributed Systems & Cloud Infrastructure">Distributed Systems & Cloud Infrastructure</option>
              <option value="Cybersecurity, Privacy & Cryptography">Cybersecurity, Privacy & Cryptography</option>
              <option value="Internet of Things, Robotics & Edge Computing">Internet of Things, Robotics & Edge Computing</option>
              <option value="Healthcare, Biomedical & Computational Biology">Healthcare, Biomedical & Computational Biology</option>
              <option value="Climate Tech, Clean Energy & Smart Cities">Climate Tech, Clean Energy & Smart Cities</option>
              <option value="FinTech, Quantitative Finance & Web3">FinTech, Quantitative Finance & Web3</option>
              <option value="Human-Computer Interaction, Accessibility & AR/VR">Human-Computer Interaction, Accessibility & AR/VR</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Synthesizing Topics with Gemini...' : 'Synthesize Project Topics'}</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block">Synthesis Error</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="py-8 text-center space-y-2">
              <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-indigo-600 border-t-transparent" />
              <p className="text-slate-500 font-medium">Generating novel topics matching your profile...</p>
            </div>
          )}

          {/* Generated Preview Cards */}
          {generatedTopics.length > 0 && !isGenerating && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs flex items-center justify-between">
                <span>Synthesized Project Topics ({generatedTopics.length})</span>
                <span className="text-[11px] text-emerald-600 font-medium">Ready to add to recommender</span>
              </h3>

              {generatedTopics.map((topic, idx) => (
                <div key={idx} className="p-4 border border-indigo-100 bg-indigo-50/20 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-indigo-700">{topic.domain}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{topic.difficulty}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">{topic.title}</h4>
                  <p className="text-slate-600 text-[11px] line-clamp-2">{topic.abstract}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {topic.coreSkills.map(s => (
                      <span key={s} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
          >
            Cancel
          </button>

          {generatedTopics.length > 0 && (
            <button
              onClick={handleIngestAndClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Add to Recommendation Pool ({generatedTopics.length})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
