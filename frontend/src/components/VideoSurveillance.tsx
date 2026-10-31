import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Maximize2, 
  Eye, 
  Crosshair, 
  ShieldAlert, 
  Clock, 
  Video,
  Layers,
  Sparkles
} from 'lucide-react';
import { ForensicCase } from '../types';

interface VideoSurveillanceProps {
  currentCase: ForensicCase;
}

export const VideoSurveillance: React.FC<VideoSurveillanceProps> = ({ currentCase }) => {
  const videoFiles = currentCase.evidence_items.filter(e => e.type.includes('VIDEO'));
  const [selectedVideo, setSelectedVideo] = useState(videoFiles[0] || null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Layer toggles
  const [showWeapons, setShowWeapons] = useState(true);
  const [showPersons, setShowPersons] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [showGridHUD, setShowGridHUD] = useState(true);

  // Update selected video if case changes
  useEffect(() => {
    if (videoFiles.length > 0 && (!selectedVideo || !videoFiles.find(v => v.id === selectedVideo.id))) {
      setSelectedVideo(videoFiles[0]);
    }
  }, [currentCase.id]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stepFrame = (frames: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + frames * (1 / 15)));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 10);
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Tactical HUD Canvas Overlay render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    // Optional Grid HUD
    if (showGridHUD) {
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;

      // Crosshair center
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy);
      ctx.lineTo(cx + 20, cy);
      ctx.moveTo(cx, cy - 20);
      ctx.lineTo(cx, cy + 20);
      ctx.stroke();

      // Corner targets
      ctx.strokeRect(20, 20, 40, 40);
      ctx.strokeRect(w - 60, 20, 40, 40);
      ctx.strokeRect(20, h - 60, 40, 40);
      ctx.strokeRect(w - 60, h - 60, 40, 40);
    }

    // Dynamic bounding boxes based on time
    // Suspect interpolation across video
    const t = currentTime;

    // Suspect #1
    if (showPersons) {
      // Suspect moves from x: 140 to 320 over 3 seconds
      const progress = Math.min(1.0, t / 3.0);
      const sx = 140 + progress * 180;
      const sy = 160;
      const boxW = 80;
      const boxH = 150;

      // Draw tactical box
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx - boxW / 2, sy, boxW, boxH);

      // Corner brackets
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      const cl = 12;
      const bx = sx - boxW / 2;
      const by = sy;
      // Top left
      ctx.beginPath();
      ctx.moveTo(bx, by + cl); ctx.lineTo(bx, by); ctx.lineTo(bx + cl, by); ctx.stroke();
      // Top right
      ctx.beginPath();
      ctx.moveTo(bx + boxW - cl, by); ctx.lineTo(bx + boxW, by); ctx.lineTo(bx + boxW, by + cl); ctx.stroke();
      // Bottom left
      ctx.beginPath();
      ctx.moveTo(bx, by + boxH - cl); ctx.lineTo(bx, by + boxH); ctx.lineTo(bx + cl, by + boxH); ctx.stroke();
      // Bottom right
      ctx.beginPath();
      ctx.moveTo(bx + boxW - cl, by + boxH); ctx.lineTo(bx + boxW, by + boxH); ctx.lineTo(bx + boxW, by + boxH - cl); ctx.stroke();

      // Label badge
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(bx, Math.max(0, by - 18), 120, 18);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('SUSPECT #1 [94%]', bx + 4, Math.max(12, by - 5));
    }

    // Weapon brandishing at t >= 2.0s
    if (showWeapons && t >= 2.0) {
      const progress = Math.min(1.0, t / 3.0);
      const sx = 140 + progress * 180;
      const wx = sx + 45;
      const wy = 195;
      const ww = 38;
      const wh = 28;

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(wx, wy, ww, wh);

      // Weapon Label
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(wx, wy - 16, 115, 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('GLOCK-19 PISTOL [97%]', wx + 3, wy - 4);

      // Flash indicator at 3.4s - 3.6s
      if (3.3 <= t && t <= 3.7) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.fillRect(0, 0, w, h); // Screen strobe flash
      }
    }

    // Action Classification Overlay
    if (showActions) {
      let actionLabel = 'SURVEILLANCE_SWEEP_NORMAL';
      let actionColor = '#06b6d4';

      if (t < 2.0) {
        actionLabel = 'ACTION: PERIMETER_INFILTRATION';
        actionColor = '#f59e0b';
      } else if (t >= 2.0 && t < 3.4) {
        actionLabel = 'ALERT: WEAPON_BRANDISHED_HOSTILE';
        actionColor = '#ef4444';
      } else if (t >= 3.4 && t < 4.2) {
        actionLabel = 'CRITICAL: BALLISTIC_DISCHARGE_CONFIRMED';
        actionColor = '#dc2626';
      } else {
        actionLabel = 'ACTION: VALUABLES_EXTRACTION & FLIGHT';
        actionColor = '#f97316';
      }

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(20, h - 45, 310, 26);
      ctx.strokeStyle = actionColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, h - 45, 310, 26);

      ctx.fillStyle = actionColor;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(actionLabel, 30, h - 28);
    }
  }, [currentTime, showWeapons, showPersons, showActions, showGridHUD]);

  // Key Action Milestones for fast jump
  const actionMarkers = [
    { time: 0.5, label: 'Entry', threat: 'LOW' },
    { time: 2.1, label: 'Draw Weapon', threat: 'HIGH' },
    { time: 3.5, label: 'Discharge', threat: 'CRITICAL' },
    { time: 5.0, label: 'Extraction', threat: 'MEDIUM' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Station Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-tactical font-bold text-slate-100 flex items-center space-x-2">
            <Video className="w-5 h-5 text-cyan-400" />
            <span>MULTI-CAMERA SURVEILLANCE & ACTION ANALYSIS</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            YOLOv8 Real-Time Entity Tracking, Pose Velocity & Threat Detection
          </p>
        </div>

        {/* Camera Selector Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          {videoFiles.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setSelectedVideo(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition flex items-center space-x-1.5 ${
                selectedVideo?.id === v.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-semibold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>CAM 0{i + 1}: {v.source}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Video Player & HUD Screen (3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
            {/* HTML5 Video Element */}
            {selectedVideo && (
              <video
                ref={videoRef}
                src={selectedVideo.file_url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-contain"
                playsInline
                muted
              />
            )}

            {/* Tactical Canvas Overlay */}
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Top Tactical HUD Bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-cyan-400 bg-slate-950/80 px-3 py-1.5 rounded border border-cyan-900/40 backdrop-blur pointer-events-none">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>REC // {selectedVideo?.source || 'CCTV_CAM_01'}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>FPS: 15.0</span>
                <span>RES: 640x360</span>
                <span>TIMECODE: 23:14:0{currentTime.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Video Scrubbing Bar with Action Markers */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 font-mono">
            {/* Scrubber Range */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max={duration || 10}
                step="0.05"
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCurrentTime(val);
                  if (videoRef.current) videoRef.current.currentTime = val;
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />

              {/* Action Marker Flags */}
              <div className="relative w-full h-4 mt-1">
                {actionMarkers.map((m, i) => {
                  const pct = (m.time / (duration || 10)) * 100;
                  const color = m.threat === 'CRITICAL' ? 'bg-red-500 text-red-200' : m.threat === 'HIGH' ? 'bg-amber-500 text-amber-200' : 'bg-cyan-500 text-cyan-200';
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (videoRef.current) videoRef.current.currentTime = m.time;
                      }}
                      style={{ left: `${pct}%` }}
                      className={`absolute -translate-x-1/2 text-[9px] px-1 py-0.2 rounded font-bold cursor-pointer hover:scale-110 transition ${color}`}
                    >
                      ▲ {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Playback Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => stepFrame(-1)}
                  title="Previous Frame"
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-semibold flex items-center space-x-1"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>

                <button
                  onClick={() => stepFrame(1)}
                  title="Next Frame"
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <span className="text-slate-400 ml-2">
                  {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
                </span>
              </div>

              {/* Playback Speed Toggles */}
              <div className="flex items-center space-x-1">
                <span className="text-slate-500 mr-1 text-[11px]">SPEED:</span>
                {[0.25, 0.5, 1.0, 2.0].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleRateChange(rate)}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      playbackRate === rate ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* HUD Layer Toggles */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowWeapons(!showWeapons)}
                  className={`px-2 py-1 rounded text-[10px] border flex items-center space-x-1 ${
                    showWeapons ? 'bg-red-950/60 border-red-700 text-red-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <Crosshair className="w-3 h-3" />
                  <span>Weapons</span>
                </button>

                <button
                  onClick={() => setShowPersons(!showPersons)}
                  className={`px-2 py-1 rounded text-[10px] border flex items-center space-x-1 ${
                    showPersons ? 'bg-cyan-950/60 border-cyan-700 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Persons</span>
                </button>

                <button
                  onClick={() => setShowActions(!showActions)}
                  className={`px-2 py-1 rounded text-[10px] border flex items-center space-x-1 ${
                    showActions ? 'bg-amber-950/60 border-amber-700 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Actions</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Entity Tracker & Forensic Metadata Sidebar (1 Column) */}
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-tactical font-semibold text-slate-200">
                ACTIVE DETECTIONS
              </h3>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {currentCase.detected_entities.map((entity) => {
                const isWeapon = entity.category === 'WEAPON';
                const isPerson = entity.category === 'PERSON_OF_INTEREST';
                const threatBg = isWeapon ? 'border-red-900/60 bg-red-950/20' : isPerson ? 'border-cyan-900/60 bg-cyan-950/20' : 'border-slate-800 bg-slate-950';

                return (
                  <div
                    key={entity.id}
                    className={`p-3 rounded-lg border text-xs font-mono space-y-1 ${threatBg}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{entity.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${isWeapon ? 'bg-red-900 text-red-200' : 'bg-cyan-900 text-cyan-200'}`}>
                        {entity.threat}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Category: <span className="text-slate-300">{entity.category}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>Conf: {Math.round(entity.confidence * 100)}%</span>
                      <span>Time: {entity.time}</span>
                    </div>

                    {entity.notes && (
                      <div className="text-[10px] text-slate-400 bg-slate-900/80 p-1.5 rounded mt-1">
                        {entity.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

