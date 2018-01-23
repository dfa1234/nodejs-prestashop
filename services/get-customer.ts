import {NextFunction, Request, Response} from "express";
import {Connection} from "mysql";
import {Customer} from "../models/customer";

export default (connection:Connection) => (req:Request,res:Response,next:NextFunction) => {
    connection.query(
        `SELECT * FROM \`ps_customer\` WHERE email = '${req.params.email}'`, (error, results, fields)=>{
            if(error){
                return res.json(error);
            }

            if(results && results.length){
                let myCustomer:Customer = results[0];
                return res.json(myCustomer);
            }else{
                return res.json({});
            }
        }
    );
}
