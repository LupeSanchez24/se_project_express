const router = require("express").Router();
const {
  getCurrentUser,
  updateUser,
  getUsers,
} = require("../controllers/users");
const { auth } = require("../middlewares/auth");

router.get("/", auth, getUsers);
//router.get("/:userId", getUser);
//router.post("/", createUser);

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);

module.exports = router;
