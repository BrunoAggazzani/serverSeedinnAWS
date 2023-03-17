import { isNull } from 'util';

const fs = require('fs');
const path = require("path");
var mime = require('mime');
//import { clientMQTT } from "../server.js";
//const file = require('../../files/');


  

export const login = (req, res, next) => {
    console.log('Launching login page...');           
    res
    .header('Access-Control-Allow-Origin', '*')
    .set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval'")
    .status(200).render('login.ejs');                
}

const readArrayUsers = new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, '../../arrayUsers.json'), (err, data) => {
        if (err){
            reject(err);
        } else {
            let array = [];
            if (data != undefined && data != null && data != '') {
                JSON.parse(data).map((e)=>{
                    //console.log('e: '+JSON.stringify(e));
                    array.push(e);
                });
            }                
            setTimeout(() => {
                resolve(array);
            }, 500);            
        }        
    });
});
/*
const readArray = new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, '../../arrayData.json'), (err, data) => {
        if (err){
            reject(err);
        } else {
            let array = [];
            if (data != undefined && data != null && data != '') {
                JSON.parse(data).map((e)=>{
                    //console.log('e: '+JSON.stringify(e));
                    array.push(e);
                });
            }                
            setTimeout(() => {
                resolve(array);
            }, 500);            
        }        
    });
});
*/
const validateUser = (users, user, pass) => {
    let logedSuccess = {};
    users.map((u)=>{
        console.log('Buscando coincidencia para '+u.user+' con '+user+' y '+u.pass+' con '+pass);
        if (u.user === user && u.pass === pass) {
            console.log('Coincidencia encontrada!!!');
            //validation = true;
            logedSuccess = {
                user: u.user,
                pass: u.pass
            };
            console.log('logedSuccess: '+logedSuccess.user+' y '+logedSuccess.pass);
            
        }
    });
    return logedSuccess;    
};

export const showDevices = (req, res, next) => {
    /*
    readArray
    .then((devices) => {
    */    
        let user = req.body.user; // usuario logeado y
        let pass = req.body.pass; // password logeado en "login.ejs"
        /*
        let validation = false;
        let logedSuccess = {
            user: '',
            pass: ''
        };
        */
        readArrayUsers
        .then((users) => { // valido usuario y pass.
            let datos = validateUser(users, user, pass);
            console.log(JSON.stringify(datos));
            if (datos.user != null && datos.user != undefined) {
                console.log('Usuario logeado exitosamente: '+datos.user);
                res
                .header('Access-Control-Allow-Origin', '*')
                .set("Content-Security-Policy", "script-src 'self' https://cdn.socket.io/4.5.4/socket.io.min.js 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('launcher.ejs', {data: datos});
            } else {
                console.log('Redireccionando a pagina de error...');        
                res
                .header('Access-Control-Allow-Origin', '*')
                .set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('error.ejs');               
            }            
        })
        /*
        .then((validation)=>{
            if (validation) {
                if (logedSuccess.user != '' && logedSuccess.user == 'BRUNO') {
                    let datos = devices.filter((elem) => elem.owner.toUpperCase() == logedSuccess.user && elem.name != 'ESP_24102'); // cambiar a ESP_24101
                    console.log('Dispositivos para BRUNO: '+JSON.stringify(datos));
                }
                if (logedSuccess.user != '' && logedSuccess.user == 'BELU') {
                    let datos = devices.filter((elem) => elem.owner.toUpperCase() == 'BRUNO' && elem.name == 'ESP_24102'); // cambiar a ESP_24101
                    console.log('Dispositivos para BELU: '+JSON.stringify(datos));
                }
                if (logedSuccess.user != '' && logedSuccess.user != 'BELU' && logedSuccess.user != 'BRUNO') {
                    let datos = devices.filter((elem) => elem.owner.toUpperCase() == logedSuccess.user);
                    console.log('Dispositivos: '+JSON.stringify(datos));
                }                    
                res
                .header('Access-Control-Allow-Origin', '*')
                .set("Content-Security-Policy", "script-src 'self' https://cdn.socket.io/4.5.4/socket.io.min.js 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('launcher.ejs', {data: datos}); 
            } else {
                // Redireccionar a login y enviar datos para alert que informe de contraseña incorrecta.
                console.log('Redireccionando a login...');
                let mje = {
                    message: 'Usuario y/o contraseña incorrectos!'
                }        
                res
                .header('Access-Control-Allow-Origin', '*')
                .set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval'")
                .status(200).render('login.ejs', {data: mje});
            }
        })
        */
        .catch((err)=>{
            console.log('readArrayUsers Error: '+err);
        });                            
    /*
    })
    .catch((err)=>{
        console.log('readArray Error: '+err);
        console.log('Error leyendo array de dispositivos!');
        // Redireccionar a login y enviar datos para alert que informe de que se produjo un error buscando dispositivos conectados.
        let mje = {
            message: 'Se produjo un error buscando dispositivos conectados para este usuario.'
        }        
        res
        .header('Access-Control-Allow-Origin', '*')
        .set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval'")
        .status(200).render('login.ejs', {data: mje});
    });
    */                           
}    



export const loadDashboard = (req, res) => {
    let deviceName = {name: req.body.deviceName};
    console.log('device name: '+deviceName.name);    
    res
        .header('Access-Control-Allow-Origin', '*')
        .set("Content-Security-Policy", "script-src 'self' https://cdn.socket.io/4.5.4/socket.io.min.js 'unsafe-inline' 'unsafe-eval'")
        .status(200).render('dashboard.ejs', {data: deviceName});
}




/*
export const loadFile = (req, res) => {       
    res
    .header('Access-Control-Allow-Origin', '*')
    .set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval'")    
    .status(200).render('loadFile.ejs');                
}



export const upload = (req, res) => {
    let ArrayDevices = req.body.devices;
    console.log('req.body: '+JSON.stringify(req.body));
    let BKPFile = req.files.file
    let type = req.body.type; 
    console.log(BKPFile.name);
    
    BKPFile.mv(`./files/${BKPFile.name}`,err => {
        if(err){
            console.log(err);
            //return res.status(500).send('Error! '+err);
        }else{
            if (Array.isArray(ArrayDevices)) {
               ArrayDevices.map((e) => {
                    clientMQTT.publish(`mqtt/${e}/bkp`, `${BKPFile.name}&#&${type}`);
               }); 
            } else {
                clientMQTT.publish(`mqtt/${ArrayDevices}/bkp`, `${BKPFile.name}&#&${type}`);
            }
            res
            .header('Access-Control-Allow-Origin', '*')
            .set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval'")
            .status(200).redirect('/loadFile');            
        }        
    });
}



export const download = async(req, res, next) => {
    let datos = await req.body.json;
    datos = JSON.parse(datos);
    console.log('fileName: '+datos.fileName);
    
    let options = {
      root: './files/'
    };
    
    let fileName = datos.fileName;
    res.sendFile(fileName, options, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "internal server error. please try again later" });    
      } else {
        console.log("Sent:", fileName, "at", new Date().toString());
        /*
        // Se comenta esta porción porque el archivo no debe eliminarse. Otro dispositivo podría llamar despuès a la ruta "/download" y no encontrar el archivo. 
        fs.rm(`./files/${fileName}`, { recursive:true }, (err) => {
            if(err){
                // File deletion failed
                console.error(err.message);
                return;
            }
            console.log(`File ${fileName} deleted successfully`);
        })
        */
       /*
      }
    });    
}
*/