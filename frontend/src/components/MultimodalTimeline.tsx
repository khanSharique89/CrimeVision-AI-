import React, { useState } from 'react';
import { 
  GitCommit, 
  Eye, 
  Mic2, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Filter, 
  RefreshCw,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { ForensicCase, TimelineEvent, ModalityType, ThreatLevel } from '../types';

interface MultimodalTimelineProps {
  currentCase: ForensicCase;
}

export const MultimodalTimeline: React.FC<MultimodalTimelineProps> = ({ currentCase }) => {
  const [selectedModality, setSelectedModality] = useState<string>('ALL');
  const [selectedThreat, setSelectedThreat] = useState<string>('ALL');
  const [isFusing, setIsFusing] = useState(false);

  const filteredEvents = currentCase.timeline_events.filter(event => {
    if (selectedModality !== 'ALL' && event.modality !== selectedModality) return false;
    if (selectedThreat !== 'ALL' && event.threat_level !== selectedThreat) return false;
    return true;
  });

  const handleReRunFusion = async () => {
    setIsFusing(true);
    try {
      await fetch(`/api/cases/${currentCase.id}/fuse`, {
        method: 'POST'
      });
      // In real app, callback to refresh case or window reload
      window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setIsFusing(false);
    }
  };

  const getModalityIcon = (modality: ModalityType) => {
    switch (modality) {
      case 'VISUAL':
        return <Eye className="w-4 h-4 text-cyan-400" />;
      case 'ACOUSTIC':
        return <Volume2 className="w-4 h-4 text-red-400" />;
      case 'AUDIO_TRANSCRIPT':
        return <Mic2 className="w-4 h-4 text-amber-400" />;
      default:
        return <GitCommit className="w-4 h-4 text-slate-400" />;
    }
  };

  const getCorroborationBadge = (event: TimelineEvent) => {
    if (event.corroboration === 'TRIPLE_VERIFIED') {
      return (
        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] font-mono font-bold flex items-center space-x-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>TRIPLE VERIFIED (OPTICAL+ACOUSTIC+SPOKEN)</span>
        </span>
      );
    }
    if (event.corroboration === 'DUAL_VERIFIED') {
      return (
        <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-700 text-blue-300 text-[10px] font-mono font-bold flex items-center space-x-1">
          <CheckCircle2 className="w-3 h-3 text-blue-400" />
          <span>DUAL VERIFIED</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
        SINGLE SENSOR
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Station Title & Re-Fusion Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-tactical font-bold text-slate-100 flex items-center space-x-2">
            <GitCommit className="w-5 h-5 text-cyan-400" />
            <span>UNIFIED CHRONOLOGICAL FORENSIC TIMELINE</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Multimodal Fusion: Optical Surveillance + Acoustic Ballistics + Witness Speech
          </p>
        </div>

        <button
          onClick={handleReRunFusion}
          disabled={isFusing}
          className="flex items-center space-x-2 px-3.5 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 rounded-md text-xs font-mono transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFusing ? 'animate-spin' : ''}`} />
          <span>{isFusing ? 'Synthesizing Fusion...' : 'Re-Run Fusion Engine'}</span>
        </button>
      </div>

      {/* Discrepancy / Contradiction Flag Alert Banner if any */}
      {currentCase.fusion_meta?.discrepancies && currentCase.fusion_meta.discrepancies.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-800/80 rounded-xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs font-mono">
            <h4 className="font-bold text-amber-300">
              CROSS-MODAL CONTRADICTION DETECTED BY FUSION ENGINE
            </h4>
            {currentCase.fusion_meta.discrepancies.map((disc, idx) => (
              <p key={idx} className="text-slate-300 font-sans">
                <strong>{disc.type}:</strong> Witness statement <em>"{disc.witness_statement}"</em> contradicts objective optical sensor finding: <em>{disc.objective_finding}</em>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Timeline Controls */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>MODALITY:</span>
          </div>
          {['ALL', 'VISUAL', 'ACOUSTIC', 'AUDIO_TRANSCRIPT'].map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModality(mod)}
              className={`px-2.5 py-1 rounded text-[11px] border transition ${
                selectedModality === mod
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-semibold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {mod.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-slate-400">SEVERITY:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((thr) => (
            <button
              key={thr}
              onClick={() => setSelectedThreat(thr)}
              className={`px-2.5 py-1 rounded text-[11px] border transition ${
                selectedThreat === thr
                  ? 'bg-slate-800 text-white border-slate-600 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {thr}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Vertical Sequence */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-cyan-900/40 space-y-6">
        {filteredEvents.map((event, index) => {
          const isCritical = event.threat_level === 'CRITICAL';
          const isHigh = event.threat_level === 'HIGH';

          const cardBorder = isCritical
            ? 'border-red-900/60 bg-red-950/20 shadow-red-950/20 shadow-lg'
            : isHigh
            ? 'border-amber-900/60 bg-amber-950/20'
            : 'border-slate-800 bg-slate-900/40';

          return (
            <div key={event.id} className="relative group">
              {/* Timeline Node Point */}
              <div 
                className={`absolute -left-[31px] sm:-left-[39px] top-3.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCritical
                    ? 'border-red-500 bg-red-950 animate-ping-slow'
                    : 'border-cyan-400 bg-slate-950'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-red-400' : 'bg-cyan-400'}`}></div>
              </div>

              {/* Event Card */}
              <div className={`rounded-xl border p-4.5 space-y-2.5 transition-all duration-200 hover:border-cyan-500/50 ${cardBorder}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-400 font-bold tracking-wide">
                      {event.wall_clock}
                    </span>
                    <span className="text-slate-600">|</span>
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      {getModalityIcon(event.modality)}
                      <span className="font-semibold">{event.source}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      isCritical ? 'bg-red-900/80 text-red-200' :
                      isHigh ? 'bg-amber-900/80 text-amber-200' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {event.threat_level}
                    </span>
                    {getCorroborationBadge(event)}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-tactical font-bold text-slate-100">
                    {event.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {event.corroboration_notes && (
                  <div className="text-xs font-mono text-cyan-300/80 bg-slate-950/60 p-2 rounded border border-slate-800 flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{event.corroboration_notes}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

