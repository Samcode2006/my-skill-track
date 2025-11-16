import { useState } from "react";

const CATEGORIES = ["Programming", "Design", "Languages", "Personal", "Other"];

export default function SkillForm({ onAdd }) {
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
            </div>

            {error && <div className="form-error">{error}</div>}
        </form>
    );
}
