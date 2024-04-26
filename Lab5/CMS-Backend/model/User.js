const mongoose = require("mongoose");
const validateDate = require("../tools/dateValidator");

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: [true, "Name cannot be empty"],
    match: [
      /^[A-Z][a-z]+([ '-][a-zA-Z]+)*$/,
      "Name must start with capital letter and contain only letters, hyphens and apostrophes",
    ],
  },
  surname: {
    type: String,
    required: [true, "Surname cannot be empty"],
    match: [
      /^[A-Z][a-z]+([ '-][a-zA-Z]+)*$/,
      "Surname must start with capital letter and contain only letters, hyphens and apostrophes",
    ],
  },
  sex: {
    type: String,
    required: [true, "Sex cannot be empty"],
    enum: ["male", "female", "other"],
  },
  dateOfBirth: {
    type: String,
    required: [true, "Date of birth cannot be empty"],
    validate: {
      validator: validateDate,
      message: "Date of birth must be in format dd.MM.yyyy and be a valid date",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email must be a valid email address",
    ],
    unique: true,
  },
  refreshToken: {
    type: String,
  },
  picture: {
    type: String,
  },
  rooms: {
    // Array of room ids (MongoDB ObjectIds)
    type: [mongoose.Schema.Types.ObjectId],
  },

});

const User = mongoose.model("User", userSchema);

module.exports = User;
