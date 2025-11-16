const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

export async function generateSummary(logs) {
    if (!CLAUDE_API_KEY) {
        throw new Error(
            "Claude API key not found. Please set VITE_CLAUDE_API_KEY in .env.local"
        );
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
        const response = await fetch(CLAUDE_API_URL, {
            method: "POST",
            headers: {
                "x-api-key": CLAUDE_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 1024,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Claude API error:", error);
            throw new Error(
                `Claude API error: ${error.error?.message || "Unknown error"}`
            );
        }

        const data = await response.json();
        const content = data.content[0].text;

        // Parse JSON response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to parse Claude response");
        }

        const parsed = JSON.parse(jsonMatch[0]);

        return {
            summary: parsed.summary || "Summary generation failed",
            insights: Array.isArray(parsed.insights) ? parsed.insights : [],
            isError: false,
        };
    } catch (error) {
        console.error("AI summary error:", error);
        return {
            summary: "Unable to generate AI summary. Please try again later.",
            insights: [
                "Check that your API key is set correctly",
                "Ensure your Claude API account has available credits",
            ],
            isError: true,
        };
    }
}
