import type {
  AlertRecord,
  AlertStatus,
  AssetRecord,
  CandidateRecord,
  KpiRecord,
  WhitelistDomain,
} from "@/lib/mock-data";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  company: string;
  passwordHash: string;
  createdAt: string;
};

export type SessionRecord = {
  token: string;
  userId: string;
  createdAt: string;
};

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  createdAt: string;
};

export type DashboardMetric = {
  label: string;
  value: string;
};

export type DashboardSnapshot = {
  metrics: DashboardMetric[];
  recentAlerts: AlertRecord[];
};

export type StoreState = {
  users: Map<string, AuthUser>;
  sessions: Map<string, SessionRecord>;
  contactInquiries: ContactInquiry[];
  assets: AssetRecord[];
  candidates: CandidateRecord[];
  alerts: AlertRecord[];
  kpis: KpiRecord[];
  whitelistDomains: WhitelistDomain[];
};

export type CreateUserInput = {
  name: string;
  email: string;
  company: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type CreateAssetInput = {
  title: string;
  kind: AssetRecord["kind"];
  rightsOwner: string;
  distributedTo: string;
};

export type CreateWhitelistInput = {
  domain: string;
  owner: string;
  reason: string;
};

export type UpdateAlertStatusInput = {
  status: AlertStatus;
};
