import {NextFunction, Request, Response} from "express";
import {Connection} from "mysql";

export default (connection:Connection) => (req:Request,res:Response,next:NextFunction) => {
    connection.query(
        `SELECT * FROM \`ps_cart\` `, (error, results, fields)=>{
            if(error){
                return res.json(error);
            }
            return res.json(results);
        }
    );
}
