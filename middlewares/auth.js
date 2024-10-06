const jwt = require("jsonwebtoken");
const { JWT_SECRET } = "../utils/config.js";
const { UNAUTHORIZEDERRORR } = require("../utils/erros");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZEDERRORR)
      .send({ message: "Authorization required" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHORIZEDERRORR)
      .send({ message: "Authorization required" });
  }
  req.user = payload; // assigning payload to the request object
  next();
};

module.exports = { auth };
