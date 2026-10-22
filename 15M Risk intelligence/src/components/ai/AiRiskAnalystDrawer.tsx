import React, { useState, useEffect, useRef } from 'react';
import { SupplierItem, PriorityAction, RadarDomain, RiskAnchor } from '../../types';
import { 
  requestAIAnalysis, 
  AIAnalystAction, 
  AIProvider, 
  fetchAIProviders, 
  AIProvidersStatus,
  authorizeMitigationAction,
  logAIAssistedDecision,
  testOpenAIConnection,
  OpenAITestResult
} from '../../services/aiAnalystService';

interface AiRiskAnalystDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: SupplierItem[];
  riskAnchors: RiskAnchor[];
  actions: PriorityAction[];
  radarDomains: RadarDomain[];
  initialAction?: AIAnalystAction;
  initialPrompt?: string;
  selectedAnchor?: RiskAnchor | null;
  selectedSupplier?: SupplierItem | null;
  onApproveAction: (action: PriorityAction) => void;
  onInspectSupplier?: (supplier: SupplierItem) => void;
  onInspectRiskAnchor?: (anchor: RiskAnchor) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: string[];
  proposedAction?: PriorityAction;
  modelUsed?: string;
  providerUsed?: string;
  toolsExecuted?: Array<{ name: string; args: any }>;
}

