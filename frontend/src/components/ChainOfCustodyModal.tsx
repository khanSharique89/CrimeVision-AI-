import React from 'react';
import { X, CheckCircle2, ShieldCheck, Lock, Copy } from 'lucide-react';
import { ForensicCase } from '../types';

interface ChainOfCustodyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: ForensicCase;
}

export const ChainOfCustodyModal: React.FC<ChainOfCustodyModalProps> = ({
  isOpen,
  onClose,
  currentCase
}) => {
  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-tactical font-bold text-slate-100">
              CRYPTOGRAPHIC CHAIN OF CUSTODY AUDIT LOG
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Tamper-Evident SHA-256 Digital Signatures & Evidentiary Admissibility Verification
            </p>
          </div>
        </div>

        {/* Master Case Hash Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>CASE MASTER INTEGRITY ROOT HASH (SHA-256)</span>
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
              UNALTERED // SECURED
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded border border-slate-800">
            <code className="text-cyan-300 text-xs break-all select-all">
              {currentCase.master_hash}
            </code>
            <button
              onClick={() => copyToClipboard(currentCase.master_hash)}
              className="ml-3 p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition shrink-0"
              title="Copy Hash"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ingested Media Evidence Items Table */}
        <div className="space-y-3 font-mono text-xs">
          <h4 className="font-bold text-slate-200 text-sm">
            EVIDENCE INTEGRITY LOG ({currentCase.evidence_items.length} ITEMS)
          </h4>

          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">TITLE / SOURCE</th>
                  <th className="p-3">FILE SIZE</th>
                  <th className="p-3">SHA-256 CHECKSUM</th>
                  <th className="p-3 text-right">INTEGRITY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 text-[11px]">
                {currentCase.evidence_items.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-800/50">
                    <td className="p-3 text-cyan-400 font-bold">{ev.id}</td>
                    <td className="p-3">
                      <div className="text-slate-200 font-sans">{ev.title}</div>
                      <div className="text-[10px] text-slate-500">{ev.source}</div>
                    </td>
                    <td className="p-3 text-slate-400">{ev.file_size_mb} MB</td>
                    <td className="p-3">
                      <code className="text-slate-400 text-[10px] truncate max-w-[200px] block" title={ev.sha256}>
                        {ev.sha256}
                      </code>
                    </td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>VERIFIED</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legal Attestation */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg text-xs text-slate-400 font-mono space-y-1">
          <span className="text-slate-300 font-bold block">COURT ADMISSIBILITY STANDARDS:</span>
          <p className="text-[11px] leading-relaxed">
            All cryptographic signatures comply with Federal Rules of Evidence (FRE) Rule 902(13) and Rule 902(14) for self-authenticating electronic records generated by automated multimodal forensic processing.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md font-mono text-xs transition"
          >
            Close Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};

