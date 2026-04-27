import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { extractFingerprint, generatePerceptualHash } from "@/lib/fingerprint";
import { requireAuth } from "@/lib/backend/http";

const ASSETS_COL = "assets";

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Try to extract invisible fingerprint
    const fingerprintId = await extractFingerprint(buffer);
    console.log(`Scan: Extracted fingerprint: ${fingerprintId}`);

    // 2. Generate perceptual hash for backup matching
    const pHash = await generatePerceptualHash(buffer);
    console.log(`Scan: Generated pHash: ${pHash}`);

    let match = null;

    // Search in Firestore
    if (fingerprintId) {
      const snapshot = await db.collection(ASSETS_COL)
        .where("fingerprintId", "==", fingerprintId)
        .limit(1)
        .get();
      
      if (!snapshot.empty) {
        match = snapshot.docs[0].data();
        console.log(`Scan: Matched by fingerprint: ${match.id}`);
      }
    }

    if (!match) {
      // Try exact pHash match
      const snapshot = await db.collection(ASSETS_COL)
        .where("pHash", "==", pHash)
        .limit(1)
        .get();
      
      if (!snapshot.empty) {
        match = snapshot.docs[0].data();
        console.log(`Scan: Matched by exact pHash: ${match.id}`);
      }
    }

    // TODO: Implement Hamming distance search for more robust pHash matching
    // (Requires fetching all hashes or using a specialized DB)

    return NextResponse.json({
      success: true,
      found: !!match,
      match: match || null,
      details: {
        extractedFingerprint: fingerprintId,
        generatedPHash: pHash,
      }
    });

  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json({ error: "Scan failed", details: String(error) }, { status: 500 });
  }
}
