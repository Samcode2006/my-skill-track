import { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import SkillForm from "./SkillForm.jsx";
import DailyLog from "./DailyLog.jsx";
import Summary from "./Summary.jsx";
import { getTodayLogs, addLog, removeLog } from "./utils/storage.js";
import ErrorBoundary from "./ErrorBoundary.jsx";

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(getTodayLogs());
  }, []);

  function handleAdd(entry) {
    addLog(entry);
    setLogs(getTodayLogs());
  }

  function handleRemove(id) {
    removeLog(id);
    setLogs(getTodayLogs());
  }
  return (
    <div className="app-root">
      <Header />

      <ErrorBoundary>
        <main className="container">
          <h1>AI Skill Tracker (Front-end)</h1>

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
