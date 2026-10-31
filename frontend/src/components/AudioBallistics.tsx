import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic2, 
  Play, 
  Pause, 
  Volume2, 
  Activity, 
  ShieldAlert, 
  Clock, 
  Search, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ForensicCase } from '../types';

interface AudioBallisticsProps {
  currentCase: ForensicCase;
}

export const AudioBallistics: React.FC<AudioBallisticsProps> = ({ currentCase }) => {
  const audioFiles = currentCase.evidence_items.filter(e => e.type.includes('AUDIO'));
  const [selectedAudio, setSelectedAudio] = useState(audioFiles[0] || null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(16.0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (audioFiles.length > 0 && (!selectedAudio || !audioFiles.find(a => a.id === selectedAudio.id))) {
      setSelectedAudio(audioFiles[0]);
    }
  }, [currentCase.id]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekToTime = (timeSec: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeSec;
      setCurrentTime(timeSec);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 16.0);
    }
  };

  // Render High-Tech Waveform on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Background tactical grid
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Center baseline
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.beginPath();
    ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

    // Simulated waveform envelope
    const totalBars = 160;
    const barWidth = w / totalBars;

    for (let i = 0; i < totalBars; i++) {
      const tNorm = i / totalBars;
      const tSec = tNorm * duration;

      // Calculate bar height based on speech and gunshot spike
      let amplitude = 0.08 + 0.04 * Math.sin(i * 0.4);

      // Speech envelope around 2s - 7s
      if (tSec >= 2.0 && tSec <= 7.0) {
        amplitude = 0.25 + 0.2 * Math.sin((tSec - 2.0) * 8);
      }

      // Ballistic Gunshot Shockwave peak at 8.4s
      if (Math.abs(tSec - 8.42) < 0.3) {
        amplitude = 0.95; // Extreme impulse spike
      } else if (tSec > 8.5 && tSec < 9.0) {
        amplitude = 0.45 * Math.exp(-(tSec - 8.5) * 5); // Reverb decay
      }

      // Scream envelope around 9.2s - 12s
      if (tSec >= 9.2 && tSec <= 12.0) {
        amplitude = 0.4 + 0.25 * Math.sin((tSec - 9.2) * 12);
      }

      amplitude = Math.min(1.0, Math.max(0.04, amplitude));

      const barHeight = amplitude * (h * 0.85);
      const x = i * barWidth;
      const y = (h - barHeight) / 2;

      // Color coding based on energy & playhead position
      const isPast = tSec <= currentTime;
      if (Math.abs(tSec - 8.42) < 0.3) {
        ctx.fillStyle = '#ef4444'; // Gunshot Red
      } else if (isPast) {
        ctx.fillStyle = '#06b6d4'; // Cyan active
      } else {
        ctx.fillStyle = '#334155'; // Muted
      }

      ctx.fillRect(x, y, barWidth - 1, barHeight);
    }

    // Playhead line
    const playheadX = (currentTime / duration) * w;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, h);
    ctx.stroke();

    // Playhead arrow marker
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(playheadX - 6, 0);
    ctx.lineTo(playheadX + 6, 0);
    ctx.lineTo(playheadX, 10);
    ctx.fill();

  }, [currentTime, duration]);

  const handleRunSpectralScan = async () => {
    setIsScanning(true);
    try {
      await fetch(`/api/cases/${currentCase.id}/analyze/audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_name: selectedAudio?.file_name })
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const filteredTranscripts = currentCase.transcripts.filter(t => 
    t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-tactical font-bold text-slate-100 flex items-center space-x-2">
            <Mic2 className="w-5 h-5 text-amber-400" />
            <span>ACOUSTIC BALLISTICS LAB & 911 DIARIZATION</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Spectrogram Shockwave Triangulation & Synchronized Witness Transcripts
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunSpectralScan}
            disabled={isScanning}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700 rounded-md text-xs font-mono transition"
          >
            <Activity className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: isScanning ? '1s' : '0s' }} />
            <span>{isScanning ? 'Computing FFT...' : 'Re-Run Spectral Scan'}</span>
          </button>
        </div>
      </div>

      {/* Main Waveform & Ballistics Workstation */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
        {/* Hidden HTML5 Audio Element */}
        {selectedAudio && (
          <audio
            ref={audioRef}
            src={selectedAudio.file_url}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />
        )}

        {/* Waveform Header Status */}
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-slate-300">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>TRACK: <strong className="text-white">{selectedAudio?.title || '911 Emergency Recording'}</strong></span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>SAMPLE RATE: 44.1 kHz</span>
            <span>FORMAT: PCM 16-BIT WAV</span>
            <span className="text-cyan-400 font-bold">{currentTime.toFixed(2)}s / {duration.toFixed(2)}s</span>
          </div>
        </div>

        {/* Waveform Canvas Viewport */}
        <div className="relative bg-slate-950 rounded-lg p-2 border border-slate-800 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={860}
            height={160}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = clickX / rect.width;
              seekToTime(ratio * duration);
            }}
            className="w-full h-40 cursor-crosshair"
          />

          {/* Gunshot Marker Overlay */}
          <div 
            onClick={() => seekToTime(8.42)}
            style={{ left: `${(8.42 / duration) * 100}%` }}
            className="absolute top-2 -translate-x-1/2 cursor-pointer bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] px-2 py-0.5 rounded shadow-lg flex items-center space-x-1"
          >
            <AlertTriangle className="w-3 h-3 animate-bounce" />
            <span>GUNSHOT IMPULSE (-1.2 dB)</span>
          </div>
        </div>

        {/* Audio Player Controls */}
        <div className="flex items-center justify-between text-xs font-mono pt-2">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold rounded-lg flex items-center space-x-2 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>{isPlaying ? 'PAUSE AUDIO' : 'PLAY AUDIO'}</span>
            </button>

            <button
              onClick={() => seekToTime(0)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
              title="Restart Audio"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Acoustic Event Badges */}
          <div className="flex items-center space-x-2">
            {currentCase.acoustic_events.map((ev, i) => (
              <button
                key={i}
                onClick={() => seekToTime(ev.timestamp_sec)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-200 flex items-center space-x-1.5 transition"
              >
                <span className={`w-2 h-2 rounded-full ${ev.threat_level === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-400'}`}></span>
                <span>+{ev.timestamp_sec}s: {ev.event_type.replace(/_/g, ' ')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Synchronized Diarized Transcript Interrogation Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-tactical font-semibold text-slate-200">
              SYNCHRONIZED SPEECH TRANSCRIPTS & DIARIZATION
            </h3>
            <span className="text-xs font-mono text-slate-500">({filteredTranscripts.length} dialogue events)</span>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter transcript keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredTranscripts.map((entry, index) => {
            const isNearCurrentTime = Math.abs(currentTime - entry.timestamp_sec) < 1.5;
            const isGunshot = entry.text.includes('ACOUSTIC DISCHARGE') || entry.threat_level === 'CRITICAL';

            return (
              <div
                key={index}
                onClick={() => seekToTime(entry.timestamp_sec)}
                className={`p-3.5 rounded-lg border text-xs font-mono transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-2 ${
                  isNearCurrentTime
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/50'
                    : isGunshot
                    ? 'bg-red-950/20 border-red-900/50 hover:bg-red-950/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px] font-bold">
                      +{entry.timestamp_sec.toFixed(2)}s
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-300">[{entry.speaker}]</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        entry.threat_level === 'CRITICAL' ? 'bg-red-900/60 text-red-200' :
                        entry.threat_level === 'HIGH' ? 'bg-amber-900/60 text-amber-200' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {entry.threat_level}
                      </span>
                    </div>
                    <p className="font-sans text-slate-200 text-sm mt-1">
                      {entry.text}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end md:self-center text-[11px] text-slate-400">
                  <span>Credibility: <strong className="text-emerald-400">{Math.round(entry.credibility_score * 100)}%</strong></span>
                  <button className="text-cyan-400 hover:text-cyan-300 underline">
                    Jump to Timestamp →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

