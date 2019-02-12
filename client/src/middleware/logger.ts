import {Middleware} from "../types";
import {Request, Response} from "express";

export default function requestLogger(logger:any): Middleware {
    return function(req:Request, res: Response, next: (err?: any) => void){
        logger.info(req.url);
        next();
    }
}
