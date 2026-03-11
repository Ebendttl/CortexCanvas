import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    messages,
    system: `You are an AI assistant integrated into a document editor called CortexCanvas. 
    Help the user with writing, summarizing, explaining, and editing their notes. 
    Keep your responses helpful, concise, and professional. 
    Maintain the context of the document.`,
  });

  return result.toTextStreamResponse();
}
