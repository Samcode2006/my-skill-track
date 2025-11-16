import { getTheme, setTheme } from "./utils/storage.js";

const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const MoonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

export default function Header({ onUndo, onRedo, canUndo, canRedo }) {
    const toggleTheme = () => {
        const currentTheme = getTheme();
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    };

    const currentTheme = getTheme();

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
                    title={currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {currentTheme === "dark" ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>
        </header>
    );
}