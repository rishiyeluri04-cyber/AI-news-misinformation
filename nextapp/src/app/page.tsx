"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ResultPanel from "@/components/ResultPanel";
import MetricsSection from "@/components/MetricsSection";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { fetchStatus, fetchMetrics } from "@/lib/api";
import type { SystemStatus, MetricsData, PredictionResult } from "@/lib/types";

export default function Home() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [metricsLoading, setML] = useState(true);
  const [bestAccuracy, setBestAcc] = useState<string>("98.4%");
  const [analysisResult, setAnalysisResult] = useState<PredictionResult | null>(null);

  useEffect(() => {
    fetchStatus()
      .then(setStatus)
      .catch(() => setStatus({ status: "Offline", model_ready: false, gemini_available: false, version: "0.0.0" }));

    fetchMetrics()
      .then((m) => {
        setMetrics(m);
        // Find best model accuracy
        const bestModelName = m.best_model;
        const bestModel = m.models[bestModelName];
        if (bestModel?.accuracy) {
          setBestAcc(Math.round(bestModel.accuracy * 100) + "%");
        }
      })
      .catch(() => { })
      .finally(() => setML(false));
  }, []);

  const handleAnalysisComplete = (result: PredictionResult | null) => {
    setAnalysisResult(result);
    if (result) {
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-200 bg-[#f6f6f8] dark:bg-[#101622] font-sans selection:bg-[#135bec] selection:text-white">
      <Header />
      <main>
        <Hero
          status={status?.status || "Loading..."}
          accuracy={bestAccuracy}
          onAnalyze={handleAnalysisComplete}
        />

        {analysisResult && (
          <section id="results-section" className="py-12 md:py-20 bg-white dark:bg-[#0d0d1a] border-y border-slate-200 dark:border-slate-800 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ResultPanel
                result={analysisResult}
                onReset={() => { setAnalysisResult(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              />
            </div>
          </section>
        )}

        <MetricsSection metrics={metrics} loading={metricsLoading} />
        <About />
      </main>
      <Footer />
    </div>
  );
}
