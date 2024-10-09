const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZEDERRORR } = require("../utils/erros");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("No authorization header");
    res.status(UNAUTHORIZEDERRORR).send({ message: "Authorization required" });
    return;
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log("failed to verify token");
    res.status(UNAUTHORIZEDERRORR).send({ message: "Authorization required" });
    return;
  }
  req.user = payload; // assigning payload to the request object
  next();
};

module.exports = { auth };
