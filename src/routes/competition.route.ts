import { Router } from "express";
import { CompetitionCtrl } from "../controller/competition.controller";
import { CategoryCtrl } from "../controller/category.controller";
import { ClubCtroller } from "../controller/club.controller";
import { EntryController } from "../controller/entry.controller";
import { KataController } from "../controller/kata.controller";

const competitionRoute = Router();

competitionRoute.get('/', CompetitionCtrl.getCompetitionCtrl)
competitionRoute.post('/', CompetitionCtrl.createCompetitionCtrl)
competitionRoute.delete('/', CompetitionCtrl.deleteCompetitionCtrl)
competitionRoute.post('/category', CategoryCtrl.createCategoryCtrl)
competitionRoute.get('/category', CategoryCtrl.getCategoryCtrl)
competitionRoute.delete('/category', CategoryCtrl.deleteCategoryCtrl)
competitionRoute.get('/clubs', ClubCtroller.getClubCtrl)
competitionRoute.post('/clubs', ClubCtroller.createClubCtrl)
competitionRoute.delete('/clubs', ClubCtroller.deleteClubCtrl)
competitionRoute.post('/entry/single', EntryController.createEntryCtrl)
competitionRoute.get('/entry', EntryController.getEntryCtrl)
competitionRoute.get('/kata', KataController.getKataCtrl)
competitionRoute.post('/kata/single', KataController.createKataCtrl)
competitionRoute.delete('/kata', KataController.deleteKataCtrl)

export default competitionRoute;