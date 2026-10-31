import React from 'react';
import { 
  ShieldAlert, 
  Video, 
  Mic2, 
  Camera, 
  GitCommit, 
  MapPin, 
  Bot, 
  FileCheck2, 
  Flame, 
  Crosshair, 
  Activity, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { ForensicCase } from '../types';

interface OperationsHubProps {
  currentCase: ForensicCase;
  onNavigateTab: (tabId: string) => void;
  onOpenUpload: () => void;
  onOpenCustody: () => void;
}

export const OperationsHub: React.FC<OperationsHubProps> = ({
  currentCase,
  onNavigateTab,
  onOpenUpload,
  onOpenCustody
}) => {
  const weaponsCount = currentCase.detected_entities.filter(e => e.category === 'WEAPON').length;
  const personsCount = currentCase.detected_entities.filter(e => e.category === 'PERSON_OF_INTEREST').length;
  const acousticCount = currentCase.acoustic_events.length;
  const videoEvidence = currentCase.evidence_items.filter(e => e.type.includes('VIDEO'));
  const audioEvidence = currentCase.evidence_items.filter(e => e.type.includes('AUDIO'));
  const imageEvidence = currentCase.evidence_items.filter(e => e.type.includes('IMAGE'));

  const threatColor = 
    currentCase.threat_level === 'CRITICAL' ? 'text-red-400 bg-red-950/40 border-red-800' :
    currentCase.threat_level === 'HIGH' ? 'text-amber-400 bg-amber-950/40 border-amber-800' :
    'text-cyan-400 bg-cyan-950/40 border-cyan-800';

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Case Header Hero Banner */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {currentCase.id}
              </span>
              <span className={`font-mono text-xs px-2.5 py-1 rounded border font-bold uppercase flex items-center space-x-1 ${threatColor}`}>
                <Flame className="w-3.5 h-3.5" />
                <span>THREAT LEVEL: {currentCase.threat_level}</span>
              </span>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5" />
                <span>EVIDENCE INTEGRITY SIGNED</span>
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-tactical font-bold text-white tracking-wide">
              {currentCase.title}
            </h1>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {currentCase.synopsis}
            </p>

            {/* Case Metadata Pills */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
              <div>
                <span className="text-slate-500">INCIDENT TIME: </span>
                <span className="text-slate-200">{currentCase.incident_date}</span>
              </div>
              <div>
                <span className="text-slate-500">LEAD DETECTIVE: </span>
                <span className="text-cyan-300">{currentCase.lead_investigator}</span>
              </div>
              <div>
                <span className="text-slate-500">LOCATION: </span>
                <span className="text-slate-200">{currentCase.location.name}</span>
              </div>
              <div>
                <span className="text-slate-500">MASTER HASH: </span>
                <span className="text-slate-300 font-mono underline cursor-pointer" onClick={onOpenCustody}>
                  {currentCase.master_hash.slice(0, 16)}...
                </span>
              </div>
            </div>
          </div>

          {/* Corroboration Gauge Card */}
          <div className="bg-slate-950/80 border border-cyan-900/40 rounded-xl p-5 flex flex-col items-center justify-center min-w-[220px] shadow-lg">
            <span className="text-[11px] font-mono text-cyan-400 tracking-wider">MULTIMODAL CORROBORATION</span>
            <div className="text-4xl font-tactical font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 my-1">
              {currentCase.corroboration_index}
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-1000" 
                style={{ width: currentCase.corroboration_index }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-2 text-center">
              Acoustic, Optical & Verbal Cross-Validated
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>EVIDENCE STREAMS</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-tactical">{currentCase.evidence_items.length} Files</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {videoEvidence.length} Video · {audioEvidence.length} Audio · {imageEvidence.length} Image
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>WEAPONS IDENTIFIED</span>
            <Crosshair className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 font-tactical">{weaponsCount} Detected</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Glock-19 & Edged Weapons
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>ACOUSTIC IMPULSES</span>
            <Mic2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-tactical">{acousticCount} Ballistic Spikes</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Gunshot shockwaves & transients
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>SUSPECTS PROFILED</span>
            <ShieldAlert className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 font-tactical">{personsCount} Entities</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Attire, Stance & Trajectory tracked
          </div>
        </div>
      </div>

      {/* Forensic Workstations Launch Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-tactical font-semibold text-slate-200 tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>FORENSIC ANALYSIS WORKSTATIONS</span>
          </h2>
          <span className="text-xs font-mono text-slate-500">SELECT STATION TO COMMENCE INTERROGATION</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Station 1: Surveillance Video */}
          <div 
            onClick={() => onNavigateTab('VIDEO_SURVEILLANCE')}
            className="group cursor-pointer bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-5 transition-all duration-200 shadow-md hover:shadow-cyan-500/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-900 group-hover:text-cyan-300">
                <Video className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-base font-tactical font-bold text-slate-100 group-hover:text-cyan-300">
              Surveillance Video Station
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Multi-angle CCTV playback with real-time YOLOv8 bounding boxes, motion tracking vectors, and suspect action classification.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400">
              <span>{videoEvidence.length} Feeds Synchronized</span>
              <span className="underline">Scrub Footage →</span>
            </div>
          </div>

          {/* Station 2: Acoustic Ballistics */}
          <div 
            onClick={() => onNavigateTab('AUDIO_BALLISTICS')}
            className="group cursor-pointer bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-xl p-5 transition-all duration-200 shadow-md hover:shadow-amber-500/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 group-hover:bg-amber-900 group-hover:text-amber-300">
                <Mic2 className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-base font-tactical font-bold text-slate-100 group-hover:text-amber-300">
              Acoustic Ballistics & 911 Lab
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Audio waveform visualizer, gunshot acoustic shockwave detection (-1.2 dB peak @ 8.4s), and speaker diarized transcripts.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-amber-400">
              <span>{currentCase.transcripts.length} Speech Records</span>
              <span className="underline">Inspect Waveforms →</span>
            </div>
          </div>

          {/* Station 3: Image Inspection */}
          <div 
            onClick={() => onNavigateTab('IMAGE_INSPECTION')}
            className="group cursor-pointer bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-xl p-5 transition-all duration-200 shadow-md hover:shadow-blue-500/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400 group-hover:bg-blue-900 group-hover:text-blue-300">
                <Camera className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-base font-tactical font-bold text-slate-100 group-hover:text-blue-300">
              Image & Weapon Inspection
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              High-resolution zoom/pan canvas, interactive weapon bounding boxes, magnifying loupe, and confidence threshold calibration.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-blue-400">
              <span>{imageEvidence.length} Scene Still Frames</span>
              <span className="underline">Zoom & Pan →</span>
            </div>
          </div>

          {/* Station 4: Multimodal Timeline */}
          <div 
            onClick={() => onNavigateTab('MULTIMODAL_TIMELINE')}
            className="group cursor-pointer bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-xl p-5 transition-all duration-200 shadow-md hover:shadow-purple-500/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 group-hover:bg-purple-900 group-hover:text-purple-300">
                <GitCommit className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-base font-tactical font-bold text-slate-100 group-hover:text-purple-300">
              Unified Chronological Timeline
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Synchronized forensic timeline merging visual, acoustic, and verbal witness statements with cross-corroboration ratings.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-purple-400">
              <span>{currentCase.timeline_events.length} Unified Events</span>
              <span className="underline">Reconstruct Sequence →</span>
            </div>
          </div>

          {/* Station 5: Tactical Scene 3D Map */}
          <div 
            onClick={() => onNavigateTab('SCENE_3D_MAPPING')}
            className="group cursor-pointer bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-5 transition-all duration-200 shadow-md hover:shadow-emerald-500/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-900 group-hover:text-emerald-300">
                <MapPin className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-base font-tactical font-bold text-slate-100 group-hover:text-emerald-300">
              Crime Scene Layout (2D/3D)
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Tactical floorplan with camera FOV coverage, physical ballistics markers (casing, ricochets), and suspect trajectory paths.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-emerald-400">
              <span>{currentCase.scene_layout_3d?.cameras.length || 2} Cameras Active</span>
              <span className="underline">View Spatial Grid →</span>
            </div>
          </div>

          {/* Station 6: AI Forensic Copilot */}
          <div 
            onClick={() => onNavigateTab('INVESTIGATOR_COPILOT')}
            className="group cursor-pointer bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-400 rounded-xl p-5 transition-all duration-200 shadow-md hover:shadow-cyan-400/20"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-900 to-blue-900 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-300 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-base font-tactical font-bold text-slate-100 group-hover:text-cyan-300">
              Forensic AI Copilot
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Persistent natural language investigator chat. Cross-examine evidence, verify alibis, and query weapons with exact citations.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-300">
              <span>Case Memory Active</span>
              <span className="underline">Ask Assistant →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evidentiary Locker Quick Stream */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <h3 className="font-tactical font-bold text-sm text-slate-200">INGESTED EVIDENCE LOCKER</h3>
            <span className="text-xs font-mono text-slate-500">({currentCase.evidence_items.length} items verified)</span>
          </div>
          <button 
            onClick={onOpenUpload}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
          >
            + Upload New Media
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentCase.evidence_items.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono space-y-1.5 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-semibold">{item.id}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">{item.type}</span>
              </div>
              <div className="font-sans font-medium text-slate-200 truncate" title={item.title}>
                {item.title}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Source: {item.source}
              </div>
              <div className="text-[9px] text-emerald-400 font-mono truncate" title={item.sha256}>
                SHA: {item.sha256.slice(0, 16)}...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

