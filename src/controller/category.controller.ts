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

    static async getSingleCategoryCtrl(req: Request, res: Response) {
        const resp = await Category.findOne({ where: { id: req.params.id } })
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

        // 1. verify competition & category
        console.log("draftCategoryCtrl:", myCategory);
        const activeCompetition = await Competition.findOne({ where: { id: myCategory.competitionId } });
        if (!activeCompetition) {
            return HttpHelper.handleNotFound('the competition is not active', res);
        }

        const category = await Category.findOne({ where: { id: myCategory.id } });
        if (!category) {
            return HttpHelper.handleNotFound('this category does not exist', res);
        }
        if (category.isDrafted) {
            return HttpHelper.handleNotFound('category has already been drafted', res);
        }

        // 2. pull entries & ensure there's at least two
        const entries = await Entry.findAll({ where: { categoryId: category.id } });
        if (entries.length < 2) {
            return HttpHelper.handleNotFound("Not enough entries to draft", res);
        }

        // 3. figure out how many rounds (next power of two)
        const numEntries = entries.length;
        const maxRound = Math.ceil(Math.log2(numEntries));
        const totalSlots = 2 ** maxRound;        // e.g. 8 entries → 8 slots; 5 entries → 8 slots
        const shuffledSlots = [...entries]
            .sort(() => 0.5 - Math.random())
            .map(e => e.id)
            // fill the rest with nulls (these become byes)
            .concat(Array(totalSlots - numEntries).fill(null));

        const bouts: Bout[] = [];

        // 4. create a Bout for every round
        for (let round = 1; round <= maxRound; round++) {
            // how many matches in this round?
            const matchesThisRound = totalSlots / (2 ** round);

            for (let i = 0; i < matchesThisRound; i++) {
                let entry1Id: number | null = null;
                let entry2Id: number | null = null;

                // only seed round-1 with participants
                if (round === 1) {
                    entry1Id = shuffledSlots[2 * i];
                    entry2Id = shuffledSlots[2 * i + 1];
                }

                const bout = await Bout.create({
                    entry1Id,                  // null for byes or future rounds
                    entry2Id,                  // null for byes or future rounds
                    winnerId: null,            // always empty at draft time
                    categoryId: myCategory.id,
                    competitionId: myCategory.competitionId,
                    round,
                });
                bouts.push(bout);
            }
        }

        // 5. mark the category drafted
        category.isDrafted = true;
        await category.save();

        // 6. return the full bracket (all rounds)
        return HttpHelper.handleResponse(bouts, res);
    }



}