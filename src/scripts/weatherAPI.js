// Weather API module

export async function fetchWeatherData(lat, lon) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=surface_pressure&timezone=auto`
        );
        const data = await response.json();
        return {
            pressure: Math.round(data.current.surface_pressure)
        };
    } catch (error) {
        console.error('Weather API error:', error);
        return { pressure: 1013 };
    }
}