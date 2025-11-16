const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function generateSummary(logs) {
    if (!logs || logs.length === 0) {
        return {
            summary: "No data yet — add some work to see a summary.",
            insights: [],
            isError: false,
        };
    }

    try {
        // Call our backend API (Vercel serverless function)
        const response = await fetch("/api/generateSummary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ logs }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("API error:", error);
            throw new Error(`API error: ${error.error || "Unknown error"}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("AI summary error:", error);
        return {
            summary: "Unable to generate AI summary. Please try again.",
            insights: [
                "Check your internet connection",
                "Try refreshing the page",
                "If the problem persists, the API key may need to be set on Vercel",
            ],
            isError: true,
        };
    }
}
