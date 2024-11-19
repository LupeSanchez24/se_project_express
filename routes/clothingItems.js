const router = require("express").Router();

const {
  createItem,
  getItems,

  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

const { validateItemId } = require("../middlewares/validation");

const { auth } = require("../middlewares/auth");

router.post("/", auth, createItem);

router.get("/", getItems);

router.put("/:itemId/likes", auth, validateItemId, likeItem);

router.delete("/:itemId", auth, validateItemId, deleteItem);

router.delete("/:itemId/likes", auth, validateItemId, unlikeItem);

module.exports = router;
