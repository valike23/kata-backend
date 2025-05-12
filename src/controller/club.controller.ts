import { Club } from "../db/models/club.model";
import { Request, Response } from "express";
import { HttpHelper } from "../helpers/http.helper";
import { Competition } from "../db/models/competition.model";

export class ClubCtroller {
    static async getClubCtrl(req: Request, res: Response) {
        const resp = await Club.findAll();
        HttpHelper.handleResponse(resp, res);
    }

    static async createClubCtrl(req: Request, res: Response) {
        const club: any = req.body;
        const resp = await Club.create(club);
        HttpHelper.handleResponse(resp, res);
    }


    static async deleteClubCtrl(req: Request, res: Response) {
            const {id} = req.query;
            const resp = await Club.destroy({where: {id}});
            HttpHelper.handleResponse(resp, res);
        }
   
}