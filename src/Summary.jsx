import React, { useMemo, useState, useEffect } from "react";
import { generateSummary } from "./utils/ai.js";

function summarizeNotes(notes) {
    if (!notes) return "";
    const sentences = notes.split(/(?<=[.!?])\s+/);
    return sentences.slice(0, 2).join(" ").slice(0, 300);
}

const LoadingSpinner = () => (
    <div className="loading-state">
        <div className="spinner"></div>
        <span>Generating insights...</span>
    </div>
);

export default function Summary({ logs = [] }) {
    const { totalHours, skillCounts, categoryCounts, topSkill, combinedNotes } = useMemo(() => {
        const totalHours = logs.reduce((s, l) => s + Number(l.hours || 0), 0);
        const skillCounts = {};
        const categoryCounts = {};
        let combinedNotes = "";

        logs.forEach((l) => {
            skillCounts[l.skill] = (skillCounts[l.skill] || 0) + Number(l.hours || 0);
            const category = l.category || "Other";
            categoryCounts[category] = (categoryCounts[category] || 0) + Number(l.hours || 0);
            if (l.notes) combinedNotes += (combinedNotes ? " " : "") + l.notes;
        });

        let topSkill = null;
        let max = 0;
        Object.entries(skillCounts).forEach(([skill, hrs]) => {
            if (hrs > max) {
                max = hrs;
                topSkill = skill;
            }
        });
        return { totalHours, skillCounts, categoryCounts, topSkill, combinedNotes };
    }, [logs]);

    const [aiSummary, setAiSummary] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(false);

    useEffect(() => {
        if (!logs || logs.length === 0) {
            setAiSummary(null);
            setAiError(false);
            return;
        }

        setAiLoading(true);
        setAiError(false);

        generateSummary(logs)
            .then((result) => {
                setAiSummary(result);
                setAiError(result.isError);
            })
            .catch((error) => {
                console.error("Error generating summary:", error);
                setAiError(true);
                setAiSummary(null);
            })
            .finally(() => setAiLoading(false));
    }, [logs]);

    if (!logs || logs.length === 0) {
        return <div className="summary-empty">No data yet. Add a work session to see your summary.</div>;
    }

    const notesSnippet = summarizeNotes(combinedNotes);

    return (
        <div className="summary">
            <div className="summary-box">
                <div className="metric"><span>Total hours</span><strong>{totalHours}</strong></div>
                <div className="metric"><span>Categories</span><strong>{Object.keys(categoryCounts).length}</strong></div>
                <div className="metric"><span>Skills</span><strong>{Object.keys(skillCounts).length}</strong></div>
                {topSkill && <div className="metric"><span>Top skill</span><strong>{topSkill}</strong></div>}
            </div>

            <div className="summary-ai">
                <div className="summary-title">
                    <div>
                        <p className="section-kicker">Powered by AI</p>
                        <h3>What you worked on</h3>
                    </div>
                    <span className="insight-badge">Insights</span>
                </div>

                {aiLoading ? (
                    <LoadingSpinner />
                ) : aiSummary ? (
                    <>
                        <p>{aiSummary.summary}</p>

                        <h4>By Category</h4>
                        <div style={{ fontSize: "0.95em", lineHeight: "1.6" }}>
                            {Object.entries(categoryCounts)
                                .sort((a, b) => b[1] - a[1])
                                .map(([cat, hrs]) => (
                                    <div key={cat} className="category-row">
                                        <span>{cat}</span><strong>{hrs} hr</strong>
                                    </div>
                                ))}
                        </div>

                        {notesSnippet ? (
                            <>
                                <h4>Notes</h4>
                                <p className="notes-snippet">{notesSnippet}</p>
                            </>
                        ) : null}

                        <h4>Smart Insights</h4>
                        <ul>
                            {aiSummary.insights.map((insight, idx) => (
                                <li key={idx}>{insight}</li>
                            ))}
                        </ul>

                        {aiError && (
                            <p className="summary-error">
                            Some features are unavailable. Check your API key.
                            </p>
                        )}
                    </>
                ) : (
                    <p style={{ color: "var(--muted)" }}>Failed to generate AI summary. Please try again.</p>
                )}
            </div>

        </div>
    );
}
