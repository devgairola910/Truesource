import { NextResponse } from "next/server";
import { uploadToGCS, getSignedUploadUrl } from "@/lib/gcs";

/**
 * GET /api/upload?fileName=...&contentType=...
 * Returns a signed URL for direct client-to-GCS upload.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");
    const contentType = searchParams.get("contentType");

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "fileName and contentType are required" },
        { status: 400 }
      );
    }

    const isImage = contentType.startsWith("image/");
    const isVideo = contentType.startsWith("video/");
    
    let prefix = "";
    if (isImage) prefix = "images/";
    else if (isVideo) prefix = "videos/";
    else prefix = "others/";

    const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const destination = `${prefix}${safeName}`;

    const signedUrl = await getSignedUploadUrl(destination, contentType);
    const publicUrl = `https://storage.googleapis.com/official-registry/${destination}`;

    return NextResponse.json({
      uploadUrl: signedUrl,
      publicUrl: publicUrl,
      fileName: fileName,
      destination: destination,
    });
  } catch (error) {
    console.error("Signed URL generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate signed upload URL" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Determine destination path based on media type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    
    let prefix = "";
    if (isImage) prefix = "images/";
    else if (isVideo) prefix = "videos/";
    else prefix = "others/";

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const destination = `${prefix}${fileName}`;

    // Read file into buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to GCS bucket: official-registry
    console.log(`Server: Uploading ${file.name} (${file.size} bytes) to ${destination}`);
    const publicUrl = await uploadToGCS(buffer, destination, file.type);
    console.log(`Server: Upload successful: ${publicUrl}`);

    return NextResponse.json({
      assetId: `AST-${Date.now()}`,
      fileName: file.name,
      url: publicUrl,
      size: file.size,
      success: true,
    });
  } catch (error) {
    console.error("Cloud Storage upload error:", error);
    
    // Check if it's a size limit issue
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("too large") || errorMessage.includes("limit")) {
      return NextResponse.json(
        { error: "File too large for direct upload. Using signed URLs is recommended for videos." },
        { status: 413 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to upload file to cloud storage",
        details: errorMessage,
        stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}

