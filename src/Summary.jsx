import React, { useMemo } from "react";

function summarizeNotes(notes) {
    if (!notes) return "";
    // Simple heuristic: return first 2 sentences or a trimmed version
    const sentences = notes.split(/(?<=[.!?])\s+/);
    return sentences.slice(0, 2).join(" ").slice(0, 300);
}

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

    if (!logs || logs.length === 0) {
        return <div className="summary-empty">No data yet — add some work to see a summary.</div>;
    }

    const notesSnippet = summarizeNotes(combinedNotes);

    return (
        <div className="summary">
            <div className="summary-box">
                <p><strong>Total hours:</strong> {totalHours}</p>
                <p><strong>Categories:</strong> {Object.keys(categoryCounts).length}</p>
                <p><strong>Skills:</strong> {Object.keys(skillCounts).length}</p>
                {topSkill && <p><strong>Top skill:</strong> {topSkill} ({skillCounts[topSkill]}h)</p>}
            </div>

            <div className="summary-ai">
                <h3>Auto-summary</h3>
                <p>
                    You spent <strong>{totalHours} hour{totalHours !== 1 ? "s" : ""}</strong> today across{' '}
                    <strong>{Object.keys(categoryCounts).length}</strong> categor{Object.keys(categoryCounts).length !== 1 ? "ies" : "y"}. {topSkill ? `Most time on ${topSkill}.` : ''}
                </p>

                <h4>By Category</h4>
                <div style={{ fontSize: "0.95em", lineHeight: "1.6" }}>
                    {Object.entries(categoryCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([cat, hrs]) => (
                            <div key={cat}>
                                <strong>{cat}:</strong> {hrs}h
                            </div>
                        ))}
                </div>

                {notesSnippet ? (
                    <>
                        <h4>Notes</h4>
                        <p className="notes-snippet">{notesSnippet}</p>
                    </>
                ) : null}

                <h4>Insights</h4>
                <ul>
                    <li>Consider breaking sessions into focused 25–60 minute blocks for better retention.</li>
                    <li>If you want faster progress, allocate &gt;50% of time to one priority skill for several days.</li>
                    <li>Try setting a small, measurable goal for the next session (example: implement one feature)</li>
                </ul>
            </div>
        </div>
    );
}
