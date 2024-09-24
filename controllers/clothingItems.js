const ClothingItem = require("../models/clothingItem");

const {
  NO_CONTENT,
  BAD_REQUEST,
  INTERNAL_SURVER_ERROR,
} = require("../utils/erros");

/*const createItem = (req, res) => {
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
};*/

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error("Error:", err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SURVER_ERROR).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      res
        .status(INTERNAL_SURVER_ERROR)
        .send({ message: "Error from getItem", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res
        .status(INTERNAL_SURVER_ERROR)
        .send({ message: "Error from updateItem", e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId).orFail(() =>
    res
      .then((item) => {
        return res.status(200).send(item);
      })
      .catch((e) => {
        res
          .status(INTERNAL_SURVER_ERROR)
          .send({ message: "Error from deleteItem", e });
      })
  );
};

/*const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
      .orFail()
      .then(() => res.status(200).send({}))
      .catch((e) => {
        res.status(500).send({ message: "Error from likeItem", e });
      })
  );
};*/

const likeItem = (req, res) => {
  console.log(req.params.itemId);
  const userId = req.user._id;
  const itemId = req.params.itemId;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error("Error:", err);
      if (err.name === "BADREQUEST") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SURVER_ERROR).send({ message: err.message });
    });
};

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail() // Call orFail() after the query
    .then(() => res.status(NO_CONTENT).send({}))
    .catch((e) => {
      res
        .status(INTERNAL_SURVER_ERROR) // Fixed the spelling here
        .send({ message: "Error from unlikeItem", e });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
