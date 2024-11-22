const router = require("express").Router();
const { celebrate } = require("celebrate");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser, celebrate);

module.exports = router;
