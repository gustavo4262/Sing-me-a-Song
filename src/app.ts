import express from "express";
import cors from "cors";

import * as recommendationController from './controllers/recommendationController'

const app = express();
app.use(cors());
app.use(express.json());

app.post('/recommendations', recommendationController.createRecommendation );

app.post('/recommendations/:id/upvote', recommendationController.upvote );

app.post('/recommendations/:id/downvote', recommendationController.downvote );
export default app;
