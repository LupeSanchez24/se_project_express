const router = require("express").Router();

const userRouter = require("./users");

const itemRouter = require("./clothingItems");

const { NOT_FOUND } = require("../utils/erros");

const { createUser, login } = require("../controllers/users");

const { auth } = require("../middlewares/auth");

router.use("/items", itemRouter);

router.post("/signin", login);
router.post("/signup", createUser);

router.use(auth);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
