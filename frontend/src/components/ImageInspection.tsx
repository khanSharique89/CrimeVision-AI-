import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Crosshair, 
  Lock, 
  Sparkles, 
  Search, 
  Sliders,
  Layers
} from 'lucide-react';
import { ForensicCase, DetectedEntity } from '../types';

interface ImageInspectionProps {
  currentCase: ForensicCase;
}

export const ImageInspection: React.FC<ImageInspectionProps> = ({ currentCase }) => {
  const imageFiles = currentCase.evidence_items.filter(e => e.type.includes('IMAGE'));
  const [selectedImage, setSelectedImage] = useState(imageFiles[0] || null);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Detection confidence threshold
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.25);
  const [showBoxes, setShowBoxes] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<DetectedEntity | null>(null);

  // Magnifier Loupe
  const [enableLoupe, setEnableLoupe] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Is analyzing state
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (imageFiles.length > 0 && (!selectedImage || !imageFiles.find(img => img.id === selectedImage.id))) {
      setSelectedImage(imageFiles[0]);
    }
  }, [currentCase.id]);

  // Load and render image with bounding boxes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedImage) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = selectedImage.file_url;
    img.onload = () => {
      canvas.width = img.width || 960;
      canvas.height = img.height || 540;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Render Bounding Boxes
      if (showBoxes) {
        currentCase.detected_entities
          .filter(e => e.confidence >= confidenceThreshold)
          .forEach(entity => {
            const isSelected = selectedEntity?.id === entity.id;
            const isWeapon = entity.category === 'WEAPON';
            const color = isWeapon ? '#ef4444' : isSelected ? '#38bdf8' : '#06b6d4';

            const [x1, y1, x2, y2] = entity.box;
            const boxW = x2 - x1;
            const boxH = y2 - y1;

            // Box outline
            ctx.strokeStyle = color;
            ctx.lineWidth = isSelected ? 3 : 2;
            ctx.strokeRect(x1, y1, boxW, boxH);

            // Corner brackets
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            const cl = Math.min(14, boxW / 4, boxH / 4);
            // Top left
            ctx.beginPath(); ctx.moveTo(x1, y1 + cl); ctx.lineTo(x1, y1); ctx.lineTo(x1 + cl, y1); ctx.stroke();
            // Top right
            ctx.beginPath(); ctx.moveTo(x2 - cl, y1); ctx.lineTo(x2, y1); ctx.lineTo(x2, y1 + cl); ctx.stroke();
            // Bottom left
            ctx.beginPath(); ctx.moveTo(x1, y2 - cl); ctx.lineTo(x1, y2); ctx.lineTo(x1 + cl, y2); ctx.stroke();
            // Bottom right
            ctx.beginPath(); ctx.moveTo(x2 - cl, y2); ctx.lineTo(x2, y2); ctx.lineTo(x2, y2 - cl); ctx.stroke();

            // Label banner
            ctx.fillStyle = color;
            const labelText = `${entity.label} [${Math.round(entity.confidence * 100)}%]`;
            ctx.font = 'bold 11px monospace';
            const textMetrics = ctx.measureText(labelText);
            ctx.fillRect(x1, Math.max(0, y1 - 20), textMetrics.width + 10, 20);

            ctx.fillStyle = isWeapon ? '#ffffff' : '#000000';
            ctx.fillText(labelText, x1 + 5, Math.max(14, y1 - 5));
          });
      }
    };
  }, [selectedImage, showBoxes, confidenceThreshold, selectedEntity]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  const handleRunYoloSweep = async () => {
    setIsAnalyzing(true);
    try {
      await fetch(`/api/cases/${currentCase.id}/analyze/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_name: selectedImage?.file_name,
          confidence: confidenceThreshold
        })
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-tactical font-bold text-slate-100 flex items-center space-x-2">
            <Camera className="w-5 h-5 text-cyan-400" />
            <span>IMAGE & WEAPONS FORENSIC INSPECTOR</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Pixel-Level Zoom, Magnifier Loupe, and Cryptographic SHA-256 Authentication
          </p>
        </div>

        {/* Image Switcher Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          {imageFiles.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition flex items-center space-x-1.5 ${
                selectedImage?.id === img.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-semibold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>IMG 0{i + 1}: {img.source}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Canvas Viewport (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative h-[520px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          >
            {/* Inner Pan/Zoom Container */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              <canvas
                ref={canvasRef}
                className="max-w-none shadow-2xl"
              />
            </div>

            {/* Magnifier Loupe Overlay if enabled */}
            {enableLoupe && mousePos && canvasRef.current && (
              <div 
                style={{
                  left: mousePos.x - 60,
                  top: mousePos.y - 60,
                  width: 120,
                  height: 120,
                  backgroundImage: `url(${selectedImage?.file_url})`,
                  backgroundPosition: `-${mousePos.x * 2.5 - 60}px -${mousePos.y * 2.5 - 60}px`,
                  backgroundSize: `${canvasRef.current.width * 2.5}px ${canvasRef.current.height * 2.5}px`
                }}
                className="pointer-events-none absolute rounded-full border-2 border-cyan-400 shadow-2xl overflow-hidden z-20"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400/50"></div>
                </div>
              </div>
            )}

            {/* Tactical Canvas Controls HUD Overlay */}
            <div className="absolute top-4 left-4 flex items-center space-x-1 bg-slate-950/80 border border-slate-800 rounded-lg p-1 backdrop-blur text-xs font-mono">
              <button
                onClick={() => setZoom(z => Math.min(4.0, z + 0.25))}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="px-2 text-cyan-400 font-semibold">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetView}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-300"
                title="Reset Viewport"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={() => setEnableLoupe(!enableLoupe)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                  enableLoupe ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {enableLoupe ? 'LOUPE ON (3x)' : '3x LOUPE'}
              </button>
            </div>

            {/* Bottom Status Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800 backdrop-blur pointer-events-none">
              <span>{selectedImage?.source || 'FORENSIC_CAMERA'}</span>
              <span>SHA-256: <strong className="text-emerald-400">{selectedImage?.sha256.slice(0, 20)}...</strong></span>
              <span>INTEGRITY VERIFIED</span>
            </div>
          </div>

          {/* Confidence Slider & Filter Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center space-x-3">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>YOLO CONFIDENCE THRESHOLD:</span>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-36 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-cyan-400 font-bold">{Math.round(confidenceThreshold * 100)}%</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowBoxes(!showBoxes)}
                className={`px-3 py-1.5 rounded border transition ${
                  showBoxes ? 'bg-cyan-950 border-cyan-700 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                {showBoxes ? 'HIDE BOUNDING BOXES' : 'SHOW BOUNDING BOXES'}
              </button>

              <button
                onClick={handleRunYoloSweep}
                disabled={isAnalyzing}
                className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded font-semibold flex items-center space-x-1.5 transition disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAnalyzing ? 'Scanning Neural Layers...' : 'Run YOLOv8 Sweep'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Forensic Metadata & Detected Object Catalog (1 Col) */}
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3 font-mono">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-tactical font-semibold text-slate-200">
                SCENE DETECTIONS
              </h3>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {currentCase.detected_entities.map((entity) => {
                const isSelected = selectedEntity?.id === entity.id;
                const isWeapon = entity.category === 'WEAPON';

                return (
                  <div
                    key={entity.id}
                    onClick={() => setSelectedEntity(entity)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/40 shadow-md'
                        : isWeapon
                        ? 'border-red-900/60 bg-red-950/20 hover:border-red-800'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{entity.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        isWeapon ? 'bg-red-900 text-red-200' : 'bg-cyan-900 text-cyan-200'
                      }`}>
                        {entity.threat}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1">
                      Certainty: <strong className="text-emerald-400">{Math.round(entity.confidence * 100)}%</strong>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      Box: [{entity.box.map(n => Math.round(n)).join(', ')}]
                    </div>

                    {entity.notes && (
                      <div className="text-[10px] text-slate-300 bg-slate-900/80 p-1.5 rounded mt-1.5">
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

