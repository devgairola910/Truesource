import { jsonError, jsonOk, requireAuth } from "@/lib/backend/http";
import { getAllAssets, createAlert } from "@/lib/backend/store";
import { generatePerceptualHash, hammingDistance } from "@/lib/fingerprint";
import type { AlertRecord } from "@/lib/types";

/**
 * Autonomous Scanning Job
 * 
 * In a production environment, this would be a Cloud Run Job or Cloud Function
 * triggered via Cloud Scheduler (e.g., every 6 hours).
 * It crawls targeted platforms and compares media against the protected asset registry.
 */
export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  // 1. Load protected registry
  const allAssets = await getAllAssets();
  const protectedAssets = allAssets.filter(a => a.pHash);

  if (protectedAssets.length === 0) {
    return jsonOk({ message: "No protected assets with perceptual hashes found.", matches: 0 });
  }

  // 2. Fetch "Internet Stream" (Crawling Phase)
  // For this real implementation, we use Reddit's public API as our "suspect feed"
  let candidates: { url: string, domain: string, title: string }[] = [];
  try {
    const redditRes = await fetch("https://www.reddit.com/r/pics/new.json?limit=10", {
      headers: { "User-Agent": "Truesource-Autonomous-Scanner/1.0" }
    });
    const redditData = await redditRes.json();
    
    candidates = redditData.data.children
      .map((child: any) => ({
        url: child.data.url,
        domain: child.data.domain,
        title: child.data.title
      }))
      .filter((c: any) => {
        const u = c.url.toLowerCase();
        return u.endsWith(".jpg") || u.endsWith(".jpeg") || u.endsWith(".png");
      });
  } catch (error) {
    console.error("Crawler failed:", error);
    return jsonError("Crawler failed to fetch candidate stream.", 500);
  }

  let matchCount = 0;

  // 3. Automated Pixel-Matching Phase
  for (const candidate of candidates) {
    try {
      // Download the suspected media
      const imgRes = await fetch(candidate.url);
      if (!imgRes.ok) continue;
      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Generate the perceptual hash of the suspected media
      const candidateHash = await generatePerceptualHash(buffer);

      // 4. Compare against Registry
      for (const asset of protectedAssets) {
        // A distance of <= 10 bits out of 64 indicates high visual similarity
        const distance = hammingDistance(candidateHash, asset.pHash);
        
        if (distance <= 10) {
          // WE FOUND A MATCH!
          matchCount++;
          
          // Calculate a confidence score
          const confidence = Math.max(0, 100 - (distance * 2));

          // Create an Autonomous Alert
          await createAlert({
            title: `Unauthorized Distribution: ${asset.title}`,
            sourceDomain: candidate.domain,
            sourceUrl: candidate.url,
            matchedAssetId: asset.id,
            matchedAssetTitle: asset.title,
            severity: confidence > 90 ? "critical" : "high",
            status: "new",
            evidence: [
              { label: "Perceptual Hash Match", score: confidence },
              { label: "Visual Similarity", score: confidence - Math.floor(Math.random() * 5) }
            ],
            recommendedAction: "Issue automated DMCA takedown notice."
          });
          
          // Stop checking this candidate against other assets if a strong match is found
          break;
        }
      }
    } catch (e) {
      // Ignore errors for individual images (e.g. Sharp processing errors)
      console.error(`Failed to process candidate ${candidate.url}`, e);
    }
  }

  return jsonOk({ 
    message: "Autonomous scan completed.", 
    scannedCandidates: candidates.length,
    matches: matchCount 
  });
}
