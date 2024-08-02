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
    icCarsPosition.set(icCars[i][0], [
        createCircles(colors[i], icCars[i][1]),
        writeCarIdText(icCars[i][0])
    ]
    )
}
const evCarsPosition = new Map()
for (let i = 0; i < evCars.length; i++) {
    evCarsPosition.set(evCars[i][0], [
        createRectangles(colors[i], evCars[i][1]),
        writeCarIdText(evCars[i][0])
    ]
    )
}
console.log(evCarsPosition.get('EV02')[0])



function createPopup(teamName) {
    var popup = L.popup(
        {
            content: `<p>${teamName}</p>`,
            closeButton: false,
            autoClose: false,
            autoPan: false,
            keepInView: true,
            minWidth: 0,
            maxWidth: 30,
            maxHeight: 50
        })
    return popup;
}

function writeCarIdText(carId) {
    var carIdText = L.popup()
    carIdText.setContent(`<p>${carId}</p>`);
    carIdText.setLatLng([0, 0]);
    return carIdText;
}

function updateCarIdText(carIdText, lat, long) {
    // carIdText.setLanLng([lat, long])
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

function createRectangles(color, teamName) {
    var popup = createPopup(teamName);
    var rectangle = L.rectangle([[0, 0], [0, 0]], {
        color: color,
        opacity: 0.5,
        fillOpacity: 1,
        maxWidth: 100,
    }).addTo(map);
    rectangle.bindPopup(popup).openPopup();
    return rectangle;
}


function updateCircles(circle, lat, long) {
    circle.setLatLng([lat, long]);
}

function updateRectangles(rectangle, lat, long) {
    const rectangleSize = [0.00018, 0.0002];
    var topLeftBound = [lat + rectangleSize[0] / 2, long - rectangleSize[1] / 2];
    var bottomRightBound = [lat - rectangleSize[0] / 2, long + rectangleSize[1] / 2];
    rectangle.setBounds([topLeftBound, bottomRightBound]);
}

// Update the position on the map
function updatePosition(latitude, longitude, topic) {
    let carType = String(topic.split("/").at(-2));
    
    if (carType.startsWith('EV') && evCarsPosition.has(carType)) {
        updateRectangles(evCarsPosition.get(carType)[0], latitude, longitude)
        updateCarIdText(evCarsPosition.get(carType)[1], latitude, longitude)
    }
    else if (carType.startsWith('IC') && icCarsPosition.has(carType)) {
        updateCircles(icCarsPosition.get(carType)[0], latitude, longitude)
        updateCarIdText(icCarsPosition.get(carType)[1], latitude, longitude)
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

