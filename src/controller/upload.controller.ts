import { Request, Response } from "express";
import { HttpHelper } from "../helpers/http.helper";


export class UploadController {
    static uploadImageCtrl(req: Request, res: Response){
        if (!req.file) {

           return HttpHelper.handleUserError({}, 'No File Uploaded', res)
            }

        const data = {message: "File uploaded successfully",
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`}

        HttpHelper.handleResponse(data, res);


    }
}