import { prisma } from "@/lib/prisma";
import { generateEmbedding, chunkText } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { documentId, content } = await req.json();

    if (!documentId || !content) {
      return new Response("Missing documentId or content", { status: 400 });
    }

    // 1. Chunk the content
    const textContent = typeof content === 'string' ? content : JSON.stringify(content);
    const chunks = chunkText(textContent);

    // 2. Delete old embeddings for this document
    await prisma.embedding.deleteMany({
      where: { documentId },
    });

    // 3. Generate and store new embeddings
    for (const chunk of chunks) {
      const vector = await generateEmbedding(chunk);
      
      // Note: prisma cannot directly insert into Unsupported("vector") 
      // without raw SQL or a specific adapter.
      // We will store the chunk text for now and use a mock/raw SQL insert.
      await prisma.$executeRaw`
        INSERT INTO "Embedding" ("id", "documentId", "textChunk", "vector")
        VALUES (
          ${Math.random().toString(36).substring(7)}, 
          ${documentId}, 
          ${chunk}, 
          ${vector}::vector
        )
      `;
    }

    return new Response("Embeddings generated", { status: 200 });
  } catch (error) {
    console.error("Embedding generation error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
