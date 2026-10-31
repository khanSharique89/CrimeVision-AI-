import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  Video, 
  Crosshair, 
  Radio, 
  Layers, 
  Eye, 
  Maximize2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ForensicCase } from '../types';

interface Scene3DMappingProps {
  currentCase: ForensicCase;
}

export const Scene3DMapping: React.FC<Scene3DMappingProps> = ({ currentCase }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Layer toggles
  const [showCameras, setShowCameras] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [showAcousticRings, setShowAcousticRings] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  const [animFrame, setAnimFrame] = useState(0);

  // Animation ticker for acoustic pulse rings and suspect vector dashes
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimFrame(f => (f + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Canvas rendering of 2D/3D Tactical Architectural Layout
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // 1. Grid Background (High-Tech Blueprint HUD)
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // 2. Architectural Floorplan Walls
    // Hallway
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, w - 120, h - 120);

    // Vault Interior Partition
    ctx.strokeRect(400, 100, 320, 260);
    // Vault Door opening
    ctx.clearRect(400, 200, 8, 60);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(401, 101, 318, 258);

    // Room Labels
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('SUB-LEVEL 2 // ACCESS CORRIDOR', 90, 95);
    ctx.fillText('HIGH-SECURITY DIAMOND VAULT B', 430, 135);

    // Coordinate scale
    ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.font = '10px monospace';
    ctx.fillText('0.0m', 65, h - 70);
    ctx.fillText('+25.0m', w - 100, h - 70);

    // 3. Camera Positions & Field-of-View (FOV) Cones
    if (showCameras) {
      const cams = currentCase.scene_layout_3d?.cameras || [
        { id: 'CCTV_CAM_01', x: 4, y: 3, fov: 80, rotation: 35, label: 'Vault Entrance Cam' },
        { id: 'CCTV_CAM_02', x: 22, y: 3, fov: 90, rotation: 140, label: 'Vault Door East Cam' }
      ];

      cams.forEach(cam => {
        const px = 60 + (cam.x / 25) * (w - 120);
        const py = 60 + (cam.y / 18) * (h - 120);
        const radius = 170;
        const rad = (cam.rotation * Math.PI) / 180;
        const halfFov = ((cam.fov / 2) * Math.PI) / 180;

        // Draw FOV Cone gradient
        const coneGrad = ctx.createRadialGradient(px, py, 10, px, py, radius);
        coneGrad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
        coneGrad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.arc(px, py, radius, rad - halfFov, rad + halfFov);
        ctx.closePath();
        ctx.fill();

        // Cone outline borders
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Camera Icon Node
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(cam.id, px - 25, py - 12);
      });
    }

    // 4. Acoustic Ballistics Triangulation Origin
    if (showAcousticRings) {
      // Gunshot origin inside vault near (520, 230)
      const ax = 520;
      const ay = 230;

      // Concentric expanding shockwaves
      const ringCount = 3;
      for (let r = 0; r < ringCount; r++) {
        const radius = ((animFrame * 2 + r * 35) % 120) + 10;
        const opacity = Math.max(0, 1 - radius / 120);

        ctx.strokeStyle = `rgba(239, 68, 68, ${opacity * 0.8})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ax, ay, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Origin Point
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(ax, ay, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('BALLISTIC DISCHARGE ORIGIN (t=8.42s)', ax - 80, ay + 20);
    }

    // 5. Suspect Trajectory Vectors
    if (showVectors) {
      // Suspect 1 (Armed) Path
      const path1 = [
        [120, 230],
        [220, 230],
        [360, 230],
        [430, 230],
        [520, 230],
        [600, 260]
      ];

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.lineDashOffset = -animFrame * 0.8;

      ctx.beginPath();
      ctx.moveTo(path1[0][0], path1[0][1]);
      for (let p = 1; p < path1.length; p++) {
        ctx.lineTo(path1[p][0], path1[p][1]);
      }
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Directional arrows along path
      ctx.fillStyle = '#ef4444';
      ctx.fillText('SUSPECT #1 VECTOR →', 240, 220);

      // Suspect 2 (Bag Handler) Path
      const path2 = [
        [120, 260],
        [240, 260],
        [360, 250],
        [430, 240],
        [500, 290]
      ];

      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -animFrame * 0.6;

      ctx.beginPath();
      ctx.moveTo(path2[0][0], path2[0][1]);
      for (let p = 1; p < path2.length; p++) {
        ctx.lineTo(path2[p][0], path2[p][1]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 6. Evidence Markers on Floor
    if (showMarkers) {
      const markers = [
        { id: 'MARKER-01', x: 535, y: 245, label: '9mm Luger Expended Brass Casing', threat: 'EVIDENCE' },
        { id: 'MARKER-02', x: 640, y: 190, label: 'Bullet Impact / Ricochet Scar', threat: 'BALLISTICS' },
        { id: 'MARKER-03', x: 395, y: 220, label: 'Forced Entry Crowbar Tool Marks', threat: 'FORENSIC' }
      ];

      markers.forEach(m => {
        // Yellow cone marker badge
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y - 16);
        ctx.lineTo(m.x - 10, m.y);
        ctx.lineTo(m.x + 10, m.y);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 8px monospace';
        ctx.fillText(m.id.slice(-2), m.x - 5, m.y - 3);

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(m.id, m.x + 12, m.y - 5);
      });
    }

  }, [animFrame, showCameras, showMarkers, showVectors, showAcousticRings]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-tactical font-bold text-slate-100 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span>CRIME SCENE RECONSTRUCTION (TACTICAL 2D/3D LAYOUT)</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Spatial Field-of-View Coverage, Acoustic Triangulation & Suspect Vectors
          </p>
        </div>

        {/* Spatial Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setShowCameras(!showCameras)}
            className={`px-3 py-1.5 rounded-md border transition flex items-center space-x-1.5 ${
              showCameras ? 'bg-cyan-950 border-cyan-700 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Camera FOVs</span>
          </button>

          <button
            onClick={() => setShowAcousticRings(!showAcousticRings)}
            className={`px-3 py-1.5 rounded-md border transition flex items-center space-x-1.5 ${
              showAcousticRings ? 'bg-red-950 border-red-700 text-red-300' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Acoustic Origin</span>
          </button>

          <button
            onClick={() => setShowVectors(!showVectors)}
            className={`px-3 py-1.5 rounded-md border transition flex items-center space-x-1.5 ${
              showVectors ? 'bg-amber-950 border-amber-700 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Suspect Vectors</span>
          </button>

          <button
            onClick={() => setShowMarkers(!showMarkers)}
            className={`px-3 py-1.5 rounded-md border transition flex items-center space-x-1.5 ${
              showMarkers ? 'bg-yellow-950 border-yellow-700 text-yellow-300' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Physical Markers</span>
          </button>
        </div>
      </div>

      {/* Main Tactical Map Viewport */}
      <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center p-2">
        <canvas
          ref={canvasRef}
          width={860}
          height={480}
          className="w-full h-[480px] object-contain rounded-lg"
        />

        {/* Legend Overlay Card */}
        <div className="absolute top-4 right-4 bg-slate-950/90 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-2 backdrop-blur shadow-xl">
          <div className="font-bold text-cyan-400 border-b border-slate-800 pb-1">
            TACTICAL MAP LEGEND
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>CCTV Camera Coverage (FOV)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span>Gunshot Triangulation Point</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-0.5 bg-red-400 border-dashed"></span>
            <span>Suspect #1 Movement Path</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-0.5 bg-amber-400 border-dashed"></span>
            <span>Suspect #2 Movement Path</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-yellow-400 clip-triangle"></span>
            <span>Physical Ballistics Marker</span>
          </div>
        </div>
      </div>

      {/* Markers Matrix Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="flex items-center justify-between text-yellow-400 font-bold">
            <span>MARKER #01</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-950/60 border border-yellow-800">BALLISTICS</span>
          </div>
          <div className="text-slate-200 font-sans font-medium">9mm Luger Expended Brass Casing</div>
          <p className="text-[11px] text-slate-400">Located at coordinate [X: 8.2m, Y: 9.4m]. Aligns with Suspect #1 discharge.</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="flex items-center justify-between text-yellow-400 font-bold">
            <span>MARKER #02</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-950/60 border border-yellow-800">BALLISTICS</span>
          </div>
          <div className="text-slate-200 font-sans font-medium">Bullet Ricochet Impact Scar</div>
          <p className="text-[11px] text-slate-400">Located at coordinate [X: 14.5m, Y: 10.1m]. Wall angle confirms ricochet path.</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="flex items-center justify-between text-yellow-400 font-bold">
            <span>MARKER #03</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-950/60 border border-yellow-800">TOOL MARKS</span>
          </div>
          <div className="text-slate-200 font-sans font-medium">Pry Marks on Vault Locking Pin</div>
          <p className="text-[11px] text-slate-400">Located at coordinate [X: 18.0m, Y: 4.5m]. Tool width ~28mm consistent with pry bar.</p>
        </div>
      </div>
    </div>
  );
};

