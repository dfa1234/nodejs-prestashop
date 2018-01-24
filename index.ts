import * as express from 'express';
import * as mysql from 'mysql';
import config  from './config';
import bodyParser = require("body-parser");
import {Request, Response, NextFunction} from "express";
const logger = require('morgan');
const sslRootCas = require('ssl-root-cas');
import newOrder from './services/new-order';
import listOrders from './services/list-orders';
import listCarts from './services/list-carts';
import getCustomer from './services/get-customer';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';


//SERVER CONFIGURATION
const app = express();
app.use(bodyParser.json());
app.use(logger('[:date[clf]] - :remote-addr - :method - :url - :status - :response-time ms'));
app.use((req:Request, res:Response, next:NextFunction)=> {
    //res.setHeader('content-type', 'application/json');
    res.header('Access-Control-Allow-Credentials', "true");
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept,Access-Control-Allow-Credentials,Authorization');
    if (req.method === "OPTIONS"){
        res.sendStatus(200);
    } else {
        next();
    }
});


//DATABASE CONFIGURATION
const pool = mysql.createPool({
    connectionLimit : 10,
    waitForConnections : true,
    queueLimit :0,
    host: config.databaseHost,
    user: config.databaseUser,
    password: config.databasePassword,
    port:config.databasePort,
    database: config.databaseName,
    //debug    :  true,
    connectTimeout: 10
});


//ROUTES
//TODO SECURITY
app.get('/',(req,res,next) => res.json("NodeJS Prestashop Webservice API"));
app.get('/customer/:email',getCustomer(pool));
app.get('/orders',listOrders(pool));
app.get('/carts',listCarts(pool));
app.post('/neworder',newOrder(pool));
//TODO to be continued here !


//START
http.createServer(app).listen(config.port,()=>{
    console.log('server started')
});

if (fs.existsSync('./tls/privkey.pem') && fs.existsSync('./tls/fullchain.pem')) {
    sslRootCas.inject();
    https.createServer({
        key: fs.readFileSync('./tls/privkey.pem'),
        cert: fs.readFileSync('./tls/fullchain.pem')
    }, app).listen(config.portSSL,()=>{
        console.log('server ssl started')
    });
}


