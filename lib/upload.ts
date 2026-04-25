/**
 * Upload configuration, validation, and API helpers.
 *
 * Centralises all file-upload logic so both the full Upload Wizard page
 * and the Quick Upload modal in the topbar share identical behaviour.
 */

// ─── Accepted file types ────────────────────────────────────────────
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime", // .mov
  "video/webm",
] as const;

export const ACCEPTED_TYPES = [
  ...ACCEPTED_IMAGE_TYPES,
  ...ACCEPTED_VIDEO_TYPES,
] as const;

/** Human-readable accept string for <input accept="…"> */
export const ACCEPT_STRING = ACCEPTED_TYPES.join(",");

/** Friendly labels for the drop-zone hint */
export const ACCEPTED_EXTENSIONS_LABEL = "JPG, PNG, WebP, GIF, MP4, MOV, WebM";

// ─── Size limits ────────────────────────────────────────────────────
export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB
export const MAX_FILE_SIZE_LABEL = "2 GB";
export const MAX_FILES = 20;

// ─── Validation ─────────────────────────────────────────────────────
export type ValidationError = {
  file: File;
  reason: "type" | "size";
  message: string;
};

/**
 * Validates an array of `File` objects against the allowed types & size.
 * Returns `{ valid, errors }`.
 */
export function validateFiles(files: File[]): {
  valid: File[];
  errors: ValidationError[];
} {
  const valid: File[] = [];
  const errors: ValidationError[] = [];

  for (const file of files) {
    if (!(ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
      errors.push({
        file,
        reason: "type",
        message: `"${file.name}" is not a supported file type. Accepted: ${ACCEPTED_EXTENSIONS_LABEL}`,
      });
    } else if (file.size > MAX_FILE_SIZE) {
      errors.push({
        file,
        reason: "size",
        message: `"${file.name}" exceeds the ${MAX_FILE_SIZE_LABEL} limit.`,
      });
    } else {
      valid.push(file);
    }
  }

  return { valid, errors };
}

// ─── Upload item state ──────────────────────────────────────────────
export type UploadStatus = "queued" | "uploading" | "processing" | "done" | "error";

export type UploadFileItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  mediaType: "image" | "video";
  progress: number; // 0-100
  status: UploadStatus;
  error?: string;
};

/** Derive media type from MIME */
export function getMediaType(file: File): "image" | "video" {
  return file.type.startsWith("video/") ? "video" : "image";
}

// ─── Simulated upload (mock backend) ────────────────────────────────
/**
 * Simulates uploading a file to the server with realistic progress ticks.
 * Calls `onProgress(0-100)` during the upload.
 *
 * In production, replace the body with a real `fetch`/`XMLHttpRequest`
 * upload to `/api/upload`.
 */
export function uploadFile(
  file: File,
  onProgress: (pct: number) => void,
  signal?: AbortSignal
): Promise<{ assetId: string }> {
  return new Promise((resolve, reject) => {
    let progress = 0;

    // Speed is proportional to file size (bigger = more ticks)
    const totalTicks = 15 + Math.floor(Math.random() * 10);
    const tickMs = 120 + Math.floor(Math.random() * 80);

    const timer = setInterval(() => {
      if (signal?.aborted) {
        clearInterval(timer);
        reject(new DOMException("Upload cancelled", "AbortError"));
        return;
      }

      const increment = Math.ceil(
        ((100 - progress) / (totalTicks - Math.floor(progress / (100 / totalTicks)))) *
          (0.7 + Math.random() * 0.6)
      );
      progress = Math.min(progress + increment, 100);
      onProgress(progress);

      if (progress >= 100) {
        clearInterval(timer);
        // Simulate a short "server processing" phase
        setTimeout(() => {
          // 5% chance of simulated failure for demo purposes
          if (Math.random() < 0.05) {
            reject(new Error("Server processing failed. Please retry."));
          } else {
            const assetId = `AST-${1000 + Math.floor(Math.random() * 9000)}`;
            resolve({ assetId });
          }
        }, 400);
      }
    }, tickMs);
  });
}

/**
 * Upload a file to the real API endpoint.
 * Uses XMLHttpRequest for native progress events.
 */
export function uploadFileToAPI(
  file: File,
  onProgress: (pct: number) => void,
  signal?: AbortSignal
): Promise<{ assetId: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        onProgress(pct);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch {
          resolve({ assetId: `AST-${Date.now()}`, fileName: file.name });
        }
      } else {
        reject(new Error(`Upload failed (HTTP ${xhr.status})`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
    xhr.addEventListener("abort", () => reject(new DOMException("Upload cancelled", "AbortError")));

    // Hook up AbortSignal
    if (signal) {
      signal.addEventListener("abort", () => xhr.abort());
    }

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
}
