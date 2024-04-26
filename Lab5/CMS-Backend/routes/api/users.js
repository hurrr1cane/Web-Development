const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const userService = require("../../service/userService");


const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Define the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Generate a unique filename to prevent overwriting existing files
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });


router.post(
  "/register",
  body("name").notEmpty().withMessage("Name is required"),
  body("surname").notEmpty().withMessage("Surname is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("sex").notEmpty().withMessage("Sex is required"),
  body("dateOfBirth").notEmpty().withMessage("Date of birth is required"),
  userService.registerUser
);


router.post("/login", userService.loginUser);

router.post("/logout", userService.logoutUser);

router.post("/refresh", userService.updateToken);

router.post("/me", userService.getMyself);

router.use(upload.single('userPicture'));

router.put("/edit", userService.editMyself);

router.get("/getMyPicture", userService.getMyPicture);

router.get("/rooms", userService.getMyRooms);

router.get("/userPicture/id/:id", userService.getOthersPictureId);
router.get("/userPicture/email/:email", userService.getOthersPictureEmail);

router.get("/user/id/:id", userService.getOthersId);


module.exports = router;
