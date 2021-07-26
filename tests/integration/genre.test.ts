import supertest from "supertest";
import app from "../../src/app";
import { clearDatabase, endConnection } from '../utils/database'
import faker from 'faker'
import { createGenre, populateDatabase } from "../factories/genreFactory";

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
        await populateDatabase();
        const result = await agent.get('/genres');
        expect(result.status).toEqual(200);
    })
})