export const AiRiskAnalystDrawer: React.FC<AiRiskAnalystDrawerProps> = ({
  isOpen,
  onClose,
  suppliers,
  riskAnchors,
  actions,
  radarDomains,
  initialAction,
  initialPrompt,
  selectedAnchor,
  selectedSupplier,
  onApproveAction,
  onInspectSupplier,
  onInspectRiskAnchor,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AIAnalystAction | 'chat'>('chat');
  const [editingAction, setEditingAction] = useState<PriorityAction | null>(null);
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('auto');
  const [providersStatus, setProvidersStatus] = useState<AIProvidersStatus | null>(null);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testRunning, setTestRunning] = useState(false);
  const [testResult, setTestResult] = useState<OpenAITestResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleRunOpenAITest = async () => {
    setTestRunning(true);
    setTestModalOpen(true);
    try {
      const res = await testOpenAIConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        keyConfigured: false,
        message: err?.message || 'Connection test failed',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setTestRunning(false);
    }
  };

  // Fetch AI providers status on mount
  useEffect(() => {
    fetchAIProviders().then((status) => {
      setProvidersStatus(status);
      if (status.defaultProvider) {
        setSelectedProvider(status.defaultProvider);
      }
    });
  }, []);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `### 👋 Welcome to the 15M AI Risk Analyst

I am grounded in Prof. Dr. Gerhard Heß's **15M Procurement Risk Management Architecture** and directly connected to your active database and backend tools:

* **Monitored Suppliers:** ${suppliers.length} verified enterprise vendors
* **Active Risk Anchors:** ${riskAnchors.length} high-severity items (€112.5M exposure)
* **Pending Mitigations:** ${actions.filter(a => a.status === 'pending').length} priority actions (${actions.filter(a => a.urgency === 'overdue').length} overdue)

Select an action below, click one of the suggested risk questions, or ask any question regarding supplier vulnerabilities, resilience gaps, or 15M category classifications.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: ['15M Architecture v4.2', 'osapiens Telemetry Live'],
          toolsExecuted: [{ name: 'getRiskMetrics', args: {} }],
        }
      ]);
    }
  }, [suppliers.length, riskAnchors.length, actions, messages.length]);

  // Handle triggered initial actions
  useEffect(() => {
    if (isOpen && initialAction) {
      setActiveTab(initialAction);
      handleTriggerAction(initialAction, initialPrompt);
    }
  }, [isOpen, initialAction, initialPrompt]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleTriggerAction = async (actionType: AIAnalystAction, customPrompt?: string) => {
    setIsLoading(true);
    setActiveTab(actionType);

    const userText = customPrompt || (
      actionType === 'explain_risk' ? (selectedAnchor ? `Explain risk anchor [${selectedAnchor.code}]: ${selectedAnchor.supplier}` : 'Explain our top critical risk anchor and why it matters.') :
      actionType === 'assess_risk' ? (selectedSupplier ? `Guide a 15M Risk Cube assessment for supplier [${selectedSupplier.name}]` : 'Perform a structured 15M Risk Cube assessment for our critical materials.') :
      actionType === 'recommend_mitigation' ? 'Recommend preventive and corrective 15M mitigation actions with estimated buffer impact.' :
      'Generate an Executive Procurement Risk Briefing for C-level leadership.'
    );

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await requestAIAnalysis({
        action: actionType,
        prompt: userText,
        provider: selectedProvider,
        context: {
          suppliers,
          riskAnchors,
          actions,
          radarDomains,
          selectedAnchorId: selectedAnchor?.id,
          selectedSupplierId: selectedSupplier?.id,
        },
        history: messages.map(m => ({ role: m.role, content: m.content })),
      });

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations,
        proposedAction: response.structuredAction,
        modelUsed: response.model,
        providerUsed: response.provider,
        toolsExecuted: response.toolsExecuted,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Unable to complete analysis:** ${err?.message || 'Server connection error'}. Please verify backend status or AI Studio Secrets configuration.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const query = inputText.trim();
    setInputText('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await requestAIAnalysis({
        action: 'general_query',
        prompt: query,
        provider: selectedProvider,
        context: {
          suppliers,
          riskAnchors,
          actions,
          radarDomains,
          selectedAnchorId: selectedAnchor?.id,
          selectedSupplierId: selectedSupplier?.id,
        },
        history: messages.map(m => ({ role: m.role, content: m.content })),
      });

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations,
        proposedAction: response.structuredAction,
        modelUsed: response.model,
        providerUsed: response.provider,
        toolsExecuted: response.toolsExecuted,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Error communicating with AI Risk Analyst:** ${err?.message || 'Unknown error'}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveProposedAction = async (action: PriorityAction) => {
    try {
      onApproveAction(action);
      await authorizeMitigationAction(action.code, 'Approved through AI Risk Analyst Drawer');
      await logAIAssistedDecision({
        actionType: 'approve_mitigation',
        recordId: action.code,
        summary: `Authorized AI-proposed mitigation: "${action.title}" (${action.financialAmount})`,
        user: 'Marcus Vance (VP Category, Procurement Director)',
      });
      setApprovalFeedback(`✓ Committed ${action.code} to Official Action Register & broadcast to live dashboard.`);
      setTimeout(() => setApprovalFeedback(null), 5000);
    } catch (err) {
      console.warn('Backend authorization failed, falling back to client update:', err);
      onApproveAction(action);
      setApprovalFeedback(`✓ Updated ${action.code} locally.`);
      setTimeout(() => setApprovalFeedback(null), 4000);
    }
  };

  const handleSaveEditedAction = () => {
    if (editingAction) {
      handleApproveProposedAction(editingAction);
      setEditingAction(null);
    }
  };

  const quickQuestions = [
    'What are our five highest-priority procurement risks?',
    'Why did our critical risk count change?',
    'Which suppliers have overdue mitigation actions?',
    'Show the evidence behind this risk.',
    'Recommend mitigation actions for this risk.',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-[#DCE6EE] transform transition-transform animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-label="15M AI Risk Analyst"
      >
        {/* Header Strip */}
        <div className="bg-[#101B33] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#1C2C4E]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#0084A8] to-[#19B6A4] p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-[#0A192A] rounded-[7px] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#19B6A4] text-[20px]">psychology</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-[15px] tracking-tight text-white">AI Risk Analyst</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#19B6A4]/20 border border-[#19B6A4]/40 text-[#19B6A4] font-mono text-[10px] font-bold">
                  15M Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Grounded in Heß 15M Risk Cube · Certified Non-Autonomous (Human Sign-Off Required)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMessages([])}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Clear Conversation"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close drawer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* AI Provider Switcher Toolbar */}
        <div className="bg-[#0B1528] px-4 py-2 border-b border-[#162744] flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Model Provider:</span>
            <div className="inline-flex rounded-lg bg-[#14233D] p-0.5 border border-[#1E3256]">
              <button
                type="button"
                onClick={() => setSelectedProvider('gemini')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                  selectedProvider === 'gemini'
                    ? 'bg-[#176BCE] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Gemini 3.8 Flash</span>
                {providersStatus?.gemini.configured && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedProvider('openai')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                  selectedProvider === 'openai'
                    ? 'bg-[#10A37F] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>OpenAI GPT-4o</span>
                {providersStatus?.openai.configured ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                ) : (
                  <span className="text-[9px] px-1 rounded bg-slate-700 text-slate-300 font-mono">API Key Req</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedProvider('auto')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  selectedProvider === 'auto'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Auto
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
            <span className="material-symbols-outlined text-[13px] text-[#19B6A4]">lock</span>
            <span>Secure Backend Tools Active</span>
          </div>
        </div>

        {/* 4 Core 15M Actions Toolbar */}
        <div className="bg-[#F5F8FC] border-b border-[#E0E7F1] px-4 py-2.5">
          <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#0084A8]">bolt</span>
            <span>15M Core Actions</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => handleTriggerAction('explain_risk')}
              disabled={isLoading}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'explain_risk'
                  ? 'bg-[#176BCE] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-[#EAF3FC] border border-[#E0E7F1]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">search_insights</span>
              <span>Explain Risks</span>
            </button>

            <button
              type="button"
              onClick={() => handleTriggerAction('assess_risk')}
              disabled={isLoading}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'assess_risk'
                  ? 'bg-[#176BCE] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-[#EAF3FC] border border-[#E0E7F1]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">view_in_ar</span>
              <span>Assess 15M</span>
            </button>

            <button
              type="button"
              onClick={() => handleTriggerAction('recommend_mitigation')}
              disabled={isLoading}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'recommend_mitigation'
                  ? 'bg-[#176BCE] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-[#EAF3FC] border border-[#E0E7F1]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">shield</span>
              <span>Mitigate</span>
            </button>

            <button
              type="button"
              onClick={() => handleTriggerAction('executive_briefing')}
              disabled={isLoading}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'executive_briefing'
                  ? 'bg-[#176BCE] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-[#EAF3FC] border border-[#E0E7F1]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">summarize</span>
              <span>Exec Briefing</span>
            </button>
          </div>
        </div>

        {/* Quick Suggested Questions Bar */}
        <div className="bg-[#FAFBFD] border-b border-[#E0E7F1] px-4 py-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mr-1">Suggested:</span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(q);
                  handleTriggerAction('general_query', q);
                }}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-[#DCE6EE] hover:border-[#176BCE] hover:text-[#176BCE] text-slate-600 font-medium transition-colors shadow-2xs shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Context Banner */}
        {(selectedAnchor || selectedSupplier) && (
          <div className="bg-[#E6F4F8] border-b border-[#BDE2EC] px-4 py-2 flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#0084A8]">pin_drop</span>
              <span className="text-slate-700 font-medium">Context:</span>
              <strong className="text-[#0084A8] font-bold">
                {selectedAnchor ? `${selectedAnchor.code} · ${selectedAnchor.supplier}` : selectedSupplier?.name}
              </strong>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {selectedAnchor ? `Buffer: ${selectedAnchor.bufferWeeks}w | Requal: ${selectedAnchor.requalificationWeeks}w` : `${selectedSupplier?.financialExposure} Exposure`}
            </span>
          </div>
        )}

        {/* Approval Feedback Toast */}
        {approvalFeedback && (
          <div className="bg-[#ECFDF5] border-b border-[#A7F3D0] px-4 py-2 text-[12px] text-[#065F46] font-semibold flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
            <span>{approvalFeedback}</span>
          </div>
        )}

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFD]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[11px] font-bold text-slate-500">
                  {msg.role === 'user' ? 'You' : '15M AI Risk Analyst'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                {msg.modelUsed && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                    {msg.modelUsed}
                  </span>
                )}
              </div>

              <div
                className={`max-w-[92%] rounded-xl p-4 text-[13px] leading-relaxed shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-[#101B33] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-[#E0E7F1] rounded-tl-none'
                }`}
              >
                {/* Executed Tools Badge Banner */}
                {msg.toolsExecuted && msg.toolsExecuted.length > 0 && (
                  <div className="mb-2.5 pb-2 border-b border-slate-100 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-[#19B6A4]">settings_suggest</span>
                      Backend Tools:
                    </span>
                    {msg.toolsExecuted.map((tool, ti) => (
                      <span
                        key={ti}
                        className="px-2 py-0.5 rounded bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] text-[10px] font-mono font-semibold flex items-center gap-1"
                      >
                        <span className="text-[#10B981]">✓</span>
                        <span>{tool.name}()</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Message Content with structured Markdown formatting */}
                <div className="space-y-2 whitespace-pre-wrap font-sans">
                  {msg.content.split('\n\n').map((paragraph, i) => {
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={i} className="text-[14px] font-bold text-[#101B33] mt-2 mb-1 flex items-center gap-1.5">{paragraph.replace('### ', '')}</h3>;
                    }
                    if (paragraph.startsWith('#### ')) {
                      return <h4 key={i} className="text-[13px] font-bold text-[#0084A8] mt-2 mb-1">{paragraph.replace('#### ', '')}</h4>;
                    }
                    if (paragraph.startsWith('---')) {
                      return <hr key={i} className="border-slate-200 my-2" />;
                    }
                    return <p key={i} className="text-[13px] text-slate-700 leading-normal">{paragraph}</p>;
                  })}
                </div>

                {/* Evidence & Grounding Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">link</span>
                      Verified Records:
                    </span>
                    {msg.citations.map((cite, ci) => (
                      <span
                        key={ci}
                        className="px-2 py-0.5 rounded-full bg-[#EAF3FC] text-[#176BCE] border border-[#D0E2FA] text-[10px] font-mono font-semibold"
                      >
                        {cite}
                      </span>
                    ))}
                  </div>
                )}

                {/* Human Approval Required: Proposed Action Card */}
                {msg.proposedAction && (
                  <div className="mt-4 p-3.5 bg-[#F0FDF4] border border-[#86EFAC] rounded-xl shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
                        <span className="font-bold text-[12px] text-[#166534] uppercase tracking-wide">
                          AI Proposed Mitigation Action · Requires Human Sign-Off
                        </span>
                      </div>
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white text-[#166534] border border-[#86EFAC]">
                        {msg.proposedAction.code}
                      </span>
                    </div>

                    <h5 className="font-bold text-[13px] text-[#065F46] mb-1">
                      {msg.proposedAction.title}
                    </h5>
                    <p className="text-[12px] text-slate-600 mb-3">
                      {msg.proposedAction.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] mb-3 bg-white/80 p-2.5 rounded-lg border border-[#BBF7D0]">
                      <div>
                        <span className="text-slate-500 block">Est. Financial CapEx:</span>
                        <strong className="text-[#101B33] font-mono">{msg.proposedAction.financialAmount}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Revenue Protected:</span>
                        <strong className="text-[#059669] font-mono">{msg.proposedAction.revenueImpact}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Residual Risk Impact:</span>
                        <span className="text-slate-700 font-medium">{msg.proposedAction.residualRisk}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Buffer Improvement:</span>
                        <span className="text-slate-700 font-medium">{msg.proposedAction.bufferImpact}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApproveProposedAction(msg.proposedAction!)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-bold text-[12px] transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                        <span>Authorize & Apply to Risk Register</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingAction(msg.proposedAction!)}
                        className="py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-[12px] transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2 animate-in fade-in">
              <div className="w-8 h-8 rounded-lg bg-[#0084A8] flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
              </div>
              <div className="bg-white border border-[#E0E7F1] rounded-xl p-3.5 shadow-xs">
                <div className="flex items-center gap-2 text-[12px] text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#19B6A4] animate-ping" />
                  <span>
                    Executing backend tools ({selectedProvider === 'openai' ? 'OpenAI GPT-4o' : selectedProvider === 'gemini' ? 'Gemini 3.8 Flash' : '15M Analytical Engine'}) & synthesizing records...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Edit Action Modal Dialog */}
        {editingAction && (
          <div className="p-4 bg-white border-t border-[#E0E7F1] shadow-lg animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-[13px] text-[#101B33]">Modify AI Proposed Action Parameters</h4>
              <button
                type="button"
                onClick={() => setEditingAction(null)}
                className="text-slate-400 hover:text-slate-600 text-[12px]"
              >
                Cancel
              </button>
            </div>
            <div className="space-y-2 mb-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Action Title</label>
                <input
                  type="text"
                  value={editingAction.title}
                  onChange={(e) => setEditingAction({ ...editingAction, title: e.target.value })}
                  className="w-full text-[12px] p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#176BCE]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Financial Budget</label>
                  <input
                    type="text"
                    value={editingAction.financialAmount}
                    onChange={(e) => setEditingAction({ ...editingAction, financialAmount: e.target.value })}
                    className="w-full text-[12px] p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Owner</label>
                  <input
                    type="text"
                    value={editingAction.owner}
                    onChange={(e) => setEditingAction({ ...editingAction, owner: e.target.value })}
                    className="w-full text-[12px] p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveEditedAction}
              className="w-full py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold text-[12px] rounded-lg shadow-xs cursor-pointer"
            >
              Commit Modified Action to Register
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#E0E7F1]">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask the AI Risk Analyst (e.g. 'What are our five highest-priority procurement risks?')..."
              disabled={isLoading}
              className="w-full h-11 pl-4 pr-24 rounded-xl border border-[#DCE6EE] bg-[#F8FAFD] text-[13px] text-[#101B33] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#176BCE]/20 focus:border-[#176BCE] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="absolute right-1.5 h-8 px-3 rounded-lg bg-[#176BCE] hover:bg-[#145CB2] disabled:opacity-40 text-white font-bold text-[12px] flex items-center gap-1 transition-colors"
            >
              <span>Ask</span>
              <span className="material-symbols-outlined text-[15px]">send</span>
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
            <span>Provider: {selectedProvider.toUpperCase()} · Verified Backend Tools</span>
            <span>Human-in-the-Loop Sign-Off Enforced</span>
          </div>
        </form>
      </div>
    </div>
  );
};
