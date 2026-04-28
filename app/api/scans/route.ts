import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { extractFingerprint, generatePerceptualHash } from "@/lib/fingerprint";
import { requireAuth } from "@/lib/backend/http";

const ASSETS_COL = "assets";

function getHammingDistance(hex1: string, hex2: string): number {
  if (!hex1 || !hex2) return 64;
  let xor;
  try {
    xor = BigInt("0x" + hex1) ^ BigInt("0x" + hex2);
  } catch {
    return 64;
  }
  let distance = 0;
  while (xor > 0n) {
    distance += Number(xor & 1n);
    xor >>= 1n;
  }
  return distance;
}

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
      // Fetch all assets for the user to perform Hamming distance search
      const snapshot = await db.collection(ASSETS_COL)
        .where("userId", "==", auth.user.id)
        .get();
      
      let bestMatch = null;
      let lowestDistance = 64;

      snapshot.docs.forEach((doc) => {
        const asset = doc.data();
        if (asset.pHash) {
          const distance = getHammingDistance(pHash, asset.pHash);
          if (distance < lowestDistance) {
            lowestDistance = distance;
            bestMatch = asset;
          }
        }
      });

      const matchPercentage = Math.round(((64 - lowestDistance) / 64) * 100);

      if (bestMatch && matchPercentage > 65) {
        match = bestMatch;
        console.log(`Scan: Matched by fuzzy pHash (distance: ${lowestDistance}, ${matchPercentage}%): ${match.id}`);
      }
    }

    // Determine the final percentage to return
    let finalPercentage = 0;
    if (match) {
      if (fingerprintId) {
        finalPercentage = 100; // Exact fingerprint match is 100%
      } else {
        // Find distance for the match we found
        const dist = getHammingDistance(pHash, match.pHash);
        finalPercentage = Math.round(((64 - dist) / 64) * 100);
      }
    } else if (bestMatch) {
      // Even if it didn't pass the >65% threshold, return the highest similarity found
      finalPercentage = Math.round(((64 - lowestDistance) / 64) * 100);
    }

    return NextResponse.json({
      success: true,
      found: !!match,
      match: match || null,
      matchPercentage: finalPercentage,
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
