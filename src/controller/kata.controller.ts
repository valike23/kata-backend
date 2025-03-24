import { Kata } from "../db/models/kata.model";
import { Request, Response } from "express";
import { HttpHelper } from "../helpers/http.helper";

export class KataController {
    static async getKataCtrl(req: Request, res: Response) {
        const resp = await Kata.findAll();
        HttpHelper.handleResponse(resp, res);
    }

    static async createKataCtrl(req: Request, res: Response) {
        const kata = req.body;
        const resp = await Kata.create(kata);
        HttpHelper.handleResponse(resp, res);
    }
}