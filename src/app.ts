import express from "express";
import cors from "cors";

import * as recommendationController from './controllers/recommendationController'
import * as genreController from './controllers/genresController'

const app = express();
app.use(cors());
app.use(express.json());

app.post('/recommendations', recommendationController.createRecommendation );

app.post('/recommendations/:id/upvote', recommendationController.upvote );

app.post('/recommendations/:id/downvote', recommendationController.downvote );

app.get('/recommendations/random', recommendationController.getRandom );

app.get('/recommendations/top/:amount', recommendationController.getTop );

app.post('/genres', genreController.create )

app.get('/genres', genreController.getAll )

app.get('/genres/:id', genreController.getOne )

app.get('/recommendations/genres/:id/random', recommendationController.getRandomByGenreId )

export default app;
