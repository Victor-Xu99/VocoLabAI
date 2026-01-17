"use client";

import { motion } from "motion/react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Footer } from "@/components/ui/footer-section";
import {
  TrendingUp,
  Mic,
  Target,
  Award,
  Activity,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  ArrowUpRight,
  PlayCircle,
  Flame,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Simplified stats - only the most important
const stats = [
  {
    title: "Overall Score",
    value: "87%",
    change: "+12%",
    trend: "up",
    icon: TrendingUp,
    color: "bg-emerald-500",
  },
  {
    title: "Sessions",
    value: "142",
    change: "+8 this week",
    trend: "up",
    icon: Mic,
    color: "bg-blue-500",
  },
  {
    title: "Streak",
    value: "24 days",
    change: "Keep it up!",
    trend: "up",
    icon: Flame,
    color: "bg-orange-500",
  },
];

// Simplified phoneme performance - show top and bottom performers
const topPhonemes = [
  { phoneme: "θ", score: 92, label: "think", status: "excellent" },
  { phoneme: "s", score: 91, label: "sun", status: "excellent" },
  { phoneme: "ð", score: 88, label: "the", status: "good" },
];

const needsWorkPhonemes = [
  { phoneme: "r", score: 78, label: "red", status: "needs-work", pattern: "r→w" },
  { phoneme: "ʃ", score: 79, label: "she", status: "needs-work", pattern: "s substitution" },
];

// Recent sessions - simplified
const recentSessions = [
  {
    id: 1,
    date: "Today",
    time: "2:30 PM",
    sentence: "Think about the weather thoroughly",
    score: 89,
  },
  {
    id: 2,
    date: "Today",
    time: "11:15 AM",
    sentence: "The three brothers thought",
    score: 85,
  },
  {
    id: 3,
    date: "Yesterday",
    time: "4:45 PM",
    sentence: "She sells sea shells",
    score: 92,
  },
];

// Weekly progress
const weeklyProgress = [
  { day: "Mon", score: 82 },
  { day: "Tue", score: 85 },
  { day: "Wed", score: 88 },
  { day: "Thu", score: 87 },
  { day: "Fri", score: 89 },
  { day: "Sat", score: 91 },
  { day: "Sun", score: 87 },
];

// Achievements - simplified
const achievements = [
  { title: "Week Warrior", icon: Flame, unlocked: true },
  { title: "Phoneme Master", icon: Sparkles, unlocked: true },
  { title: "The Champion", icon: Award, unlocked: true },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#C6E7FF] via-[#FBFBFB] to-[#D4F6FF]">
      <NavBar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header - Minimalist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-1">
              Dashboard
            </h1>
            <p className="text-black/70">
              Your speech training progress at a glance
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Key Stats - Simplified */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-all hover:bg-white/50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "p-2 rounded-lg",
                        stat.color
                      )}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    </div>
                    <h3 className="text-sm text-black/70 mb-1">
                      {stat.title}
                    </h3>
                    <p className="text-3xl font-bold text-black mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-green-600 font-medium">{stat.change}</p>
                  </motion.div>
                ))}
              </div>

              {/* Weekly Progress - Simplified */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/60 shadow-lg"
              >
                <h2 className="text-lg font-semibold text-black mb-6">
                  Weekly Progress
                </h2>
                <div className="flex items-end justify-between h-48 gap-3">
                  {weeklyProgress.map((day, index) => {
                    const maxScore = Math.max(...weeklyProgress.map((d) => d.score));
                    const heightPercent = (day.score / maxScore) * 100;
                    return (
                      <div
                        key={day.day}
                        className="flex-1 flex flex-col items-center gap-2 group h-full max-w-[60px]"
                      >
                        <div className="relative w-full h-full flex items-end px-1">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(heightPercent, 5)}%` }}
                            transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: "easeOut" }}
                            className="w-full bg-blue-500 rounded-t-md group-hover:bg-blue-600 transition-colors shadow-sm min-h-[4px]"
                          />
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded shadow whitespace-nowrap z-10">
                            {day.score}%
                          </div>
                        </div>
                        <span className="text-xs font-medium text-black/70">
                          {day.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Phoneme Performance - Simplified */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Performers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/60 shadow-lg"
                >
                  <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Mastering
                  </h2>
                  <div className="space-y-3">
                    {topPhonemes.map((item, index) => (
                      <div key={item.phoneme} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-lg font-bold text-black">
                              {item.phoneme}
                            </span>
                            <span className="text-sm text-black/70">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-xl font-bold text-black">
                            {item.score}%
                          </span>
                        </div>
                        <div className="relative h-2 bg-white/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(item.score, 1)}%` }}
                            transition={{ duration: 1, delay: 0.6 + index * 0.1, ease: "easeOut" }}
                            className="h-full rounded-full bg-green-500 min-w-[2px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Needs Work */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/60 shadow-lg"
                >
                  <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Focus Areas
                  </h2>
                  <div className="space-y-3">
                    {needsWorkPhonemes.map((item, index) => (
                      <div key={item.phoneme} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-lg font-bold text-black">
                              {item.phoneme}
                            </span>
                            <span className="text-sm text-black/70">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-xl font-bold text-black">
                            {item.score}%
                          </span>
                        </div>
                        <div className="relative h-2 bg-white/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(item.score, 1)}%` }}
                            transition={{ duration: 1, delay: 0.7 + index * 0.1, ease: "easeOut" }}
                            className="h-full rounded-full bg-orange-500 min-w-[2px]"
                          />
                        </div>
                        {item.pattern && (
                          <p className="text-xs text-black/60">
                            {item.pattern}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Recent Sessions - Simplified */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/60 shadow-lg"
              >
                <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Recent Sessions
                </h2>
                <div className="space-y-3">
                  {recentSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-white/50 hover:bg-white/30 transition-colors backdrop-blur-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-black truncate mb-1">
                          {session.sentence}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-black/60">
                          <span>{session.date}</span>
                          <span>•</span>
                          <span>{session.time}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <span className="text-2xl font-bold text-black">
                          {session.score}
                        </span>
                        <span className="text-sm text-black/70">%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Floating Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:w-80 space-y-6"
            >
              {/* Quick Stats Card */}
              <div className="bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/60 shadow-lg sticky top-24">
                <h3 className="text-sm font-semibold text-black/70 uppercase tracking-wide mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/70">Phonemes Mastered</span>
                    <span className="text-lg font-bold text-black">12/15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/70">Avg. Score</span>
                    <span className="text-lg font-bold text-black">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/70">Total Practice</span>
                    <span className="text-lg font-bold text-black">142</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/50">
                  <h3 className="text-sm font-semibold text-black/70 uppercase tracking-wide mb-4">
                    Achievements
                  </h3>
                  <div className="space-y-2">
                    {achievements.map((achievement, index) => (
                      <div
                        key={achievement.title}
                        className="flex items-center gap-3 p-2 rounded-lg bg-white/40 backdrop-blur-sm border border-white/50"
                      >
                        <achievement.icon className="w-5 h-5 text-black" />
                        <span className="text-sm font-medium text-black">
                          {achievement.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Action */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Practice
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}