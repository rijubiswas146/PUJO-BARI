import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, MessageCircle, ExternalLink } from 'lucide-react';

interface AdPopupProps {
  onClose: () => void;
}

export const AdPopup: React.FC<AdPopupProps> = ({ onClose }) => {
  const [countdown, setCountdown] = useState<number>(7);
  const [canSkip, setCanSkip] = useState<boolean>(false);

  useEffect(() => {
    if (countdown <= 0) {
      setCanSkip(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleSkip = () => {
    if (canSkip) {
      onClose();
    }
  };

  const progressPercent = ((7 - countdown) / 7) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-amber-50">
        
        {/* Top Header Badge */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 px-5 py-3 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold tracking-widest uppercase border border-amber-500/30">
              ADVERTISEMENT
            </span>
            <span className="text-xs text-amber-200/70 font-mono">
              Sponsored
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Ad {countdown > 0 ? `(${countdown}s)` : 'Finished'}</span>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full h-1 bg-stone-800">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Ad Body Content */}
        <div className="p-5 sm:p-6 space-y-4 text-center">
          
          {/* Ad Visual Graphic */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-600 via-emerald-500 to-green-600 p-0.5 shadow-[0_0_30px_rgba(34,197,94,0.35)]">
            <div className="w-full h-full rounded-[14px] bg-stone-950 flex flex-col items-center justify-center p-2 text-emerald-400">
              <MessageCircle className="w-8 h-8 sm:w-9 sm:h-9 animate-pulse text-emerald-400 fill-emerald-400/20" />
            </div>
            
            {/* Countdown Badge overlay */}
            <div className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-400 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-lg border-2 border-stone-950 font-mono">
              {countdown}
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black font-brand tracking-wider text-amber-100 uppercase">
              Join WhatsApp Channel
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 leading-relaxed">
              Get official music updates, daily lo-fi vibes & new highway playlist releases directly on WhatsApp!
            </p>
          </div>

          {/* WhatsApp Channel Direct Link Button */}
          <a
            href="https://whatsapp.com/channel/0029VbD33rX7j6gBBvfXAF2o"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Join Official WhatsApp Channel</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>

          {/* Features bullet list */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-left text-xs text-amber-200/90 space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ad-free music once this 7s ad completes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Daily music drops & highway radio updates</span>
            </div>
          </div>

          {/* Skip / Continue Button */}
          <div className="pt-1">
            <button
              onClick={handleSkip}
              disabled={!canSkip}
              className={`w-full py-3 px-6 rounded-2xl font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                canSkip
                  ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer hover:scale-[1.02] active:scale-95'
                  : 'bg-stone-800 text-stone-400 border border-stone-700 cursor-not-allowed opacity-80'
              }`}
            >
              {canSkip ? (
                <>
                  <span>Skip Ad & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Skip in {countdown}s</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Footer Note */}
        <div className="px-5 py-2 bg-stone-950/80 text-[10px] text-amber-200/40 text-center font-mono border-t border-amber-500/10">
          This 7-second ad will only show once per session.
        </div>

      </div>
    </div>
  );
};
