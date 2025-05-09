import { Request, Response } from "express";
import { Category, Icategory } from "../db/models/category.model";
import { HttpHelper } from "../helpers/http.helper";
import { Competition } from "../db/models/competition.model";
import { Entry } from "../db/models/entry.model";
import { Bout } from "../db/models/bout.model";


export class CategoryCtrl {
    static async getCategoryCtrl(req: Request, res: Response) {
        const resp = await Category.findAll();
        HttpHelper.handleResponse(resp, res);

    }

    static async createCategoryCtrl(req: Request, res: Response) {
        const competition: any = req.body;
        const activeCompetition = await Competition.findOne({ where: { active: 1 } });
        if (!activeCompetition) {
            return HttpHelper.handleNotFound("No active competition found", res);
        }
        competition.competitionId = activeCompetition.id;
        const resp = await Category.create(competition);
        HttpHelper.handleResponse(resp, res);
    }


    static async deleteCategoryCtrl(req: Request, res: Response) {
        const { id } = req.query;
        const resp = await Category.destroy({ where: { id } });
        HttpHelper.handleResponse(resp, res);
    }

    static async draftCategoryCtrl(req: Request, res: Response) {
        const myCategory: Icategory = req.body;
        console.log("the category is working");
        const activeCompetition = await Competition.findOne({ where: { id: myCategory.competitionId } })
        if (!activeCompetition) return HttpHelper.handleNotFound('the competition is not active', res);
        const category = await Category.findOne({ where: { id: myCategory.id } });
        if (!category) return HttpHelper.handleNotFound('this category does not exist', res);
        if (category.isDrafted) return HttpHelper.handleNotFound('category has already been drafted', res);
        const entries = await Entry.findAll({
            where: { categoryId: category.id }
        });


        if (entries.length < 2) {
            return HttpHelper.handleNotFound("Not enough entries to draft", res);
        }

        // Shuffle entries for random pairing
        const shuffled = [...entries].sort(() => 0.5 - Math.random());
        const bouts: Bout[] = [];

        // Create bouts for pairs
        for (let i = 0; i < shuffled.length; i += 2) {
            if (i + 1 >= shuffled.length) {
                // Handle odd number of entries - give one a bye
                const byeBout = await Bout.create({
                    entry1Id: shuffled[i].id,
                    entry2Id: shuffled[i].id, // Same entry indicates a bye
                    winnerId: shuffled[i].id,
                    categoryId: myCategory.id,
                    round: 1,
                    competitionId: myCategory.competitionId
                });
                bouts.push(byeBout);
            } else {
                const bout = await Bout.create({
                    entry1Id: shuffled[i].id,
                    entry2Id: shuffled[i + 1].id,
                    winnerId: null, // No winner yet
                    categoryId: myCategory.id,
                    round: 1,
                    competitionId: myCategory.competitionId,
                });
                bouts.push(bout);
            }
        }

        category.isDrafted = true;
        await category.save();

        return HttpHelper.handleResponse(bouts, res);

    }


}