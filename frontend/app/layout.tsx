import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sentinel Finance AI – Institutional-Grade Financial Intelligence',
  description: 'AI-powered financial intelligence platform for Indian retail investors. Hedge-fund quality analysis for everyone.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
        {/* UnicornStudio Script */}
        <script src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js" async={true}></script>
      </head>
      <body className="antialiased selection:bg-white/20 selection:text-white pb-20 bg-black">
        {/* Background Component */}
        <div className="fixed top-0 w-full h-screen -z-10 hue-rotate-90 brightness-125 pointer-events-none" data-alpha-mask="80" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)' }}>
          <div data-us-project="bmaMERjX2VZDtPrh4Zwx" className="absolute w-full h-full left-0 top-0 -z-10 pointer-events-none"></div>
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex text-black bg-white w-8 h-8 rounded-full items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                <iconify-icon icon="solar:shield-check-bold" width="18"></iconify-icon>
              </div>
              <span className="text-sm font-semibold text-white tracking-tight">Sentinel Finance AI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/60">
              <Link href="/#markets" className="hover:text-white transition-colors">Markets</Link>
              <Link href="/portfolios" className="hover:text-white transition-colors">Portfolios</Link>
              <Link href="/intelligence" className="hover:text-white transition-colors">Intelligence</Link>
              <Link href="/sectors" className="hover:text-white transition-colors">Sectors</Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[11px] bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ticker-live shadow-sm shadow-emerald-400/50"></span>
                <span className="text-emerald-400/90 font-medium tracking-wide">AI LIVE</span>
              </div>
              <Link href="/intelligence" className="hidden sm:block text-xs font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 transition-colors">
                New Analysis
              </Link>
            </div>
          </div>
        </nav>
        {children}
        
        {/* Init UnicornStudio wrapper script */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('load', function() {
            if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
              window.UnicornStudio.init();
              window.UnicornStudio.isInitialized = true;
            }
          });
        `}} />
      </body>
    </html>
  )
}
