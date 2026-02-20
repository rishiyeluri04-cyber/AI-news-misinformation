"use client";
import React from "react";
import { motion } from "framer-motion";

const FEATURES = [
  { icon: "⚡", title: "Wait-Free Analysis", desc: "Optimized inference pipeline delivers results in under 3 seconds." },
  { icon: "🤖", title: "Dual Intelligence", desc: "Combines 4 traditional ML models with Google's Gemini LLM." },
  { icon: "🔍", title: "Full Transparency", desc: "See exactly why an article was flagged with keyword highlighting." },
  { icon: "📊", title: "Dataset-Backed", desc: "Trained on 20,000+ verified articles from trusted global sources." },
  { icon: "🌐", title: "Open API", desc: "Developers can hook into our detection engine via standard REST API." },
  { icon: "✨", title: "Smart Context", desc: "Gemini 1.5 checks facts against its massive knowledge base." },
];

const TECH_DETAILS = [
  {
    name: "Python 3.10",
    color: "#3776AB",
    bg: "rgba(55,118,171,0.1)",
    border: "rgba(55,118,171,0.2)",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.25.3c-.9.01-1.79.11-2.61.29-1.39.31-2.42 1.15-2.87 2.37L8.68 4h3.58c.28 0 .5.22.5.5v1.25h-5.5c-1.38 0-2.5 1.12-2.5 2.5v3.25l-.01 1c.01 1.12.87 2.05 1.95 2.21l1.41.21-.01-1c.01-1.38 1.12-2.5 2.5-2.5h3.58v-4c0-1.38-1.12-2.5-2.5-2.5H8.11L9.12 2.3c.27-.72.84-1.22 1.63-1.4 1.1-.25 2.36-.26 3.51 0 .79.18 1.36.68 1.63 1.4L16.9 5.3h3.58c.28 0 .5.22.5.5v1.25H16.1c1.38 0 2.5 1.12 2.5 2.5v3.25l-.01.99c.01 1.12-.87 2.05-1.95 2.21l-1.41.21.01 1c-.01 1.38-1.12 2.5-2.5 2.5H9.16l1.01 1.99c.27.72.84 1.22 1.63 1.4 1.1.25 2.36.26 3.51 0 .79-.18 1.36-.68 1.63-1.4l1.01-2.99h-3.58c-.28 0-.5-.22-.5-.5v-1.25h5.5c1.38 0 2.5-1.12 2.5-2.5v-3.25l.01-1c-.01-1.12-.87-2.05-1.95-2.21l-1.41-.21.01-1c-.01-1.38-1.12-2.5-2.5-2.5H9.27c.28 0 .5.22.5.5v4h3.58c1.38 0 2.5 1.12 2.5 2.5v4H15.8c.28 0 .5-.22.5-.5V8.5h-5.5a.5.5 0 01-.5-.5V6.75h3.58c1.38 0 2.5-1.12 2.5-2.5V1.75l-.01-.99c-.01-1.12-.87-2.05-1.95-2.21L14.25.3z" />
      </svg>
    ),
  },
  {
    name: "Flask",
    color: "#000000",
    bg: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.1)",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.9 0L.9 14.1l2.4 1 1.7-2.2v10.1l.3.3.3-1v-8.8L18 24l.3-.3L7.7 10.6l2.1-.8L12 11l.3-.3L7.7 5.7l2.8-.7L11.9 0z" />
      </svg>
    ),
  },
  {
    name: "scikit-learn",
    color: "#F7931E",
    bg: "rgba(247,147,30,0.1)",
    border: "rgba(247,147,30,0.2)",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    name: "Next.js 16",
    color: "#000000",
    bg: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.1)",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.758 15.352l-9.016-11.53c.123-.016.248-.022.375-.022 1.353 0 2.449 1.096 2.449 2.449v1.942l6.192 7.161zm-10.358-10.3c0-.127.006-.252.022-.375l11.53 9.016c.016-.123.022-.248.022-.375 0-1.353-1.096-2.449-2.449-2.449h-1.942l-7.161-6.192z" />
      </svg>
    ),
  },
  {
    name: "React 19",
    color: "#61DAFB",
    bg: "rgba(97,218,251,0.1)",
    border: "rgba(97,218,251,0.2)",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="2.5" /><path d="M21.9 11.2c-.3-2-1.3-3.8-2.6-5.3-2.1-2.4-5.2-3.8-8.6-3.8-3.3 0-6.2 1.3-8.1 3.4-1.3 1.5-2.2 3.2-2.5 5.2-.2 1.5-.1 3 .4 4.4.7 1.9 2 3.6 3.7 4.8 2 1.4 4.4 2.1 6.8 2.1 3.2 0 6.1-1.2 8.3-3.4 1.4-1.5 2.3-3.3 2.6-5.4.2-1 .2-2 0-3zm-9.9 8.2c-2.2 0-4.3-.6-6-1.8-1.5-1-2.6-2.5-3.2-4.2-.4-1.2-.5-2.4-.2-3.6.3-1.6 1-3.1 2.1-4.3 1.6-1.8 4-2.8 6.6-2.8 2.6 0 5 1.1 6.7 2.9 1.1 1.2 1.9 2.7 2.2 4.3.3 1.2.2 2.4-.2 3.6-.6 1.7-1.7 3.2-3.2 4.2-1.7 1.2-3.8 1.8-6 1.8z" />
      </svg>
    ),
  },
  {
    name: "Tailwind 4",
    color: "#38B2AC",
    bg: "rgba(56,178,172,0.1)",
    border: "rgba(56,178,172,0.2)",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 6.00001C10.2 6.00001 9 6.60001 8.4 7.80001C7.8 9.00001 7.8 10.2 8.4 11.4C9 12.6 10.2 13.2 12 13.2C13.8 13.2 15 12.6 15.6 11.4C16.2 10.2 16.2 9.00001 15.6 7.80001C15 6.60001 13.8 6.00001 12 6.00001ZM6 12C4.2 12 3 12.6 2.4 13.8C1.8 15 1.8 16.2 2.4 17.4C3 18.6 4.2 19.2 6 19.2C7.8 19.2 9 18.6 9.6 17.4C10.2 16.2 10.2 15 9.6 13.8C9 12.6 7.8 12 6 12Z" />
      </svg>
    ),
  },
  {
    name: "Gemini AI",
    color: "#4285F4",
    bg: "rgba(66,133,244,0.1)",
    border: "rgba(66,133,244,0.2)",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
      </svg>
    ),
  },
  {
    name: "Pandas",
    color: "#150458",
    bg: "rgba(21,4,88,0.1)",
    border: "rgba(21,4,88,0.2)",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 17h-6v-1h6v1zm0-3h-6v-1h6v1zm0-3h-6v-1h6v1zm0-3h-6v-1h6v1z" />
      </svg>
    ),
  },
  {
    name: "NLTK",
    color: "#000000",
    bg: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.1)",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

