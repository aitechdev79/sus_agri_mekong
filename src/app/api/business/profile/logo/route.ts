import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { saveFile } from "@/lib/file-upload";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "BUSINESS" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only business accounts can upload logo" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Logo must be an image file" }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Image is too large. Max size is 5MB" }, { status: 400 });
    }

    const result = await saveFile(file);
    if (!result.success || !result.url) {
      return NextResponse.json({ error: result.error || "Failed to upload logo" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      file: {
        url: result.url,
        fileName: result.fileName,
        originalName: result.originalName,
        size: result.size,
        type: result.type,
      },
    });
  } catch (error) {
    console.error("Business logo upload error:", error);
    return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 });
  }
}

