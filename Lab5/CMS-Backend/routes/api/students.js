const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const studentService = require("../../service/studentService");

// Middleware for JWT verification
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decoded.id; // Store the user id in the request object for later use
    next(); // Proceed to the next middleware
  });
};

// Route for /api/students
router.route("/").get(async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for /api/students/page
router.get("/page", async (req, res) => {
  const { page = 0, size = 10 } = req.query;
  try {
    const studentPage = await studentService.getAllStudents(page, size);
    res.json(studentPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply the middleware to all routes except the GET request to /api/students
router.use(verifyToken);

router.post(
  "/add",
  [
    body("name").notEmpty(),
    body("surname").notEmpty(),
    body("group")
      .notEmpty()
      .matches(/[A-Za-z0-9]+-[0-9]+/),
    body("sex").notEmpty().isIn(["male", "female", "other"]),
    body("active").optional().isBoolean(),
    body("dateOfBirth")
      .notEmpty()
      .matches(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d$/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, surname, group, sex, dateOfBirth } = req.body;
    const active = req.body.active || false; // Set active to false if not provided
    try {
      const newStudent = await studentService.addStudent({
        name,
        surname,
        group,
        sex,
        active,
        dateOfBirth,
      });
      res.status(201).json(newStudent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);



// Route for /api/students/:id
router
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    try {
      const student = await studentService.getStudentById(id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .put(async (req, res) => {
    const { id } = req.params;
    const { name, surname, group, sex, active, dateOfBirth } = req.body;
    try {
      const updatedStudent = await studentService.updateStudent(id, {
        name,
        surname,
        group,
        sex,
        active,
        dateOfBirth,
      });
      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(updatedStudent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    try {
      const deletedStudent = await studentService.deleteStudent(id);
      /*if (!deletedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(deletedStudent);*/
      res.json({ message: "Student deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
