import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { content, type } = await req.json();

    const textContent = typeof content === 'string' ? content : JSON.stringify(content);

    let prompt = "";
    if (type === "title") {
      prompt = `Generate a short, punchy, and descriptive title for this document content. Return ONLY the title text, nothing else.\n\nCONTENT:\n${textContent}`;
    } else {
      prompt = `Summarize this document content in 3-5 concise bullet points. Focus on the most important takeaways.\n\nCONTENT:\n${textContent}`;
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    });

    return new Response(JSON.stringify({ result: text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Insight error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
