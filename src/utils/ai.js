const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function generateSummary(logs) {
    if (!OPENAI_API_KEY) {
        console.warn("OpenAI API key not set. Using fallback summaries.");
        return {
            summary: "AI summaries are unavailable. Please set VITE_OPENAI_API_KEY in your environment.",
            insights: [
                "To enable AI features: Get a FREE OpenAI API key from platform.openai.com/account/api-keys",
                "Add VITE_OPENAI_API_KEY to your .env.local file",
                "Redeploy the app to use ChatGPT for personalized insights",
            ],
            isError: true,
            isUnavailable: true,
        };
    }

    if (!logs || logs.length === 0) {
        return {
            summary: "No data yet — add some work to see a summary.",
            insights: [],
            isError: false,
        };
    }

    // Format logs for Claude
    const logsText = logs
        .map(
            (log) =>
                `- ${log.skill} (${log.category}): ${log.hours}h${log.notes ? ` - "${log.notes}"` : ""
                }`
        )
        .join("\n");

    const totalHours = logs.reduce((sum, log) => sum + Number(log.hours || 0), 0);
    const skillCount = new Set(logs.map((log) => log.skill)).size;
    const categoryCount = new Set(logs.map((log) => log.category || "Other")).size;

    const prompt = `You are a supportive learning coach. Analyze this person's practice log from today and provide personalized, encouraging insights.

Today's Practice Log:
${logsText}

Stats:
- Total Hours: ${totalHours}
- Skills Practiced: ${skillCount}
- Categories: ${categoryCount}

Provide a brief, encouraging summary (2-3 sentences) and 2-3 specific, actionable tips to improve their learning. Be concise and motivating.

Format your response as JSON:
{
  "summary": "Your encouraging summary here",
  "insights": ["tip 1", "tip 2", "tip 3"]
}`;

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a supportive learning coach. Analyze practice logs and provide personalized, encouraging insights in valid JSON format.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("OpenAI API error:", error);
            throw new Error(
                `OpenAI API error: ${error.error?.message || "Unknown error"}`
            );
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Parse JSON response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to parse OpenAI response");
        }

        const parsed = JSON.parse(jsonMatch[0]);

        return {
            summary: parsed.summary || "Summary generation failed",
            insights: Array.isArray(parsed.insights) ? parsed.insights : [],
            isError: false,
        };
    } catch (error) {
        console.error("AI summary error:", error);

        // Check if it's a CORS or network error
        const isNetworkError = error.message.includes("Failed to fetch") ||
            error.message.includes("NetworkError");
        const isAuthError = error.message.includes("401") ||
            error.message.includes("invalid_request_error") ||
            error.message.includes("Unauthorized");

        return {
            summary: isAuthError
                ? "API Key Error: Please check your OpenAI API key is correct."
                : isNetworkError
                    ? "Network Error: Unable to reach OpenAI API. Check your internet connection."
                    : "Unable to generate AI summary. Please try again later.",
            insights: isAuthError
                ? [
                    "Get a free OpenAI API key at platform.openai.com/account/api-keys",
                    "Add it to .env.local as: VITE_OPENAI_API_KEY=sk-...",
                    "You get $5 free credits to test (expires after 3 months)",
                ]
                : [
                    "Check your internet connection",
                    "Try refreshing the page",
                    "If the problem persists, check the browser console (F12) for details",
                ],
            isError: true,
        };
    }
}
