import { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import SkillForm from "./SkillForm.jsx";
import DailyLog from "./DailyLog.jsx";
import Summary from "./Summary.jsx";
import { getTodayLogs, addLog, removeLog, getHistory, setTheme, undo, redo, canUndo, canRedo } from "./utils/storage.js";
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
      <Header
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoRedoState.canUndo}
        canRedo={undoRedoState.canRedo}
      />

      <ErrorBoundary>
        <main className="container">
          <h1>AI Skill Tracker</h1>

          <section className="tracker-grid">
            <div className="panel">
              <h2>Log Work</h2>
              <SkillForm onAdd={handleAdd} />
            </div>

            <div className="panel">
              <h2>Today's Logs</h2>
              <DailyLog logs={logs} onRemove={handleRemove} />
            </div>

            <div className="panel wide">
              <h2>Summary & Insights</h2>
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
