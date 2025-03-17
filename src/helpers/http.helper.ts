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
}