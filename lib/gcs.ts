import { Storage } from "@google-cloud/storage";

// Initialize GCS storage client
// It will automatically use GOOGLE_APPLICATION_CREDENTIALS env var if present,
// or fallback to default credentials on GCP environments.
export const storage = new Storage();

export const BUCKET_NAME = "truesource-official-registry";

/**
 * Uploads a file buffer to a specific GCS bucket and path.
 * @param buffer File content buffer
 * @param destination Destination path in the bucket (e.g. 'images/my-file.jpg')
 * @param contentType MIME type of the file
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
