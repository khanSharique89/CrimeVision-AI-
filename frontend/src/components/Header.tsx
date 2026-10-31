import React from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Activity, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Radio, 
  Sparkles, 
  Sliders,
  FolderOpen
} from 'lucide-react';
import { ForensicCase } from '../types';

interface HeaderProps {
  cases: ForensicCase[];
  currentCase: ForensicCase | null;
  onSelectCase: (caseId: string) => void;
  onOpenUpload: () => void;
  onOpenCustody: () => void;
  onOpenGeminiSettings: () => void;
  onGenerateReport: () => void;
  isGeneratingReport: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasCustomGeminiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cases,
  currentCase,
  onSelectCase,
  onOpenUpload,
  onOpenCustody,
  onOpenGeminiSettings,
  onGenerateReport,
  isGeneratingReport,
  activeTab,
  setActiveTab,
  hasCustomGeminiKey,
}) => {
  return (
    <header className="border-b border-cyan-900/40 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
      {/* Top Tactical Status Bar */}
      <div className="px-4 py-2 flex flex-wrap items-center justify-between border-b border-slate-900 text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-cyan-400 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-semibold tracking-wider">SYSTEM SECURE // LAW ENFORCEMENT LEVEL 4</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-3 text-slate-400 font-mono hidden md:flex">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>YOLOv8: <strong className="text-emerald-400">ONLINE</strong></span>
            </span>
            <span className="flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>SPECTRAL BALLISTICS: <strong className="text-emerald-400">ACTIVE</strong></span>
            </span>
            <span className="flex items-center space-x-1">
              <Radio className="w-3.5 h-3.5 text-blue-400" />
              <span>MULTIMODAL FUSION: <strong className="text-emerald-400">SYNCED</strong></span>
            </span>
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI COPILOT: <strong className={hasCustomGeminiKey ? "text-purple-400" : "text-cyan-400"}>
                {hasCustomGeminiKey ? 'GEMINI 1.5 PRO' : 'LOCAL NEURAL'}
              </strong></span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-slate-400 font-mono">
          <span className="hidden sm:inline">JURISDICTION:</span>
          <span className="text-cyan-300 font-semibold">{currentCase?.jurisdiction || 'METRO TASKFORCE'}</span>
        </div>
      </div>

      {/* Main App Navigation & Case Selector */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-tactical font-bold text-lg tracking-wider text-slate-100">CRIMEVISION AI</span>
              <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded font-mono uppercase">Forensic v2.4</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Multimodal Forensic Reconstruction & Intelligence Decision Platform</p>
          </div>
        </div>

        {/* Case Selector Dropdown */}
        <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-lg p-1">
          <FolderOpen className="w-4 h-4 text-cyan-400 ml-2" />
          <span className="text-xs text-slate-400 font-mono hidden md:inline">CASE FILE:</span>
          <select 
            value={currentCase?.id || ''}
            onChange={(e) => onSelectCase(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1.5 font-mono focus:outline-none focus:border-cyan-500"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenCustody}
            title="Inspect Cryptographic Chain of Custody & SHA-256 Hashes"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-md text-xs font-mono transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Chain of Custody</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 hover:text-cyan-100 border border-cyan-800 rounded-md text-xs font-mono transition shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ Ingest Evidence</span>
          </button>

          <button
            onClick={onGenerateReport}
            disabled={isGeneratingReport}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white rounded-md text-xs font-semibold font-mono transition shadow-md shadow-cyan-900/30 disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isGeneratingReport ? 'Compiling Dossier...' : 'Export PDF Dossier'}</span>
          </button>

          <button
            onClick={onOpenGeminiSettings}
            title="Configure Gemini API Key & Neural Settings"
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-purple-300 border border-slate-800 rounded-md transition"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Forensic Workstations Navigation Tabs */}
      <div className="px-4 flex items-center space-x-1 overflow-x-auto border-t border-slate-900 py-1 bg-slate-950/60 text-xs font-mono">
        {[
          { id: 'OPERATIONS_HUB', label: 'OPERATIONS HUB' },
          { id: 'VIDEO_SURVEILLANCE', label: 'SURVEILLANCE VIDEO (CCTV)' },
          { id: 'AUDIO_BALLISTICS', label: 'ACOUSTIC BALLISTICS & 911' },
          { id: 'IMAGE_INSPECTION', label: 'IMAGE & WEAPON INSPECT' },
          { id: 'MULTIMODAL_TIMELINE', label: 'UNIFIED TIMELINE' },
          { id: 'SCENE_3D_MAPPING', label: 'TACTICAL SCENE MAP (2D/3D)' },
          { id: 'INVESTIGATOR_COPILOT', label: 'FORENSIC AI COPILOT' },
          { id: 'REPORT_CENTER', label: 'REPORT DOSSIER STUDIO' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              {tab.id === 'MULTIMODAL_TIMELINE' && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};

