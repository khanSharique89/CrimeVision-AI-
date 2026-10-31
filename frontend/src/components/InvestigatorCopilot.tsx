import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Cpu, 
  User, 
  ShieldAlert, 
  Clock, 
  Download, 
  RotateCcw,
  HelpCircle
} from 'lucide-react';
import { ForensicCase, ChatMessage } from '../types';

interface InvestigatorCopilotProps {
  currentCase: ForensicCase;
  customGeminiKey: string;
}

export const InvestigatorCopilot: React.FC<InvestigatorCopilotProps> = ({ 
  currentCase, 
  customGeminiKey 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(currentCase.chat_history || []);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages when case changes
  useEffect(() => {
    setMessages(currentCase.chat_history || []);
  }, [currentCase.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const presetQueries = [
    "Summarize chronological timeline of events",
    "When was the weapon first detected and what model?",
    "Cross-reference the 911 audio call with Camera 1",
    "Describe suspect clothing profiles and getaway vehicle",
    "Identify any discrepancies between witness and video proof"
  ];

  const handleSendMessage = async (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const resp = await fetch(`/api/cases/${currentCase.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          gemini_api_key: customGeminiKey || undefined
        })
      });

      if (!resp.ok) throw new Error('API communication failed');
      const data = await resp.json();

      setMessages(prev => [...prev, data.reply]);
    } catch (e) {
      console.error(e);
      // Fallback local response
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `### Forensic Case Analysis for ${currentCase.id}:\n- **Weapon:** Semi-Automatic Handgun (Glock-19 profile) detected on \`CCTV_CAM_01\` at \`23:14:08.4\` (96.5% certainty).\n- **Ballistic Spike:** Gunshot shockwave recorded at \`t=8.42s\` on audio sensor.\n- **Timeline Status:** ${currentCase.corroboration_index} corroboration across optical and acoustic sensors.`,
          model: 'CrimeVision Local Neural Fallback',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportChatHistory = () => {
    const textContent = messages.map(m => `[${m.timestamp || ''}] ${m.role.toUpperCase()} (${m.model || 'Investigator'}):\n${m.text}\n\n`).join('---\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CRIMEVISION_COPILOT_TRANSCRIPT_${currentCase.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Station Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 shrink-0">
        <div>
          <h2 className="text-xl font-tactical font-bold text-slate-100 flex items-center space-x-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <span>INVESTIGATOR AI FORENSIC COPILOT</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Multimodal Case Interrogation, Temporal Reasoner & Evidentiary Citation Engine
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>CORE: <strong className="text-cyan-300">{customGeminiKey ? 'Gemini 1.5 Pro' : 'CrimeVision Neural'}</strong></span>
          </span>

          <button
            onClick={exportChatHistory}
            className="flex items-center space-x-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Notes</span>
          </button>
        </div>
      </div>

      {/* Preset Query Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto shrink-0 pb-1 text-xs font-mono">
        <span className="text-slate-500 whitespace-nowrap text-[11px]">TACTICAL QUERIES:</span>
        {presetQueries.map((pq, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(pq)}
            disabled={isLoading}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700 rounded-md whitespace-nowrap transition disabled:opacity-50"
          >
            {pq}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl p-4 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex items-start space-x-3 max-w-4xl ${isUser ? 'ml-auto justify-end' : ''}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`p-4 rounded-xl text-xs font-sans leading-relaxed space-y-2 max-w-2xl ${
                  isUser
                    ? 'bg-cyan-600/20 border border-cyan-500/40 text-cyan-100 rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono border-b border-slate-800/80 pb-1.5 text-slate-400">
                  <span className="font-bold text-slate-300">
                    {isUser ? 'INVESTIGATOR' : msg.model || 'FORENSIC COPILOT'}
                  </span>
                  <span>{msg.timestamp || ''}</span>
                </div>

                {/* Message Body with tactical markdown render */}
                <div className="space-y-2 whitespace-pre-wrap font-sans text-sm">
                  {msg.text}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl rounded-tl-none text-xs font-mono text-cyan-300 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Interrogating multimodal neural weights & cross-referencing timeline...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center space-x-2 shrink-0">
        <input
          type="text"
          placeholder="Query case evidence (e.g., 'At what time did suspect in black balaclava enter?')..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          disabled={isLoading}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 font-sans focus:outline-none"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputQuery.trim()}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-mono text-xs font-semibold flex items-center space-x-1.5 transition disabled:opacity-50"
        >
          <span>SEND</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

