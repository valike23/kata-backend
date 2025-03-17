import { Request, Response } from "express";
import { Competition } from "../db/models/competition.model";
import { HttpHelper } from "../helpers/http.helper";

export class CompetitionCtrl {
    static async getCompetitionCtrl(req: Request, res: Response){
        const resp = await Competition.findAll();
        HttpHelper.handleResponse(resp, res);
        
    }
}