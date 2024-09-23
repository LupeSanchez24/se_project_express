const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const owner = req.user._id;
  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL, owner })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      res.status(500).send({ message: "Error from getItem", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(500).send({ message: "Error from updateItem", e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId).orFail((item) =>
    res
      .status(204)
      .send({})
      .catch((e) => {
        res.status(500).send({ message: "Error from deleteItem", e });
      })
  );
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
      .orFail()
      .then((item) => res.status(200).send({}))
      .catch((e) => {
        res.status(500).send({ message: "Error from likeItem", e });
      })
  );
};

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
      .orFail()
      .then((item) => res.status(204).send({}))
      .catch((e) => {
        res.status(500).send({ message: "Error from unlikeItem", e });
      })
  );
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
