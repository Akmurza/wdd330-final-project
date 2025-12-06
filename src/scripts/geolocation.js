// Geolocation module

export async function getLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({ lat: 33.9526, lon: -84.5499, city: 'Marietta', country: 'USA' });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                    );
                    const data = await response.json();

                    resolve({
                        lat,
                        lon,
                        city: data.address.city || data.address.town || 'Unknown',
                        country: data.address.country || 'Unknown'
                    });
                } catch (error) {
                    resolve({ lat, lon, city: 'Unknown', country: 'Unknown' });
                }
            },
            () => {
                resolve({ lat: 33.9526, lon: -84.5499, city: 'Marietta', country: 'USA' });
            }
        );
    });
}