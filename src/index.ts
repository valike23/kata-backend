import express from 'express';
import {json} from 'body-parser';
import cors from 'cors'; 



import competitionRoute from './routes/competition.route';
import uploadRoute from './routes/upload.route';
import applicationRoute from './routes/application.route';

const app = express();


app.use(
    json(),
    cors()
);
app.use("/uploads", express.static("uploads"));
app.use("/api/competition", competitionRoute);
app.use("/api/application", applicationRoute);
app.use('/api/upload', uploadRoute);


app.listen(3000,()=>{
    console.log("Server started on port 3000")
})