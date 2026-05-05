export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: "GROQ_API_KEY environment variable is not configured" },
        { status: 500 }
      );
    }

    const { prompt, imageBase64 } = await req.json();

    // Note: Groq's llama3-8b-8192 doesn't support image inputs
    // If an image is provided, we'll include a note about it in the prompt
    let finalPrompt = prompt;
    if (imageBase64) {
      finalPrompt = `[Note: An image was provided but this model doesn't support image analysis. Please provide text-based guidance instead.]\n\n${prompt}`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: finalPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Groq API request failed");
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    return Response.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
