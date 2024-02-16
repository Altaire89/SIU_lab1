function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

let coordinates = [182, 342];
let marker;
let destiny;
let mymap; // Declaramos mymap fuera de la función createMap

function createMap() {
    mymap = L.map('sample_map').setView(coordinates, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(mymap);

    marker = L.marker(coordinates).addTo(mymap);

    if (isMobileDevice()) {
        document.getElementById('sample_map').addEventListener('touchend', function(e) {
        if (e.touches.length > 0) { // Verificar si hay algún toque registrado
            const touch = e.touches[0]; // Obtener el primer toque
            const clickedCoordinates = mymap.containerPointToLatLng(L.point(touch.clientX, touch.clientY));
            addMarker([clickedCoordinates.lat, clickedCoordinates.lng]);
        }
    });
    } else{
        mymap.on('click', function(e) {
            const clickedCoordinates = [e.latlng.lat, e.latlng.lng];
            addMarker(clickedCoordinates);
        });
    }
}

if ('geolocation' in navigator) {
    navigator.geolocation.watchPosition(
        (position) => {
            coordinates = [position.coords.latitude, position.coords.longitude];
            createMap();
        },
        (error) => {
            console.error('Error occurred. Geolocation is not available.', error);
            createMap();
        }
    );
} else {
    console.error('Geolocation is not available.');
    createMap();
}

function addMarker(coords) {
    if (destiny) {
        destiny.setLatLng(coords); // Actualizar posición del marcador
    } else {
        destiny = L.marker(coords).addTo(mymap); // Crear nuevo marcador si no existe
    }
}
