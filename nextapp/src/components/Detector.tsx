"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { predictText, predictFile } from "@/lib/api";
import type { PredictionResult, TabType } from "@/lib/types";

export default function Detector({ modelReady, onAnalyze }: { modelReady: boolean; onAnalyze: (data: PredictionResult | null) => void }) {
  const [tab, setTab] = useState<TabType>("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deepScan, setDeepScan] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleAnalyze = useCallback(async () => {
    setError("");
    if (!text.trim()) { setError("Please enter a news article or headline."); return; }
    if (text.trim().length < 20) { setError("Input too short — please provide at least 20 characters."); return; }
    setLoading(true);

    try {
      const data = await predictText(text);
      onAnalyze(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [text, onAnalyze]);

  const handleFileAnalyze = useCallback(async () => {
    if (!file) { setError("Please select a file."); return; }
    setLoading(true); setError("");
    try {
      const data = await predictFile(file);
      onAnalyze(data);
      setTab("text");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "File processing failed.");
    } finally {
      setLoading(false);
    }
  }, [file, onAnalyze]);

  const TABS = [
    { id: "text", label: "Text Input", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> },
    { id: "file", label: "File Upload", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] shadow-2xl overflow-hidden" id="detector">
      {/* Tabs Styled from Stitch */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as TabType)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold border-b-2 transition-colors duration-200 ${tab === t.id
                ? "border-[#135bec] text-[#135bec] bg-[#135bec]/5"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Input Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {tab === "text" && (
            <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your article content or news headline here for instant verification..."
                  className="w-full min-h-[300px] p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all resize-none font-sans"
                />
                <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-900/50 px-2 rounded">
                  {wordCount} / 10,000 words
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm font-medium px-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={deepScan}
                    onChange={(e) => setDeepScan(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600 text-[#135bec] focus:ring-[#135bec] bg-transparent w-4 h-4"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    Deep scan sources
                  </span>
                </label>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => { setText(""); onAnalyze(null); setError(""); }}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !modelReady}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-[#135bec] text-white font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /></svg>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <span>Analyze News</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {tab === "file" && (
            <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center hover:border-[#135bec] hover:bg-[#135bec]/5 transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" accept=".txt,.csv" hidden onChange={(e) => { e.target.files?.[0] && setFile(e.target.files[0]); }} />
                <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-slate-400 text-sm">.txt or .csv files (max 2MB)</p>
                {file && <div className="mt-4 text-[#135bec] font-bold text-sm bg-[#135bec]/10 py-1 px-3 rounded-full inline-block">{file.name}</div>}
              </div>
              <button
                onClick={handleFileAnalyze}
                disabled={!file || loading}
                className="mt-6 w-full py-3 rounded-lg bg-[#135bec] text-white font-bold shadow-lg hover:bg-blue-600 disabled:opacity-50 transition-all"
              >
                {loading ? "Processing..." : "Analyze File"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Disclaimer */}
      <div className="px-6 py-3 bg-slate-50 dark:bg-[#101622]/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        Secured by Neural Network Verifier v4.2
      </div>
    </div>
  );
}
