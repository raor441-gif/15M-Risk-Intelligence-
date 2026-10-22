/**
 * Sourcing Champions · AI Risk Analyst Client Service
 * Communicates with the secure backend server at /api/ai/analyze & /api/dashboard/metrics
 * Grounded in 15M Architecture Risk Cube methodology
 * Supports Google Gemini and OpenAI (Responses API & GPT-4o)
 */

import { SupplierItem, PriorityAction, RadarDomain, RiskAnchor } from '../types';

export type AIAnalystAction = 
  | 'explain_risk'
  | 'assess_risk'
  | 'recommend_mitigation'
  | 'executive_briefing'
  | 'general_query';

export type AIProvider = 'gemini' | 'openai' | 'auto';

export interface AIAnalysisRequest {
  action: AIAnalystAction;
  prompt?: string;
  provider?: AIProvider;
  context: {
    suppliers: SupplierItem[];
    riskAnchors: RiskAnchor[];
    actions: PriorityAction[];
    radarDomains: RadarDomain[];
    selectedAnchorId?: string;
    selectedSupplierId?: string;
  };
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface AIAnalysisResponse {
  text: string;
  citations: string[];
  structuredAction?: PriorityAction;
  model: string;
  provider?: string;
  toolsExecuted?: Array<{ name: string; args: any }>;
  status: 'success' | 'error';
  notice?: string;
}

export interface ProviderInfo {
  name: string;
  model: string;
  configured: boolean;
  badge: string;
  supportsResponsesApi?: boolean;
}

export interface AIProvidersStatus {
  gemini: ProviderInfo;
  openai: ProviderInfo;
  defaultProvider: AIProvider;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actionType: string;
  recordId?: string;
  summary: string;
  user: string;
  aiSuggested: boolean;
}

export interface LiveDashboardMetrics {
  totalActiveRisks: number;
  severityBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  official15MCategories: Record<string, { count: number; exposureEurM: number }>;
  criticalSuppliersCount: number;
  criticalSuppliers: Array<{
    name: string;
    material: string;
    exposure: string;
    bufferWeeks: number;
  }>;
  totalRevenueExposure: string;
  totalSpendAtRisk: string;
  overdueMitigationsCount: number;
  overdueActions: Array<{
    id: string;
    code: string;
    title: string;
    urgencyLabel: string;
    amount: string;
    owner: string;
  }>;
  openAlertsCount: number;
  recentAlerts: Array<{
    id: string;
    type: 'critical' | 'warning' | 'positive';
    title: string;
    timeAgo: string;
    timestamp: string;
    desc: string;
  }>;
  historicalChangeLog: Array<{
    date: string;
    label: string;
    totalRisks: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    totalExposureEurM: number;
    events?: string[];
  }>;
  lastUpdated: string;
  isSyntheticData: boolean;
  dataSourceNote: string;
}

export async function requestAIAnalysis(payload: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  try {
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'procurement_director',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.notice || errData?.message || `AI Analyst service returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('AI Risk Analyst service error:', err);
    throw err;
  }
}

export async function fetchAIProviders(): Promise<AIProvidersStatus> {
  try {
    const res = await fetch('/api/ai/providers');
    if (!res.ok) throw new Error('Failed to load AI providers');
    return await res.json();
  } catch {
    return {
      gemini: { name: 'Google Gemini', model: 'gemini-3.8-flash', configured: false, badge: 'Needs GEMINI_API_KEY' },
      openai: { name: 'OpenAI', model: 'gpt-4o', configured: false, badge: 'Needs OPENAI_API_KEY' },
      defaultProvider: 'fallback' as AIProvider,
    };
  }
}

export async function fetchDashboardMetrics(): Promise<LiveDashboardMetrics> {
  const res = await fetch('/api/dashboard/metrics', {
    headers: { 'x-user-role': 'procurement_director' }
  });
  if (!res.ok) {
    throw new Error(`Failed to load metrics: HTTP ${res.status}`);
  }
  return await res.json();
}

export async function authorizeMitigationAction(actionId: string, notes?: string): Promise<{ success: boolean; action?: PriorityAction }> {
  try {
    const res = await fetch(`/api/actions/${actionId}/authorize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: 'Marcus Vance (VP Category, Procurement Director)',
        notes: notes || 'Authorized in Procurement Command Center',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to authorize action:', err);
    throw err;
  }
}

export async function logAIAssistedDecision(entry: {
  actionType: 'approve_mitigation' | 'reject_mitigation' | 'modify_risk' | 'executive_briefing_exported';
  recordId?: string;
  summary: string;
  user?: string;
}): Promise<boolean> {
  try {
    const res = await fetch('/api/ai/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to log AI decision to audit trail:', err);
    return false;
  }
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  try {
    const res = await fetch('/api/ai/audit-logs');
    if (!res.ok) return [];
    const data = await res.json();
    return data.logs || [];
  } catch (err) {
    console.warn('Failed to fetch audit logs:', err);
    return [];
  }
}

export interface OpenAITestResult {
  success: boolean;
  keyConfigured: boolean;
  model?: string;
  reply?: string;
  status?: number;
  code?: string;
  type?: string;
  errorCategory?: string;
  message?: string;
  fix?: string;
  timestamp: string;
}

export async function testOpenAIConnection(): Promise<OpenAITestResult> {
  try {
    const res = await fetch('/api/ai/test-openai', { method: 'POST' });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      keyConfigured: false,
      message: err.message || 'Failed to connect to test endpoint',
      timestamp: new Date().toISOString(),
    };
  }
}

