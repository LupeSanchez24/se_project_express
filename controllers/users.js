const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const {
  BadRequestError,
  Conflict,

  NotFound,
  UnauthorizedError,
} = require("../utils/errors-classes");

const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(
      new BadRequestError("The 'email' and 'password' fields are required")
    );
  }

  if (!validator.isEmail(email)) {
    return next(new BadRequestError("Invalid email format"));
  }

  return User.findOne({ email })
    .then((existingEmail) => {
      if (existingEmail) {
        const error = new Error("Email already exists");
        error.code = 11000;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new Conflict("Email already exists"));
      }
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError({ message: err.message }));
      } else {
        return next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError({ message: err.message }));
      } else {
        return next(err);
      }
    });
};

const getCurrentUser = (req, res) => {
  const id = req.user._id;
  User.findById(id)
    .orFail()
    .then((user) => {
      const { _id, email, avatar, name } = user;
      res.status(200).send({
        _id,
        email,
        avatar,
        name,
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFound("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("User ID is not in valid format"));
      } else {
        return next(err);
      }
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFound("User not found"));
      } else {
        return next(err);
      }
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
