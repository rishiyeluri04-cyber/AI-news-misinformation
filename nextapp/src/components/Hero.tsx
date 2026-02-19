"use client";
import { motion } from "framer-motion";
import Detector from "./Detector";

import { PredictionResult } from "@/lib/types";

interface HeroProps {
  status: string;
  accuracy: string;
  onAnalyze: (data: PredictionResult | null) => void;
}

export default function Hero({ status, accuracy, onAnalyze }: HeroProps) {
  const modelReady = status.includes("ready") || status.includes("trained");

  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-24 overflow-hidden min-h-screen">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#135bec]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Text & Stats */}
          <div className="lg:col-span-5 flex flex-col gap-8 pt-4 lg:pt-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#135bec]/10 border border-[#135bec]/20 text-[#135bec] text-xs font-bold uppercase tracking-wider w-fit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Next-Gen Verification
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white tracking-tight"
            >
              Uncover the Truth with <span className="text-[#135bec]">AI-Driven</span> Analysis
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg text-slate-400 leading-relaxed"
            >
              Leverage advanced machine learning and real-time cross-referencing to verify headlines, articles, and large datasets in seconds. Designed for journalists, researchers, and you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-2 gap-4 mt-2"
            >
              <div className="p-5 rounded-xl border border-slate-800 bg-[#1e293b]/50 backdrop-blur-sm">
                <div className="text-[#135bec] mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{accuracy || "98.4%"}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Model Accuracy</div>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-[#1e293b]/50 backdrop-blur-sm">
                <div className="text-[#135bec] mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="text-2xl font-bold text-white mb-1">1M+</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Verified Articles</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Detector Interface */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Detector modelReady={modelReady} onAnalyze={onAnalyze} />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
