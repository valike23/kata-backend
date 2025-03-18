import { Router } from "express";
import { CompetitionCtrl } from "../controller/competition.controller";

const competitionRoute = Router();

competitionRoute.get('/', CompetitionCtrl.getCompetitionCtrl)
competitionRoute.post('/', CompetitionCtrl.createCompetitionCtrl)


export default competitionRoute;