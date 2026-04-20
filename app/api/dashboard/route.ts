import { createDashboardSnapshot } from "@/lib/backend/store";
import { jsonOk, requireAuth } from "@/lib/backend/http";

export async function GET(request: Request) {
  const auth = requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  return jsonOk({ snapshot: createDashboardSnapshot() });
}
