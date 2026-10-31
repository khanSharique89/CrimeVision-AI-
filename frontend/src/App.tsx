import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OperationsHub } from './components/OperationsHub';
import { VideoSurveillance } from './components/VideoSurveillance';
import { AudioBallistics } from './components/AudioBallistics';
import { ImageInspection } from './components/ImageInspection';
import { MultimodalTimeline } from './components/MultimodalTimeline';
import { Scene3DMapping } from './components/Scene3DMapping';
import { InvestigatorCopilot } from './components/InvestigatorCopilot';
import { ReportCenter } from './components/ReportCenter';
import { EvidenceUploadModal } from './components/EvidenceUploadModal';
import { ChainOfCustodyModal } from './components/ChainOfCustodyModal';
import { GeminiSettingsModal } from './components/GeminiSettingsModal';
import { ForensicCase } from './types';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export function App() {
  const [cases, setCases] = useState<ForensicCase[]>([]);
  const [currentCase, setCurrentCase] = useState<ForensicCase | null>(null);
  const [activeTab, setActiveTab] = useState<string>('OPERATIONS_HUB');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCustodyOpen, setIsCustodyOpen] = useState(false);
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);

  // Report generation state
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [lastReportUrl, setLastReportUrl] = useState<string | null>(null);

  // Gemini API Key from localStorage
  const [customGeminiKey, setCustomGeminiKey] = useState<string>(() => {
    return localStorage.getItem('CRIMEVISION_GEMINI_KEY') || '';
  });

  const handleSaveGeminiKey = (key: string) => {
    setCustomGeminiKey(key);
    if (key) {
      localStorage.setItem('CRIMEVISION_GEMINI_KEY', key);
    } else {
      localStorage.removeItem('CRIMEVISION_GEMINI_KEY');
    }
  };

  // Fetch all cases
  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/cases');
      if (!resp.ok) throw new Error('Failed to fetch cases');
      const data = await resp.json();
      if (data.cases && data.cases.length > 0) {
        setCases(data.cases);
        // Fetch detailed first case
        fetchCaseDetails(data.cases[0].id);
      }
    } catch (e) {
      console.error("Error loading cases from API:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch specific case details
  const fetchCaseDetails = async (caseId: string) => {
    try {
      const resp = await fetch(`/api/cases/${caseId}`);
      if (!resp.ok) throw new Error('Failed to load case file');
      const data = await resp.json();
      setCurrentCase(data);
    } catch (e) {
      console.error(`Error loading case ${caseId}:`, e);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleGenerateReport = async () => {
    if (!currentCase) return;
    setIsGeneratingReport(true);
    try {
      const resp = await fetch(`/api/cases/${currentCase.id}/report/generate`, {
        method: 'POST'
      });
      if (!resp.ok) throw new Error('Report compilation error');
      const data = await resp.json();
      if (data.download_url) {
        setLastReportUrl(data.download_url);
        setActiveTab('REPORT_CENTER');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleUploadSuccess = (updatedCase: ForensicCase) => {
    setCurrentCase(updatedCase);
    fetchCases();
  };

  if (isLoading && !currentCase) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-cyan-400 font-mono">
        <div className="relative">
          <ShieldAlert className="w-12 h-12 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-lg font-tactical font-bold text-white tracking-widest">
            INITIALIZING CRIMEVISION AI PLATFORM
          </h2>
          <p className="text-xs text-slate-400">
            Connecting YOLOv8 neural weights & multimodal forensic timeline...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Top Tactical App Header */}
      <Header
        cases={cases}
        currentCase={currentCase}
        onSelectCase={(id) => fetchCaseDetails(id)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenCustody={() => setIsCustodyOpen(true)}
        onOpenGeminiSettings={() => setIsGeminiOpen(true)}
        onGenerateReport={handleGenerateReport}
        isGeneratingReport={isGeneratingReport}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasCustomGeminiKey={Boolean(customGeminiKey)}
      />

      {/* Main Workstation Screen based on activeTab */}
      <main className="flex-1 pb-12">
        {currentCase ? (
          <>
            {activeTab === 'OPERATIONS_HUB' && (
              <OperationsHub
                currentCase={currentCase}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenUpload={() => setIsUploadOpen(true)}
                onOpenCustody={() => setIsCustodyOpen(true)}
              />
            )}

            {activeTab === 'VIDEO_SURVEILLANCE' && (
              <VideoSurveillance currentCase={currentCase} />
            )}

            {activeTab === 'AUDIO_BALLISTICS' && (
              <AudioBallistics currentCase={currentCase} />
            )}

            {activeTab === 'IMAGE_INSPECTION' && (
              <ImageInspection currentCase={currentCase} />
            )}

            {activeTab === 'MULTIMODAL_TIMELINE' && (
              <MultimodalTimeline currentCase={currentCase} />
            )}

            {activeTab === 'SCENE_3D_MAPPING' && (
              <Scene3DMapping currentCase={currentCase} />
            )}

            {activeTab === 'INVESTIGATOR_COPILOT' && (
              <InvestigatorCopilot
                currentCase={currentCase}
                customGeminiKey={customGeminiKey}
              />
            )}

            {activeTab === 'REPORT_CENTER' && (
              <ReportCenter
                currentCase={currentCase}
                onGenerateReport={handleGenerateReport}
                isGeneratingReport={isGeneratingReport}
                lastReportUrl={lastReportUrl}
              />
            )}
          </>
        ) : (
          <div className="p-12 text-center text-slate-400 font-mono space-y-3">
            <p>No active forensic case loaded.</p>
            <button
              onClick={fetchCases}
              className="px-4 py-2 bg-cyan-600 text-white rounded text-xs flex items-center space-x-1.5 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      {currentCase && (
        <>
          <EvidenceUploadModal
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
            caseId={currentCase.id}
            onUploadSuccess={handleUploadSuccess}
          />

          <ChainOfCustodyModal
            isOpen={isCustodyOpen}
            onClose={() => setIsCustodyOpen(false)}
            currentCase={currentCase}
          />

          <GeminiSettingsModal
            isOpen={isGeminiOpen}
            onClose={() => setIsGeminiOpen(false)}
            currentApiKey={customGeminiKey}
            onSaveApiKey={handleSaveGeminiKey}
          />
        </>
      )}
    </div>
  );
}

export default App;

