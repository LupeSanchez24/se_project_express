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

router.get("/", getItems);

router.put("/:itemId/likes", auth, likeItem);

router.delete("/:itemId", deleteItem);

router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
