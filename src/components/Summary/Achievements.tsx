import { useState, useMemo } from "react";
import { useAchievements } from "../../hooks/useAchievements";
import type { AchievementCategory, AchievementTier } from "../../type";

const Achievements = () => {
  const { achievements } = useAchievements();
  const [selectedCategory, setSelectedCategory] = useState<
    AchievementCategory | "all"
  >("all");

  const filteredAchievements = useMemo(() => {
    if (selectedCategory === "all") return achievements;
    return achievements.filter((a) => a.category === selectedCategory);
  }, [achievements, selectedCategory]);

  const stats = useMemo(() => {
    const total = achievements.length;
    const unlocked = achievements.filter((a) => a.isUnlocked).length;
    const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    // Debug output
    console.log(
      `Achievement Stats: ${unlocked}/${total} unlocked (${percentage}%)`
    );
    console.log(
      "Sample achievements:",
      achievements.slice(0, 3).map((a) => ({
        name: a.name,
        isUnlocked: a.isUnlocked,
        progress: a.progress,
      }))
    );

    return { total, unlocked, percentage };
  }, [achievements]);

  const getTierColor = (tier: AchievementTier) => {
    switch (tier) {
      case "bronze":
        return "from-amber-700 to-amber-900";
      case "silver":
        return "from-gray-300 to-gray-500";
      case "gold":
        return "from-yellow-400 to-yellow-600";
      case "platinum":
        return "from-cyan-300 to-cyan-500";
    }
  };

  const getTierBorder = (tier: AchievementTier, isUnlocked: boolean) => {
    if (!isUnlocked) return "border-gray-600/50";

    switch (tier) {
      case "bronze":
        return "border-amber-600";
      case "silver":
        return "border-gray-300";
      case "gold":
        return "border-yellow-400";
      case "platinum":
        return "border-cyan-400";
    }
  };

  const getTierBackground = (tier: AchievementTier, isUnlocked: boolean) => {
    if (!isUnlocked) return "bg-gray-800/50";

    switch (tier) {
      case "bronze":
        return "bg-gradient-to-br from-amber-900/40 to-gray-800/80";
      case "silver":
        return "bg-gradient-to-br from-gray-700/60 to-gray-800/80";
      case "gold":
        return "bg-gradient-to-br from-yellow-900/40 to-gray-800/80";
      case "platinum":
        return "bg-gradient-to-br from-cyan-900/40 to-gray-800/80";
    }
  };

  const categories: Array<{ key: AchievementCategory | "all"; label: string }> =
    [
      { key: "all", label: "All" },
      { key: "bpm", label: "Speed" },
      { key: "consistency", label: "Consistency" },
      { key: "time", label: "Dedication" },
      { key: "improvement", label: "Progress" },
      { key: "special", label: "Special" },
    ];

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">
            Achievements
          </h2>
          <p className="text-sm text-gray-400">
            {stats.unlocked}/{stats.total} unlocked ({stats.percentage}%)
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                selectedCategory === cat.key
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`
              relative overflow-hidden rounded-lg border-2 transition-all
              ${getTierBorder(achievement.tier, achievement.isUnlocked)}
              ${getTierBackground(achievement.tier, achievement.isUnlocked)}
              ${
                achievement.isUnlocked
                  ? "hover:shadow-lg hover:scale-[1.02]"
                  : "opacity-60"
              }
            `}
          >
            {/* Tier Gradient Accent */}
            {achievement.isUnlocked && (
              <>
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${getTierColor(
                    achievement.tier
                  )}`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${getTierColor(
                    achievement.tier
                  )} opacity-5`}
                />
              </>
            )}

            <div className="p-4 relative z-10">
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={`
                  text-4xl flex-shrink-0
                  ${achievement.isUnlocked ? "" : "grayscale opacity-40"}
                `}
                >
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold mb-1 ${
                      achievement.isUnlocked ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {achievement.name}
                  </h3>
                  <p
                    className={`text-xs ${
                      achievement.isUnlocked ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {achievement.description}
                  </p>
                </div>
              </div>

              {/* Progress or Unlock Info */}
              {achievement.isUnlocked ? (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-600">
                  <span className="text-xs text-gray-400">
                    {achievement.unlockedAt &&
                      new Date(achievement.unlockedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                  </span>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getTierColor(
                      achievement.tier
                    )} text-white`}
                  >
                    {achievement.tier.toUpperCase()}
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-semibold text-gray-400">
                      {achievement.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-300"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                  {achievement.currentValue !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">
                      {achievement.currentValue}/
                      {achievement.criteria.threshold}{" "}
                      {getCriteriaUnit(achievement.criteria.type)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getCriteriaUnit(type: string): string {
  switch (type) {
    case "total_sessions":
      return "sessions";
    case "total_time":
      return "seconds";
    case "highest_bpm":
      return "BPM";
    case "bpm_growth":
      return "BPM growth";
    case "streak_days":
      return "days";
    case "perfect_week":
      return "perfect weeks";
    case "exercise_mastery":
      return "sessions";
    default:
      return "";
  }
}

export default Achievements;
