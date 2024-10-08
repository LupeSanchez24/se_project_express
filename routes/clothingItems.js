const router = require("express").Router();

const {
  createItem,
  getItems,

  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

const { auth } = require("../middlewares/auth");

router.post("/", auth, createItem);

router.get("/", auth, getItems);

router.put("/:itemId/likes", auth, likeItem);

router.delete("/:itemId", auth, deleteItem);

router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
