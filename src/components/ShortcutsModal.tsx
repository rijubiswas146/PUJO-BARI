import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause music' },
    { key: 'N', desc: 'Next song' },
    { key: 'P', desc: 'Previous song' },
    { key: 'M', desc: 'Mute / Unmute audio' },
    { key: '←', desc: 'Seek backward 5 seconds' },
    { key: '→', desc: 'Seek forward 5 seconds' },
    { key: '↑', desc: 'Increase volume (+10%)' },
    { key: '↓', desc: 'Decrease volume (-10%)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-amber-500/30 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-brand text-amber-100">KEYBOARD SHORTCUTS</h3>
              <p className="text-xs text-amber-300/80">Quick Controls for Your Journey</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-amber-500/20 text-amber-200 hover:text-amber-50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/60 border border-amber-500/15">
              <span className="text-xs text-amber-200/90 font-medium">{sc.desc}</span>
              <kbd className="px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-mono font-bold shadow-inner">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center pt-2 border-t border-amber-500/15">
          <p className="text-[11px] text-amber-300/60 font-mono">
            Keyboard controls are disabled when typing in inputs.
          </p>
        </div>
      </div>
    </div>
  );
};
