const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    requried: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    Select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  console.log("Entering findUserByCredentials with email:", email);
  return this.findOne({ email })
    .select("+password")
    .exec()
    .then((user) => {
      if (!user) {
        console.log("User not found with email:", email);
        return Promise.reject("Incorrect email or password");
      }
      console.log("User found:", user);
      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          console.log("Password does not match for user:", user.email);
          return Promise.reject("Incorrect email or password");
        }
        console.log("Password matched for user:", user.email);
        return user;
      });
    })
    .catch((err) => {
      console.error("Error in findUserByCredentials:", err);
      throw err;
    });
};

module.exports = mongoose.model("user", userSchema);
