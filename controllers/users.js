const User = require("../models/user");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZEDERRORR,
} = require("../utils/erros");

const { JWT_SECRET } = "../utils/config.js";

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

/*const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};*/

const bcrypt = require("bcryptjs");
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })

    .then((existingEmail) => {
      if (existingEmail) {
        const error = new Error("Email already exists");
        error.code = 11000;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      return User.create({ name, avatar, email, password: hash }).then(
        (user) => {
          res.status(201).send({
            name: user.name,
            avatar: user.avatar,
            email: user.email,
          });
        }
      );
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "Email already exist" });
      }
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An Error has occured on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZEDERRORR)
          .send({ message: "Incorrect email or password" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  const { id } = req.user;
  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "User ID is not in valid format" });
      }
      console.error(err);
      return res.status(500).send({ message: "Internal server error" });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  ).then((updatedUser) => {
    if (!updatedUser) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }
    return res.status(200).send(updatedUser);
  });
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateUser };
