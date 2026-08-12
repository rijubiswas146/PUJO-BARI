import React from 'react';
import { Play, Compass, Radio } from 'lucide-react';

interface AutoplayPromptProps {
  onTapToPlay: () => void;
  stationName?: string;
}

export const AutoplayPrompt: React.FC<AutoplayPromptProps> = ({ onTapToPlay, stationName }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div className="w-full max-w-sm glass-panel rounded-3xl p-6 sm:p-8 text-center border border-amber-500/40 shadow-2xl space-y-4">
        
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 mx-auto shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-bounce">
          <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-amber-400">
            <Radio className="w-8 h-8" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold font-brand text-amber-100 tracking-wider">
            TAP PLAY TO START PUJO BARI
          </h3>
          <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed font-body">
            Your roadtrip soundtrack is ready on {stationName || 'National Highway 44'}. Tap below to tune in.
          </p>
        </div>

        <button
          onClick={onTapToPlay}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-extrabold text-sm tracking-wider uppercase transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start Journey</span>
        </button>

        <p className="text-[10px] text-amber-300/50 font-mono">
          Required by browser audio autoplay guidelines.
        </p>

      </div>
    </div>
  );
};
