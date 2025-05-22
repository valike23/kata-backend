import { Router } from "express";
import { JudgeController } from "../controller/judge.controller";
import { BoutController } from "../controller/bout.controller";


const applicationRoute = Router();

applicationRoute.get('/judges', JudgeController.getJudgesCtrl);
applicationRoute.post('/judge/login', JudgeController.loginSingleJudgeCtrl);
applicationRoute.post('/judge', JudgeController.createJudgeCtrl);
applicationRoute.get('/bouts', BoutController.getAllByCompetition)


export default applicationRoute;