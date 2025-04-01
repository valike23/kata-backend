import { Kata } from "../db/models/kata.model";
import { Request, Response } from "express";
import { HttpHelper } from "../helpers/http.helper";
import { Judge } from "../db/models/judge.model";

export class JudgeController {
    static async getJudgesCtrl(req: Request, res: Response) {
        const resp = await Judge.findAll();
        HttpHelper.handleResponse(resp, res);
    }
    static async loginSingleJudgeCtrl(req: Request, res: Response) {
        const judge: {judgeName: string, password: string} = req.body;
        const resp = await Judge.findOne({where: {judgeName: judge.judgeName}});
        if (!resp) {
            HttpHelper.handleUserError({message: "Judge not found"}, "Judge not found", res);
            return;
        }
        if (resp.password !== judge.password) {
            HttpHelper.handleUserError({message:  "Invalid password" },  "Invalid password" , res);
            return;
        }
        HttpHelper.handleResponse(resp, res);
    }

    static async createJudgeCtrl(req: Request, res: Response) {
        const judge = req.body;
        const resp = await Judge.create(judge);
        HttpHelper.handleResponse(resp, res);
    }
    static async deleteJudgeCtrl(req: Request, res: Response) {
            const {id} = req.query;
            const resp = await Judge.destroy({where: {id}});
            HttpHelper.handleResponse(resp, res);
        }
}