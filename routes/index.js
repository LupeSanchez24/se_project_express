const router = require("express").Router();

const userRouter = require("./users");

const itemRouter = require("./clothingItems");

const { NotFound } = require("../utils/errors/not-found");

const {
  validateLogin,
  validateUserBody,
} = require("../middlewares/validation");

const { createUser, login } = require("../controllers/users");

router.use("/items", itemRouter);

router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);

router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFound("Router not found"));
});

module.exports = router;
