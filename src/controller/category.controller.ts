import { Request, Response } from "express";
import { Category } from "../db/models/category.model";
import { HttpHelper } from "../helpers/http.helper";
import { Competition } from "../db/models/competition.model";


export class CategoryCtrl {
    static async getCategoryCtrl(req: Request, res: Response){
        const resp = await Category.findAll();
        HttpHelper.handleResponse(resp, res);
        
    }

    static async createCategoryCtrl(req: Request, res: Response){
        const competition: any = req.body;
        const activeCompetition = await Competition.findOne({where:{active: 1}});
        if (!activeCompetition) {
            return HttpHelper.handleNotFound("No active competition found", res);   
        }
        competition.competitionId = activeCompetition.id;
                const resp = await Category.create(competition);
                HttpHelper.handleResponse(resp, res);
    }


    static async deleteCategoryCtrl(req: Request, res: Response) {
        const {id} = req.query;
        const resp = await Category.destroy({where: {id}});
        HttpHelper.handleResponse(resp, res);
    }

    
}