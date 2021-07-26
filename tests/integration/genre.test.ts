import supertest from "supertest";
import app from "../../src/app";
import { clearDatabase, endConnection } from '../utils/database'
import faker from 'faker'
import { createGenre, populateGenreDatabase } from "../factories/genreFactory";
import { createClassification } from "../factories/classificationFactory";
import { createRecommendation } from "../factories/recommendationFactory";

const agent = supertest(app)

beforeEach( async () => {
    await clearDatabase();
})

afterAll( async () => {
    await clearDatabase();
    await endConnection();
})


describe("post /genres", () => {
    function generateBody( { name } : { name?:string }) {
        return {
            name: name || faker.music.genre()
        }
    }
    it(`should return 201 for valid params`, async () => {
        const body = generateBody({})
        const result = await agent.post('/genres').send(body)
        expect(result.status).toEqual(201)
    })
    it(`should return 409 when name alredy exists`, async () => {
        const body = generateBody({ name: "test" })
        await createGenre(body);
        const result = await agent.post('/genres').send(body)
        expect(result.status).toEqual(409)
    })
})

describe("get /genres", () => {
    it(`should return 404 when database is empty`, async () => {
        const result = await agent.get('/genres');
        expect(result.status).toEqual(404);
    })
    it(`should return 200 for valid params`, async () => {
        await populateGenreDatabase();
        const result = await agent.get('/genres');
        expect(result.status).toEqual(200);
    })
})

describe("get /genres/:id", () => {
    it('should return 200 for valid params', async () => {
        const genre = await createGenre({})
        const recommendation = await createRecommendation({})
        const classification = await createClassification({ genreId: genre.id, recommendationId:recommendation.id} )
        const result = await agent.get(`/genres/${classification.id}`);
        expect(result.status).toEqual(200)
    })
    it('should return 404 for invalid genre', async () => {
        const result = await agent.get(`/genres/-1`);
        expect(result.status).toEqual(404)
    })
})