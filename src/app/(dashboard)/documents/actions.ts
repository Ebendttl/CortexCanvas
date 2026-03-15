"use server"

import { prisma } from "@/lib/prisma";
import { generateEmbedding, chunkText } from "@/lib/ai";
import mammoth from "mammoth";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// pdf-parse doesn't have good ESM types, using a more stable approach
const pdf = require("pdf-parse");

async function checkDatabaseConnection() {
  try {
    await (prisma as any).$queryRaw`SELECT 1`;
  } catch (error: any) {
    console.error("SERVER: Database connection check failed", error.message);
    throw new Error("Database connection refused. Please ensure your local database cluster is running.");
  }
}

/**
 * Dev-only fallback to ensure we have a user in the DB even if OAuth is not configured.
 * This unblocks document/AI testing in local environments.
 */
async function getDevSession() {
  if (process.env.NODE_ENV !== "development") return null;

  const devEmail = "dev@cortexcanvas.local";
  let devUser = await (prisma as any).user.findUnique({ where: { email: devEmail } });

  if (!devUser) {
    console.log("SERVER: Initializing Dev User for local exploration...");
    devUser = await (prisma as any).user.create({
      data: {
        id: "dev-explorer-id",
        name: "Dev Explorer",
        email: devEmail,
        image: "https://api.dicebear.com/7.x/bottts/svg?seed=dev",
      },
    });
  }

  return {
    user: {
      id: devUser.id,
      name: devUser.name,
      email: devUser.email,
    }
  };
}

export async function handleDelete(id: string) {
  await checkDatabaseConnection();
  await headers(); // Primary headers for Next.js 15 async compliance
  let session = await auth();

  if (!session?.user?.id && process.env.NODE_ENV === "development") {
    session = await getDevSession() as any;
  }

  if (!session?.user?.id) throw new Error("Unauthorized");

  console.log("SERVER: Deleting document", id);
  await (prisma as any).document.delete({
    where: { 
      id: id,
      ownerId: session.user.id // Security: Ensure owner
    },
  });

  // Log Activity
  await (prisma as any).activity.create({
    data: {
      documentId: id,
      userId: session.user.id,
      type: "DELETED",
    },
  }).catch((err: any) => console.error("SERVER: Delete activity log failed", err.message));

  revalidatePath("/documents");
  return { success: true };
}

export async function uploadDocument(formData: FormData) {
  console.log("SERVER: uploadDocument started");
  await checkDatabaseConnection();
  await headers(); // Primary headers for Next.js 15 async compliance
  let session = await auth();
  
  if (!session?.user?.id && process.env.NODE_ENV === "development") {
    console.warn("SERVER: No session found, using DEV fallback");
    session = await getDevSession() as any;
  }

  if (!session?.user?.id) {
    console.error("SERVER: Unauthorized upload attempt - Session missing or auth failed");
    throw new Error("Unauthorized: Please sign in to upload documents.");
  }

  const file = formData.get("file") as File;
  if (!file) {
    console.error("SERVER: No file in formData");
    throw new Error("No file provided");
  }

  console.log("SERVER: Processing file", file.name, file.size, file.type);
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // 1. Create Record
  console.log("SERVER: Creating database record...");
  const doc = await (prisma as any).document.create({
    data: {
      title: file.name,
      fileSize: file.size,
      fileType: file.type || file.name.split('.').pop() || "unknown",
      ownerId: session.user.id,
      status: "PROCESSING",
    },
  });
  console.log("SERVER: Document record created", doc.id);

  // 1.5 Log Activity
  await (prisma as any).activity.create({
    data: {
      documentId: doc.id,
      userId: session.user.id,
      type: "UPLOADED",
      metadata: JSON.stringify({ fileName: file.name }),
    },
  }).catch((err: any) => console.error("SERVER: Activity log failed", err.message));

  // 2. Trigger Processing in Background
  console.log("SERVER: Triggering background processing for", doc.id);
  // We do NOT await here to ensure fast UI response
  processDocument(doc.id, buffer, file.type).catch(err => {
    console.error("SERVER: Background processing failed for", doc.id, err);
  });

  revalidatePath("/documents");
  return doc;
}

export async function getDocuments() {
  console.log("SERVER: getDocuments started");
  try {
    await checkDatabaseConnection();
    await headers(); // Primary headers for Next.js 15 async compliance
    let session = await auth();

    if (!session?.user?.id && process.env.NODE_ENV === "development") {
      session = await getDevSession() as any;
    }

    if (!session?.user?.id) return [];

    return (prisma as any).document.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        tags: true,
      }
    });
  } catch (error: any) {
    console.error("SERVER: getDocuments failed", error.message);
    return []; // Return empty list on failure but log error
  }
}

export async function processDocument(documentId: string, fileBuffer: Buffer, fileType: string) {
  try {
    let text = "";

    // 1. Extract Text
    if (fileType.includes("pdf")) {
      const data = await pdf(fileBuffer);
      text = data.text;
    } else if (fileType.includes("docx") || fileType.includes("officedocument")) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      text = result.value;
    } else {
      text = fileBuffer.toString("utf-8");
    }

    if (!text) throw new Error("Could not extract text from document");

    // 2. Generate Summary & Insights using AI SDK
    const { text: aiOutput } = await generateText({
      model: openai("gpt-4o-mini"),
      system: "You are an expert knowledge analyst. Summarize the following document and extract 3-5 key strategic insights.",
      prompt: `Document Content:\n${text.substring(0, 10000)}`, // Limit for token sanity
    });

    // Parse AI output (assuming a simple format or we can steer it)
    // For this demo, let's keep it simple or use a structured output if needed.
    const summary = aiOutput.split("\n\n")[0];
    const insights = aiOutput.split("\n").filter(line => line.startsWith("-") || line.startsWith("•")).map(line => line.substring(1).trim());

    // 3. Update Document in DB
    console.log("SERVER: Updating document state for", documentId);
    await (prisma as any).document.update({
      where: { id: documentId },
      data: {
        summary: summary,
        keyInsights: JSON.stringify(insights),
        status: "COMPLETED",
      },
    });

    // Log Activity
    await (prisma as any).activity.create({
      data: {
        documentId: documentId,
        userId: "AI_SYSTEM", // Mock user for system actions
        type: "AI_PROCESSED",
      },
    }).catch((err: any) => console.log("SERVER: AI activity log failed (ok)", err.message));

    // 4. Generate & Store Embeddings for chunks
    const chunks = chunkText(text);
    console.log("SERVER: Starting embedding generation for", chunks.length, "chunks");
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await generateEmbedding(chunks[i]);
      await (prisma as any).embedding.create({
        data: {
          documentId: documentId,
          textChunk: chunks[i],
          // vector: embedding, // pgvector support needed for this, skipping for mock-compatible DB
        },
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("[PROCESS_DOCUMENT_ERROR]", error.message || error);
    await (prisma as any).document.update({
      where: { id: documentId },
      data: { status: "FAILED" },
    }).catch(() => {});
    return { success: false, error: "Processing failed" };
  }
}

export async function createDocumentRecord(data: { name: string, size: string, type: string, ownerId: string }) {
  const doc = await (prisma as any).document.create({
    data: {
      title: data.name,
      fileSize: parseInt(data.size),
      fileType: data.type,
      ownerId: data.ownerId,
      status: "PROCESSING",
    },
  });
  return doc;
}
