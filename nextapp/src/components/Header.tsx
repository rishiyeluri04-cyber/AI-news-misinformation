"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { href: "#", label: "Home" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#api", label: "API" },
  { href: "#about", label: "About" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 w-full border-b transition-all duration-300 ${scrolled
          ? "border-slate-800 bg-[#101622]/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="text-[#135bec]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center">
              VeriFact<span className="text-[#135bec] text-sm ml-1 font-medium">AI</span>
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`text-sm font-medium transition-colors ${l.label === "Home"
                    ? "text-[#135bec]"
                    : "text-slate-400 hover:text-[#135bec]"
                  }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:block px-4 py-2 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
              Login
            </button>
            <a href="#detector" className="px-4 py-2 text-sm font-bold bg-[#135bec] text-white rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-600 transition-all">
              Sign Up
            </a>

            {/* Mobile Hamburger */}
            <div className="md:hidden ml-2">
              <button
                className="p-2 text-slate-400 hover:text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-[#101622] border-b border-slate-800 px-4 pb-4 overflow-hidden"
        >
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-medium text-slate-400 hover:text-[#135bec]"
            >
              {l.label}
            </a>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
