import { HttpStatusCode } from "axios";
import { Response } from "express";

export class HttpHelper {
    static handleResponse(data: any, res: Response){
        res.json({
            statusCode: HttpStatusCode.Ok,
            data,
            message: 'returned successfully'

        })
    }

    static handleUserError(err: any, message: string, res: Response){
        res.status(HttpStatusCode.BadRequest).json({
            message,
            err
        })
    }

    static handleServerError(err: any, res: Response){
        res.status(HttpStatusCode.InternalServerError).json({
            message: 'Internal Server Error',
            err
        })
    }
    static handleNotFound(message: string, res: Response){
        res.status(HttpStatusCode.NotFound).json({
            message,
        })
    }

}