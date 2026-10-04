import React, { useState } from 'react';
import { X, Plus, Trash2, Award, Briefcase, Target, Clock, Check, User } from 'lucide-react';
import { StudentProfile, AcademicLevel, SkillProficiency, StudentSkill } from '../types/index.ts';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
}

const COMMON_SKILLS = [
  'Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'Docker', 'Kubernetes',
  'Go', 'Rust', 'C++', 'C', 'JavaScript', 'TypeScript', 'React', 'Node.js',
  'PostgreSQL', 'Redis', 'Linux Internals', 'Distributed Systems',
  'Consensus Algorithms', 'Zero-Knowledge Proofs', 'Cryptography', 'Solidity',
  'Computer Vision', 'ROS 2', 'Reinforcement Learning', 'NLP', 'Vector Databases',
  'Differential Privacy', 'Edge AI', 'Bioinformatics'
];

const COMMON_INTERESTS = [
  'Healthcare AI', 'Medical Imaging', 'Distributed Systems', 'Fault Tolerance',
  'Zero-Knowledge Proofs', 'Applied Cryptography', 'Autonomous Flight', 'Robotics',
  'LLM Agents', 'Clean Energy', 'Smart Grid', 'Quantitative Finance',
  'Accessibility', 'HCI', 'Bioinformatics', 'eBPF', 'Semantic Search', 'Web3'
];

