// Main application entry point
import { getLocation } from './geolocation.js';
import { fetchNASAImage, calculateMoonPhase } from './nasaAPI.js';
import { fetchWeatherData } from './weatherAPI.js';
import { saveEntry, loadEntries } from './storage.js';
import { renderHistory } from './render.js';

// Global variables to store current data
let currentMoonPhase = 'Unknown';
let currentPressure = 1013;

// Initialize app
async function init() {
    try {
        console.log('🚀 Initializing Sky & Wellness Tracker...');

        // 1. Get user location
        console.log('📍 Getting location...');
        const coords = await getLocation();
        document.getElementById('location').textContent = `${coords.city}, ${coords.country}`;
        console.log('✅ Location:', coords);

        // 2. Fetch NASA astronomy data
        console.log('🌌 Fetching NASA data...');
        try {
            const nasaData = await fetchNASAImage();
            console.log('✅ NASA data received:', nasaData);

            // Check if it's a moon-related image
            if (nasaData.title.toLowerCase().includes('moon')) {
                // Use NASA image if it's moon-related
                const moonContainer = document.getElementById('moonImageContainer');
                moonContainer.innerHTML = `<img src="${nasaData.url}" alt="${nasaData.title}" class="moon-image">`;
                document.getElementById('moonPhaseName').textContent = nasaData.title;
                currentMoonPhase = nasaData.title;
            } else {
                // Otherwise calculate moon phase
                console.log('ℹ️ NASA image is not moon-related, calculating moon phase...');
                const moonPhase = calculateMoonPhase();
                document.getElementById('moonEmoji').textContent = moonPhase.phaseEmoji;
                document.getElementById('moonPhaseName').textContent = moonPhase.phaseName;
                currentMoonPhase = moonPhase.phaseName;
            }
        } catch (error) {
            console.warn('⚠️ NASA API failed, using calculated moon phase');
            const moonPhase = calculateMoonPhase();
            document.getElementById('moonEmoji').textContent = moonPhase.phaseEmoji;
            document.getElementById('moonPhaseName').textContent = moonPhase.phaseName;
            currentMoonPhase = moonPhase.phaseName;
        }

        // 3. Fetch weather data
        console.log('🌡️ Fetching weather data...');
        const weatherData = await fetchWeatherData(coords.lat, coords.lon);
        console.log('✅ Weather data received:', weatherData);

        document.getElementById('pressure').textContent = `${weatherData.pressure} hPa ☁️`;
        currentPressure = weatherData.pressure;

        // 4. Load wellness history
        console.log('📊 Loading wellness history...');
        const entries = loadEntries();
        renderHistory(entries);
        console.log('✅ History loaded:', entries.length, 'entries');

        console.log('✅ App initialized successfully!');

    } catch (error) {
        console.error('❌ Initialization error:', error);
        document.getElementById('location').textContent = 'Error loading data';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Range input handlers
    const energyLevel = document.getElementById('energyLevel');
    const painLevel = document.getElementById('painLevel');

    energyLevel.addEventListener('input', (e) => {
        document.getElementById('energyValue').textContent = e.target.value;
    });

    painLevel.addEventListener('input', (e) => {
        document.getElementById('painValue').textContent = e.target.value;
    });

    // Form submission handler
    const form = document.getElementById('wellnessForm');
    form.addEventListener('submit', handleFormSubmit);
}

// Handle wellness form submission
function handleFormSubmit(e) {
    e.preventDefault();

    console.log('📝 Submitting wellness entry...');

    const energyLevel = parseInt(document.getElementById('energyLevel').value);
    const painLevel = parseInt(document.getElementById('painLevel').value);
    const notes = document.getElementById('notes').value;

    // Get selected symptoms
    const symptomCheckboxes = document.querySelectorAll('input[name="symptoms"]:checked');
    const symptoms = Array.from(symptomCheckboxes).map(cb => cb.value);

    // Create entry object
    const entry = {
        date: new Date().toISOString(),
        energyLevel,
        painLevel,
        symptoms,
        notes,
        moonPhase: currentMoonPhase,
        pressure: currentPressure
    };

    console.log('Entry data:', entry);

    // Save entry
    const saved = saveEntry(entry);

    if (saved) {
        // Reload and render history
        const entries = loadEntries();
        renderHistory(entries);

        // Reset form
        e.target.reset();
        document.getElementById('energyValue').textContent = '5';
        document.getElementById('painValue').textContent = '5';

        // Success feedback
        alert('✅ Entry logged successfully!');
        console.log('✅ Entry saved to localStorage');
    } else {
        alert('❌ Failed to save entry. Please try again.');
        console.error('❌ Failed to save entry');
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 DOM loaded, starting app...');
    setupEventListeners();
    init();
});