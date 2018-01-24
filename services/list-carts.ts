import {NextFunction, Request, Response} from "express";
import {Connection, MysqlError, Pool, PoolConnection} from "mysql";

export default (pool:Pool) => (req:Request,res:Response,next:NextFunction) => {
    pool.query(
        `SELECT * FROM \`ps_cart\` `, (error:MysqlError, results:any, fields:any) => error? res.json(error) : res.json(results)
    );
}
