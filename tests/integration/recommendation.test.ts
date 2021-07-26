import supertest from "supertest";
import app from "../../src/app";
import connection from "../../src/database";
import { createClassification } from "../factories/classificationFactory";
import { createGenre } from "../factories/genreFactory";
import { createRecommendation, populateRecommendationDatabase } from "../factories/recommendationFactory";
import { clearDatabase, endConnection } from '../utils/database'

const agent = supertest(app)

beforeEach( async () => {
  await clearDatabase();
})

afterAll( async () => {
  await clearDatabase();
  await endConnection();
})

describe("post /recommendations", () => {
  async function generateBody( { name, youtubeLink } : { name?:string, youtubeLink?:string }){
    const genres = [await createGenre({}), await createGenre({}) ]
    const genresIds = genres.map(g => g.id);
    return {
      name: name || "Falamansa - Xote dos Milagres",
      youtubeLink: youtubeLink || "https://www.youtube.com/watch?v=chwyjJbcs1Y",
      genresIds
    }
  }
  it(`should answer with status 201 when given valid data`, async () => {
    const body = await generateBody({});

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

    const body = await generateBody({name:name})

    await createRecommendation(body)

    const result = await agent.post('/recommendations').send(body)

    expect(result.status).toEqual(409)
  })
});

describe("post /recommendation/:id/upvote", () => {
  it("should return 200 for valid params", async () => {
    const { id } = await createRecommendation({});
    const result = await agent.post(`/recommendations/${id}/upvote`)
    expect(result.status).toEqual(200)
  })
  it("should return 404 for invalid id", async () => {
    const result = await agent.post(`/recommendations/-1/upvote`)
    expect(result.status).toEqual(404)
  })
})

describe("post /recommendation/:id/downvote", () => {
  it("should return 200 for valid params", async () => {
    const { id } = await createRecommendation({score:-5});
    const result = await agent.post(`/recommendations/${id}/downvote`)
    expect(result.status).toEqual(200)
  })
  it("should return 404 for invalid id", async () => {
    const result = await agent.post(`/recommendations/-1/downvote`)
    expect(result.status).toEqual(404)
  })
})

describe("get /recommendations/random", () => {
  it("should return 404 for empty database", async () => {
    const result = await agent.get("/recommendations/random")
    expect(result.status).toEqual(404)
  })
  it("should return 200", async () => {
    await populateRecommendationDatabase()
    const result = await agent.get("/recommendations/random")
    expect(result.status).toEqual(200)
  })
})

describe("get /recommendations/top/:amount", () => {
  it("should return 404 for empty database", async () => {
    const result = await agent.get("/recommendations/random")
    expect(result.status).toEqual(404)
  })
  it("should return 200", async () => {
    await populateRecommendationDatabase()
    const result = await agent.get("/recommendations/random")
    expect(result.status).toEqual(200)
  })
})

describe("get /recommendations/genres/:id/random", () => {
  it("should return 404 when genre does not exists", async () => {
    const result = await agent.get(`/recommendations/genres/-1/random`)
    expect(result.status).toEqual(404)
  })
  it("should return 200", async () => {
    const genre = await createGenre({})
    const recommendation = await createRecommendation({})
    const bfs = await connection.query("select * from genres")
    await createClassification({ genreId: genre.id, recommendationId: recommendation.id })
    const result = await agent.get(`/recommendations/genres/${genre.id}/random`)
    expect(result.status).toEqual(200)
  })
})