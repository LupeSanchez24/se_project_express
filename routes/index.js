const router = require("express").Router();
const { celebrate } = require("celebrate");

const userRouter = require("./users");

const itemRouter = require("./clothingItems");

const { NotFound } = require("../utils/errors-classes");

const { createUser, login } = require("../controllers/users");

router.use("/items", itemRouter);

router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

router.post("/signin", celebrate, login);
router.post("/signup", celebrate, createUser);

router.use("/users", userRouter);

router.use((req, res) => {
  next(new NotFound("Router not found"));
});

module.exports = router;
