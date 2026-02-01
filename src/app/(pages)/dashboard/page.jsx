"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fadeUp, staggerContainer } from "../../utils/animations";
import { AnimatedWrapper } from "../../components/shared/AnimatedWrapper";
import { SectionTitle } from "../../components/shared/SectionTitle";

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState("7");
  const [data, setData] = useState(null);
  const [gaData, setGaData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await fetch(`/api/analytics/dashboard?timeframe=${timeframe}`);
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [timeframe]);

  const fetchGAData = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics/google");
      if (!res.ok) return;
      const json = await res.json();
      setGaData(json);
    } catch (err) {
      // Error fetching GA data
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchGAData();
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchGAData();
    }, 30000);
    return () => clearInterval(interval);
  }, [timeframe, fetchDashboardData, fetchGAData]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: "📘",
      twitter: "🐦",
      linkedin: "💼",
      pinterest: "📌",
      whatsapp: "💚",
      telegram: "✈️",
      reddit: "🤖",
      tiktok: "🎵",
      discord: "💬",
      threads: "🧵",
      x_share: "❌",
      ig_story: "📷",
    };
    return icons[platform?.toLowerCase()] || "🔗";
  };

  const getPlatformColor = (platform) => {
    const colors = {
      facebook: "bg-blue-500",
      twitter: "bg-sky-500",
      linkedin: "bg-blue-700",
      pinterest: "bg-red-600",
      whatsapp: "bg-green-500",
      telegram: "bg-blue-400",
      reddit: "bg-orange-500",
      tiktok: "bg-black",
      discord: "bg-indigo-500",
      threads: "bg-gray-800",
      x_share: "bg-black",
      ig_story: "bg-pink-500",
    };
    return colors[platform?.toLowerCase()] || "bg-gray-500";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="mb-8 h-8 w-1/4 rounded bg-white/10"></div>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-xl bg-white/10"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-red-500/20 border border-red-500 p-6">
            <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const maxDailyShares = Math.max(...data.dailyShares.map((d) => d.count), 1);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <AnimatedWrapper variant={fadeUp} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-primary font-subheading uppercase tracking-wider">
                📊 Analytics Dashboard
              </h1>
              <p className="text-white/50 font-body">Track your poll performance and social engagement</p>
            </div>
            <Link
              href="/public"
              className="border border-primary py-3 px-6 text-primary font-bold bg-transparent hover:bg-primary/10 transition-all uppercase rounded-sm"
            >
              ← Back Home
            </Link>
          </div>
        </AnimatedWrapper>

        {/* Timeframe Selector */}
        <AnimatedWrapper variant={fadeUp} className="mb-8">
          <div className="flex gap-2 flex-wrap">
            {["7", "14", "30", "90"].map((days) => (
              <motion.button
                key={days}
                onClick={() => setTimeframe(days)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-sm px-4 py-2 font-bold transition-all uppercase ${
                  timeframe === days
                    ? "bg-primary text-black border border-primary"
                    : "bg-transparent text-white/50 border border-white/10 hover:border-primary/50"
                }`}
              >
                Last {days} days
              </motion.button>
            ))}
          </div>
        </AnimatedWrapper>

        {/* Overview Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5"
        >
          <motion.div
            variants={fadeUp}
            className="rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 p-6 text-white shadow-lg backdrop-blur-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium text-blue-300 font-body">Total Polls</h3>
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-4xl font-bold text-primary font-subheading">{data.overview.totalPolls}</p>
            <p className="mt-2 text-sm text-blue-300 font-body">All time</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 p-6 text-white shadow-lg backdrop-blur-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium text-green-300 font-body">Total Votes</h3>
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-4xl font-bold text-primary font-subheading">{data.overview.totalVotes}</p>
            <p className="mt-2 text-sm text-green-300 font-body">All time</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 p-6 text-white shadow-lg backdrop-blur-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium text-purple-300 font-body">Total Shares</h3>
              <span className="text-3xl">🔗</span>
            </div>
            <p className="text-4xl font-bold text-primary font-subheading">{data.overview.totalShares}</p>
            <p className="mt-2 text-sm text-purple-300 font-body">All time</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 p-6 text-white shadow-lg backdrop-blur-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium text-orange-300 font-body">Recent Shares</h3>
              <span className="text-3xl">🚀</span>
            </div>
            <p className="text-4xl font-bold text-primary font-subheading">{data.overview.recentShares}</p>
            <p className="mt-2 text-sm text-orange-300 font-body">Last {timeframe} days</p>
          </motion.div>

          {/* Google Analytics Card */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl bg-gradient-to-br from-red-500/20 to-pink-600/20 border border-red-500/30 p-6 text-white shadow-lg backdrop-blur-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium text-red-300 font-body">Analytics</h3>
              <span className="text-3xl">📊</span>
            </div>
            {gaData?.configured ? (
              <>
                <p className="text-4xl font-bold text-primary font-subheading">{gaData.activeUsers || 0}</p>
                <p className="mt-2 text-sm text-red-300 font-body">Active users</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-primary font-subheading">Not Setup</p>
                <p className="mt-2 text-sm text-red-300 font-body">Configure GA4</p>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Google Analytics Status Banner */}
        {gaData?.configured && (
          <AnimatedWrapper variant={fadeUp} className="mb-8">
            <div className="rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-2xl">✓</div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-bold text-white font-subheading">Google Analytics Connected</h3>
                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                    <div>
                      <p className="text-white/50 font-body">Measurement ID</p>
                      <p className="font-mono font-bold text-primary">{gaData.measurementId}</p>
                    </div>
                    <div>
                      <p className="text-white/50 font-body">Active Users (Live)</p>
                      <p className="text-xl font-bold text-primary font-subheading">{gaData.activeUsers || 0}</p>
                    </div>
                    <div>
                      <p className="text-white/50 font-body">Status</p>
                      <p className="font-bold text-green-400 font-subheading">🟢 Tracking Active</p>
                    </div>
                  </div>
                  {gaData.note && (
                    <p className="mt-3 rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300 font-body">
                      ℹ️ {gaData.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AnimatedWrapper>
        )}

        {!gaData?.configured && (
          <AnimatedWrapper variant={fadeUp} className="mb-8">
            <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-2xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-bold text-white font-subheading">Google Analytics Not Configured</h3>
                  <p className="mb-3 text-white/70 font-body">
                    Add your Google Analytics Measurement ID to track active users, page views, and real-time data.
                  </p>
                  <div className="rounded-lg border border-amber-500/30 bg-black/50 p-4">
                    <p className="mb-2 font-mono text-sm text-primary">NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX</p>
                    <p className="text-xs text-white/50 font-body">
                      Add this to your .env.local file and restart the dev server
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedWrapper>
        )}

        {/* Charts Section */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Daily Shares Chart */}
          <AnimatedWrapper
            variant={fadeUp}
            className="rounded-xl bg-black/50 border border-white/10 p-6 shadow-lg backdrop-blur-sm"
          >
            <h2 className="mb-6 text-2xl font-bold text-primary font-subheading uppercase tracking-wider">
              📈 Daily Shares
            </h2>
            <div className="space-y-3">
              {data.dailyShares.map((day) => (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-white/50 font-body">{formatDate(day.date)}</span>
                  <div className="relative h-8 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-primary to-green-400 pr-3 transition-all duration-500"
                      style={{ width: `${(day.count / maxDailyShares) * 100}%` }}
                    >
                      {day.count > 0 && (
                        <span className="text-sm font-bold text-black font-subheading">{day.count}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedWrapper>

          {/* Platform Distribution */}
          <AnimatedWrapper
            variant={fadeUp}
            className="rounded-xl bg-black/50 border border-white/10 p-6 shadow-lg backdrop-blur-sm"
          >
            <h2 className="mb-6 text-2xl font-bold text-primary font-subheading uppercase tracking-wider">
              🌐 Platform Distribution
            </h2>
            <div className="space-y-4">
              {data.platformStats.length === 0 ? (
                <p className="py-8 text-center text-white/50 font-body">No shares yet</p>
              ) : (
                data.platformStats.map((platform) => {
                  const percentage =
                    data.overview.totalShares > 0 ? ((platform.count / data.overview.totalShares) * 100).toFixed(1) : 0;
                  return (
                    <div key={platform.platform}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getPlatformIcon(platform.platform)}</span>
                          <span className="font-medium text-white font-body capitalize">{platform.platform}</span>
                        </div>
                        <span className="font-bold text-primary font-subheading">
                          {platform.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`${getPlatformColor(platform.platform)} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </AnimatedWrapper>
        </div>

        {/* UTM Sources & Referrers Section */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* UTM Sources */}
          <AnimatedWrapper
            variant={fadeUp}
            className="rounded-xl bg-black/50 border border-white/10 p-6 shadow-lg backdrop-blur-sm"
          >
            <h2 className="mb-6 text-2xl font-bold text-primary font-subheading uppercase tracking-wider">
              🎯 Traffic Sources (UTM)
            </h2>
            <div className="space-y-4">
              {!data.utmSources || data.utmSources.length === 0 ? (
                <p className="py-8 text-center text-white/50 font-body">No UTM data yet</p>
              ) : (
                data.utmSources.map((utm) => {
                  const percentage =
                    data.overview.recentShares > 0 ? ((utm.clicks / data.overview.recentShares) * 100).toFixed(1) : 0;
                  return (
                    <div
                      key={utm.source}
                      className="rounded-lg border border-white/10 p-4 transition-colors hover:bg-white/5"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white font-subheading uppercase">{utm.source}</span>
                          <p className="text-sm text-white/50 font-body">{utm.campaigns} campaign(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary font-subheading">{utm.clicks}</p>
                          <p className="text-xs text-white/50 font-body">{percentage}%</p>
                        </div>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </AnimatedWrapper>

          {/* Top Referrers */}
          <AnimatedWrapper
            variant={fadeUp}
            className="rounded-xl bg-black/50 border border-white/10 p-6 shadow-lg backdrop-blur-sm"
          >
            <h2 className="mb-6 text-2xl font-bold text-primary font-subheading uppercase tracking-wider">
              🔗 Top Referrers
            </h2>
            <div className="space-y-3">
              {!data.referrers || data.referrers.length === 0 ? (
                <p className="py-8 text-center text-white/50 font-body">No referrer data yet</p>
              ) : (
                data.referrers.map((ref, index) => {
                  const percentage =
                    data.overview.recentShares > 0 ? ((ref.count / data.overview.recentShares) * 100).toFixed(1) : 0;
                  return (
                    <div
                      key={ref.referrer}
                      className="flex items-center justify-between rounded-lg border border-white/10 p-3 transition-colors hover:bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-green-400 text-sm font-bold text-black font-subheading">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-white font-body">{ref.referrer}</p>
                          <p className="text-xs text-white/50 font-body">{percentage}% of traffic</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-primary/20 border border-primary px-3 py-1 text-sm font-bold text-primary font-subheading">
                        {ref.count}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </AnimatedWrapper>
        </div>

        {/* Top Polls Table */}
        <AnimatedWrapper
          variant={fadeUp}
          className="rounded-xl bg-black/50 border border-white/10 p-6 shadow-lg backdrop-blur-sm"
        >
          <h2 className="mb-6 text-2xl font-bold text-primary font-subheading uppercase tracking-wider">
            🏆 Top Performing Polls
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-white/20">
                  <th className="px-4 py-3 text-left font-semibold text-white/70 font-body">Rank</th>
                  <th className="px-4 py-3 text-left font-semibold text-white/70 font-body">Question</th>
                  <th className="px-4 py-3 text-center font-semibold text-white/70 font-body">Votes</th>
                  <th className="px-4 py-3 text-left font-semibold text-white/70 font-body">Created</th>
                  <th className="px-4 py-3 text-center font-semibold text-white/70 font-body">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.topPolls.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-white/50 font-body">
                      No polls yet
                    </td>
                  </tr>
                ) : (
                  data.topPolls.map((poll, index) => (
                    <tr key={poll.id} className="border-b border-white/10 transition-colors hover:bg-white/5">
                      <td className="px-4 py-4">
                        <span className="text-2xl">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="line-clamp-2 font-medium text-white font-body">{poll.question}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-block rounded-full bg-primary/20 border border-primary px-3 py-1 font-bold text-primary font-subheading">
                          {poll.total_votes}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-white/50 font-body">
                        {new Date(poll.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Link
                          href={`/result?id=${poll.id}`}
                          className="inline-block rounded-sm bg-primary px-4 py-2 font-medium text-black transition-all hover:bg-primary/80 font-subheading uppercase"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AnimatedWrapper>

        {/* Footer Stats */}
        <AnimatedWrapper
          variant={fadeUp}
          className="mt-8 rounded-xl bg-gradient-to-r from-primary/20 to-green-400/20 border border-primary/30 p-6 shadow-lg backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
            <div>
              <p className="mb-1 text-sm text-white/70 font-body">Avg Votes per Poll</p>
              <p className="text-3xl font-bold text-primary font-subheading">
                {data.overview.totalPolls > 0 ? (data.overview.totalVotes / data.overview.totalPolls).toFixed(1) : "0"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-white/70 font-body">Avg Shares per Poll</p>
              <p className="text-3xl font-bold text-primary font-subheading">
                {data.overview.totalPolls > 0 ? (data.overview.totalShares / data.overview.totalPolls).toFixed(1) : "0"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-white/70 font-body">Engagement Rate</p>
              <p className="text-3xl font-bold text-primary font-subheading">
                {data.overview.totalPolls > 0
                  ? (((data.overview.totalVotes + data.overview.totalShares) / data.overview.totalPolls) * 100).toFixed(
                      0,
                    )
                  : "0"}
                %
              </p>
            </div>
          </div>
        </AnimatedWrapper>
      </div>
    </div>
  );
}
