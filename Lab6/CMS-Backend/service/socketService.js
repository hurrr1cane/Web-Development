const RoomModel = require("../model/Room");

let connectionHandler = (socket, io) => {
  console.log("a user was connected");

  socket.on("join-specific-room", (roomId) => {
    socket.join(roomId);
    console.log(`A user joined specific room ${roomId}`);
  });

  socket.on("send-message", (data) => {
    const currentTime = new Date();

    console.log("MEssage sended: ", data.message);
    console.log("Message sended to: " ,data.roomId);
    console.log("Sender of message: ", data.sender);
    io.to(data.roomId).emit("new-message", { message: data.message, sender: data.sender, dateTime: currentTime });

    // Save message to database
    RoomModel.findOneAndUpdate(
      { _id: data.roomId },
      { $push: { messages: { sender: data.sender, message: data.message, dateTime: currentTime } } },
      { new: true } // This option returns the updated document
    )
      .then((updatedRoom) => {
        if (updatedRoom) {
          // Successfully updated
          console.log("Message saved:", updatedRoom);
        } else {
          // Room not found
          console.log("Room not found");
        }
      })
      .catch((error) => {
        console.error("Error saving message:", error);
      });
  });
};

module.exports = { connectionHandler };
