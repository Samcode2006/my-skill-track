export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { logs } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    if (!logs || logs.length === 0) {
        return res.status(200).json({
            summary: "No data yet — add some work to see a summary.",
            insights: [],
            isError: false,
        });
    }

    // Format logs for Claude
    const logsText = logs
        .map(
            (log) =>
                `- ${log.skill} (${log.category}): ${log.hours}h${log.notes ? ` - "${log.notes}"` : ""}`
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
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
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
            return res.status(response.status).json({
                summary: "Unable to generate AI summary. Please try again.",
                insights: ["Check your API key", "Ensure you have credits available"],
                isError: true,
            });
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Parse JSON response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to parse response");
        }

        const parsed = JSON.parse(jsonMatch[0]);

        return res.status(200).json({
            summary: parsed.summary || "Summary generation failed",
            insights: Array.isArray(parsed.insights) ? parsed.insights : [],
            isError: false,
        });
    } catch (error) {
        console.error("API error:", error);
        return res.status(500).json({
            summary: "Error generating summary. Please try again.",
            insights: ["Check your internet connection", "Try refreshing the page"],
            isError: true,
        });
    }
}
