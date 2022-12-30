const fs = require('fs');
const path = require("path");
var mime = require('mime');
import { clientMQTT } from "../server.js";
//const file = require('../../files/');


  

export const login = (req, res, next) => {
    console.log('Launching page...');       
    res
    .header('Access-Control-Allow-Origin', '*')
    .set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval'")
    .status(200).render('login.ejs');                
}



export const showDevices = (req, res, next) => {
    /* 
    const readArray = new Promise((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, '../../arrayData.json'), (err, data) => {
            if (err){
                reject(err);
            } else {
                let array = [];
                JSON.parse(data).map((e)=>{
                    //console.log('e: '+JSON.stringify(e));
                    array.push(e);
                })
                setTimeout(() => {
                    resolve(array);
                }, 500);            
            }        
        });
    });
*/
/*
    readArray
    .then((data) => {
        let filtro = req.body.user;
        let datos = data.filter((elem) => elem.owner.toUpperCase() == filtro.toUpperCase());
        //console.log('data: '+JSON.stringify(datos));        
        res
            .header('Access-Control-Allow-Origin', '*')
            .set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval'")
            .status(200).render('launcher.ejs', {data: JSON.stringify(datos)});            
    })
    .catch((err)=>{
        console.log('Error: '+err);
    }); 
*/
    res
        .header('Access-Control-Allow-Origin', '*')
        .set("Content-Security-Policy", "script-src 'self' https://cdn.socket.io/4.5.4/socket.io.min.js 'unsafe-inline' 'unsafe-eval'")
        .status(200).render('launcher.ejs');                       
}    



export const loadDashboard = (req, res) => {
    let deviceName = {name: req.body.deviceName};
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