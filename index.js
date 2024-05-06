const gpsSpeedHTML = document.getElementById("gpsSpeedChart");
const brakeHTML = document.getElementById("brakeChart");
const throttleHTML = document.getElementById("throttleChart");

const gpsSpeedText = document.getElementById("gpsSpeedText");
const brakeText = document.getElementById("brakeText");
const throttleText = document.getElementById("throttleText");


const gpsSpeedHTMLValue = document.getElementById("gpsSpeedValue")
const RPMHTMLValue = document.getElementById("RPMValue");
const gearHTMLValue = document.getElementById("gearValue");


// GPS SPEED CHART
const gpsSpeedData = {
    datasets: [{
        data: [0, 300, 60],
        backgroundColor: [
            'blue',
            'rgb(0,0,0,0.5)',
            'rgb(0,0,0,0)'
        ],
        weight: 2,
    }]
};
const gpsSpeedConfig = {
    type: 'doughnut',
    data: gpsSpeedData,
    options: {
        cutout: "80%",
        radius: "45%",
        borderColor: "rgb(0,0,0,0)",
        rotation: 210
    },
};
let gpsSpeedChart = new Chart(gpsSpeedHTML, gpsSpeedConfig)

// Creating the numbers in the gpsSpeedChart
const gpsSpeedTextData = {
    datasets: [{
        data: [42.8571429,42.8571429,42.8571429,42.8571429,42.8571429,42.8571429,42.8571429,60],
        backgroundColor: "rgb(0,0,0,0)",
        weight: 2,
    }]
};
const gpsSpeedTextConfig = {
    type: 'doughnut',
    data: gpsSpeedTextData,
    options: {
        cutout: "80%",
        radius: "45%",
        borderColor: "rgb(0,0,0,0)",
        rotation: 210,
        plugins: {
            labels: {
                render: (chart)=> {
                    if(chart.index == 7){
                        return;
                    }
                    return `${chart.index * 20}`;
                },
                arc: true,
                fontStyle: "bold",
                fontSize: 6,
                overlap: false,
                fontFamily: "Helvetica",
                textShadow: true,
                fontColor: "white",
            }
        }
    },
};
let gpsSpeedTextChart = new Chart(gpsSpeedText, gpsSpeedTextConfig)

// THROTTLE  CHART
const throttleData = {
    datasets: [{
        data: [0, 180, 180],
        backgroundColor: [
            'green',
            'rgb(0,0,0,0.2)',
            'rgb(0,0,0,0)'
        ],
        weight: 2,
        borderWidth: 0.5,
        hoverOffset: 4
    }]
};
const throttleConfig = {
    type: 'doughnut',
    data: throttleData,
    options: {
        cutout: "80%",
        radius: "30%",
        borderColor: "rgb(0,0,0,0)",
        rotation: -150
    },
};
let throttleChart = new Chart(throttleHTML, throttleConfig);

//Creating the "THROTTLE" text
const throttleTextData = {
    datasets: [{
        data: [0, 180, 180],
        backgroundColor: "rgb(0,0,0,0)",
        weight: 2,
        borderWidth: 0.5,
        hoverOffset: 4
    }]
};
const throttleTextConfig = {
    type: 'doughnut',
    data: throttleTextData,
    options: {
        cutout: "80%",
        radius: "30%",
        borderColor: "rgb(0,0,0,0)",
        rotation: -150,
        plugins: {
            labels: {
                render:(chart)=>{ 
                    if(chart.index == 1){
                        return "THROTTLE"
                    }
                },
                arc: true,
                fontStyle: "bold",
                fontSize: 7,
                fontFamily: "Helvetica",
                textShadow: true,
                fontColor: "white"
            },
            
        }
    },
};
let throttleTextChart = new Chart(throttleText, throttleTextConfig);

// BRAKE  CHART
const brakeData = {
    datasets: [{
        data: [0, 120, 360],
        backgroundColor: [
            'red',
            'rgb(0,0,0,0.2)',
            'rgb(0, 0, 0,0)'
        ],
        weight: 2,
        borderWidth: 0.5,
        hoverOffset: 4,
    }]
};
const brakeConfig = {
    type: 'doughnut',
    data: brakeData,
    options: {
        cutout: "80%",
        radius: "30%",
        borderColor: "rgb(0,0,0,0)",
        rotation: 56,
    }
};
let brakeChart = new Chart(brakeHTML, brakeConfig);
// Creating the "BRAKE" text
const brakeTextData = {
    datasets: [{
        data: [0, 120, 360],
        backgroundColor: "rgb(0,0,0,0)",
        weight: 2,
        borderWidth: 0.5,
        hoverOffset: 4,
    }]
};
const brakeTextConfig = {
    type: 'doughnut',
    data: brakeTextData,
    options: {
        cutout: "80%",
        radius: "30%",
        borderColor: "rgb(0,0,0,0)",
        rotation: 56,
        plugins: {
            labels: {
                render:(chart)=>{ 
                    if(chart.index == 1){
                        return "BRAKE";
                    }
                },
                arc: true,
                overlap: true,
                fontStyle: "bold",
                fontSize: 7,
                fontFamily: "Helvetica",
                fontColor: "white"
            }
        }
    }
};
let brakeTextChart = new Chart(brakeText, brakeTextConfig);

