"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Detector from "@/components/Detector";
import MetricsSection from "@/components/MetricsSection";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { fetchStatus } from "@/lib/api";
import type { SystemStatus } from "@/lib/types";

export default function Home() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [bestAccuracy, setBestAccuracy] = useState<number | null>(null);

  useEffect(() => {
    // Check backend status on mount
    fetchStatus()
      .then((data) => {
        setStatus(data);
      })
      .catch((err) => console.error("Status check failed", err));
  }, []);

  return (
    <div className="min-h-screen text-slate-900 bg-white transition-colors duration-300">
      <Header />
      <main>
        <Hero status={status} accuracy={bestAccuracy} />
        <Detector modelReady={status?.model_ready ?? false} />
        <MetricsSection />
        <About />
      </main>
      <Footer />
    </div>
  );
}
