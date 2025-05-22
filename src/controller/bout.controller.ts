import { Bout } from "../db/models/bout.model";
import { Club } from "../db/models/club.model";
import { Competition } from "../db/models/competition.model";
import { Entry } from "../db/models/entry.model";
import { HttpHelper } from "../helpers/http.helper";
import { Request, Response } from "express";

export class BoutController {
   static async getAllBouts(req: Request, res: Response) {
  try {
    const categoryId = req.params.id;
    const bouts = await Bout.findAll({
      where: { categoryId },
      include: [
        {
          model: Entry,
          as: 'entry1',
          attributes: ['id', 'name'],
          include: [{
            model: Club,
            as: 'club',
            attributes: ['id', 'clubName', 'flag']
          }]
        },
        {
          model: Entry,
          as: 'entry2',
          attributes: ['id', 'name'],
          include: [{
            model: Club,
            as: 'club',
            attributes: ['id', 'clubName', 'flag']
          }]
        },
        {
          model: Entry,
          as: 'winner',
          attributes: ['id', 'name'],
          include: [{
            model: Club,
            as: 'club',
            attributes: ['id', 'clubName', 'flag']
          }]
        }
      ],
      order: [
        ['round', 'ASC'],
        ['id',    'ASC']
      ]
    });

    return HttpHelper.handleResponse(bouts, res);
  } catch (error) {
    console.error(error);
    return HttpHelper.handleServerError(error, res);
  }
}

static async getAllByCompetition(req: Request, res: Response) {
  const activeCompetition = await Competition.findOne({where: {active: true}});
  if(!activeCompetition) {
    return HttpHelper.handleNotFound('no active competition', res);
  }
    const bouts = await Bout.findAll({
      where: { competitionId: activeCompetition.id },
      include: [
        {
          model: Entry,
          as: "entry1",
          include: [{ model: Club, as: "club" }],
        },
        {
          model: Entry,
          as: "entry2",
          include: [{ model: Club, as: "club" }],
        },
        {
          model: Entry,
          as: "winner",
          include: [{ model: Club, as: "club" }],
        },
      ],
      order: [
        ["round", "ASC"],
        ["id", "ASC"],
      ],
    });

    HttpHelper.handleResponse(bouts, res);
  }

}