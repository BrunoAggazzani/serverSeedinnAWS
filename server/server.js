import app from './app.js';
const server = require("http").Server(app);
const ioS = require("socket.io")(server);
////const ioC = require("socket.io-client");
const mqtt = require('mqtt');
const CryptoJS = require("crypto-js");
//import { dataConnect } from "../server/AWS/dataConnectMqtt.js";

// Puerto de escucha servidor
let port = 24180 || process.env.PORT;
server/*app*/.listen(port, () => {
  console.log(' ');
    console.log("server is running in port " + port);
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let id = {
    firma: 'firma',
    sucursal: 'sucursal',
    department: 'depto',
    name: 'webserverRest',
    id: CryptoJS.MD5(getRandomInt(10000).toString()),
    wildcard: 'wilcard'
};

const opts = {
    clientId: JSON.stringify(id),
    clean: false,
    protocolId: 'MQTT',
    protocolVersion: 4
};

let arrayDevices = [];

var fs = require('fs');
fs.readFile('arrayData.json', (err, data)=>{
  if (!err) {
    if (data != undefined && data != null && data != '') {
        arrayDevices = JSON.parse(data);
    }
    arrayDevices.map((elem) => {
      console.log('Device connected: '+elem.name);
    });

    ////ioS.sockets.emit("conectedDevices", arrayDevices);
    ioS.on("connection",  (socket) => {
      socket.emit("conectedDevices", arrayDevices);
    });
  }
});



export const clientMQTT = mqtt.connect('mqtt://192.168.2.158:9000');
//export const clientMQTT = mqtt.connect('mqtt://localhost:9000', opts);

clientMQTT.on('connect', ()=>{  
    if (clientMQTT.connected) {        
        clientMQTT.subscribe('mqtt/demo/connected/res/#');
        clientMQTT.subscribe('mqtt/demo/disconnected/res/#');
        //clientMQTT.subscribe('+/estadoBoton');
    }    
});


clientMQTT.on('message', (topic, message, packet)=>{

    if (topic == "mqtt/demo/connected/res") {
      let MessageSTR = message.toString();
      let Message = MessageSTR.split('{');
      if (Message.length > 1) {
          console.log(JSON.parse(message).name+' se ha conectado por topico '+topic);
          let scale = JSON.parse(message);
          arrayDevices.push(scale);
          setTimeout(() => {
            ioS.sockets.emit("conectedDevices", arrayDevices);            
            ////ioS.on("connection",  (socket) => {
            ////  socket.emit("conectedScales", arrayDevices);
            ////});            
          }, 500);
          arrayDevices.map((elem) => {
            console.log('Device connected: '+elem.name);
          });
        
          fs.writeFile('arrayData.json', JSON.stringify(arrayDevices), (err) => {
            if (!err) {
              console.log('Se sobreescribió el archivo arrayData.json');
            }
          });
        
      } else {
        console.log(message+' no modifica array porque no posee un ID valido.');
      }      
    }

    if (topic == 'mqtt/demo/disconnected/res') {
      let MessageSTR = message.toString();
      let Message = MessageSTR.split('{');
      if (Message.length > 1) {
          console.log(JSON.parse(message).name+' se ha desconectado!!!');
          let scale = JSON.parse(message);
          arrayDevices = arrayDevices.filter((elem) => elem.name != scale.name);
          setTimeout(() => {
            ioS.sockets.emit("conectedDevices", arrayDevices);            
            ////ioS.on("connection",  (socket) => {
            ////  socket.emit("conectedScales", arrayDevices);
            ////});            
          }, 500);
          arrayDevices.map((elem) => {
            console.log('Device connected: '+elem.name);
          });
          
          fs.writeFile('arrayData.json', JSON.stringify(arrayDevices), (err) => {
            if (!err) {
              console.log('Se sobreescribió el archivo arrayData.json');
            }
          });
          
      } else {
        console.log(message+' no modifica array porque no posee un ID valido.');
      }      
    }

    if (topic == '') {
      
    }

    
});

