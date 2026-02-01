import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { getUserSkills } from '@/lib/api';
import type { UserSkill, SkillZone } from '@/types/api';

interface SkillMapProps {
  userId: string;
  className?: string;
}

export function SkillMap({ userId, className = '' }: SkillMapProps) {
  const navigate = useNavigate();
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['user-skills', userId],
    queryFn: () => getUserSkills(userId),
  });

  if (isLoading) {
    return (
      <div className={`border border-white/10 rounded-lg p-6 ${className}`}>
        <h2 className="text-xl font-bold text-white mb-4">Your Skill Map</h2>
        <div className="h-64 bg-white/5 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`border border-white/10 rounded-lg p-6 ${className}`}>
        <h2 className="text-xl font-bold text-white mb-4">Your Skill Map</h2>
        <p className="text-white/60 text-sm">Failed to load skills</p>
      </div>
    );
  }

  const skillsByZone = {
    red: data.skills.filter((skill) => skill.zone === 'red'),
    yellow: data.skills.filter((skill) => skill.zone === 'yellow'),
    green: data.skills.filter((skill) => skill.zone === 'green'),
    untested: data.skills.filter((skill) => skill.zone === 'untested'),
  };

  const handleSkillClick = (skill: UserSkill) => {
    if (skill.tested) {
      navigate({ to: `/skills/${skill.id}` });
    } else {
      navigate({ to: '/library', search: { skill: skill.skill_name } });
    }
  };

  const getZoneColor = (zone: SkillZone) => {
    switch (zone) {
      case 'red':
        return 'bg-red-900/30 border-red-800/50';
      case 'yellow':
        return 'bg-yellow-900/30 border-yellow-800/50';
      case 'green':
        return 'bg-green-900/30 border-green-800/50';
      case 'untested':
        return 'bg-gray-900/30 border-gray-800/50';
    }
  };

  const getDotColor = (zone: SkillZone) => {
    switch (zone) {
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'green':
        return 'bg-green-500';
      case 'untested':
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`border border-white/10 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Your Skill Map</h2>
        <p className="text-sm text-white/60">
          {data.total_sessions} session{data.total_sessions !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <div
          className={`border rounded-lg p-4 ${getZoneColor('red')}`}
          style={{ flex: Math.max(1, skillsByZone.red.length) }}
        >
          <h3 className="text-xs font-semibold text-white/60 mb-3">
            Needs Work (0-1)
          </h3>
          <div className="space-y-3">
            {skillsByZone.red.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSkillClick(skill)}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="w-full text-left group relative"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getDotColor('red')} flex-shrink-0`} />
                  <span className="text-sm text-white/90 truncate hidden sm:block">
                    {skill.skill_name}
                  </span>
                </div>
                {hoveredSkill === skill.id && (
                  <div className="absolute left-0 top-full mt-1 p-2 bg-black border border-white/20 rounded text-xs text-white/70 z-10 w-48">
                    {skill.skill_description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`border rounded-lg p-4 ${getZoneColor('yellow')}`}
          style={{ flex: Math.max(1, skillsByZone.yellow.length) }}
        >
          <h3 className="text-xs font-semibold text-white/60 mb-3">
            Developing (2-4)
          </h3>
          <div className="space-y-3">
            {skillsByZone.yellow.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSkillClick(skill)}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="w-full text-left group relative"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getDotColor('yellow')} flex-shrink-0`} />
                  <span className="text-sm text-white/90 truncate hidden sm:block">
                    {skill.skill_name}
                  </span>
                </div>
                {hoveredSkill === skill.id && (
                  <div className="absolute left-0 top-full mt-1 p-2 bg-black border border-white/20 rounded text-xs text-white/70 z-10 w-48">
                    {skill.skill_description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`border rounded-lg p-4 ${getZoneColor('green')}`}
          style={{ flex: Math.max(1, skillsByZone.green.length) }}
        >
          <h3 className="text-xs font-semibold text-white/60 mb-3">
            Strong (5+)
          </h3>
          <div className="space-y-3">
            {skillsByZone.green.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSkillClick(skill)}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="w-full text-left group relative"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getDotColor('green')} flex-shrink-0`} />
                  <span className="text-sm text-white/90 truncate hidden sm:block">
                    {skill.skill_name}
                  </span>
                </div>
                {hoveredSkill === skill.id && (
                  <div className="absolute left-0 top-full mt-1 p-2 bg-black border border-white/20 rounded text-xs text-white/70 z-10 w-48">
                    {skill.skill_description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {skillsByZone.untested.length > 0 && (
        <div className={`border rounded-lg p-4 ${getZoneColor('untested')}`}>
          <h3 className="text-xs font-semibold text-white/60 mb-3">
            Untested
          </h3>
          <div className="flex flex-wrap gap-3">
            {skillsByZone.untested.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSkillClick(skill)}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="group relative"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getDotColor('untested')} flex-shrink-0`} />
                  <span className="text-sm text-white/70 hidden sm:inline">
                    {skill.skill_name}
                  </span>
                </div>
                {hoveredSkill === skill.id && (
                  <div className="absolute left-0 top-full mt-1 p-2 bg-black border border-white/20 rounded text-xs text-white/70 z-10 w-48">
                    {skill.skill_description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