const COMMON_CAREERS = [
  'ML Research Scientist', 'Healthcare AI Specialist', 'Distributed Systems Engineer',
  'Cloud Infrastructure Architect', 'Security Research Engineer', 'Cryptographer',
  'Robotics Engineer', 'Autonomous Systems Engineer', 'Fullstack AI Engineer',
  'Quantitative Developer', 'Accessibility Technologist', 'Platform Engineer'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  const [profile, setProfile] = useState<StudentProfile>({ ...currentProfile });

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillProficiency>('Intermediate');
  const [newInterest, setNewInterest] = useState('');
  const [newCareer, setNewCareer] = useState('');

  const handleAddSkill = (name: string, level: SkillProficiency = 'Intermediate') => {
    if (!name.trim()) return;
    if (profile.skills.some(s => s.name.toLowerCase() === name.toLowerCase())) return;

    const newSkill: StudentSkill = {
      name: name.trim(),
      category: 'frameworks',
      level,
      weight: level === 'Advanced' ? 3 : level === 'Intermediate' ? 2 : 1,
    };

    setProfile({
      ...profile,
      skills: [...profile.skills, newSkill],
    });
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s.name !== skillName),
    });
  };

  const handleAddInterest = (interest: string) => {
    if (!interest.trim()) return;
    if (profile.interests.some(i => i.toLowerCase() === interest.toLowerCase())) return;

    setProfile({
      ...profile,
      interests: [...profile.interests, interest.trim()],
    });
    setNewInterest('');
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter(i => i !== interest),
    });
  };

  const handleAddCareer = (career: string) => {
    if (!career.trim()) return;
    if (profile.careerGoals.some(c => c.toLowerCase() === career.toLowerCase())) return;

    setProfile({
      ...profile,
      careerGoals: [...profile.careerGoals, career.trim()],
    });
    setNewCareer('');
  };

  const handleRemoveCareer = (career: string) => {
    setProfile({
      ...profile,
      careerGoals: profile.careerGoals.filter(c => c !== career),
    });
  };

  const handleSave = () => {
    onSaveProfile(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Customize Student Profile</h2>
              <p className="text-xs text-slate-500">Tune your background to recalculate recommendation rankings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Section 1: Academic Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Student Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Academic Level</label>
              <select
                value={profile.academicLevel}
                onChange={e => setProfile({ ...profile, academicLevel: e.target.value as AcademicLevel })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Undergraduate Final Year">Undergraduate Final Year</option>
                <option value="Masters Thesis">Masters Thesis</option>
                <option value="PhD Research">PhD Research</option>
                <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Discipline / Major</label>
              <input
                type="text"
                value={profile.discipline}
                onChange={e => setProfile({ ...profile, discipline: e.target.value })}
                placeholder="e.g. Computer Science, Artificial Intelligence"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">GPA / Academic Standing</label>
              <input
                type="text"
                value={profile.gpaOrStanding || ''}
                onChange={e => setProfile({ ...profile, gpaOrStanding: e.target.value })}
                placeholder="e.g. 3.9 / 4.0 (First Class Honors)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Section 2: Skills with Proficiency */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Technical Skills & Proficiency Levels</span>
              </label>
              <span className="text-slate-400">{profile.skills.length} skills</span>
            </div>

            {/* Current Skills Chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <span className={`w-2 h-2 rounded-full ${
                    skill.level === 'Advanced' ? 'bg-emerald-500' :
                    skill.level === 'Intermediate' ? 'bg-indigo-500' : 'bg-slate-400'
                  }`} />
                  <span className="font-semibold text-slate-800">{skill.name}</span>
                  <span className="text-[10px] text-slate-400">({skill.level})</span>
                  <button
                    onClick={() => handleRemoveSkill(skill.name)}
                    className="text-slate-400 hover:text-rose-600 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Row */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add custom skill (e.g. PyTorch, Rust, Solidity)..."
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(newSkillName, newSkillLevel))}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
              <select
                value={newSkillLevel}
                onChange={e => setNewSkillLevel(e.target.value as SkillProficiency)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button
                type="button"
                onClick={() => handleAddSkill(newSkillName, newSkillLevel)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs"
              >
                Add
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
              <span className="font-medium">Quick add:</span>
              {COMMON_SKILLS.slice(0, 10).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s, 'Intermediate')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                >
                  +{s}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Thematic Interests */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Thematic & Research Interests</span>
              </label>
              <span className="text-slate-400">{profile.interests.length} selected</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {profile.interests.map((interest) => (
                <div
                  key={interest}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900"
                >
                  <span>{interest}</span>
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="text-indigo-400 hover:text-indigo-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add research topic (e.g. Federated Learning, Zero-Knowledge Proofs)..."
                value={newInterest}
                onChange={e => setNewInterest(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddInterest(newInterest))}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={() => handleAddInterest(newInterest)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
              <span className="font-medium">Suggestions:</span>
              {COMMON_INTERESTS.slice(0, 8).map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddInterest(i)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                >
                  +{i}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Target Career Goals */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-sky-600" />
                <span>Target Career Trajectories</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {profile.careerGoals.map((career) => (
                <div
                  key={career}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-100 rounded-lg text-sky-900"
                >
                  <span>{career}</span>
                  <button
                    onClick={() => handleRemoveCareer(career)}
                    className="text-sky-400 hover:text-sky-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add career goal (e.g. ML Research Scientist, Systems Architect)..."
                value={newCareer}
                onChange={e => setNewCareer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCareer(newCareer))}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={() => handleAddCareer(newCareer)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs"
              >
                Add
              </button>
            </div>
          </div>

          {/* Section 5: Project Constraints */}
          <div className="pt-4 border-t border-slate-100">
            <label className="font-semibold text-slate-800 flex items-center gap-1.5 mb-3">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Project Preferences & Constraints</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Duration</label>
                <select
                  value={profile.projectPreferences?.duration}
                  onChange={e => setProfile({
                    ...profile,
                    projectPreferences: { ...profile.projectPreferences, duration: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="1_semester">1 Semester (3-4 Months)</option>
                  <option value="2_semesters">2 Semesters / Full Year (6-8 Months)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Team Size</label>
                <select
                  value={profile.projectPreferences?.teamSize}
                  onChange={e => setProfile({
                    ...profile,
                    projectPreferences: { ...profile.projectPreferences, teamSize: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="solo">Solo Individual Project</option>
                  <option value="duo">Pair (2 members)</option>
                  <option value="team_3_4">Group (3-4 members)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Resource Constraints</label>
                <select
                  value={profile.projectPreferences?.resourceType}
                  onChange={e => setProfile({
                    ...profile,
                    projectPreferences: { ...profile.projectPreferences, resourceType: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="software_only">Pure Software / Standard Laptop</option>
                  <option value="gpu_compute">GPU Compute / Cloud Credits Needed</option>
                  <option value="hardware_iot">Physical Hardware / Microcontrollers / Sensors</option>
                  <option value="cloud_heavy">Cloud Infrastructure / Multi-node Cluster</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Primary Target Outcome</label>
                <select
                  value={profile.projectPreferences?.targetOutcome}
                  onChange={e => setProfile({
                    ...profile,
                    projectPreferences: { ...profile.projectPreferences, targetOutcome: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="publication">Conference Paper / Preprint Publication</option>
                  <option value="industry_portfolio">Industry Portfolio / Job Recruitment Showcase</option>
                  <option value="working_prototype">Deployable MVP / Working Prototype</option>
                  <option value="open_source">Open-Source Community Tool / Library</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Save Profile & Recalculate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
