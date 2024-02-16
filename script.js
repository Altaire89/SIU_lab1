let coordinates = [182, 342];

function createMap() {
    const mymap = L.map('sample_map').setView(coordinates, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(mymap);

    mymap.on('click', function(e) {
        console.log(e);
        let destiny = e.coordinates;
    });
    L.marker([40.3, -3.8]).addTo(mymap);
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
