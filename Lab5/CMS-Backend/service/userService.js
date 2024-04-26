const UserModel = require("../model/User");
const RoomModel = require("../model/Room");
const bcrypt = require("bcrypt");
const { da } = require("date-fns/locale");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

class UserService {
  async registerUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userData = req.body;

    try {
      let email = userData.email;
      let password = userData.password;

      if (!password) {
        throw new Error("Password is required");
      }

      const user = await UserModel.findOne({ email });
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //console.log("AND I AM HERE TOO");

      // Find the maximum id currently in use
      const maxIdUser = await UserModel.findOne().sort({ id: -1 });
      let maxId = 0;
      if (maxIdUser) {
        maxId = maxIdUser.id;
      }
      // Increment the id for the new student
      const newId = maxId + 1;
      console.log(userData);
      // Add the id to studentData
      userData.id = newId;
      userData.password = hashedPassword;

      console.log(userData);
      res.sendStatus(200);

      return await UserModel.create(userData);
    } catch (err) {
      console.log(err);
    }
  }

  async loginUser(req, res) {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Password is hashed, so we need to compare it
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: user.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // Saving refreshToken with current user
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  }

  async updateToken(req, res) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const foundUser = await UserModel.findOne({ refreshToken });
    if (!foundUser) return res.sendStatus(403); //Forbidden
    // evaluate jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.email !== decoded.email)
          return res.sendStatus(403);
        //const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
          {
            UserInfo: {
              email: foundUser.email,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        res.json({ accessToken });
      }
    );
  }

  async logoutUser(req, res) {
    const refreshToken = req.body.refreshToken;

    // Is refreshToken in db?
    const found = await UserModel.findOne({ refreshToken });
    if (!found) {
      return res.sendStatus(204);
    }

    found.refreshToken = null;
    await found.save();
    res.sendStatus(204);
  }

  async getMyself(req, res) {
    // Extract accessToken from the Authorization header
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.sendStatus(401); // Unauthorized if Authorization header is missing or doesn't start with 'Bearer '
    }

    const accessToken = authorizationHeader.split(" ")[1]; // Extract token from the header
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          return res.sendStatus(403); // Forbidden if token is invalid or expired
        }

        // Find user in the database using user's email from decoded token
        try {
          const found = await UserModel.findOne({ email: user.UserInfo.email });
          if (!found) {
            return res.sendStatus(404); // User not found
          }

          // Return user details
          res.json({
            id: found.id,
            email: found.email,
            name: found.name,
            surname: found.surname,
            dateOfBirth: found.dateOfBirth,
            sex: found.sex,
          });
        } catch (error) {
          console.error("Error:", error);
          res.sendStatus(500); // Internal server error
        }
      }
    );
  }

  async editMyself(req, res) {
    // Extract accessToken from the Authorization header
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.sendStatus(401); // Unauthorized if Authorization header is missing or doesn't start with 'Bearer '
    }

    const accessToken = authorizationHeader.split(" ")[1]; // Extract token from the header
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          return res.sendStatus(403); // Forbidden if token is invalid or expired
        }

        // Find user in the database using user's email from decoded token
        try {
          const found = await UserModel.findOne({ email: user.UserInfo.email });
          if (!found) {
            return res.sendStatus(404); // User not found
          }

          // Update user details
          // Only update fields that are present in the request body
          if (req.body.name) {
            found.name = req.body.name;
          }
          if (req.body.surname) {
            found.surname = req.body.surname;
          }
          if (req.body.dateOfBirth) {
            found.dateOfBirth = req.body.dateOfBirth;
          }
          if (req.body.sex) {
            found.sex = req.body.sex;
          }

          // Handle file upload (file is parsed by multer middleware)
          if (req.file) {
            const pictureFile = req.file;

            // Store the file path in the user object
            found.picture = pictureFile.path;
          }

          await found.save();

          // Return user details
          res.json({
            email: found.email,
            name: found.name,
            surname: found.surname,
            dateOfBirth: found.dateOfBirth,
            sex: found.sex,
            picture: found.picture, // Include picture path in the response
          });
        } catch (error) {
          console.error("Error:", error);
          res.sendStatus(500); // Internal server error
        }
      }
    );
  }

  async getMyPicture(req, res) {
    // Extract accessToken from the Authorization header
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.sendStatus(401); // Unauthorized if Authorization header is missing or doesn't start with 'Bearer '
    }

    const accessToken = authorizationHeader.split(" ")[1]; // Extract token from the header
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          return res.sendStatus(403); // Forbidden if token is invalid or expired
        }

        // Find user in the database using user's email from decoded token
        try {
          console.log(user);
          const found = await UserModel.findOne({ email: user.UserInfo.email });
          if (!found) {
            return res.sendStatus(404); // User not found
          }

          // Check if user has a picture
          if (!found.picture) {
            return res.sendFile(path.resolve("uploads/default-image.png"));
          }

          // Send the picture file
          res.sendFile(path.resolve(found.picture));
        } catch (error) {
          console.error("Error:", error);
          res.sendStatus(500); // Internal server error
        }
      }
    );
  }

  async getMyRooms(req, res) {
    // Extract accessToken from the Authorization header
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.sendStatus(401); // Unauthorized if Authorization header is missing or doesn't start with 'Bearer '
    }

    const accessToken = authorizationHeader.split(" ")[1]; // Extract token from the header
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          console.log(err);
          return res.sendStatus(403); // Forbidden if token is invalid or expired
        }

        // Find user in the database using user's email from decoded token
        try {
          const found = await UserModel.findOne({ email: user.UserInfo.email });
          if (!found) {
            return res.sendStatus(404); // User not found
          }

          //Get information about rooms (members)
          const rooms = [];
          for (let i = 0; i < found.rooms.length; i++) {
            const room = await RoomModel.findById(found.rooms[i]);
            //Only emails of members are needed
            const members = [];
            for (let j = 0; j < room.members.length; j++) {
              const member = await UserModel.findById(room.members[j]);
              members.push(member.email);
            }
            rooms.push({
              id: room._id,
              members: members,
            });
          }

          // Return user details
          res.json({
            rooms: rooms,
          });
        } catch (error) {
          console.error("Error:", error);
          res.sendStatus(500); // Internal server error
        }
      }
    );
  }

  async getOthersPictureId(req, res) {
    const id = req.params.id;
    try {
      const found = await UserModel.findOne({ id });

      if (!found) {
        return res.sendStatus(404); // User not found
      }

      // Check if user has a picture
      if (!found.picture) {
        return res.sendFile(path.resolve("uploads/default-image.png"));
      }

      console.log("Sending pic");

      // Send the picture file
      res.sendFile(path.resolve(found.picture));
    } catch (error) {
      console.error("Error:", error);
      res.sendStatus(500); // Internal server error
    }
  }

  async getOthersPictureEmail(req, res) {
    const email = req.params.email;

    const found = await UserModel.findOne({ email: email });

    if (!found) {
      return res.sendStatus(404); // User not found
    }

    // Check if user has a picture
    if (!found.picture) {
      return res.sendFile(path.resolve("uploads/default-image.png"));
    }

    // Send the picture file
    res.sendFile(path.resolve(found.picture));
  }

  async getOthersId(req, res) {
    const id = req.params.id;
    try {
      const found = await UserModel.findOne({ id });

      if (!found) {
        return res.sendStatus(404); // User not found
      }

      // Return user details
      res.json({
        email: found.email,
        name: found.name,
        surname: found.surname,
        dateOfBirth: found.dateOfBirth,
        sex: found.sex,
      });
    } catch (error) {
      console.error("Error:", error);
      res.sendStatus(500); // Internal server error
    }
  }
    
}

module.exports = new UserService();
