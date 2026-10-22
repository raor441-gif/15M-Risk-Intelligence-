/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, ScreenId } from './components/Sidebar';
import { StickyHeader } from './components/StickyHeader';
import { Footer } from './components/Footer';
import { DynamicBackground } from './components/DynamicBackground';

// Screens
import { LandingScreen } from './screens/LandingScreen';
import { OverviewScreen } from './screens/OverviewScreen';
import { FifteenMCubeScreen } from './screens/FifteenMCubeScreen';
import { RiskMapScreen } from './screens/RiskMapScreen';
import { RiskRadarScreen } from './screens/RiskRadarScreen';
import { SuppliersScreen } from './screens/SuppliersScreen';
import { MaterialsScreen } from './screens/MaterialsScreen';
import { ActionCentreScreen } from './screens/ActionCentreScreen';
import { AboutScreen } from './screens/AboutScreen';
import { ContactScreen } from './screens/ContactScreen';

// Modals
import { RecordRiskModal } from './components/modals/RecordRiskModal';
import { ExportBriefingModal } from './components/modals/ExportBriefingModal';
import { SearchModal } from './components/modals/SearchModal';
import { CalibrateWeightsModal } from './components/modals/CalibrateWeightsModal';
import { PrivacyPolicyModal } from './components/modals/PrivacyPolicyModal';
import { ActionDetailModal } from './components/modals/ActionDetailModal';
import { SupplierDetailModal } from './components/modals/SupplierDetailModal';
import { AiRiskAnalystDrawer } from './components/ai/AiRiskAnalystDrawer';
import { AIAnalystAction } from './services/aiAnalystService';

