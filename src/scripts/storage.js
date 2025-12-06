// Storage module

const STORAGE_KEY = 'wellness_entries';

export function saveEntry(entry) {
    try {
        const entries = loadEntries();
        entries.unshift(entry);
        if (entries.length > 30) entries.length = 30;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        return true;
    } catch (error) {
        console.error('Error saving entry:', error);
        return false;
    }
}

export function loadEntries() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading entries:', error);
        return [];
    }
}