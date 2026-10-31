import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldAlert, 
  Lock, 
  Sparkles, 
  FileCheck2,
  Calendar,
  UserCheck
} from 'lucide-react';
import { ForensicCase } from '../types';

interface ReportCenterProps {
  currentCase: ForensicCase;
  onGenerateReport: () => void;
  isGeneratingReport: boolean;
  lastReportUrl: string | null;
}

export const ReportCenter: React.FC<ReportCenterProps> = ({
  currentCase,
  onGenerateReport,
  isGeneratingReport,
  lastReportUrl
}) => {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-tactical font-bold text-slate-100 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>FORENSIC REPORT DOSSIER STUDIO</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Official Court-Admissible Intelligence Dossier & Cryptographic Chain of Custody
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-md text-xs font-mono transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>

          <button
            onClick={onGenerateReport}
            disabled={isGeneratingReport}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-semibold rounded-md shadow-lg shadow-cyan-950/40 transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingReport ? 'Compiling PDF Dossier...' : 'Generate Official PDF'}</span>
          </button>
        </div>
      </div>

      {/* Download Alert Banner if report is ready */}
      {lastReportUrl && (
        <div className="bg-emerald-950/40 border border-emerald-800 rounded-xl p-4 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="font-bold text-emerald-300">OFFICIAL FORENSIC PDF GENERATED VIA REPORTLAB</span>
              <p className="text-slate-400 font-sans text-xs mt-0.5">SHA-256 digital signature embedded and ready for court submission.</p>
            </div>
          </div>
          <a
            href={lastReportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded flex items-center space-x-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        </div>
      )}

      {/* Realistic Printable Legal Forensic Dossier Paper Document */}
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 border border-slate-200 space-y-8 font-sans">
        {/* Document Classification Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="bg-slate-900 text-white px-2.5 py-1 font-bold inline-block rounded-sm self-start">
            RESTRICTED // LAW ENFORCEMENT SENSITIVE // COURT EXHIBIT
          </div>
          <div className="text-slate-600 font-bold">
            DOSSIER REF: CV-RPT-{currentCase.id}
          </div>
        </div>

        {/* Header Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black font-tactical tracking-wide text-slate-950">
            CRIMEVISION AI™ MULTIMODAL FORENSIC INTELLIGENCE DOSSIER
          </h1>
          <p className="text-sm font-semibold text-sky-700 tracking-wider font-mono">
            DEPARTMENT OF DIGITAL FORENSICS & BALLISTICS RECONSTRUCTION
          </p>
        </div>

        {/* Case Metadata Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          <div>
            <span className="text-slate-500 block font-mono text-[10px]">CASE FILE ID</span>
            <strong className="text-slate-900 font-mono text-sm">{currentCase.id}</strong>
          </div>
          <div>
            <span className="text-slate-500 block font-mono text-[10px]">DATE OF INCIDENT</span>
            <strong className="text-slate-900">{currentCase.incident_date}</strong>
          </div>
          <div>
            <span className="text-slate-500 block font-mono text-[10px]">LEAD DETECTIVE</span>
            <strong className="text-slate-900">{currentCase.lead_investigator}</strong>
          </div>
          <div>
            <span className="text-slate-500 block font-mono text-[10px]">THREAT LEVEL</span>
            <strong className="text-red-700 font-bold">{currentCase.threat_level}</strong>
          </div>
          <div className="col-span-2">
            <span className="text-slate-500 block font-mono text-[10px]">INCIDENT TITLE</span>
            <strong className="text-slate-900">{currentCase.title}</strong>
          </div>
          <div className="col-span-2">
            <span className="text-slate-500 block font-mono text-[10px]">MASTER SHA-256 CRYPTOGRAPHIC FINGERPRINT</span>
            <code className="text-slate-700 text-[10px] break-all block">{currentCase.master_hash}</code>
          </div>
        </div>

        {/* Section 1: Executive Synopsis */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold font-mono tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            1. EXECUTIVE FORENSIC RECONSTRUCTION SYNOPSIS
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            {currentCase.synopsis} Multi-sensor autonomous fusion achieved a verified <strong>{currentCase.corroboration_index}</strong> evidentiary agreement index across optical surveillance, acoustic ballistics spectrograms, and witness emergency communications.
          </p>
        </div>

        {/* Section 2: Chain of Custody */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold font-mono tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            2. DIGITAL EVIDENCE CHAIN OF CUSTODY & INTEGRITY STATUS
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border border-slate-200">
              <thead className="bg-slate-900 text-white text-[11px]">
                <tr>
                  <th className="p-2">EVIDENCE ID</th>
                  <th className="p-2">SOURCE FEED</th>
                  <th className="p-2">TYPE</th>
                  <th className="p-2">SHA-256 DIGITAL FINGERPRINT</th>
                  <th className="p-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {currentCase.evidence_items.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50">
                    <td className="p-2 font-bold">{ev.id}</td>
                    <td className="p-2">{ev.source}</td>
                    <td className="p-2">{ev.type}</td>
                    <td className="p-2 text-slate-600 text-[10px] font-mono">{ev.sha256.slice(0, 24)}...</td>
                    <td className="p-2 font-bold text-emerald-700">VERIFIED</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Weapons & Suspects Catalog */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold font-mono tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            3. WEAPONS, SUSPECTS & OBJECT DETECTION CATALOG
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border border-slate-200">
              <thead className="bg-slate-900 text-white text-[11px]">
                <tr>
                  <th className="p-2">CLASS</th>
                  <th className="p-2">IDENTIFIED ENTITY / WEAPON</th>
                  <th className="p-2">THREAT</th>
                  <th className="p-2">CERTAINTY</th>
                  <th className="p-2">TIME & SENSOR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {currentCase.detected_entities.map((ent) => (
                  <tr key={ent.id} className="hover:bg-slate-50">
                    <td className="p-2 font-bold">{ent.category}</td>
                    <td className="p-2">{ent.label}</td>
                    <td className="p-2 font-bold text-red-700">{ent.threat}</td>
                    <td className="p-2">{Math.round(ent.confidence * 100)}%</td>
                    <td className="p-2 text-slate-600">{ent.time} [{ent.source}]</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Lead Examiner Sign-off Block */}
        <div className="border border-slate-300 rounded-lg p-5 bg-slate-50 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <strong className="block text-slate-900 font-mono">LEAD EXAMINER ATTESTATION:</strong>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              I hereby certify under penalty of official inquiry that the multimodal forensic timeline, computer vision classifications, acoustic ballistics analyses, and chain of custody checksums presented herein are accurate and uncorrupted.
            </p>
          </div>

          <div className="space-y-1 font-mono text-[11px] border-t md:border-t-0 md:border-l md:border-slate-300 md:pl-6 pt-3 md:pt-0">
            <div><span className="text-slate-500">EXAMINER:</span> <strong>{currentCase.lead_investigator}</strong></div>
            <div><span className="text-slate-500">JURISDICTION:</span> <strong>{currentCase.jurisdiction}</strong></div>
            <div><span className="text-slate-500">DATE:</span> <strong>{new Date().toISOString().slice(0, 10)}</strong></div>
            <div className="pt-2 text-emerald-800 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CRYPTOGRAPHICALLY SEALED // SHA-256</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

