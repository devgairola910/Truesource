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