// Mock Data & Types
import { 
  initialSuppliers, 
  initialActions, 
  initialRadarDomains, 
  riskAnchors as initialAnchors 
} from './data/mockData';
import { SupplierItem, PriorityAction, RadarDomain, RiskAnchor, Timeframe, RiskLikelihood, RiskSeverity } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('landing');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<Timeframe>('Q3 2024');

  // Interactive application state
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(initialSuppliers);
  const [actions, setActions] = useState<PriorityAction[]>(initialActions);
  const [radarDomains, setRadarDomains] = useState<RadarDomain[]>(initialRadarDomains);
  const [riskAnchors, setRiskAnchors] = useState<RiskAnchor[]>(initialAnchors);

  // Search query & modal states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [recordRiskOpen, setRecordRiskOpen] = useState(false);
  const [exportBriefingOpen, setExportBriefingOpen] = useState(false);
  const [calibrateWeightsOpen, setCalibrateWeightsOpen] = useState(false);
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

  // AI Risk Analyst Drawer State
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiInitialAction, setAiInitialAction] = useState<AIAnalystAction | undefined>(undefined);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);
  const [aiSelectedAnchor, setAiSelectedAnchor] = useState<RiskAnchor | null>(null);
  const [aiSelectedSupplier, setAiSelectedSupplier] = useState<SupplierItem | null>(null);

  // Active item inspection
  const [inspectedAction, setInspectedAction] = useState<PriorityAction | null>(null);
  const [inspectedSupplier, setInspectedSupplier] = useState<SupplierItem | null>(null);

  // Keyboard shortcut for Cmd+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setRecordRiskOpen(false);
        setExportBriefingOpen(false);
        setCalibrateWeightsOpen(false);
        setPrivacyPolicyOpen(false);
        setInspectedAction(null);
        setInspectedSupplier(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Action authorization handler
  const handleExecuteAction = (action: PriorityAction) => {
    setActions((prev) =>
      prev.map((a) => (a.id === action.id || a.code === action.code ? { ...a, status: 'authorized' } : a))
    );

    // If authorizing Tavira CapEx, update Tavira status
    if (action.code === 'ACTION-409') {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === 'supp-5'
            ? { ...s, status: 'ramping', financialExposure: 'Mitigated €38.4M', bufferProgress: 90 }
            : s
        )
      );
    }
  };

  // 15M AI Analyst triggers & human approval workflow
  const handleOpenAIAnalyst = (
    action?: AIAnalystAction,
    prompt?: string,
    item?: RiskAnchor | SupplierItem | null
  ) => {
    setAiInitialAction(action);
    setAiInitialPrompt(prompt);
    if (item && 'likelihood' in item) {
      setAiSelectedAnchor(item as RiskAnchor);
      setAiSelectedSupplier(null);
    } else if (item && 'tier' in item) {
      setAiSelectedSupplier(item as SupplierItem);
      setAiSelectedAnchor(null);
    } else {
      setAiSelectedAnchor(null);
      setAiSelectedSupplier(null);
    }
    setAiDrawerOpen(true);
  };

  const handleApproveAIAction = (newAction: PriorityAction) => {
    setActions((prev) => {
      const existingIndex = prev.findIndex((a) => a.code === newAction.code);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...newAction, status: 'authorized' };
        return updated;
      }
      return [{ ...newAction, status: 'pending' }, ...prev];
    });

    if (newAction.code === 'ACTION-409' || newAction.title.includes('Tavira')) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === 'supp-5'
            ? { ...s, status: 'ramping', financialExposure: 'Mitigated €38.4M', bufferProgress: 90 }
            : s
        )
      );
    }
  };

  // Add new risk entry
  const handleAddRisk = (newRisk: {
    supplier: string;
    material: string;
    category: string;
    businessUnit: string;
    likelihood: RiskLikelihood;
    severity: RiskSeverity;
    financialExposure: string;
    bufferWeeks: number;
    description: string;
  }) => {
    const id = `supp-${Date.now()}`;
    const newSupplierItem: SupplierItem = {
      id,
      name: newRisk.supplier,
      code: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      tier: 'Tier 1 Monitored',
      location: 'EU / Global',
      isSoleSource: true,
      material: newRisk.material,
      materialSku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newRisk.category,
      businessUnit: newRisk.businessUnit,
      bufferWeeks: newRisk.bufferWeeks,
      gapWeeks: 20,
      bufferProgress: Math.min(newRisk.bufferWeeks * 5, 100),
      financialExposure: newRisk.financialExposure,
      spend: '€10.5M',
      osapiensSignal: {
        type: 'alert',
        label: '15M Early Telemetry Intake',
      },
      status: 'critical',
      creditRating: 'BBB',
      esgScore: 82,
    };

    setSuppliers((prev) => [newSupplierItem, ...prev]);

    const newAnchorItem: RiskAnchor = {
      id: `R-${Math.floor(200 + Math.random() * 800)}`,
      code: `R-${Math.floor(200 + Math.random() * 800)}`,
      supplier: newRisk.supplier,
      material: newRisk.material,
      category: newRisk.category,
      likelihood: newRisk.likelihood,
      severity: newRisk.severity,
      score: newRisk.likelihood * newRisk.severity,
      revenueAtRisk: newRisk.financialExposure,
      spendAtRisk: '€10.5M',
      status: 'critical',
      osapiensAlert: '15M Telemetry Intake',
      bufferWeeks: newRisk.bufferWeeks,
      requalificationWeeks: 20,
      description: newRisk.description || 'Monitored under 15M early-warning protocols.',
    };

    setRiskAnchors((prev) => [newAnchorItem, ...prev]);
  };

  const pendingActionCount = actions.filter((a) => a.status === 'pending').length;

  return (
    <div className={`min-h-screen text-[#0A192A] relative transition-colors duration-500 ${currentScreen === 'landing' ? 'bg-[#040B16]' : 'bg-[#F4F8FA] mesh-background'}`}>
      {/* Living Dynamic Background with Ambient Gradients and Telemetry Lines */}
      <DynamicBackground variant={currentScreen === 'landing' ? 'full' : 'subtle'} />

      {/* Midnight Navy Sidebar with Mobile Drawer */}
      <Sidebar
        currentScreen={currentScreen}
        onSelectScreen={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        actionCount={pendingActionCount}
        onOpenAIAnalyst={() => handleOpenAIAnalyst()}
      />

      {/* Main Content Area (Offset by Sidebar on Desktop) */}
      <div className="pl-0 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Sticky Top Navigation Menu */}
        <StickyHeader
          currentScreen={currentScreen}
          onSelectScreen={(screen) => {
            setCurrentScreen(screen);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenRecordRisk={() => setRecordRiskOpen(true)}
          onOpenExportBriefing={() => setExportBriefingOpen(true)}
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenAIAnalyst={() => handleOpenAIAnalyst()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Main Content Viewport */}
        <main className="relative pt-16 flex-1">
          {currentScreen === 'landing' && (
            <LandingScreen
              onNavigate={(screen) => {
                setCurrentScreen(screen);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenRecordRisk={() => setRecordRiskOpen(true)}
            />
          )}

          {currentScreen === 'overview' && (
            <OverviewScreen
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              onOpenCalibrateWeights={() => setCalibrateWeightsOpen(true)}
              onOpenRecordRisk={() => setRecordRiskOpen(true)}
              onOpenExportBriefing={() => setExportBriefingOpen(true)}
              suppliers={suppliers}
              actions={actions}
              radarDomains={radarDomains}
              riskAnchors={riskAnchors}
              onExecuteAction={handleExecuteAction}
              onInspectAction={(action) => setInspectedAction(action)}
              onInspectSupplier={(supplier) => setInspectedSupplier(supplier)}
              onInspectRiskAnchor={(anchor) => {
                const supp = suppliers.find((s) => s.name.includes(anchor.supplier) || anchor.supplier.includes(s.name));
                if (supp) setInspectedSupplier(supp);
              }}
              onNavigateToRiskMap={() => setCurrentScreen('risk-map')}
              onNavigateToSuppliers={() => setCurrentScreen('suppliers')}
              onTriggerAI={(act, prompt) => handleOpenAIAnalyst(act, prompt)}
            />
          )}

          {currentScreen === '15m-cube' && (
            <FifteenMCubeScreen
              onNavigateToRiskMap={() => setCurrentScreen('risk-map')}
              onNavigateToRadar={() => setCurrentScreen('risk-radar')}
              onNavigateToSuppliers={() => setCurrentScreen('suppliers')}
            />
          )}

          {currentScreen === 'risk-map' && (
            <RiskMapScreen
              riskAnchors={riskAnchors}
              onInspectRiskAnchor={(anchor) => {
                const supp = suppliers.find((s) => s.name.includes(anchor.supplier) || anchor.supplier.includes(s.name));
                if (supp) setInspectedSupplier(supp);
              }}
              onTriggerAI={(act, prompt, anchor) => handleOpenAIAnalyst(act, prompt, anchor)}
            />
          )}

          {currentScreen === 'risk-radar' && (
            <RiskRadarScreen
              domains={radarDomains}
              onOpenCalibrateWeights={() => setCalibrateWeightsOpen(true)}
              onTriggerAI={(act, prompt) => handleOpenAIAnalyst(act, prompt)}
            />
          )}

          {currentScreen === 'resilience' && (
            <RiskRadarScreen
              domains={radarDomains}
              onOpenCalibrateWeights={() => setCalibrateWeightsOpen(true)}
              onTriggerAI={(act, prompt) => handleOpenAIAnalyst(act, prompt)}
            />
          )}

          {currentScreen === 'crisis-readiness' && (
            <RiskMapScreen
              riskAnchors={riskAnchors}
              onInspectRiskAnchor={(anchor) => {
                const supp = suppliers.find((s) => s.name.includes(anchor.supplier) || anchor.supplier.includes(s.name));
                if (supp) setInspectedSupplier(supp);
              }}
              onTriggerAI={(act, prompt, anchor) => handleOpenAIAnalyst(act, prompt, anchor)}
            />
          )}

          {currentScreen === 'suppliers' && (
            <SuppliersScreen
              suppliers={suppliers}
              onInspectSupplier={(supplier) => setInspectedSupplier(supplier)}
              onTriggerAI={(act, prompt, supplier) => handleOpenAIAnalyst(act, prompt, supplier)}
            />
          )}

          {currentScreen === 'materials' && (
            <MaterialsScreen
              suppliers={suppliers}
              onInspectSupplier={(supplier) => setInspectedSupplier(supplier)}
            />
          )}

          {currentScreen === 'categories' && (
            <MaterialsScreen
              suppliers={suppliers}
              onInspectSupplier={(supplier) => setInspectedSupplier(supplier)}
            />
          )}

          {currentScreen === 'financial-exposure' && (
            <OverviewScreen
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              onOpenCalibrateWeights={() => setCalibrateWeightsOpen(true)}
              onOpenRecordRisk={() => setRecordRiskOpen(true)}
              onOpenExportBriefing={() => setExportBriefingOpen(true)}
              suppliers={suppliers}
              actions={actions}
              radarDomains={radarDomains}
              riskAnchors={riskAnchors}
              onExecuteAction={handleExecuteAction}
              onInspectAction={(action) => setInspectedAction(action)}
              onInspectSupplier={(supplier) => setInspectedSupplier(supplier)}
              onInspectRiskAnchor={(anchor) => {
                const supp = suppliers.find((s) => s.name.includes(anchor.supplier) || anchor.supplier.includes(s.name));
                if (supp) setInspectedSupplier(supp);
              }}
              onNavigateToRiskMap={() => setCurrentScreen('risk-map')}
              onNavigateToSuppliers={() => setCurrentScreen('suppliers')}
              onTriggerAI={(act, prompt) => handleOpenAIAnalyst(act, prompt)}
            />
          )}

          {currentScreen === 'action-centre' && (
            <ActionCentreScreen
              actions={actions}
              onExecuteAction={handleExecuteAction}
              onInspectAction={(action) => setInspectedAction(action)}
            />
          )}

          {currentScreen === 'reports-audit' && (
            <OverviewScreen
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              onOpenCalibrateWeights={() => setCalibrateWeightsOpen(true)}
              onOpenRecordRisk={() => setRecordRiskOpen(true)}
              onOpenExportBriefing={() => setExportBriefingOpen(true)}
              suppliers={suppliers}
              actions={actions}
              radarDomains={radarDomains}
              riskAnchors={riskAnchors}
              onExecuteAction={handleExecuteAction}
              onInspectAction={(action) => setInspectedAction(action)}
              onInspectSupplier={(supplier) => setInspectedSupplier(supplier)}
              onInspectRiskAnchor={(anchor) => {
                const supp = suppliers.find((s) => s.name.includes(anchor.supplier) || anchor.supplier.includes(s.name));
                if (supp) setInspectedSupplier(supp);
              }}
              onNavigateToRiskMap={() => setCurrentScreen('risk-map')}
              onNavigateToSuppliers={() => setCurrentScreen('suppliers')}
              onTriggerAI={(act, prompt) => handleOpenAIAnalyst(act, prompt)}
            />
          )}

          {currentScreen === 'governance-system' && (
            <AboutScreen />
          )}

          {currentScreen === 'about' && (
            <AboutScreen />
          )}

          {currentScreen === 'contact' && (
            <ContactScreen />
          )}
        </main>

        {/* Footer Section with Copyright, Privacy Policy, and Social Links */}
        <Footer
          onOpenPrivacyPolicy={() => setPrivacyPolicyOpen(true)}
          onOpenAbout={() => {
            setCurrentScreen('about');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenContact={() => {
            setCurrentScreen('contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

      </div>

      {/* Global Interactive Modals */}
      <RecordRiskModal
        isOpen={recordRiskOpen}
        onClose={() => setRecordRiskOpen(false)}
        onSubmit={handleAddRisk}
      />

      <ExportBriefingModal
        isOpen={exportBriefingOpen}
        onClose={() => setExportBriefingOpen(false)}
        criticalCount={riskAnchors.length}
        revenueAtRisk="€112.5M"
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        suppliers={suppliers}
        actions={actions}
        anchors={riskAnchors}
        onSelectSupplier={(supplier) => {
          setInspectedSupplier(supplier);
        }}
        onSelectAction={(action) => {
          setInspectedAction(action);
        }}
      />

      <CalibrateWeightsModal
        isOpen={calibrateWeightsOpen}
        onClose={() => setCalibrateWeightsOpen(false)}
        domains={radarDomains}
        onSaveDomains={(updated) => setRadarDomains(updated)}
      />

      <PrivacyPolicyModal
        isOpen={privacyPolicyOpen}
        onClose={() => setPrivacyPolicyOpen(false)}
      />

      <ActionDetailModal
        action={inspectedAction}
        onClose={() => setInspectedAction(null)}
        onExecute={handleExecuteAction}
      />

      <SupplierDetailModal
        supplier={inspectedSupplier}
        onClose={() => setInspectedSupplier(null)}
      />

      {/* 15M AI Risk Analyst Drawer */}
      <AiRiskAnalystDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        suppliers={suppliers}
        riskAnchors={riskAnchors}
        actions={actions}
        radarDomains={radarDomains}
        initialAction={aiInitialAction}
        initialPrompt={aiInitialPrompt}
        selectedAnchor={aiSelectedAnchor}
        selectedSupplier={aiSelectedSupplier}
        onApproveAction={handleApproveAIAction}
        onInspectSupplier={(supplier) => setInspectedSupplier(supplier)}
        onInspectRiskAnchor={(anchor) => {
          const supp = suppliers.find((s) => s.name.includes(anchor.supplier) || anchor.supplier.includes(s.name));
          if (supp) setInspectedSupplier(supp);
        }}
      />
    </div>
  );
}
