import { addAsset, listAssets } from "@/lib/backend/store";
import { jsonError, jsonOk, requireAuth } from "@/lib/backend/http";
import { toNonEmptyString } from "@/lib/backend/validators";

type AssetPayload = {
  title?: unknown;
  kind?: unknown;
  rightsOwner?: unknown;
  distributedTo?: unknown;
};

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  return jsonOk({ assets: await listAssets() });
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  let body: AssetPayload;
  try {
    body = (await request.json()) as AssetPayload;
  } catch {
    return jsonError("Invalid request payload.", 400);
  }

  const title = toNonEmptyString(body.title);
  const kind = toNonEmptyString(body.kind);
  const rightsOwner = toNonEmptyString(body.rightsOwner);
  const distributedTo = toNonEmptyString(body.distributedTo);

  if (!title || !kind || !rightsOwner || !distributedTo) {
    return jsonError("title, kind, rightsOwner, and distributedTo are required.", 400);
  }

  if (kind !== "image" && kind !== "video") {
    return jsonError("kind must be either image or video.", 400);
  }

  const asset = await addAsset({
    title,
    kind,
    rightsOwner,
    distributedTo,
  });

  return jsonOk({ asset }, { status: 201 });
}
