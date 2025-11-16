const STORAGE_KEY = "ai-skill-tracker-logs-v1";
const UNDO_REDO_KEY = "ai-skill-tracker-history-v1";
const THEME_KEY = "ai-skill-tracker-theme";

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

// Undo/Redo History Management
export function getHistory() {
    try {
        const raw = localStorage.getItem(UNDO_REDO_KEY);
        if (!raw) return { past: [], present: loadLogs(), future: [] };
        return JSON.parse(raw);
    } catch (e) {
        console.error("Failed to load history", e);
        return { past: [], present: loadLogs(), future: [] };
    }
}

export function saveHistory(past, present, future) {
    try {
        localStorage.setItem(UNDO_REDO_KEY, JSON.stringify({ past, present, future }));
        saveLogs(present);
    } catch (e) {
        console.error("Failed to save history", e);
    }
}

export function pushToHistory(currentLogs) {
    const history = getHistory();
    history.past.push(history.present);
    history.present = JSON.parse(JSON.stringify(currentLogs));
    history.future = [];
    saveHistory(history.past, history.present, history.future);
}

export function undo() {
    const history = getHistory();
    if (history.past.length === 0) return null;

    const previous = history.past.pop();
    history.future.unshift(history.present);
    history.present = previous;
    saveHistory(history.past, history.present, history.future);
    return history.present;
}

export function redo() {
    const history = getHistory();
    if (history.future.length === 0) return null;

    const next = history.future.shift();
    history.past.push(history.present);
    history.present = next;
    saveHistory(history.past, history.present, history.future);
    return history.present;
}

export function canUndo() {
    const history = getHistory();
    return history.past.length > 0;
}

export function canRedo() {
    const history = getHistory();
    return history.future.length > 0;
}

// Theme Management
export function getTheme() {
    return localStorage.getItem(THEME_KEY) || "dark";
}

export function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === "light") {
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.remove("light-theme");
    }
}

export function addLog(entry) {
    const logs = loadLogs();
    logs.push(entry);
    pushToHistory(logs);
}

export function removeLog(id) {
    const logs = loadLogs().filter((l) => l.id !== id);
    pushToHistory(logs);
}

export function getTodayLogs() {
    const today = new Date().toISOString().slice(0, 10);
    return loadLogs().filter((l) => l.date === today).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function clearAll() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(UNDO_REDO_KEY);
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
    getHistory,
    saveHistory,
    pushToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    getTheme,
    setTheme,
};
