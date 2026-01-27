import { SkillCategory } from '@/data/skillsGalaxyData';

interface ReducedMotionFallbackProps {
  categories: SkillCategory[];
}

/**
 * ReducedMotionFallback Component
 *
 * Accessible fallback for users with prefers-reduced-motion enabled.
 * Displays skills in a simple 2D vertical layout with minimal animations.
 *
 * Features:
 * - Static 2D card layout instead of 3D scene
 * - No continuous animations or rotations
 * - Simple fade transitions only
 * - Vertical scroll layout with category cards
 * - Responsive grid for skill icons
 * - Dark theme matching the site design
 */
export default function ReducedMotionFallback({ categories }: ReducedMotionFallbackProps) {
  return (
    <div className="relative h-full w-full overflow-y-auto bg-gradient-to-b from-black to-purple-950">
      {/* Content container */}
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">Technical Skills</h1>
          <p className="text-lg text-white/70">
            Explore my technical skills organized by category
          </p>
        </div>

        {/* Category cards */}
        <div className="space-y-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="rounded-2xl border bg-gray-900/50 p-8 shadow-xl backdrop-blur-sm transition-opacity duration-500"
              style={{
                borderColor: `${category.color}40`,
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Category header */}
              <div className="mb-6 flex items-center gap-4">
                {/* Color indicator */}
                <div
                  className="h-4 w-4 rounded-full"
                  style={{
                    backgroundColor: category.color,
                    boxShadow: `0 0 20px ${category.color}80`,
                  }}
                  aria-hidden="true"
                />
                <h2 className="text-2xl font-semibold text-white">
                  {category.name}
                </h2>
              </div>

              {/* Skills grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="group relative flex flex-col items-center gap-3 rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 transition-all duration-300 hover:border-gray-600 hover:bg-gray-800/50"
                  >
                    {/* Skill icon */}
                    {skill.icon ? (
                      <div
                        className="flex h-12 w-12 items-center justify-center text-4xl opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                        aria-hidden="true"
                      >
                        {skill.icon}
                      </div>
                    ) : (
                      // Fallback for skills without icons (e.g., Leadership category)
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full text-xs font-medium opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          backgroundColor: `${category.color}20`,
                          color: category.color,
                        }}
                        aria-hidden="true"
                      >
                        {skill.name.charAt(0)}
                      </div>
                    )}

                    {/* Skill name */}
                    <div className="text-center text-sm font-medium text-white/90">
                      {skill.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Accessibility note */}
        <div className="mt-12 rounded-lg border border-gray-700/50 bg-gray-900/30 p-6 text-center">
          <p className="text-sm text-white/60">
            You're viewing a simplified layout based on your reduced motion preferences.
            This ensures a comfortable browsing experience without animations.
          </p>
        </div>
      </div>
    </div>
  );
}
