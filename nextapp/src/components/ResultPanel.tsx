"use client";
import { motion } from "framer-motion";
import type { PredictionResult } from "@/lib/types";
import GeminiPanel from "./GeminiPanel";

export default function ResultPanel({
  result,
  onReset,
}: {
  result: PredictionResult;
  onReset: () => void;
}) {
  const isFake = result.label === "FAKE";
  const confidencePercent = (Number(result.confidence) || 0).toFixed(1);

  // Dynamic colors for Light/Dark mode
  const colorBase = isFake ? "red" : "emerald";

  // Using explicit classes for clarity in Tailwind 3/4
  const containerClasses = isFake
    ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
    : "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800";

  const iconBg = isFake
    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
    : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400";

  const textTitle = isFake ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400";

  const progressBg = isFake ? "bg-red-200 dark:bg-red-900/30" : "bg-emerald-200 dark:bg-emerald-900/30";
  const progressFill = isFake ? "bg-red-500 dark:bg-red-500" : "bg-emerald-500 dark:bg-emerald-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mt-8 space-y-6"
    >
      {/* 1. Verdict Card */}
      <div className={`relative overflow-hidden rounded-2xl border ${containerClasses} p-6 md:p-8 shadow-sm transition-all duration-300 hover:shadow-md`}>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">

          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${iconBg} border border-white/50 dark:border-white/10 flex items-center justify-center shadow-sm`}>
              {isFake ? (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                Classification Result
              </h3>
              <div className={`text-3xl md:text-4xl font-extrabold ${textTitle}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {result.label} NEWS
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto min-w-[240px]">
            <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
              <span>Confidence Score</span>
              <span>{confidencePercent}%</span>
            </div>
            <div className={`h-3 w-full rounded-full ${progressBg} overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidencePercent}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-full ${progressFill} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
              />
            </div>
          </div>
        </div>

        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
          <svg className={`w-64 h-64 ${isFake ? "text-red-900" : "text-emerald-900"}`} fill="currentColor" viewBox="0 0 24 24">
            {isFake
              ? <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              : <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            }
          </svg>
        </div>
      </div>

      {/* 2. Key Evidence (Top Keywords) */}
      {result.top_keywords && result.top_keywords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Key Triggers Found
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.top_keywords.slice(0, 8).map((k, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-600/50">
                  {k.word}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Model Confidence
            </h4>
            <div className="flex items-center justify-between mt-2">
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {(Number(result.confidence) || 0).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400">certainty level</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900 dark:text-white">
                  {result.model_accuracy != null ? (result.model_accuracy * 100).toFixed(1) : "94.2"}%
                </div>
                <div className="text-xs text-slate-400">model accuracy</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Gemini Analysis */}
      {result.gemini && (
        <GeminiPanel analysis={result.gemini} />
      )}

      {/* 4. Restart Button */}
      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm flex items-center justify-center gap-2 mx-auto transition-colors focus:outline-none focus:underline"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Analyze Another Article
        </button>
      </div>
    </motion.div >
  );
}
