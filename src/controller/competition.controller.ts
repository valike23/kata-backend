import { Request, Response } from "express";
import { Competition, Icompetition } from "../db/models/competition.model";
import { HttpHelper } from "../helpers/http.helper";

export class CompetitionCtrl {
    static async getCompetitionCtrl(req: Request, res: Response){
        const resp = await Competition.findAll();
        HttpHelper.handleResponse(resp, res);
        
    }

    static async createCompetitionCtrl(req: Request, res: Response){
        const competition: any = req.body;
        const resp = await Competition.create(competition);
        HttpHelper.handleResponse(resp, res);
    }
}