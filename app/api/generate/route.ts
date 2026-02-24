import { NextResponse } from 'next/server';

// --- 1. Define the expected data shape ---
interface StoryPage {
  text: string;
  question: string;
  options: string[];
}

interface Story {
  title: string;
  pages: StoryPage[];
}

export async function POST(req: Request) {
  try {
    const { studentName, ageGroup, topic } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": `${process.env.SITE_URL || 'http://localhost:3000'}`,
        "X-Title": "CircleTime AI",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-chat", // DeepSeek-V3.2
        "messages": [
          {
            "role": "system",
            "content": `You are an expert Kindergarten Teacher in Shanghai specializing in EAL.
            Create an interactive story for a ${ageGroup} year old named ${studentName}.
            Topic: ${topic}.

            Return ONLY a JSON object with:
            {
              "title": "Title of story",
              "pages": [
                { "text": "Simple sentence", "question": "Simple check", "options": ["Option1", "Option2"] }
              ]
            }
            Use exactly 3 pages. Keep vocabulary simple for second language learners.`
          }
        ],
        // DeepSeek-V3.2 natively supports JSON mode for structured output
        "response_format": { "type": "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("🚨 OpenRouter API Error:", errorData);
      return NextResponse.json(
        { error: "DeepSeek is currently busy. Please try again." },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Parse the content string into our Story interface
    const storyContent: Story = JSON.parse(data.choices[0].message.content);

    // --- 2. Final Data Validation ---
    // Ensure 'pages' exists before sending it to the frontend to prevent TypeErrors
    if (!storyContent.pages || !Array.isArray(storyContent.pages)) {
      throw new Error("AI returned invalid story format.");
    }

    return NextResponse.json(storyContent);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("🚨 SERVER ERROR:", errorMessage);

    return NextResponse.json(
      { error: "Connection error. If in Shanghai, check your VPN status." },
      { status: 500 }
    );
  }
}
