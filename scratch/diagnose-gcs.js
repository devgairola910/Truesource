const { Storage } = require("@google-cloud/storage");

async function diagnose() {
  const BUCKET_NAME = "truesource-official-registry";
  const storage = new Storage();
  
  console.log("--- GCS Diagnosis Start ---");
  console.log(`Target Bucket: ${BUCKET_NAME}`);
  
  try {
    const [buckets] = await storage.getBuckets();
    console.log("Connection: SUCCESS");
    console.log("Available Buckets:", buckets.map(b => b.name).join(", "));
    
    const bucket = storage.bucket(BUCKET_NAME);
    const [exists] = await bucket.exists();
    console.log(`Bucket '${BUCKET_NAME}' exists: ${exists}`);
    
    if (exists) {
      const [metadata] = await bucket.getMetadata();
      console.log("Bucket Permissions: Verified");
    }
  } catch (err) {
    console.error("Diagnosis FAILED");
    console.error("Error Code:", err.code);
    console.error("Error Message:", err.message);
    
    if (err.message.includes("Could not load the default credentials")) {
      console.log("\n[ADVICE] You need to set GOOGLE_APPLICATION_CREDENTIALS environment variable.");
    }
  }
  console.log("--- GCS Diagnosis End ---");
}

diagnose();
