import { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import SkillForm from "./SkillForm.jsx";
import DailyLog from "./DailyLog.jsx";
import Summary from "./Summary.jsx";
import { getTodayLogs, addLog, removeLog, setTheme, undo, redo, canUndo, canRedo } from "./utils/storage.js";
import ErrorBoundary from "./ErrorBoundary.jsx";

function App() {
  const [logs, setLogs] = useState([]);
  const [undoRedoState, setUndoRedoState] = useState({ canUndo: false, canRedo: false });

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem("ai-skill-tracker-theme") || "dark";
    setTheme(savedTheme);

    // Initialize logs
    setLogs(getTodayLogs());
    updateUndoRedoState();
  }, []);

  function updateUndoRedoState() {
    setUndoRedoState({ canUndo: canUndo(), canRedo: canRedo() });
  }

  function handleAdd(entry) {
    addLog(entry);
    setLogs(getTodayLogs());
    updateUndoRedoState();
  }

  function handleRemove(id) {
    removeLog(id);
    setLogs(getTodayLogs());
    updateUndoRedoState();
  }

  function handleUndo() {
    const logs = undo();
    if (logs) {
      setLogs(getTodayLogs());
      updateUndoRedoState();
    }
  }

  function handleRedo() {
    const logs = redo();
    if (logs) {
      setLogs(getTodayLogs());
      updateUndoRedoState();
    }
  }

  return (
    <div className="app-root">
      <Header />

      <ErrorBoundary>
        <main className="container">
          <div className="page-heading">
            <div>
              <p className="eyebrow">Daily practice dashboard</p>
              <h1>Build momentum, one session at a time.</h1>
              <p className="page-description">Capture the work you do today and turn it into clear, actionable insight.</p>
            </div>
            <div className="date-card">
              <span className="date-label">Today</span>
              <strong>{new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}</strong>
            </div>
          </div>

          <section className="tracker-grid">
            <div className="panel form-panel">
              <div className="panel-heading">
                <div>
                  <p className="section-kicker">Activity</p>
                  <h2>Log work</h2>
                </div>
                <span className="panel-icon">+</span>
              </div>
              <SkillForm
                onAdd={handleAdd}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={undoRedoState.canUndo}
                canRedo={undoRedoState.canRedo}
              />
            </div>
            <div className="panel">
              <div className="panel-heading">
                <div>
                  <p className="section-kicker">Your progress</p>
                  <h2>Today's logs</h2>
                </div>
                <span className="count-badge">{logs.length}</span>
              </div>
              <DailyLog logs={logs} onRemove={handleRemove} />
            </div>

            <div className="panel wide">
              <div className="panel-heading">
                <div>
                  <p className="section-kicker">Reflection</p>
                  <h2>Summary & insights</h2>
                </div>
              </div>
              <Summary logs={logs} />
            </div>
          </section>
        </main>
      </ErrorBoundary>

      <Footer />
    </div>
  );
}

export default App;
