import { Storage } from "@google-cloud/storage";

// Initialize GCS storage client using the unified Service Account
let storageConfig = {};
const saJson = process.env.COMPUTE_SERVICE_ACCOUNT;

if (saJson) {
  try {
    const credentials = JSON.parse(saJson);
    storageConfig = {
      projectId: credentials.project_id,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key?.replace(/\\n/g, "\n"),
      },
    };
  } catch (err) {
    console.error("Critical: Failed to parse Service Account JSON. Falling back to default credentials.", err);
  }
}

export const storage = new Storage(storageConfig);

export const BUCKET_NAME = "official-registry";

/**
 * Uploads a file buffer to a specific GCS bucket and path.
 */
export async function uploadToGCS(
  buffer: Buffer,
  destination: string,
  contentType: string
) {
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(destination);

  await file.save(buffer, {
    metadata: {
      contentType: contentType,
    },
    resumable: false,
  });

  return `https://storage.googleapis.com/${BUCKET_NAME}/${destination}`;
}
