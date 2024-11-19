const { JWT_SECRET = "secretKey" } = process.env;

console.log(JWT_SECRET);
module.exports = { JWT_SECRET };
