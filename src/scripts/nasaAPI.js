// NASA API module - fetches real astronomy data

const NASA_API_KEY = 'dPCpzfKzMJBOLczqOI7UR1hqJgJ5QuejaAfeVbgM'; //key

// Fetch Astronomy Picture of the Day
export async function fetchNASAImage() {
    try {
        const response = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`NASA API error: ${response.status}`);
        }

        const data = await response.json();

        console.log('NASA API Response:', data); // 

        return {
            url: data.url,
            title: data.title,
            explanation: data.explanation,
            date: data.date
        };
    } catch (error) {
        console.error('NASA API fetch error:', error);
        throw error;
    }
}

// Calculate moon phase 
export function calculateMoonPhase() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const c = Math.floor((year - 2000) / 100);
    const e = 2 * c - Math.floor(c / 4);
    const jd = 365.25 * (year + 4716) + 30.6001 * (month + 1) + day + e - 1524.5;
    const daysSinceNew = (jd - 2451549.5) % 29.53;
    const phase = daysSinceNew / 29.53;

    let phaseName = '';
    let phaseEmoji = '';

    if (phase < 0.125) {
        phaseName = 'New Moon';
        phaseEmoji = '🌑';
    } else if (phase < 0.25) {
        phaseName = 'Waxing Crescent';
        phaseEmoji = '🌒';
    } else if (phase < 0.375) {
        phaseName = 'First Quarter';
        phaseEmoji = '🌓';
    } else if (phase < 0.5) {
        phaseName = 'Waxing Gibbous';
        phaseEmoji = '🌔';
    } else if (phase < 0.625) {
        phaseName = 'Full Moon';
        phaseEmoji = '🌕';
    } else if (phase < 0.75) {
        phaseName = 'Waning Gibbous';
        phaseEmoji = '🌖';
    } else if (phase < 0.875) {
        phaseName = 'Last Quarter';
        phaseEmoji = '🌗';
    } else {
        phaseName = 'Waning Crescent';
        phaseEmoji = '🌘';
    }

    return { phaseName, phaseEmoji };
}