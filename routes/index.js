const router = require("express").Router();

const userRouter = require("./users");

const itemRouter = require("./clothingItems");

const { NOT_FOUND } = require("../utils/erros");

const { createUser, login } = require("../controllers/users");

router.use("/items", itemRouter);

router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
