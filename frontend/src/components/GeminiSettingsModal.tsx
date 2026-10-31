import React, { useState } from 'react';
import { X, Sparkles, Key, Check, Cpu } from 'lucide-react';

interface GeminiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const GeminiSettingsModal: React.FC<GeminiSettingsModalProps> = ({
  isOpen,
  onClose,
  currentApiKey,
  onSaveApiKey
}) => {
  const [keyInput, setKeyInput] = useState(currentApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-tactical font-bold text-slate-100">
              AI COPILOT CONFIGURATION
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Google Gemini 1.5 / 2.0 & Local Neural Fallback
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
          <div className="space-y-2">
            <label className="text-slate-300 block font-semibold">
              GEMINI API KEY (OPTIONAL)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="AIzaSy..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
              If provided, CrimeVision AI will route queries directly to Google Gemini 1.5 Flash / Pro with the full multimodal case context. When omitted, the platform uses its high-performance built-in neural reasoning engine out-of-the-box.
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 space-y-1">
            <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>ACTIVE INFERENCE ENGINE:</span>
            </div>
            <div className="text-slate-300 font-semibold">
              {keyInput.trim() ? 'Google Gemini 1.5 Flash (Live Cloud Multimodal)' : 'CrimeVision Local Neural Reasoning Pipeline (Offline / Sovereign)'}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-500 hover:text-slate-300 text-xs underline"
            >
              Reset to Local Engine
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded font-semibold flex items-center space-x-1 transition"
              >
                {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : null}
                <span>{savedSuccess ? 'Configured' : 'Save Config'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

