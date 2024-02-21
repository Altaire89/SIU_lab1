function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

let coordinates = [182, 342];
let marker;
let destiny;
let mymap; // Declaramos mymap fuera de la función createMap
let isLocationSelected = false;
let isTouchMoving = false;

document.getElementById('centerButton').addEventListener('click', centerLocation);
document.getElementById('confirmButton').addEventListener('click', confirmLocation);
document.getElementById('cancelButton').addEventListener('click', cancelLocation);

function createMap() {
    mymap = L.map('sample_map').setView(coordinates, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(mymap);

    marker = L.marker(coordinates).addTo(mymap);


    
    if (isMobileDevice()) {
        document.getElementById('sample_map').addEventListener('touchstart', function() {
            isTouchMoving = false;
        });

        document.getElementById('sample_map').addEventListener('touchmove', function() {
            isTouchMoving = true;
        });

        document.getElementById('sample_map').addEventListener('touchend', function(e) {
            if (!isTouchMoving && e.changedTouches.length > 0 && !isLocationSelected) {
                const touch = e.changedTouches[0];
                const clickedCoordinates = mymap.containerPointToLatLng(L.point(touch.clientX, touch.clientY));
                addMarker([clickedCoordinates.lat, clickedCoordinates.lng]);
            }
        });
    
    } else{
        mymap.on('click', function(e) {
            const clickedCoordinates = [e.latlng.lat, e.latlng.lng];
            if (!isLocationSelected){
                addMarker(clickedCoordinates);
            }
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

function centerLocation() {
    mymap.setView(coordinates, 15);
}

function confirmLocation(){
    isLocationSelected = true;
    const confirmButton = document.getElementById('confirmButton');
    confirmButton.style.backgroundColor = '#07f223';
    const cancelButton = document.getElementById('cancelButton');
    cancelButton.style.backgroundColor = '#ff0000';
}

function cancelLocation(){
    isLocationSelected = false;
    const confirmButton = document.getElementById('confirmButton');
    confirmButton.style.backgroundColor = '#aeb8c1';
    const cancelButton = document.getElementById('cancelButton');
    cancelButton.style.backgroundColor = '#aeb8c1';
}

function addMarker(coords) {
    if (destiny) {
        destiny.setLatLng(coords); // Actualizar posición del marcador
    } else {
        destiny = L.marker(coords).addTo(mymap); // Crear nuevo marcador si no existe
    }
}
