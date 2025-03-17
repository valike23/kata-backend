import express from 'express';
import {json} from 'body-parser';
import cors from 'cors'; 


import competitionRoute from './routes/competition.route';

const app = express();

app.use(
    json(),
    cors()
);
app.use("/api/competition", competitionRoute);

app.listen(3000)