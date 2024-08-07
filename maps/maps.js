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
const h2CarsPosition = new Map()
for (let i = 0; i < h2Cars.length; i++){
    h2CarsPosition.set(h2Cars[i][0], [
        createTriangles(colors[i], h2Cars[i][1]),
        writeCarIdText(h2Cars[i][0])
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
        radius: 13
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
    var triangle = L.polygon([[0,0], [0,0]], {
        color: color,
        opacity: 0.5,
        fillOpacity: 1
    }).addTo(map);
    triangle.bindTooltip(tooltip).openTooltip();
    return triangle;
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

function updateTriangles(triangle, lat, long) {
    const circumcircleRadius = [0.00015, 0.0002]
    var topPoint = [lat + circumcircleRadius[0] * 3 / 2, long]
    var leftPoint = [lat - circumcircleRadius[0] / 2, long - circumcircleRadius[1] * Math.sqrt(3) / 2]
    var rightPoint = [lat - circumcircleRadius[0] / 2, long + circumcircleRadius[1] * Math.sqrt(3) / 2]
    triangle.setLatLngs([topPoint, leftPoint, rightPoint])
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
    else if(carType.startsWith('H2') && h2CarsPosition.has(carType)) {
        updateTriangles(h2CarsPosition.get(carType)[0], latitude, longitude)
        updateCarIdText(h2CarsPosition.get(carType)[1], latitude, longitude)
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

