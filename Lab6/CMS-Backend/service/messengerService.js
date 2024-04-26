const RoomModel = require("../model/Room");
const UserModel = require("../model/User");

const jwt = require("jsonwebtoken");


class UserService {
  createRoom(req, res) {
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

          const roomData = req.body;
          let email = roomData.email;
      
          
          let ids = [found._id];
          const other = await UserModel.findOne({ email: email });
          if (other) {
            ids.push(other._id);

            let room = await RoomModel.create({
              members: ids,
              messages: [],
            });

            found.rooms.push(room._id);
            found.save();
            other.rooms.push(room._id);
            other.save();
            return res.sendStatus(200);

          

          } else {
            return res.sendStatus(404);
          }
        } catch (error) {
          console.error("Error:", error);
          res.sendStatus(500); // Internal server error
        }
      }
    );
    
  }

  getMessages(req, res) {
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

          const roomId = req.params.id;
          //Check if user is in the room
          const room = await RoomModel.findOne({ _id: roomId});
          if (!room) {
            return res.sendStatus(404); // Room not found
          }
          let members = room.members;
          if (!members.includes(found._id)) {
            return res.sendStatus(403); // Forbidden
          }


          return res.json(room.messages);

        } catch (error) {
          console.error("Error:", error);
          res.sendStatus(500); // Internal server error
        }

      }
    )
  }
    
  addParticipantToRoom(req, res) {
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

          const roomData = req.body;
          let email = roomData.email;
          let roomId = roomData.roomId;

          let room = await RoomModel.findOne({ _id: roomId});
          if (!room) {
            return res.sendStatus(404); // Room not found
          }

          // Check if user is in the room
          let id = found._id;
          let members = room.members;
          if (!members.includes(id)) {
            return res.sendStatus(403); // Forbidden
          }

      
          const other = await UserModel.findOne({ email: email });

          if (other) {
            //Check if other user is already in the room
            if (members.includes(other._id)) {
              return res.sendStatus(403); // Forbidden
            }

            // Add other user to the room
            room.members.push(other._id);
            room.save();
            other.rooms.push(room._id);
            other.save();

            return res.sendStatus(200);

          } else {
            return res.sendStatus(404);
          }
        } catch (error) {
          console.error("Error:", error);
          res.sendStatus(500); // Internal server error
        }
      }
    );
  }
  


}
module.exports = new UserService();

