const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/bcrypt");

beforeAll(async () => {
  await queryInterface.bulkInsert("Users", [
    {
      email: "testuser@mail.com",
      password: hashPassword("password123"),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    restartIdentity: true,
    truncate: true,
    cascade: true
  });
});

describe("User API", () => {
  test("POST /register - success", async () => {
    const res = await request(app).post("/register").send({
      email: "newuser@mail.com",
      password: "password123"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", "newuser@mail.com");
  });

  test("POST /login - success", async () => {
    const res = await request(app).post("/login").send({
      email: "testuser@mail.com",
      password: "password123"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("access_token");
  });

  test("POST /login - fail (wrong password)", async () => {
    const res = await request(app).post("/login").send({
      email: "testuser@mail.com",
      password: "wrongpassword"
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /register - fail (email already exists)", async () => {
    const res = await request(app).post("/register").send({
      email: "testuser@mail.com",
      password: "password123"
    });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /register - fail (missing email)", async () => {
    const res = await request(app).post("/register").send({
      password: "password123"
    });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /login - fail (missing email)", async () => {
    const res = await request(app).post("/login").send({
      password: "password123"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /login - fail (missing password)", async () => {
    const res = await request(app).post("/login").send({
      email: "testuser@mail.com"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /login - fail (user not found)", async () => {
    const res = await request(app).post("/login").send({
      email: "notfound@mail.com",
      password: "password123"
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
