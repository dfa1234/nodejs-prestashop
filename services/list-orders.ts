import {NextFunction, Request, Response} from "express";
import {Connection, Pool, PoolConnection} from "mysql";

export default (pool:Pool) => (req:Request,res:Response,next:NextFunction) => {
    pool.query(
        `SELECT * FROM \`ps_orders\` `, (error:any, results:any, fields:any) => error? res.json(error) : res.json(results)
    );
}
