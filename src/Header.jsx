import { getTheme, setTheme } from "./utils/storage.js";

export default function Header({ onUndo, onRedo, canUndo, canRedo }) {
    const toggleTheme = () => {
        const currentTheme = getTheme();
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    };

    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontWeight: 800, color: 'var(--accent)' }}>AI Skill Tracker</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>Track practice time & get quick insights</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="undo-redo-buttons">
                    <button
                        className="undo-redo-btn"
                        onClick={onUndo}
                        disabled={!canUndo}
                        title="Undo last action"
                    >
                        ↶ Undo
                    </button>
                    <button
                        className="undo-redo-btn"
                        onClick={onRedo}
                        disabled={!canRedo}
                        title="Redo last action"
                    >
                        ↷ Redo
                    </button>
                </div>
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    title="Toggle dark/light theme"
                >
                    🌙 / ☀️
                </button>
            </div>
        </header>
    );
}
