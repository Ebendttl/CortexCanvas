import { prisma } from "@/lib/prisma";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { generateEmbedding } from "@/lib/ai";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { messages, documentId } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 1. Generate embedding for the query
    const queryVector = await generateEmbedding(lastMessage);

    // 2. Search for relevant chunks in the database
    // Note: This requires PostgreSQL with pgvector and similarity search.
    // We use raw SQL to find the top 5 most similar chunks.
    const relevantChunks = await prisma.$queryRaw`
      SELECT "textChunk", 1 - ("vector" <=> ${queryVector}::vector) as similarity
      FROM "Embedding"
      WHERE "documentId" = ${documentId}
      ORDER BY similarity DESC
      LIMIT 5
    ` as { textChunk: string }[];

    const context = relevantChunks.map(c => c.textChunk).join("\n\n---\n\n");

    // 3. Stream response with context
    const result = await streamText({
      model: openai("gpt-4o"),
      messages,
      system: `You are CortexCanvas AI. 
      Use the following context from the current document to answer the user's question. 
      If the context doesn't contain the answer, say you don't know based on the provided notes, 
      but try to be as helpful as possible with the document's information.
      
      CONTEXT:
      ${context}`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("RAG error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
