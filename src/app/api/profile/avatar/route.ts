import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WEBP, GIF and AVIF are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `avatar-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");

    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/avatars/${filename}`;
    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (err) {
    console.error("[AVATAR_UPLOAD_ERROR]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
