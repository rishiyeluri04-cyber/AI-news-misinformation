"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { PredictionResult } from "@/lib/types";
import GeminiPanel from "./GeminiPanel";

interface ResultPanelProps {
  result: PredictionResult;
  onReset: () => void;
}

export default function ResultPanel({ result, onReset }: ResultPanelProps) {
  const isFake = result.is_fake;
  const [confWidth, setConfWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setConfWidth(result.confidence), 200);
    return () => clearTimeout(t);
  }, [result.confidence]);

  const copyResult = () => {
    const text = `TruthLens Analysis\nVerdict: ${result.label}\nConfidence: ${result.confidence.toFixed(1)}%\nModel: ${result.model_name}`;
    navigator.clipboard.writeText(text).catch(() => { });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] shadow-xl dark:shadow-2xl overflow-hidden"
      role="region"
      aria-label="Analysis Results"
    >
      {/* Verdict header */}
      <div className={`p-6 border-b border-slate-100 dark:border-white/[0.06] ${isFake ? "bg-red-50 dark:bg-red-500/[0.05]" : "bg-emerald-50 dark:bg-emerald-500/[0.05]"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Badge */}
          <div
            className={`flex items-center gap-4 px-6 py-4 rounded-xl border flex-shrink-0 ${isFake
              ? "bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 shadow-lg dark:shadow-red-500/20"
              : "bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-lg dark:shadow-emerald-500/20"
              }`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl font-black ${isFake ? "bg-red-200 dark:bg-red-500/15" : "bg-emerald-200 dark:bg-emerald-500/15"
                }`}
            >
              <span aria-hidden="true">{isFake ? "✗" : "✓"}</span>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold tracking-wide"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {result.label}
              </p>
              <p className={`text-sm ${isFake ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300"}`}>
                {isFake ? "Likely Fake News" : "Likely Real News"}
              </p>
            </div>
          </div>

          {/* Confidence */}
          <div className="flex-1">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Confidence</span>
              <span
                className={`text-3xl font-bold ${isFake ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {result.confidence.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-slate-200 dark:bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full confidence-bar ${isFake
                  ? "bg-gradient-to-r from-red-500 to-rose-400"
                  : "bg-gradient-to-r from-emerald-500 to-teal-400"
                  }`}
                style={{ width: `${confWidth}%` }}
                role="progressbar"
                aria-valuenow={result.confidence}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Confidence Score"
              />
            </div>
            <p className="text-slate-500 dark:text-slate-600 text-xs mt-1.5">
              {result.confidence >= 90
                ? "Very high confidence — strong signal detected"
                : result.confidence >= 75
                  ? "High confidence — clear patterns found"
                  : "Moderate confidence — borderline result"}
            </p>
          </div>
        </div>
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100 dark:divide-white/[0.05] border-b border-slate-100 dark:border-white/[0.06]">
        {[
          { label: "Model Used", value: result.model_name },
          { label: "Accuracy", value: result.model_accuracy ? `${(result.model_accuracy * 100).toFixed(1)}%` : "—" },
          { label: "Total Time", value: result.response_time_ms ? `${result.response_time_ms}ms` : "—" },
          { label: "Gemini Time", value: result.gemini_time_ms ? `${result.gemini_time_ms}ms` : "—" },
        ].map((item, i) => (
          <div key={i} className="p-4">
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-600 uppercase tracking-wider mb-1">{item.label}</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-300 truncate">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="p-6 space-y-6">
        {/* Keywords */}
        {result.top_keywords && result.top_keywords.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Top Keywords</h3>
            <p className="text-xs text-slate-500 dark:text-slate-600 mb-3">Words that most influenced the classification decision</p>
            <div className="flex flex-wrap gap-2">
              {result.top_keywords.map((kw, i) => {
                const tier = i < 3 ? "high" : i < 6 ? "mid" : "low";
                const classes = {
                  high: "bg-indigo-50 dark:bg-indigo-500/[0.12] border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300",
                  mid: "bg-violet-50 dark:bg-violet-500/[0.08] border-violet-200 dark:border-violet-500/25 text-violet-700 dark:text-violet-300",
                  low: "bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/[0.07] text-slate-600 dark:text-slate-500",
                }[tier];
                return (
                  <div
                    key={kw.word}
                    className={`chip-animate flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${classes}`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span>{kw.word}</span>
                    <span className="opacity-50">{kw.score.toFixed(3)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI explanation */}
        <div className="flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
          <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{isFake ? "⚠️" : "✅"}</span>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isFake ? (
              <>
                <strong className="text-slate-900 dark:text-slate-200">Why FAKE?</strong> The AI detected linguistic patterns
                commonly associated with misinformation: sensationalist language, emotional manipulation,
                unverified claims, or conspiracy-style rhetoric. Always cross-reference with trusted sources.
              </>
            ) : (
              <>
                <strong className="text-slate-900 dark:text-slate-200">Why REAL?</strong> The AI detected language patterns
                typical of credible reporting: measured tone, attributable claims, factual style, and
                absence of manipulative rhetoric. Still recommend verifying through multiple sources.
              </>
            )}
          </p>
        </div>

        {/* Gemini panel */}
        {result.gemini && <GeminiPanel gemini={result.gemini} />}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={copyResult}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-indigo-50 dark:bg-indigo-500/[0.1] border border-indigo-200 dark:border-indigo-500/25 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/[0.18] transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Result
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            ↺ Analyze Another
          </button>
        </div>
      </div>
    </motion.div>
  );
}
