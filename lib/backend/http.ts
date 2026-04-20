import { NextResponse } from "next/server";
import {
  getSession,
  getUserById,
} from "@/lib/backend/store";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    ...init,
  });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export function extractBearerToken(request: Request) {
  const header = request.headers.get("authorization");
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token.trim();
}

export function requireAuth(request: Request) {
  const token = extractBearerToken(request);
  if (!token) {
    return {
      ok: false as const,
      response: jsonError("Authorization token is missing.", 401),
    };
  }

  const session = getSession(token);
  if (!session) {
    return {
      ok: false as const,
      response: jsonError("Session is invalid or expired.", 401),
    };
  }

  const user = getUserById(session.userId);
  if (!user) {
    return {
      ok: false as const,
      response: jsonError("Session user no longer exists.", 401),
    };
  }

  return {
    ok: true as const,
    user,
    session,
    token,
  };
}
