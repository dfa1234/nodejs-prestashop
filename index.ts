import * as express from 'express';
import * as mysql from 'mysql';
import config  from './config';
import bodyParser = require("body-parser");
import {Request, Response, NextFunction} from "express";
const logger = require('morgan');
const sslRootCas = require('ssl-root-cas')
import newOrder from './services/new-order';
import listOrders from './services/list-orders';
import listCarts from './services/list-carts';
import getCustomer from './services/get-customer';
import {Connection} from "mysql";
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
/*
const pool = mysql.createPool({
    connectionLimit : 10,
    host: config.databaseHost,
    user: config.databaseUser,
    password: config.databasePassword,
    port:config.databasePort,
    database: config.databaseName
});

pool.getConnection((err,connection)=>{

});
*/

//- Establish a new connection
const connectUri = {
    host: config.databaseHost,
    user: config.databaseUser,
    password: config.databasePassword,
    port:config.databasePort,
    database: config.databaseName
};

let connection = mysql.createConnection(connectUri);

//- Reconnection function
const reconnect = (connection:Connection):Promise<Connection>=>{
    return new Promise((resolve,reject)=>{
        console.log("\n New connection tentative...");

        //- Destroy the current connection variable
        if(connection) connection.destroy();

        //- Create a new one
        let newConnection = mysql.createConnection(connectUri);

        //- Try to reconnect
        newConnection.connect((err:any)=>{
            if(err) {
                //- Try to connect every 2 seconds.
                setTimeout(reconnect, 2000);
            }else {
                console.log("\n\t *** New connection established with the database. ***");
                resolve(newConnection);
            }
        });
    })

};

//- First connection
connection.connect(function(err){
    if(err) {
        // mysqlErrorHandling(connection, err);
        console.log("\n\t *** Cannot establish a connection with the database. ***");
        reconnect(connection).then(
            newC => connection= newC
        );
    }else {
        console.log("\n\t *** New connection established with the database. ***")
    }
});

//- Error listener
connection.on('error', function(err) {

    //- The server close the connection.
    if(err.code === "PROTOCOL_CONNECTION_LOST"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        reconnect(connection).then(
            newC => connection= newC
        );
    }

    //- Connection in closing
    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        reconnect(connection).then(
            newC => connection= newC
        );
    }

    //- Fatal error : connection variable must be recreated
    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        reconnect(connection).then(
            newC => connection= newC
        );
    }

    //- Error because a connection is already being established
    else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
    }

    //- Anything else
    else{
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        reconnect(connection).then(
            newC => connection= newC
        );
    }

});


//ROUTES
//TODO SECURITY
app.get('/',(req,res,next) => res.json("NodeJS Prestashop Webservice API"));
app.get('/customer/:email',getCustomer(connection));
app.get('/orders',listOrders(connection));
app.get('/carts',listCarts(connection));
app.post('/neworder',newOrder(connection));
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


