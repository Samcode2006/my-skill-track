export default function Header() {
    return (
        <header className="header">
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontWeight: 800, color: 'var(--accent)' }}>AI Skill Tracker</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>Track practice time & get quick insights</div>
            </div>
        </header>
    );
}
