import supertest from "supertest";
import app from "../../src/app";
import { clearDatabase, endConnection } from '../utils/database'
import faker from 'faker'
import { createGenre } from "../factories/genreFactory";

const agent = supertest(app)

beforeEach( async () => {
    clearDatabase();
})

afterAll( async () => {
    clearDatabase();
    endConnection();
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