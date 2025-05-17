import { Bout } from "../db/models/bout.model";
import { Entry } from "../db/models/entry.model";
import { HttpHelper } from "../helpers/http.helper";
import { Request, Response } from "express";

export class BoutController {
    static async getAllBouts(req: Request, res: Response) {
    try {
        let categoryId = req.params.id;
        const bouts = await Bout.findAll({
            where: { categoryId },
            include: [
                { 
                    model: Entry, 
                    as: 'entry1',
                    attributes: ['id', 'name'] // Only include necessary fields
                },
                { 
                    model: Entry, 
                    as: 'entry2',
                    attributes: ['id', 'name'] 
                },
                {
                    model: Entry,
                    as: 'winner',
                    attributes: ['id', 'name']
                }
            ],
            order: [
                ['round', 'ASC'],
                ['id', 'ASC']
            ]
        });
        return HttpHelper.handleResponse(bouts, res);
    } catch (error) {
        console.log(error);
        return HttpHelper.handleServerError(error, res);
    }
}
}