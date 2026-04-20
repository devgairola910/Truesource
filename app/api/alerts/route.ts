import { listAlerts } from "@/lib/backend/store";
import { jsonOk, requireAuth } from "@/lib/backend/http";

export async function GET(request: Request) {
  const auth = requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status");

  const alerts = listAlerts().filter((alert) => {
    if (!statusFilter) {
      return true;
    }

    return alert.status === statusFilter;
  });

  return jsonOk({ alerts });
}
