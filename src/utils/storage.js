const STORAGE_KEY = "ai-skill-tracker-logs-v1";

function loadLogs() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (e) {
        console.error("Failed to load logs", e);
        return [];
    }
}

function saveLogs(logs) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
        console.error("Failed to save logs", e);
    }
}

export function addLog(entry) {
    const logs = loadLogs();
    logs.push(entry);
    saveLogs(logs);
}

export function removeLog(id) {
    const logs = loadLogs().filter((l) => l.id !== id);
    saveLogs(logs);
}

export function getTodayLogs() {
    const today = new Date().toISOString().slice(0, 10);
    return loadLogs().filter((l) => l.date === today).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function clearAll() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error(e);
    }
}

export default {
    loadLogs,
    saveLogs,
    addLog,
    removeLog,
    getTodayLogs,
    clearAll,
};