// Updating data
function updateGpsSpeed(gpsSpeed) {
    gpsSpeedHTMLValue.innerText = gpsSpeed;
    if (gpsSpeed > 120) { // This avoids the breaking of the Chart
        gpsSpeed = 120
    }
    gpsSpeed *= 2.5; // It converts the gpsSpeed to a appropriate value in the chart  (2.5 = 300 / 120)
    gpsSpeedChart.data.datasets[0].data[0] = gpsSpeed;
    gpsSpeedChart.data.datasets[0].data[1] = 300 - gpsSpeed;
    gpsSpeedChart.update();
}

function updateRPM(rpm) {
    RPMHTMLValue.innerText = rpm;
}

function updateGear(gear) {
    gearHTMLValue.innerText = gear;
}

function updateThrottlePosition(throttlePosition) {
    throttleChart.data.datasets[0].data[0] = throttlePosition * 180
    throttleChart.data.datasets[0].data[1] = 180 - throttlePosition * 180
    throttleChart.update()
}

function updateBrakePressure(brakePressure) {
    brakeChart.data.datasets[0].data[0] = brakePressure
    brakeChart.data.datasets[0].data[1] = 120 - brakePressure
    brakeChart.update()
}

// The handling of the received message
function receiveSignal(message) {
    console.log(message);
    switch (message.name) {
        case "pd01_dcu":
            updateGpsSpeed(message.fields.gps_speed);
            updateRPM(message.fields.engine_rpm);
            updateGear(message.fields.gear);
            break
        case "pd03_dcu":
            const brakePressure = message.fields.brake_pressure_front + message.fields.brake_pressure_rear
            updateBrakePressure(brakePressure)
            break
        case "pd06_dcu":
            updateThrottlePosition(message.fields.throttle_position)
            break
    }
}




//  Variables
var WebSocket_MQTT_Broker_URL = "";
var MQTT_Client_ID = "";
var MQTT_Topic = "";
var MQTT_Client = "";


function mqtt_Connect_with_Broker() {

    // Set variables
    WebSocket_MQTT_Broker_URL = document.getElementById("txt_MQTT_Broker_URL").value;
    MQTT_Client_ID = document.getElementById("txt_MQTT_Client_ID").value;

    // Create a MQTT Client nstance 
    MQTT_Client = new Paho.MQTT.Client(WebSocket_MQTT_Broker_URL, MQTT_Client_ID);

    // set callback handlers
    MQTT_Client.onConnectionLost = onConnectionLost;
    MQTT_Client.onMessageArrived = onMessageArrived;

    MQTT_Client.connect({ onSuccess: onConnect, userName: "public", password: "public" });


}

// Subscribe to MQTT Topic
function mqtt_Subscribe_to_Topic() {
    let MQTT_Subscribe_Topic = document.getElementById("txt_MQTT_Subscribe_Topic").value;
    MQTT_Client.subscribe(MQTT_Subscribe_Topic);
    Set_New_Console_Msg("Subscribed to MQTT Topic: " + "\"" + MQTT_Subscribe_Topic + "\"");
}

// Send MQTT Message 
function mqtt_Publish_Message() {
    message = new Paho.MQTT.Message(document.getElementById("txt_MQTT_Msg").value);
    message.destinationName = document.getElementById("txt_MQTT_Publish_Topic").value;
    MQTT_Client.send(message);
    Set_New_Console_Msg("Published " + "\"" + document.getElementById("txt_MQTT_Msg").value + "\"" + "to MQTT Topic: " + "\"" + document.getElementById("txt_MQTT_Publish_Topic").value + "\"");
}

// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    Set_New_Console_Msg("Connected with MQTT Broker: " + "\"" + document.getElementById("txt_MQTT_Broker_URL").value + "\"");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        Set_New_Console_Msg("Connection Lost with MQTT Broker. Error: " + "\"" + responseObject.errorMessage + "\"");
    }
}

// called when a message arrives
function onMessageArrived(message) {
    Set_New_Console_Msg("MQTT Message Received. " + " Message: " + "\"" + JSON.stringify(message.payloadString) + "\"" + " MQTT Topic: " + "\"" + message.destinationName + "\"" + " QoS Value: " + "\"" + message.qos + "\"");
    receiveSignal(message.payloadString); //Updating data when a message arrives
}


// Document Ready Event
$(document).ready(function () {
    //Set default MQTT Broker WebSocket URL
    document.getElementById("txt_MQTT_Broker_URL").value = "ws://mqtt.maua.br:8083/mqtt";
    //Generate Random MQTT Clinet ID
    gen_MQTT_Client_ID();

})


// Set MQTT Messages to TextArea
function Set_New_Console_Msg(text) {
    document.getElementById("txtAr_Console").value = document.getElementById("txtAr_Console").value + get_Fromatted_Time().toString() + ":  " + text + "\n";
    document.getElementById("txtAr_Console").scrollTop = document.getElementById("txtAr_Console").scrollHeight;
}

//Clear Console
function clear_Console() {
    document.getElementById("txtAr_Console").value = "";
}

// Get Formatted time in Hour:Minute:Seconds AM/PM format
function get_Fromatted_Time() {
    var dt = new Date();
    var hours = dt.getHours() == 0 ? "12" : dt.getHours() > 12 ? dt.getHours() - 12 : dt.getHours();
    var minutes = (dt.getMinutes() < 10 ? "0" : "") + dt.getMinutes();
    var seconds = dt.getSeconds();
    var ampm = dt.getHours() < 12 ? "AM" : "PM";
    var formattedTime = hours + ":" + minutes + ":" + seconds + " " + ampm;
    return formattedTime;
}

// Randomly generate Client ID
function gen_MQTT_Client_ID() {
    document.getElementById("txt_MQTT_Client_ID").value = Math.floor(100000000000 + Math.random() * 900000000000);
}

