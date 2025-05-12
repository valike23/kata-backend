import { Request, Response } from "express";
import { HttpHelper } from "../helpers/http.helper";
import { Entry, Ientry } from "../db/models/entry.model";
import { Club } from "../db/models/club.model";
import { Competition } from "../db/models/competition.model";
import { Category } from "../db/models/category.model";

export class EntryController {
    static async getEntryCtrl(req: Request, res: Response) {
        const resp = await Entry.findAll({
            include: [
                { model: Club, as: "club" },
                { model: Competition, as: "competition" },
                {model: Category, as: "category"}
            ],
        });
        HttpHelper.handleResponse(resp, res);
    }

    static async createEntryCtrl(req: Request, res: Response) {
        const entry: any = req.body;
        const activeCompetition = await Competition.findOne({where:{active: 1}});
        if (!activeCompetition) {
            return HttpHelper.handleNotFound("No active competition found", res);
        }
        entry.competitionId = activeCompetition.id;
        const resp = await Entry.create(entry);
        HttpHelper.handleResponse(resp, res);
    }

     static async createBulkEntryCtrl(req: Request, res: Response) {
        try {
            console.log(req);
             const entries: Partial<Ientry>[] = req.body;
        const activeCompetition = await Competition.findOne({where:{active: 1}});
        if (!activeCompetition) {
            return HttpHelper.handleNotFound("No active competition found", res);
        }
        console.log("my entries", entries);

        entries.forEach((e, i)=>{
            entries[i].competitionId = activeCompetition.id;
        })
        
        const resp = await Entry.bulkCreate(entries);
        HttpHelper.handleResponse(resp, res);
        } catch (error) {
            console.log('error here ', error);
            HttpHelper.handleServerError(error, res);
        }
       
    }

    static async updateEntryCtrl(req: Request, res: Response) {
        const entry: any = req.body;
        const resp = await Entry.update(entry, {
            where: {
                id: req.params.id
            }
        });
        HttpHelper.handleResponse(resp, res);
    }

    static async deleteEntryCtrl(req: Request, res: Response) {
        const resp = await Entry.destroy({
            where: {
                id: req.query.id
            }
        });
        HttpHelper.handleResponse(resp, res);
    }

    static async getEntryByIdCtrl(req: Request, res: Response) {
        const resp = await Entry.findByPk(req.params.id);
        HttpHelper.handleResponse(resp, res);
    }
}