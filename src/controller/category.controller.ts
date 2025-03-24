import { Request, Response } from "express";
import { Category } from "../db/models/category.model";
import { HttpHelper } from "../helpers/http.helper";


export class CategoryCtrl {
    static async getCategoryCtrl(req: Request, res: Response){
        const resp = await Category.findAll();
        HttpHelper.handleResponse(resp, res);
        
    }

    static async createCategoryCtrl(req: Request, res: Response){
        const competition: any = req.body;
                const resp = await Category.create(competition);
                HttpHelper.handleResponse(resp, res);
    }

    
}