export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { logs } = req.body;
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
        console.error('GROQ_API_KEY environment variable not set');
        return res.status(500).json({ error: 'API key not configured' });
    }

    if (!logs || logs.length === 0) {
        return res.status(200).json({
            summary: "No data yet — add some work to see a summary.",
            insights: [],
            isError: false,
        });
    }

    // Format logs for AI
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

Provide a brief, encouraging summary (2-3 sentences) and 2-3 specific, actionable tips to improve their learning. Be concise and motivating.`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${groqApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                    {
                        role: "system",
                        content: "You are a supportive learning coach. Analyze practice logs and provide personalized, encouraging insights.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 300,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Groq API error:", error);
            return res.status(response.status).json({
                summary: "Unable to generate AI summary. Please try again.",
                insights: ["Check your API key", "Ensure your API key has sufficient quota"],
                isError: true,
            });
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Parse the response
        const lines = content.split('\n').filter(line => line.trim());
        const summary = lines.slice(0, 3).join(' ').trim();
        const insights = lines.slice(3).filter(line => line.trim()).slice(0, 3);

        return res.status(200).json({
            summary: summary || "Summary generation completed",
            insights: insights.length > 0 ? insights : ["Keep practicing consistently", "Track your progress daily"],
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
