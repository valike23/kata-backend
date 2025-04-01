import { Router } from "express";
import { JudgeController } from "../controller/judge.controller";


const applicationRoute = Router();

applicationRoute.get('/judges', JudgeController.getJudgesCtrl);
applicationRoute.post('/judge/login', JudgeController.loginSingleJudgeCtrl);
applicationRoute.post('/judge', JudgeController.createJudgeCtrl);


export default applicationRoute;