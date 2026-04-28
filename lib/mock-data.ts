export type AssetKind = "image" | "video";

export type AssetRecord = {
  id: string;
  title: string;
  kind: AssetKind;
  rightsOwner: string;
  distributedTo: string;
  status: "protected" | "fingerprinting";
  lastUpdated: string;
  url?: string;
  fingerprintId?: string | null;
  pHash?: string | null;
  userId?: string;
};

export type CandidateRecord = {
  id: string;
  sourceDomain: string;
  sourceUrl: string;
  extractedAt: string;
  mediaType: AssetKind;
  stage: "prefiltered" | "deep-match" | "queued-alert";
  signalSummary: string;
};

export type EvidenceSignal = {
  label: string;
  score: number;
};

export type AlertStatus = "new" | "confirmed" | "dismissed" | "whitelisted";

export type AlertRecord = {
  id: string;
  title: string;
  sourceDomain: string;
  sourceUrl: string;
  matchedAssetId: string;
  matchedAssetTitle: string;
  severity: "critical" | "high" | "medium";
  detectedAt: string;
  status: AlertStatus;
  evidence: EvidenceSignal[];
  recommendedAction: string;
};

export type KpiRecord = {
  id: string;
  label: string;
  value: string;
  target: string;
  trend: "up" | "down" | "neutral";
};

export type WhitelistDomain = {
  domain: string;
  owner: string;
  reason: string;
};

export const assets: AssetRecord[] = [];
export const candidates: CandidateRecord[] = [];
export const alerts: AlertRecord[] = [];
export const kpis: KpiRecord[] = [];
export const whitelistDomains: WhitelistDomain[] = [];
