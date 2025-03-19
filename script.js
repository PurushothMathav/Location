// Initialize map
const map = L.map('map').setView([0, 0], 16); 

// Add tile layer (map style)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let userMarker;
let geofenceCircle;
const radius = 50; // 50 meters

// Function to create or update markers
function updateMarker(lat, lng, inside) {
    if (userMarker) {
        map.removeLayer(userMarker);
    }

    // Set color based on inside/outside status
    const color = inside ? 'green' : 'red';

    userMarker = L.circleMarker([lat, lng], {
        color,
        fillColor: color,
        fillOpacity: 0.8,
        radius: 10
    }).addTo(map);

    // Update status message
    const status = document.getElementById('status');
    status.textContent = inside ? "You are INSIDE the area" : "You are OUTSIDE the area";
    status.className = `status ${inside ? 'inside' : 'outside'}`;

    // Alert user if outside
    if (!inside) {
        alert("You are outside the allowed area!");
    }
}

// Get current location and initialize the circle
navigator.geolocation.watchPosition(
    (position) => {
        const { latitude, longitude } = position.coords;

        // Center map on first location update
        if (!geofenceCircle) {
            map.setView([latitude, longitude], 16);

            // Create geofence circle
            geofenceCircle = L.circle([latitude, longitude], {
                color: 'blue',
                fillColor: '#add8e6',
                fillOpacity: 0.5,
                radius: radius
            }).addTo(map);
        }

        // Calculate distance from geofence
        const distance = map.distance(
            geofenceCircle.getLatLng(),
            L.latLng(latitude, longitude)
        );

        const inside = distance <= radius;
        updateMarker(latitude, longitude, inside);
    },
    (error) => {
        console.error(error);
        alert("Failed to get location!");
    },
    {
        enableHighAccuracy: true, // Use GPS accuracy
        maximumAge: 0,
        timeout: 5000
    }
);
