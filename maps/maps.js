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
    ])
}
const evCarsPosition = new Map()
for (let i = 0; i < evCars.length; i++) {
    evCarsPosition.set(evCars[i][0], [
        createRectangles(colors[i], evCars[i][1]),
        writeCarIdText(evCars[i][0])
    ])

}


function writeCarNameText(teamName) {
    var tooltip = L.tooltip(
        {
            content: `<p>${teamName}</p>`,
            permanent: true,
            direction: "center",
            className: "carNameText",
            opacity: 1
        })
    return tooltip;
}

function writeCarIdText(carId) {
    var carIdText = L.tooltip([0, 0], {
        content: `<p>${carId}</p>`,
        permanent: true,
        direction: "center",
        className: "carIdText",
        opacity: 1
    }).addTo(map);

    return carIdText;
}
function updateCarIdText(carIdText, lat, long){
    carIdText.setLatLng([lat, long])
}

function createCircles(color, teamName) {
    var tooltip = writeCarNameText(teamName);
    var circle = L.circle([0, 0], {
        color: color,
        opacity: 0.5,
        fillOpacity: 1,
    }).addTo(map);
    circle.bindTooltip(tooltip).openTooltip();
    return circle;
}

function createRectangles(color, teamName) {
    var tooltip = writeCarNameText(teamName);
    var rectangle = L.rectangle([[0, 0], [0, 0]], {
        color: color,
        opacity: 0.5,
        fillOpacity: 1,
        maxWidth: 100,
    }).addTo(map);
    rectangle.bindTooltip(tooltip).openTooltip();
    return rectangle;
}

function createTriangles(color, teamName){
    var tooltip = writeCarNameText(teamName);
    var triangle;
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