const MARQUEE_ITEMS = [...TECH_DETAILS, ...TECH_DETAILS, ...TECH_DETAILS];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-300" aria-labelledby="about-heading">

      {/* Background blobs - faint (Dark/Light aware) */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-[120px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-4">
            About the Project
          </div>
          <h2 id="about-heading" className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Why Build TruthLens?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Misinformation spreads 6x faster than truth. We built TruthLens to give readers a
            fast, unbiased, and explainable tool to verify what they read online.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-2xl mb-5 group-hover:rotate-[360deg] group-hover:bg-indigo-100 dark:group-hover:bg-indigo-800 transition-all duration-700 ease-in-out">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Animated Tech Stack Section */}
        <div className="text-center">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8">Built With Modern Tech</h4>

          <div className="relative max-w-5xl mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
              {MARQUEE_ITEMS.map((tech, i) => (
                <div
                  key={`${tech.name}-${i}`}
                  className="px-5 py-2.5 rounded-full border shadow-sm flex items-center gap-3 whitespace-nowrap transition-all duration-300 cursor-default"
                  style={{
                    backgroundColor: tech.bg,
                    borderColor: tech.border,
                    color: tech.color
                  }}
                >
                  <span className="flex-shrink-0">{tech.icon}</span>
                  <span className="text-sm font-bold">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          <style jsx global>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-33.33%); }
              }
              .animate-marquee {
                animation: marquee 35s linear infinite;
              }
            `}</style>
        </div>
      </div>
    </section>
  );
}
