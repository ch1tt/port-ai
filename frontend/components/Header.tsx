'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center py-6 px-4 ${scrolled ? 'pt-3' : 'pt-6'}`}>
      <div className={`transition-all duration-500 ease-out flex items-center justify-between px-8 relative overflow-hidden ${
        scrolled 
          ? 'w-[85%] max-w-5xl h-14 rounded-2xl premium-glass shadow-2xl' 
          : 'w-full max-w-7xl h-16 rounded-3xl bg-white/[0.02] border border-white/5'
      }`}>
        {/* Subtle radial glow inside header when scrolled */}
        {scrolled && (
          <div className="absolute inset-0 bg-blue-500/[0.03] pointer-events-none"></div>
        )}

        {/* Logo Section */}
        <div className="flex items-center gap-4 relative z-10 group cursor-pointer">
          <div className="relative">
            <div className="flex text-black bg-white w-9 h-9 rounded-xl items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-500 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
               <iconify-icon icon="solar:shield-check-bold" width="22"></iconify-icon>
            </div>
            {/* Soft pulse glow behind logo */}
            <div className="absolute -inset-2 bg-blue-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
          <span className="text-lg font-bold tracking-tighter shimmer-text">PortAI</span>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10 relative z-10">
          {[
            { name: 'Markets', href: '/#markets' },
            { name: 'Portfolios', href: '/portfolios' },
            { name: 'Intelligence', href: '/intelligence' },
            { name: 'Sectors', href: '/sectors' }
          ].map((item) => (
            <Link key={item.name} href={item.href} 
              className="text-[13px] font-medium text-white/50 hover:text-white transition-all duration-300 luxury-nav-link py-1">
              {item.name}
            </Link>
          ))}
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-6 relative z-10">
          <div className="hidden lg:flex items-center gap-2 text-[10px] uppercase tracking-widest bg-white/[0.03] px-4 py-2 rounded-full border border-white/10 group hover:border-emerald-500/30 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ticker-live shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
            <span className="text-emerald-400/80 font-semibold">AI LIVE ANALYSIS</span>
          </div>

          <Link href="/intelligence" 
            className="group relative px-6 py-2.5 rounded-xl bg-white text-black text-[13px] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden">
            {/* Shimmer effect inside button */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative z-10">Start Analysis</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
