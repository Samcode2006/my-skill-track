import React from "react";

export default function DailyLog({ logs = [], onRemove }) {
    const totalHours = logs.reduce((s, l) => s + Number(l.hours || 0), 0);

    return (
        <div className="daily-log">
            {logs.length === 0 ? (
                <div className="empty">No logs for today yet.</div>
            ) : (
                <>
                    <ul className="log-list">
                        {logs.map((log) => (
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

                    <div className="log-total">Total hours today: <strong>{totalHours}</strong></div>
                </>
            )}
        </div>
    );
}
