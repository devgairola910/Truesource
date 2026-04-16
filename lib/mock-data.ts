export type AssetKind = "image" | "video";

export type AssetRecord = {
  id: string;
  title: string;
  kind: AssetKind;
  rightsOwner: string;
  distributedTo: string;
  status: "protected" | "fingerprinting";
  lastUpdated: string;
};

export type CandidateRecord = {
  id: string;
  sourceDomain: string;
  sourceUrl: string;
  extractedAt: string;
  mediaType: AssetKind;
  stage: "prefiltered" | "deep-match" | "queued-alert";
  signalSummary: string;
};

export type EvidenceSignal = {
  label: string;
  score: number;
};

export type AlertStatus = "new" | "confirmed" | "dismissed" | "whitelisted";

export type AlertRecord = {
  id: string;
  title: string;
  sourceDomain: string;
  sourceUrl: string;
  matchedAssetId: string;
  matchedAssetTitle: string;
  severity: "critical" | "high" | "medium";
  detectedAt: string;
  status: AlertStatus;
  evidence: EvidenceSignal[];
  recommendedAction: string;
};

export const assets: AssetRecord[] = [
  {
    id: "AST-1002",
    title: "Player Reveal - Matchday Graphic",
    kind: "image",
    rightsOwner: "Apex Sports Media",
    distributedTo: "Instagram, X",
    status: "protected",
    lastUpdated: "2h ago",
  },
  {
    id: "AST-1010",
    title: "Highlight Reel Q2",
    kind: "video",
    rightsOwner: "Apex Sports Media",
    distributedTo: "Broadcast Partners",
    status: "fingerprinting",
    lastUpdated: "11m ago",
  },
  {
    id: "AST-1021",
    title: "Club Crest Master Vector",
    kind: "image",
    rightsOwner: "Apex Sports Media",
    distributedTo: "Sponsorship Kit",
    status: "protected",
    lastUpdated: "1d ago",
  },
];

export const candidates: CandidateRecord[] = [
  {
    id: "CAND-611",
    sourceDomain: "streamclips.watch",
    sourceUrl: "https://streamclips.watch/live/fans-relive-weekend-final",
    extractedAt: "45 sec ago",
    mediaType: "video",
    stage: "deep-match",
    signalSummary: "Shot sequence overlap on frames 120-180",
  },
  {
    id: "CAND-609",
    sourceDomain: "sports-trends.blog",
    sourceUrl: "https://sports-trends.blog/latest/poster-preview",
    extractedAt: "2 min ago",
    mediaType: "image",
    stage: "queued-alert",
    signalSummary: "Embedding similarity 0.94 + logo patch match",
  },
  {
    id: "CAND-606",
    sourceDomain: "fan-news-hub.io",
    sourceUrl: "https://fan-news-hub.io/photo-roundup/week-14",
    extractedAt: "7 min ago",
    mediaType: "image",
    stage: "prefiltered",
    signalSummary: "Perceptual hash threshold exceeded",
  },
];

export const alerts: AlertRecord[] = [
  {
    id: "ALT-9201",
    title: "Match highlight excerpt reposted with crop",
    sourceDomain: "streamclips.watch",
    sourceUrl: "https://streamclips.watch/live/fans-relive-weekend-final",
    matchedAssetId: "AST-1010",
    matchedAssetTitle: "Highlight Reel Q2",
    severity: "critical",
    detectedAt: "3 min ago",
    status: "new",
    recommendedAction: "Confirm and retain evidence snapshot for legal review.",
    evidence: [
      { label: "Shot-level sequence", score: 0.96 },
      { label: "Embedding similarity", score: 0.93 },
      { label: "Logo consistency", score: 0.81 },
      { label: "Watermark verification", score: 0.72 },
    ],
  },
  {
    id: "ALT-9193",
    title: "Promotional player graphic mirrored and reposted",
    sourceDomain: "sports-trends.blog",
    sourceUrl: "https://sports-trends.blog/latest/poster-preview",
    matchedAssetId: "AST-1002",
    matchedAssetTitle: "Player Reveal - Matchday Graphic",
    severity: "high",
    detectedAt: "11 min ago",
    status: "new",
    recommendedAction: "Confirm if source lacks licensing metadata.",
    evidence: [
      { label: "Embedding similarity", score: 0.94 },
      { label: "Perceptual hash", score: 0.88 },
      { label: "Logo consistency", score: 0.79 },
      { label: "Watermark verification", score: 0.41 },
    ],
  },
  {
    id: "ALT-9182",
    title: "Crest graphic appears in fan roundup gallery",
    sourceDomain: "fan-news-hub.io",
    sourceUrl: "https://fan-news-hub.io/photo-roundup/week-14",
    matchedAssetId: "AST-1021",
    matchedAssetTitle: "Club Crest Master Vector",
    severity: "medium",
    detectedAt: "19 min ago",
    status: "new",
    recommendedAction: "Dismiss if fair use context is validated by reviewer.",
    evidence: [
      { label: "Perceptual hash", score: 0.86 },
      { label: "Embedding similarity", score: 0.76 },
      { label: "Logo consistency", score: 0.67 },
      { label: "Watermark verification", score: 0.32 },
    ],
  },
];
