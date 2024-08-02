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

const icCarsPosition = new Map()
for (let i = 0; i < icCars.length; i++) {
    icCarsPosition.set(icCars[i][0], createCircles(colors[i], icCars[i][1]))
}
const elCarsPosition = new Map() 
for (let i = 0; i < elCars.length; i++) {
    elCarsPosition.set(elCars[i][0], createRectangles(colors[i], elCars[i][1]))
}

function createPopup(teamName){
    var popup = L.popup(
    {
        content: `<p>${teamName}</p>`,
        closeButton: false,
        autoClose: false,
        autoPan : false,
        keepInView: true,
        minWidth: 0,
        maxWidth: 30,
        maxHeight: 50
    })
    return popup;
}

function createCircles(color, teamName) {
    var popup = createPopup(teamName);
    var circle = L.circle([0, 0], {
        color: color,
        opacity: 0.5,
        fillOpacity: 1,
    }).addTo(map);
    circle.bindPopup(popup).openPopup();
    return circle;
}

function createRectangles(color, teamName){
    var popup = createPopup(teamName);
    var rectangle = L.rectangle([[0,0],[0,0]], {
        color: color,
        opacity: 0.5,
        fillOpacity: 1,
        maxWidth: 100,
    }).addTo(map);
    rectangle.bindPopup(popup).openPopup();
    return rectangle;
}


function updateCircles(circle, lat, long){
    circle.setLatLng([lat,long]);
}

function updateRectangles(rectangle, lat, long){
    const rectangleSize = [0.00018, 0.0002];
    var topLeftBound = [lat + rectangleSize[0] / 2, long - rectangleSize[1]/2];
    var bottomRightBound = [lat - rectangleSize[0]/2, long + rectangleSize[1]/2];
    rectangle.setBounds([topLeftBound, bottomRightBound]);
}

// Update the position on the map
function updatePosition(latitude, longitude, topic){    
    let carType = String(topic.split("/").at(-2));

    if(carType.startsWith('E') && elCarsPosition.has(topic)){
        updateRectangles(elCarsPosition.get(carType), latitude, longitude)
    }
    else if(icCarsPosition.has(topic)){
        updateCircles(icCarsPosition.get(carType), latitude, longitude)
    }
}

// The handling of the received message
function receiveSignal(message) {
    var data = JSON.parse(message.payloadString)
    if (data._type == "location") {
        var topic = message.destinationName
        updatePosition(data.lat, data.lon, topic)
    }
}

