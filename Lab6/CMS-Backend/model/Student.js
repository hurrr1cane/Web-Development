const mongoose = require("mongoose");
const validateDate = require("../tools/dateValidator");

const studentSchema = new mongoose.Schema({
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
  group: {
    type: String,
    required: [true, "Group cannot be empty"],
    match: [/[A-Za-z0-9]+-[0-9]+/, "Group must be in format XX-00"],
  },
  sex: {
    type: String,
    required: [true, "Sex cannot be empty"],
    enum: ["male", "female", "other"],
  },
  active: {
    type: Boolean,
    default: false,
  },
  dateOfBirth: {
    type: String,
    required: [true, "Date of birth cannot be empty"],
    validate: {
      validator: validateDate,
      message: "Date of birth must be in format dd.MM.yyyy and be a valid date",
    },
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
