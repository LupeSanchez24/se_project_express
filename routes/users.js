const router = require("express").Router();
const { celebrate } = require("celebrate");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, celebrate, updateUser);

module.exports = router;
