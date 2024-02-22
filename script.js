function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/* Inicializamos el mapa con los marcadores y las coordenadas. Además de la ruta y las variables necesarias para
el funcionamiento en dispositivos móviles.*/
let coordinates = [182, 342];
let marker;
let destiny;
let mymap;
let isLocationSelected = false;
let isTouchMoving = false;
let route;

document.getElementById('centerButton').addEventListener('click', centerLocation);
document.getElementById('confirmButton').addEventListener('click', confirmLocation);
document.getElementById('cancelButton').addEventListener('click', cancelLocation);

function createMap() {
    //Crea el mapa y el marcador de posición si se dispone de geolocalización.
    mymap = L.map('sample_map').setView(coordinates, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(mymap);

    marker = L.marker(coordinates).addTo(mymap);


    //Si estamos en un dispositivo móvil. Necesitamos los eventos touchstart, touchmove y touchend.
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
    //El botón centrar centra el zoom de la posición actual a X.
    mymap.setView(coordinates, 15);
}

function addMarker(coords) {
    //Crea o actualiza el marcador de la posición de destino.
    if (destiny) {
        destiny.setLatLng(coords);
    } else {
        destiny = L.marker(coords).addTo(mymap);
    }
}

function confirmLocation(){
    /*Si hay un destino marcado y no estamos en ruta. El botón de confirmación establece la ruta entre los dos puntos
    y la añade al mapa. Dibujamos la linea de la ruta.*/
    if (destiny && marker && !isLocationSelected) {
        // Eliminamos la ruta existente si la hay.
        if (route) {
            mymap.removeControl(route);
            route = null;
        }

        isLocationSelected = true;
        document.getElementById('confirmButton').style.backgroundColor = '#07f223';
        document.getElementById('cancelButton').style.backgroundColor = '';
        
        // Conseguimos las coordenadas de los marcadores de posición actual y destino.
        const markerCoords = marker.getLatLng();
        const destinyCoords = destiny.getLatLng();
        
        // Crear una nueva instancia de la clase Routing de Leaflet.
        route = L.Routing.control({
            waypoints: [
                L.latLng(markerCoords.lat, markerCoords.lng),
                L.latLng(destinyCoords.lat, destinyCoords.lng)
            ],
            routeWhileDragging: true,
            lineOptions: {
                styles: [{color: 'blue', opacity: 0.6, weight: 6}]
            }
        }).addTo(mymap);
        
        // Ajustamos zoom del mapa para que se pueda visualizar bien toda la ruta.
        const bounds = L.latLngBounds([markerCoords, destinyCoords]);
        mymap.fitBounds(bounds);
    }
}

function cancelLocation(){
    //Restaura los botones y borramos la ruta establecida.
    isLocationSelected = false;
    document.getElementById('confirmButton').style.backgroundColor = ''; 
    document.getElementById('cancelButton').style.backgroundColor = '';
    
    // Quitamos la capa de la ruta del mapa.
    if (route) {
        mymap.removeControl(route);
        route = null; // Establecemos la variable route a null para indicar que la ruta ha sido eliminada.
    }
}

setInterval(isNearDestiny, 1000);

function isNearDestiny() {
    const vibrateZone = 500; // Radio de la zona de vibración en metros.
    
    if (destiny && marker && isLocationSelected) {
        const markerCoords = marker.getLatLng();
        const destinyCoords = destiny.getLatLng();
        const distance = markerCoords.distanceTo(destinyCoords);
        
        if (distance <= vibrateZone) {
            navigator.vibrate(15000); // Vibrar durante 15 segundos.
        }
    }
}