import * as express from 'express';
import * as mysql from 'mysql';
import config  from './config';
import bodyParser = require("body-parser");
import {Request, Response, NextFunction} from "express";
const logger = require('morgan');
import newOrder from './services/new-order';
import listOrders from './services/list-orders';
import getCustomer from './services/get-customer';


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
const connection = mysql.createConnection({
    host: config.databaseHost,
    user: config.databaseUser,
    password: config.databasePassword,
    port:config.databasePort,
    database: config.databaseName
});
connection.connect();


//ROUTES
app.get('/',(req,res,next) => res.json("NodeJS Prestashop Webservice API"));
app.get('/customer/:email',getCustomer(connection));
app.get('/orders',listOrders(connection));
app.get('/neworder',newOrder(connection));


//START
app.listen(config.port,()=>{
    console.log('server started')
});