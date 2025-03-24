import { Request, Response } from "express";
import { HttpHelper } from "../helpers/http.helper";
import { Entry } from "../db/models/entry.model";
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
        const resp = await Entry.create(entry);
        HttpHelper.handleResponse(resp, res);
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
                id: req.params.id
            }
        });
        HttpHelper.handleResponse(resp, res);
    }

    static async getEntryByIdCtrl(req: Request, res: Response) {
        const resp = await Entry.findByPk(req.params.id);
        HttpHelper.handleResponse(resp, res);
    }
}