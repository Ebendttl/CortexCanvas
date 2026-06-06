import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMock = !supabaseUrl || 
      supabaseUrl.includes("mpwoecfookkoexalgmsr") || 
      supabaseUrl.includes("your-project-url");

    if (isMock) {
      // Local development - write to public disk
      const { writeFile, mkdir } = await import("fs/promises");
      const path = await import("path");
      const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");

      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/avatars/${filename}`;
      return NextResponse.json({ url: publicUrl }, { status: 200 });
    } else {
      // Production / Cloud - upload to Supabase Storage bucket 'avatars'
      const supabase = await createClient();
      const buffer = Buffer.from(await file.arrayBuffer());

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        console.error("[SUPABASE_STORAGE_ERROR]", error);
        return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
      }

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filename);

      return NextResponse.json({ url: publicUrl }, { status: 200 });
    }
  } catch (err) {
    console.error("[AVATAR_UPLOAD_ERROR]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
