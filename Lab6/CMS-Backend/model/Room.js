const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
  messages: {
    type: [Object],
    default: [],
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
