import express from "express";
import path from 'path';
import morgan from "morgan";
import cors from 'cors';
import i18n from './i18n.js';
import helmet from "helmet";
import compression from "compression";
// import rutas
import testRoutes from './routes/test.routes';
const fileUpload = require('express-fileupload')

const app = express();

// motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(__dirname+'/public'));

// middlewares
app.use(express.json({limit: "100mb"}));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: '*'}));
app.use(i18n);
app.use(fileUpload());
// middleware de seguridad
app.use(helmet.contentSecurityPolicy({
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        }
    })
);
// middleware de compresion http
app.use(compression());

// rutas principales
app.use('/', testRoutes);


export default app;