import {ErrorMiddleware, HTTPError} from "../types";
import {Request, Response} from "express";

export default function errorLogger(logger:any): ErrorMiddleware {
    return function(error: HTTPError, req:Request, res: Response, next: (err?:any)=> void){
        logger.error("Error occured: ", error);
        next(error);
    }
}
