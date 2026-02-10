
export interface ChannelData {
  id: string;
  name: string;
  dailyLeads: number;
  unresolvedLeads: number;
  icon: string;
}

export interface HumanConfig {
  costPerAgentMonth: number;
  convsPerAgentDay: number;
  daysPerMonth: number;
}

export interface ModelBConfig extends HumanConfig {
  aiResolutionRate: number;
  avgAiMinutes: number;
  costPerAiMinute: number;
}
