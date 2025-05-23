import { Router } from "express";
import { CompetitionCtrl } from "../controller/competition.controller";
import { CategoryCtrl } from "../controller/category.controller";
import { ClubCtroller } from "../controller/club.controller";
import { EntryController } from "../controller/entry.controller";
import { KataController } from "../controller/kata.controller";
import { BoutController } from "../controller/bout.controller";

const competitionRoute = Router();

competitionRoute.get('/', CompetitionCtrl.getCompetitionCtrl)
competitionRoute.post('/', CompetitionCtrl.createCompetitionCtrl)
competitionRoute.delete('/', CompetitionCtrl.deleteCompetitionCtrl)
competitionRoute.put('/activate', CompetitionCtrl.activateCompetitionCtrl)
competitionRoute.post('/category', CategoryCtrl.createCategoryCtrl)
competitionRoute.get('/category', CategoryCtrl.getCategoryCtrl)
competitionRoute.get('/category/:id', CategoryCtrl.getSingleCategoryCtrl)
competitionRoute.post('/category/draft', CategoryCtrl.draftCategoryCtrl)
competitionRoute.delete('/category', CategoryCtrl.deleteCategoryCtrl)
competitionRoute.get('/bouts/:id',BoutController.getAllBouts)
competitionRoute.get('/clubs', ClubCtroller.getClubCtrl)
competitionRoute.post('/clubs', ClubCtroller.createClubCtrl)
competitionRoute.delete('/clubs', ClubCtroller.deleteClubCtrl)
competitionRoute.post('/entry/bulk', EntryController.createBulkEntryCtrl)
competitionRoute.post('/entry/single', EntryController.createEntryCtrl)
competitionRoute.get('/entry', EntryController.getEntryCtrl)
competitionRoute.delete('/entry', EntryController.deleteEntryCtrl)
competitionRoute.get('/kata', KataController.getKataCtrl)
competitionRoute.post('/kata/single', KataController.createKataCtrl)
competitionRoute.delete('/kata', KataController.deleteKataCtrl)

export default competitionRoute;