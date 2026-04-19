import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PortAI – Institutional-Grade Financial Intelligence',
  description: 'AI-powered financial intelligence platform for Indian retail investors. Hedge-fund quality analysis for everyone.',
}

import Header from '@/components/Header'
import { AuthProvider } from '@/context/AuthContext'
import AuthLanyardBadge from '@/components/AuthLanyardBadge'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
        {/* UnicornStudio Script */}
        <script src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js" async={true}></script>
        {/* Google Translate — hidden widget, driven by LanguageSwitcher */}
        <script dangerouslySetInnerHTML={{ __html: `
          function googleTranslateElementInit() {
            try {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,hi,bn,te,mr,ta,gu,kn,ml,pa,zh-CN,ja,ko,ar,es,fr,de,pt,ru',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'gt_root');
            } catch(e) { console.warn('GT init failed', e); }
          }
        `}} />
        <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
        {/* Suppress Google Translate's own UI — we use our custom switcher */}
        <style>{`
          #gt_root { position: absolute; overflow: hidden; height: 1px; width: 1px; top: -1px; left: -1px; }
          .goog-te-banner-frame { display: none !important; }
          .goog-te-balloon-frame { display: none !important; }
          body { top: 0px !important; }
        `}</style>
      </head>
      <body className="antialiased selection:bg-white/20 selection:text-white pb-20 bg-black">
        {/* Background Component - Optimized by removing expensive filters */}
        <div className="fixed top-0 w-full h-screen -z-10 pointer-events-none" 
             style={{ 
               maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', 
               WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
               opacity: 0.6
             }}>
          <div data-us-project="bmaMERjX2VZDtPrh4Zwx" className="absolute w-full h-full left-0 top-0 -z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none"></div>
        </div>

        {/* Google Translate mount point — kept in flow but visually invisible via CSS above */}
        <div id="gt_root" />

        <AuthProvider>
          <Header />
          {children}
          {/* Mini lanyard badge — only shown when user is logged in */}
          <AuthLanyardBadge />
          {/* Floating language switcher — bottom-right on mobile, visible everywhere */}
          <div className="fixed bottom-14 right-4 z-[70] lg:hidden">
            <LanguageSwitcher />
          </div>
        </AuthProvider>
        
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
