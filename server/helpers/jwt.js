const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
// console.log("Environment variables check:");
// console.log("SECRET_KEY exists:", !!process.env.SECRET_KEY);
// console.log("SECRET_KEY length:", process.env.SECRET_KEY ? process.env.SECRET_KEY.length : 0);

const signToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY);
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = {
  signToken,
  verifyToken
};
