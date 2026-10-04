import React from 'react';
import { User, Briefcase, Award, Target, Edit3, Clock, Cpu } from 'lucide-react';
import { StudentProfile } from '../types/index.ts';

interface StudentBannerProps {
  profile: StudentProfile;
  onEditProfile: () => void;
}

export const StudentBanner: React.FC<StudentBannerProps> = ({
  profile,
  onEditProfile,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden mb-8">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar & Identity Details */}
          <div className="flex items-start space-x-4">
            <div className="relative">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-100"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xl">
                  <User className="w-6 h-6" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {profile.name}
                </h1>
                {profile.gpaOrStanding && (
                  <span className="text-xs text-slate-500 font-medium">
                    ({profile.gpaOrStanding})
                  </span>
                )}
              </div>

              {/* Clean unboxed metadata with typographic separators */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 mt-1">
                <span className="font-medium text-slate-800">{profile.discipline}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{profile.academicLevel}</span>
                {profile.university && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span>{profile.university}</span>
                  </>
                )}
              </div>

              {profile.bio && (
                <p className="text-xs text-slate-500 mt-2 max-w-2xl line-clamp-2">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3 self-start lg:self-center">
            <button
              onClick={onEditProfile}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>Edit Profile & Preferences</span>
            </button>
          </div>
        </div>

        {/* Divider hairline */}
        <div className="h-px bg-slate-100 my-5" />

        {/* Bottom Matrix: Skills, Interests, Career Trajectory, Constraints */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
          {/* Key Skills */}
          <div>
            <div className="flex items-center gap-1 text-slate-400 font-medium mb-1.5">
              <Award className="w-3.5 h-3.5 text-slate-400" />
              <span>Assessed Skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 5).map((s) => (
                <span
                  key={s.name}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200/80 rounded text-slate-700"
                  title={`${s.name} (${s.level})`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    s.level === 'Advanced' ? 'bg-emerald-500' : s.level === 'Intermediate' ? 'bg-indigo-500' : 'bg-slate-400'
                  }`} />
                  {s.name}
                </span>
              ))}
              {profile.skills.length > 5 && (
                <span className="text-slate-400 text-xs self-center">
                  +{profile.skills.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Interests */}
          <div>
            <div className="flex items-center gap-1 text-slate-400 font-medium mb-1.5">
              <Target className="w-3.5 h-3.5 text-slate-400" />
              <span>Research & Thematic Interests</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.slice(0, 4).map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-0.5 bg-indigo-50/60 border border-indigo-100 rounded text-indigo-900"
                >
                  {interest}
                </span>
              ))}
              {profile.interests.length > 4 && (
                <span className="text-slate-400 text-xs self-center">
                  +{profile.interests.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Career Target */}
          <div>
            <div className="flex items-center gap-1 text-slate-400 font-medium mb-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Career Target Trajectory</span>
            </div>
            <div className="flex flex-col gap-1 text-slate-700">
              {profile.careerGoals.slice(0, 2).map((goal) => (
                <span key={goal} className="truncate font-medium">
                  → {goal}
                </span>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div>
            <div className="flex items-center gap-1 text-slate-400 font-medium mb-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Preferences & Constraints</span>
            </div>
            <div className="flex flex-col gap-1 text-slate-600">
              <span className="flex items-center gap-1">
                <span>Duration:</span>{' '}
                <strong className="text-slate-800 font-semibold">
                  {profile.projectPreferences?.duration === '1_semester' ? '1 Semester (3-4 mo)' : '2 Semesters (Full Year)'}
                </strong>
              </span>
              <span className="flex items-center gap-1">
                <span>Team:</span>{' '}
                <strong className="text-slate-800 font-semibold">
                  {profile.projectPreferences?.teamSize === 'solo' ? 'Individual (Solo)' : profile.projectPreferences?.teamSize === 'duo' ? 'Pair (Duo)' : 'Team (3-4)'}
                </strong>
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-slate-400" />
                <span>Resource:</span>{' '}
                <span className="text-slate-700 capitalize">
                  {profile.projectPreferences?.resourceType.replace('_', ' ')}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
