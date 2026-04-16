import { createHash } from "node:crypto";

export type StoredUser = {
  name: string;
  email: string;
  company: string;
  passwordHash: string;
  createdAt: string;
};

export type PublicUser = {
  name: string;
  email: string;
  company: string;
};

const usersByEmail = new Map<string, StoredUser>();

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

function toPublicUser(user: StoredUser): PublicUser {
  return {
    name: user.name,
    email: user.email,
    company: user.company,
  };
}

export function registerUser(input: {
  name: string;
  email: string;
  company: string;
  password: string;
}) {
  const email = normalizeEmail(input.email);

  if (usersByEmail.has(email)) {
    return { ok: false as const, code: "EXISTS" as const };
  }

  const user: StoredUser = {
    name: input.name.trim(),
    email,
    company: input.company.trim(),
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };

  usersByEmail.set(email, user);

  return {
    ok: true as const,
    user: toPublicUser(user),
  };
}

export function loginUser(input: { email: string; password: string }) {
  const email = normalizeEmail(input.email);
  const user = usersByEmail.get(email);

  if (!user) {
    return { ok: false as const, code: "INVALID_CREDENTIALS" as const };
  }

  const candidateHash = hashPassword(input.password);
  if (candidateHash !== user.passwordHash) {
    return { ok: false as const, code: "INVALID_CREDENTIALS" as const };
  }

  return {
    ok: true as const,
    user: toPublicUser(user),
  };
}
