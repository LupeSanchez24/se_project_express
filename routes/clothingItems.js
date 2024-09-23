const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
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

module.exports = router;
