import { Request, Response } from "express";
import { Competition, Icompetition } from "../db/models/competition.model";
import { HttpHelper } from "../helpers/http.helper";
import { Op } from "sequelize";

export class CompetitionCtrl {
    static async getCompetitionCtrl(req: Request, res: Response){
        const resp = await Competition.findAll();
        HttpHelper.handleResponse(resp, res);
        
    }

    static async createCompetitionCtrl(req: Request, res: Response){
        console.log("Creating competition");
        try {
            const competition: any = req.body;
        const resp = await Competition.create(competition);
        HttpHelper.handleResponse(resp, res);
        } catch (error) {
            console.log(error);
            HttpHelper.handleServerError(error, res);
            
        }
    }

    static async activateCompetitionCtrl(req: Request, res: Response) {
        try {
         
          const id = parseInt(req.query.id as string, 10);
  
          if (isNaN(id)) {
            return HttpHelper.handleNotFound("Valid Competition ID is required", res);
          }
          console.log("Activating competition", id);
          const competition = await Competition.findByPk(id);
            if (!competition) {
                return HttpHelper.handleNotFound("Competition not found", res);
            }
          
          const resp = await Competition.update(
            { active: true },
            { where: { id } }
          );
      
         console.log("Competition updated", resp);
        
          await Competition.update(
            { active: false },
            { where: { id: { [Op.ne]: id } } }
          );
      
          const competitions = await Competition.findAll({ raw: true });
          HttpHelper.handleResponse(competitions, res);
        } catch (error) {
          console.error(error);
          HttpHelper.handleServerError(error, res);
        }
      }
      

    static async deleteCompetitionCtrl(req: Request, res: Response){
        const id = req.body.id;
        const resp = await Competition.destroy({where: {id}});
        HttpHelper.handleResponse(resp, res);
        
    }
}