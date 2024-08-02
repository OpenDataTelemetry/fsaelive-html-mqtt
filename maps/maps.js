var map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    doubleClickZoom: false,
    scrollWheelZoom: false
}).setView([-22.738833, -47.533014], 17);
var imageUrl = `src/${mapName}.png`,
    imageBounds = [[-22.736874, -47.536211], [-22.740792, -47.529817]];
image = L.imageOverlay(imageUrl, imageBounds, {
    interactive: false
}).addTo(map);
function changeMap(mapName) {
    imageUrl = `src/${mapName}.png`,
        image.setUrl(imageUrl)
}
const carPosition = {}
function createCircles(lat, long) {
    var circle = L.circle([lat, long], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 10
    }).addTo(map);
    return circle;
}

// Update the position on the map
function updatePosition(latitude, longitude){
    console.log(latitude)
    console.log(longitude)
    if (carPosition.position != undefined) carPosition.position.remove();
    carPosition.position = createCircles(latitude, longitude);
    console.log(carPosition)
}

// The handling of the received message
function receiveSignal(message) {
    var data = JSON.parse(message.payloadString)
    switch (data.name) {
        case "pd07_dcu":
            updatePosition(data.fields.gps_latitude, data.fields.gps_longitude)
            break
    }
}

