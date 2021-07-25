import supertest from "supertest";
import app from "../../src/app";
import { createRecommendation } from "../factories/recommendationFactory";
import {clearDatabase, endConnection} from '../utils/database'

const agent = supertest(app)

beforeEach( async () => {
  await clearDatabase();
})

afterAll( async () => {
  await clearDatabase();
  await endConnection();
})

describe("post /recommendations", () => {
  function generateBody( { name, youtubeLink } : { name?:string, youtubeLink?:string }){
    return {
      name: name || "Falamansa - Xote dos Milagres",
      youtubeLink: youtubeLink || "https://www.youtube.com/watch?v=chwyjJbcs1Y"
    }
  }

  it(`should answer with status 201 when given valid data`, async () => {
    const body = generateBody({});

    const result = await agent.post('/recommendations').send(body)

    expect(result.status).toEqual(201)
  });

  it(`should answer 400 when data is empty`, async () => {
    const body = {}

    const result = await agent.post('/recommendations').send(body)

    expect(result.status).toEqual(400)
  })

  it(`should answer 400 when name is not string`, async () => {
    const body = {name:12345}

    const result = await agent.post('/recommendations').send(body)

    expect(result.status).toEqual(400)
  })

  it(`should answer 400 when youtubeLink is not a link from youtube`, async () => {
    const body = {youtubeLink:"https://ge.globo.com/"}

    const result = await agent.post('/recommendations').send(body)

    expect(result.status).toEqual(400)
  })

  it(`should answer 409 when name alredy exists`, async () => {
    const name = "test_user"

    const body = generateBody({name:name})

    await createRecommendation(body)

    const result = await agent.post('/recommendations').send(body)

    expect(result.status).toEqual(409)
  })
});
