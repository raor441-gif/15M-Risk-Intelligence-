export type RiskSeverity = 1 | 2 | 3 | 4 | 5;
export type RiskLikelihood = 1 | 2 | 3 | 4 | 5;

export type Timeframe = 'Q3 2024' | 'TTM Projected' | 'Stress Case (95% CI)';

// 15M Architecture Strategy Partitions (SP1 - SP5)
export type StrategyPartition = 
  | 'SP1 - Procurement Framework Strategy'
  | 'SP2 - Category Strategies'
  | 'SP3 - Supplier Strategies'
  | 'SP4 - Process & Digital Strategies'
  | 'SP5 - Procurement Management System';

// 15M 3 Approaches
export type RMApproach = 'Cause-oriented RM' | 'Impact-oriented RM' | 'Resilience in the crisis';

// 9 Tier-1 Risk Categories defined by Prof. Dr. Gerhard Heß in 15M White Paper
export type Tier1RiskCategory =
  | 'Supply risks'
  | 'Failure risks'
  | 'Cost risks'
  | 'Quality risks'
  | 'Know-how and innovation risks'
  | 'Financial risks'
  | 'Sustainability and compliance risks'
  | 'Dependency risks'
  | 'Performance risks';

// Building Blocks 1 to 7
export interface BuildingBlock {
  id: number;
  title: string;
  subtitle: string;
  approach: RMApproach;
  level: string;
  description: string;
  coreTools: string[];
  keyOutputs: string[];
}

export interface RiskAnchor {
  id: string;
  code: string;
  supplier: string;
  material: string;
  category: string;
  likelihood: RiskLikelihood;
  severity: RiskSeverity;
  score: number;
  revenueAtRisk: string;
  spendAtRisk: string;
  status: 'critical' | 'high' | 'medium' | 'low';
  osapiensAlert: string;
  bufferWeeks: number;
  requalificationWeeks: number;
  description: string;
}

export interface RadarDomain {
  name: string;
  slug: string;
  score: number;
  target: number;
  weight: number;
  category: 'Severe' | 'Moderate' | 'Controlled';
  description: string;
  keyDrivers: string[];
}

export interface PriorityAction {
  id: string;
  code: string;
  category: string;
  title: string;
  description: string;
  owner: string;
  revenueImpact: string;
  financialAmount: string;
  residualRisk: string;
  bufferImpact: string;
  status: 'pending' | 'authorized' | 'frozen' | 'in_review';
  urgency: 'overdue' | 'warning' | 'normal';
  urgencyLabel: string;
  actionButtonLabel: string;
  secondaryButtonLabel: string;
}

export interface SupplierItem {
  id: string;
  name: string;
  code: string;
  tier: string;
  location: string;
  isSoleSource: boolean;
  material: string;
  materialSku: string;
  category: string;
  businessUnit: string;
  bufferWeeks: number;
  gapWeeks: number;
  bufferProgress: number; // percentage
  financialExposure: string;
  spend: string;
  osapiensSignal: {
    type: 'alert' | 'warning' | 'positive';
    label: string;
  };
  status: 'critical' | 'high' | 'medium' | 'ramping';
  contactPerson?: string;
  creditRating?: string;
  esgScore?: number;
}
