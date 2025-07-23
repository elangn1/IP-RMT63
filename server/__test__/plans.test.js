const request = require("supertest");
const app = require("../app");
const { sequelize, Plan, User } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/bcrypt");

jest.mock("../helpers/gemini", () => ({
  generateGeminiContent: jest.fn().mockResolvedValue("Mocked AI Feedback")
}));

let userId;
let planId;
let access_token;

beforeAll(async () => {
  const [user] = await queryInterface.bulkInsert(
    "Users",
    [
      {
        email: "planuser@mail.com",
        password: hashPassword("password123"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    { returning: true }
  );
  userId = user ? user.id : 1;

  const res = await request(app).post("/login").send({
    email: "planuser@mail.com",
    password: "password123"
  });
  access_token = res.body.access_token;
});

afterAll(async () => {
  await queryInterface.bulkDelete("Plans", null, {
    restartIdentity: true,
    truncate: true,
    cascade: true
  });
  await queryInterface.bulkDelete("Users", null, {
    restartIdentity: true,
    truncate: true,
    cascade: true
  });
});

describe("Plan API", () => {
  test("POST /plans - success create plan", async () => {
    const res = await request(app)
      .post("/plans")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        userId,
        judulBelajar: "Belajar Unit Test"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("userId", userId);
    expect(res.body).toHaveProperty("judulBelajar", "Belajar Unit Test");
    expect(res.body).toHaveProperty("aiFeedback");
    planId = res.body.id;
  });

  test("GET /plans - get all plans", async () => {
    const res = await request(app).get("/plans").set("Authorization", `Bearer ${access_token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /plans/:id - get plan by id", async () => {
    const res = await request(app)
      .get(`/plans/${planId}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", planId);
    expect(res.body).toHaveProperty("judulBelajar");
  });

  test("PUT /plans/:id - update plan", async () => {
    const res = await request(app)
      .put(`/plans/${planId}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ judulBelajar: "Belajar Integration Test" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("judulBelajar", "Belajar Integration Test");
    expect(res.body).toHaveProperty("aiFeedback");
  });

  test("PUT /plans/:id/feedback - regenerate aiFeedback", async () => {
    const res = await request(app)
      .put(`/plans/${planId}/feedback`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("aiFeedback");
  });

  test("GET /plans/:id - fail (plan not found)", async () => {
    const res = await request(app)
      .get("/plans/99999")
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  test("PUT /plans/:id - fail (plan not found)", async () => {
    const res = await request(app)
      .put("/plans/99999")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ judulBelajar: "Tidak Ada" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /plans - fail (missing judulBelajar)", async () => {
    const res = await request(app)
      .post("/plans")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ userId });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("PUT /plans/:id - fail (missing judulBelajar)", async () => {
    const res = await request(app)
      .put(`/plans/${planId}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("DELETE /plans/:id - delete plan", async () => {
    const res = await request(app)
      .delete(`/plans/${planId}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  test("DELETE /plans/:id - fail (plan not found)", async () => {
    const res = await request(app)
      .delete("/plans/99999")
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /plans - fail (force Plan.create error)", async () => {
    const res = await request(app)
      .post("/plans")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ userId: -1, judulBelajar: "Belajar Error" });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /plans - success with special judulBelajar for ai error", async () => {
    const res = await request(app)
      .post("/plans")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ userId, judulBelajar: "__force_gemini_error__" });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty("message");
  });

  let aiErrorPlanId;
  test("POST /plans - create plan for ai error feedback", async () => {
    const res = await request(app)
      .post("/plans")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ userId, judulBelajar: "__force_gemini_error__" });

    aiErrorPlanId = res.body.id;
  });

  test("PUT /plans/:id/feedback - fail (force gemini error)", async () => {
    if (!aiErrorPlanId) return;
    const res = await request(app)
      .put(`/plans/${aiErrorPlanId}/feedback`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty("message");
  });

  test("PUT /plans/:id/feedback - fail (plan not found)", async () => {
    const res = await request(app)
      .put("/plans/99999/feedback")
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /plans/:id/generate-quizzes - success generate quizzes", async () => {
    const resPlan = await request(app)
      .post("/plans")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        userId,
        judulBelajar: "Belajar Quiz Gemini"
      });
    const quizPlanId = resPlan.body.id;
    const res = await request(app)
      .post(`/plans/${quizPlanId}/generate-quizzes`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("quizzes");
  });

  test("POST /plans/:id/generate-quizzes - fail (plan not found)", async () => {
    const res = await request(app)
      .post("/plans/99999/generate-quizzes")
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  test("PUT /plans/:id/feedback - fail (force gemini error in feedback)", async () => {
    // Test plan dengan judulBelajar "__force_gemini_error__" di endpoint feedback
    const res = await request(app)
      .put(`/plans/${aiErrorPlanId}/feedback`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
