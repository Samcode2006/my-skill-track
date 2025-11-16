import { useState } from "react";

const CATEGORIES = ["Programming", "Design", "Languages", "Personal", "Other"];

const UndoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7v6h6"></path>
        <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path>
    </svg>
);

const RedoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 7v6h-6"></path>
        <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"></path>
    </svg>
);

export default function SkillForm({ onAdd, onUndo, onRedo, canUndo, canRedo }) {
    const [skill, setSkill] = useState("");
    const [category, setCategory] = useState("Programming");
    const [hours, setHours] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");

    function reset() {
        setSkill("");
        setCategory("Programming");
        setHours("");
        setNotes("");
        setError("");
    }

    function handleSubmit(e) {
        e.preventDefault();
        const trimmedSkill = skill.trim();
        const parsedHours = Number(hours);

        if (!trimmedSkill) {
            setError("Please enter a skill name.");
            return;
        }
        if (!hours || Number.isNaN(parsedHours) || parsedHours <= 0) {
            setError("Enter a valid number of hours (> 0).");
            return;
        }

        const entry = {
            id: Date.now().toString(),
            date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
            skill: trimmedSkill,
            category: category,
            hours: parsedHours,
            notes: notes.trim(),
            timestamp: new Date().toISOString(),
        };

        onAdd(entry);
        reset();
    }

    return (
        <form onSubmit={handleSubmit} className="skill-form">
            <label>
                Skill
                <input
                    type="text"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    placeholder="e.g. React, Prompt Engineering"
                />
            </label>

            <label>
                Category
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="skill-form-select"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Hours
                <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="e.g. 1.5"
                />
            </label>

            <label>
                Notes (optional)
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Short description of what you did"
                />
            </label>

            <div className="form-actions">
                <button type="submit" className="btn-primary">Add Log</button>
                <button type="button" className="btn-ghost" onClick={reset}>Clear</button>
                <button
                    type="button"
                    className="btn-ghost icon-btn"
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Undo last action"
                >
                    <UndoIcon />
                </button>
                <button
                    type="button"
                    className="btn-ghost icon-btn"
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Redo last action"
                >
                    <RedoIcon />
                </button>
            </div>

            {error && <div className="form-error">{error}</div>}
        </form>
    );
}
