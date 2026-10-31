import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Camera,
  Video,
  Mic2
} from 'lucide-react';

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  onUploadSuccess: (updatedCase: any) => void;
}

export const EvidenceUploadModal: React.FC<EvidenceUploadModalProps> = ({
  isOpen,
  onClose,
  caseId,
  onUploadSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('CCTV_CAMERA_FEED');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      if (!title) {
        setTitle(f.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a media file to upload.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title || file.name);
      formData.append('source', source);
      formData.append('description', description);

      const resp = await fetch(`/api/cases/${caseId}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!resp.ok) {
        throw new Error('Evidence ingestion failed.');
      }

      const data = await resp.json();
      if (data.case) {
        onUploadSuccess(data.case);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-tactical font-bold text-slate-100">
              INGEST FORENSIC EVIDENCE
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Auto SHA-256 Hashing & Autonomous AI Detection Sweep
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {/* File input */}
          <div className="space-y-1.5">
            <label className="text-slate-300 block font-semibold">
              SELECT MEDIA FILE (IMAGE, VIDEO, AUDIO)
            </label>
            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-lg p-6 text-center cursor-pointer bg-slate-950/60 transition">
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="modal-file-input"
              />
              <label htmlFor="modal-file-input" className="cursor-pointer block space-y-2">
                <Upload className="w-6 h-6 text-cyan-400 mx-auto" />
                <span className="text-slate-300 block">
                  {file ? file.name : 'Click or drag file here to ingest'}
                </span>
                <span className="text-slate-500 text-[10px] block">
                  Supports MP4, JPG, PNG, WAV, MP3
                </span>
              </label>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-slate-300 block">EVIDENCE TITLE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., East Perimeter Surveillance Camera 03"
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Sensor Source */}
          <div className="space-y-1">
            <label className="text-slate-300 block">SENSOR SOURCE / DEVICE</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="CCTV_CAMERA_FEED">CCTV Stationary Camera</option>
              <option value="OFFICER_BODYCAM">Police Officer Body-Worn Camera</option>
              <option value="EMERGENCY_911_AUDIO">911 Emergency Dispatch Audio</option>
              <option value="CRIME_SCENE_FORENSIC_PHOTO">Crime Scene CSI High-Res Photo</option>
              <option value="WITNESS_SMARTPHONE">Witness Smartphone Recording</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-slate-300 block">FORENSIC NOTES / DESCRIPTION</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Location recovered, physical markings, or specific context..."
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-md font-semibold flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Executing AI Sweep...' : 'Ingest & Analyze'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

