import { Router } from "express";
import upload from "../middleware/fileupload.middleware";
import { UploadController } from "../controller/upload.controller";

const uploadRoute = Router();


//uploadRoute.get('/', CompetitionCtrl.getCompetitionCtrl)
uploadRoute.post('/', upload.single("image"), UploadController.uploadImageCtrl)


export default uploadRoute;