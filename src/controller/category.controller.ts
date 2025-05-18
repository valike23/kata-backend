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
  const numEntries   = entries.length;
  const maxRound     = Math.ceil(Math.log2(numEntries));
  const totalSlots   = 2 ** maxRound;     // e.g. 5 entries → 8 slots
  const shuffledIds  = [...entries]
    .sort(() => 0.5 - Math.random())
    .map(e => e.id)
    .concat(Array(totalSlots - numEntries).fill(null));

  // we'll collect bouts by round for later linking
  const boutsByRound: Record<number, Bout[]> = {};

  // 4. create every-round bouts (with null nextBoutId for now)
  for (let round = 1; round <= maxRound; round++) {
    const matchesThisRound = totalSlots / (2 ** round);
    boutsByRound[round] = [];

    for (let i = 0; i < matchesThisRound; i++) {
      const entry1Id = round === 1 ? shuffledIds[2 * i]     : null;
      const entry2Id = round === 1 ? shuffledIds[2 * i + 1] : null;

      const bout = await Bout.create({
        entry1Id,
        entry2Id,
        winnerId:   null,
        categoryId: myCategory.id,
        competitionId: myCategory.competitionId,
        round,
        nextBoutId: null    // fill this in below
      });

      boutsByRound[round].push(bout);
    }
  }

  // 5. link each bout to its parent in the next round
  for (let round = 1; round < maxRound; round++) {
    const thisRoundBouts = boutsByRound[round];
    const nextRoundBouts = boutsByRound[round + 1];

    for (let idx = 0; idx < thisRoundBouts.length; idx++) {
      const child = thisRoundBouts[idx];
      // two children feed into one parent: floor(idx/2)
      const parent = nextRoundBouts[Math.floor(idx / 2)];
      if (parent) {
        await child.update({ nextBoutId: parent.id });
      }
    }
  }

  // 6. mark the category drafted
  category.isDrafted = true;
  await category.save();

  // 7. return the full bracket (all rounds)
  const allBouts = Object.values(boutsByRound).flat();
  return HttpHelper.handleResponse(allBouts, res);
}




}