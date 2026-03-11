import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.replace(/\n/g, " "),
  });

  return response.data[0].embedding;
}

export function chunkText(text: string, chunkSize: number = 500): string[] {
  // Simple word-based chunking for demonstration
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
}

export async function findRelevantChunks(query: string, documentId?: string) {
  // In a real app, this would perform a vector search in the database.
  // For this demo, we'll return a mock search or use a simple Prisma filter if vector search isn't available.
  console.log(`Searching for: ${query} in document: ${documentId}`);
  
  // This is where pgvector or RedisSearch would come in.
  // We'll implement the logic in the API route.
  return [];
}
