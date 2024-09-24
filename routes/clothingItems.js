const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

//CRUD

//Create

router.post("/", createItem);

//Read

router.get("/", getItems);

//update

router.put("/:itemId", updateItem);

//delete

router.delete("/:itemId", deleteItem);

//like

router.put("/:itemId/likes", likeItem);

//unlike
router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
