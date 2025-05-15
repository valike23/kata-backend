import { Bout } from "../db/models/bout.model";
import { HttpHelper } from "../helpers/http.helper";
import { Request, Response } from "express";

export class BoutController {
    static async getAllBouts (req: Request, res: Response) {

        try {
           let categoryId = req.params.id;
          const bouts = await  Bout.findAll({where: {categoryId}}) ;
          return HttpHelper.handleResponse(bouts, res);
        } catch (error) {
            console.log(error);
             return HttpHelper.handleServerError(error, res);
        }
    }
}