import React from "react";

export default function DailyLog({ logs = [], onRemove }) {
    const totalHours = logs.reduce((s, l) => s + Number(l.hours || 0), 0);

    // Group logs by category
    const grouped = logs.reduce((acc, log) => {
        const category = log.category || "Other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(log);
        return acc;
    }, {});

    const categories = Object.keys(grouped).sort();

    return (
        <div className="daily-log">
            {logs.length === 0 ? (
                <div className="empty">No logs for today yet.</div>
            ) : (
                <>
                    {categories.map((category) => (
                        <div key={category} className="skill-category">
                            <div className="category-label">{category}</div>
                            <ul className="log-list">
                                {grouped[category].map((log) => (
                                    <li key={log.id} className="log-item">
                                        <div className="log-main">
                                            <div className="skill">{log.skill}</div>
                                            <div className="hours">{log.hours}h</div>
                                        </div>
                                        {log.notes && <div className="notes">{log.notes}</div>}
                                        <div className="log-actions">
                                            <button className="btn-ghost small" onClick={() => onRemove(log.id)}>Remove</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div className="log-total">Total hours today: <strong>{totalHours}</strong></div>
                </>
            )}
        </div>
    );
}
