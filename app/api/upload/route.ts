import { NextResponse } from "next/server";
import { uploadToGCS } from "@/lib/gcs";

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
    const publicUrl = await uploadToGCS(buffer, destination, file.type);

    return NextResponse.json({
      assetId: `AST-${Date.now()}`,
      fileName: file.name,
      url: publicUrl,
      size: file.size,
      success: true,
    });
  } catch (error) {
    console.error("Cloud Storage upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file to cloud storage" },
      { status: 500 }
    );
  }
}
