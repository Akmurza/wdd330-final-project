// ИМПОРТЫ в начале файла
import { getLocation } from './geolocation.js';
import { calculateMoonPhase } from './nasaAPI.JS';
import { fetchWeatherData } from './weatherAPI.js';
import { saveEntry, loadEntries } from './storage.js';
import { renderHistory } from './ui.js';

// Initialize app
async function init() {
    try {
        // Get location
        const coords = await getLocation();
        document.getElementById('location').textContent = `${coords.city}, ${coords.country}`;

        // Get moon phase
        const moonPhase = calculateMoonPhase();
        document.getElementById('moonEmoji').textContent = moonPhase.phaseEmoji;
        document.getElementById('moonPhaseName').textContent = moonPhase.phaseName;

        // Get weather data
        const weatherData = await fetchWeatherData(coords.lat, coords.lon);
        document.getElementById('pressure').textContent = `${weatherData.pressure} hPa ☁️`;

        // Store current data for form submission
        window.currentMoonPhase = moonPhase.phaseName;
        window.currentPressure = weatherData.pressure;

        // Load history
        renderHistory(loadEntries());

    } catch (error) {
        console.error('Init error:', error);
    }
}

// Setup event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Range inputs
    document.getElementById('energyLevel').addEventListener('input', (e) => {
        document.getElementById('energyValue').textContent = e.target.value;
    });

    document.getElementById('painLevel').addEventListener('input', (e) => {
        document.getElementById('painValue').textContent = e.target.value;
    });

    // Form submission
    document.getElementById('wellnessForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const energyLevel = parseInt(document.getElementById('energyLevel').value);
        const painLevel = parseInt(document.getElementById('painLevel').value);
        const notes = document.getElementById('notes').value;

        const symptomCheckboxes = document.querySelectorAll('input[name="symptoms"]:checked');
        const symptoms = Array.from(symptomCheckboxes).map(cb => cb.value);

        const entry = {
            date: new Date().toISOString(),
            energyLevel,
            painLevel,
            symptoms,
            notes,
            moonPhase: window.currentMoonPhase || 'Unknown',
            pressure: window.currentPressure || 1013
        };

        saveEntry(entry);
        renderHistory(loadEntries());

        e.target.reset();
        document.getElementById('energyValue').textContent = '5';
        document.getElementById('painValue').textContent = '5';

        alert('✅ Entry logged successfully!');
    });

    // Initialize
    init();
});