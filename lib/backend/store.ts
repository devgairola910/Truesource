import { createHash, randomUUID } from "node:crypto";
import {
  alerts as seedAlerts,
  assets as seedAssets,
  candidates as seedCandidates,
  kpis as seedKpis,
  whitelistDomains as seedWhitelist,
} from "@/lib/mock-data";
import type {
  AuthUser,
  ContactInquiry,
  CreateAssetInput,
  CreateUserInput,
  CreateWhitelistInput,
  DashboardSnapshot,
  LoginInput,
  SessionRecord,
  StoreState,
  UpdateAlertStatusInput,
} from "@/lib/backend/types";
import { normalizeEmail } from "@/lib/backend/validators";

const store: StoreState = {
  users: new Map<string, AuthUser>(),
  sessions: new Map<string, SessionRecord>(),
  contactInquiries: [],
  assets: [...seedAssets],
  candidates: [...seedCandidates],
  alerts: [...seedAlerts],
  kpis: [...seedKpis],
  whitelistDomains: [...seedWhitelist],
};

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export function createUser(input: CreateUserInput) {
  const email = normalizeEmail(input.email);

  if (store.users.has(email)) {
    return {
      ok: false as const,
      reason: "EMAIL_EXISTS" as const,
    };
  }

  const user: AuthUser = {
    id: randomUUID(),
    name: input.name.trim(),
    email,
    company: input.company.trim(),
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };

  store.users.set(email, user);

  return {
    ok: true as const,
    user,
  };
}

export function authenticateUser(input: LoginInput) {
  const email = normalizeEmail(input.email);
  const existing = store.users.get(email);

  if (!existing) {
    return {
      ok: false as const,
      reason: "INVALID_CREDENTIALS" as const,
    };
  }

  const matches = hashPassword(input.password) === existing.passwordHash;
  if (!matches) {
    return {
      ok: false as const,
      reason: "INVALID_CREDENTIALS" as const,
    };
  }

  return {
    ok: true as const,
    user: existing,
  };
}

export function createSession(userId: string) {
  const token = randomUUID();
  const session: SessionRecord = {
    token,
    userId,
    createdAt: new Date().toISOString(),
  };

  store.sessions.set(token, session);
  return session;
}

export function getSession(token: string) {
  return store.sessions.get(token);
}

export function deleteSession(token: string) {
  return store.sessions.delete(token);
}

export function getUserById(id: string) {
  for (const user of store.users.values()) {
    if (user.id === id) {
      return user;
    }
  }

  return undefined;
}

export function listAssets() {
  return [...store.assets];
}

export function addAsset(input: CreateAssetInput) {
  const asset = {
    id: `AST-${Math.floor(Math.random() * 9000) + 1000}`,
    title: input.title.trim(),
    kind: input.kind,
    rightsOwner: input.rightsOwner.trim(),
    distributedTo: input.distributedTo.trim(),
    status: "fingerprinting" as const,
    lastUpdated: "just now",
  };

  store.assets = [asset, ...store.assets];
  return asset;
}

export function listCandidates() {
  return [...store.candidates];
}

export function listAlerts() {
  return [...store.alerts];
}

export function updateAlertStatus(alertId: string, input: UpdateAlertStatusInput) {
  let updated = null as (typeof store.alerts)[number] | null;

  store.alerts = store.alerts.map((alert) => {
    if (alert.id !== alertId) {
      return alert;
    }

    updated = { ...alert, status: input.status };
    return updated;
  });

  return updated;
}

export function listWhitelistDomains() {
  return [...store.whitelistDomains];
}

export function addWhitelistDomain(input: CreateWhitelistInput) {
  const domain = input.domain.trim().toLowerCase();
  const existing = store.whitelistDomains.find((entry) => entry.domain === domain);

  if (existing) {
    return {
      ok: false as const,
      reason: "DOMAIN_EXISTS" as const,
    };
  }

  const record = {
    domain,
    owner: input.owner.trim(),
    reason: input.reason.trim(),
  };

  store.whitelistDomains = [record, ...store.whitelistDomains];

  return {
    ok: true as const,
    record,
  };
}

export function removeWhitelistDomain(domain: string) {
  const normalized = domain.trim().toLowerCase();
  const before = store.whitelistDomains.length;
  store.whitelistDomains = store.whitelistDomains.filter(
    (entry) => entry.domain !== normalized,
  );

  return before !== store.whitelistDomains.length;
}

export function listKpis() {
  return [...store.kpis];
}

export function createDashboardSnapshot(): DashboardSnapshot {
  const openAlerts = store.alerts.filter((alert) => alert.status === "new").length;
  const confirmedToday = store.alerts.filter(
    (alert) => alert.status === "confirmed",
  ).length;

  return {
    metrics: [
      { label: "Open Alerts", value: String(openAlerts) },
      { label: "Confirmed Today", value: String(confirmedToday) },
      { label: "Suppressed Sources", value: String(store.whitelistDomains.length) },
      {
        label: "Monitored Candidates",
        value: String(store.candidates.length),
      },
    ],
    recentAlerts: store.alerts.slice(0, 5),
  };
}

export function saveContactInquiry(inquiry: Omit<ContactInquiry, "id" | "createdAt">) {
  const record: ContactInquiry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...inquiry,
  };

  store.contactInquiries = [record, ...store.contactInquiries];
  return record;
}

export function listContactInquiries() {
  return [...store.contactInquiries];
}
