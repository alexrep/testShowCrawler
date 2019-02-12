import {ErrorMiddleware, HTTPError} from "../types";
import {Request, Response} from "express";

export default function internalErrorReport(): ErrorMiddleware {
    return function(error: HTTPError, req:Request, res: Response, next: (err?:any)=> void){
        res.status(error.status || 500);
        res.json({'errors': {
                message: error.message,
                error: error
            }});

    }
}

