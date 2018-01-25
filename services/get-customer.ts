import {NextFunction, Request, Response} from "express";
import {Connection, Pool, PoolConnection} from "mysql";
import {Customer} from "../models/customer";


export const queryGetCustomer = (connection:Pool,email:string): Promise<Customer> =>{
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT * FROM \`ps_customer\` WHERE email = '${email}'`, (error, results, fields)=>{
            if(error) return reject(error);

            if(results && results.length){
                return resolve(results[0]);
            }else{
                return reject("customer not found");
            }
        });
    })
};


export default (pool:Pool) => (req:Request,res:Response,next:NextFunction) => {
    queryGetCustomer(pool,req.params.email).then(
        result => res.json(result),
        err => res.json(err)
    )
}
