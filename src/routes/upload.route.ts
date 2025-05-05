import { Router } from "express";
import upload from "../middleware/fileupload.middleware";
import { UploadController } from "../controller/upload.controller";
import { excelUpload } from "../middleware/excelupload.middleware";

const uploadRoute = Router();


//uploadRoute.get('/', CompetitionCtrl.getCompetitionCtrl)
uploadRoute.post('/', upload.single("image"), UploadController.uploadImageCtrl)
uploadRoute.post('/kata',excelUpload.single("excel"), UploadController.uploadKataExcel);
uploadRoute.post('/entry',excelUpload.single("excel"), UploadController.uploadEntryExcel);


export default uploadRoute;