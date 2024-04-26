const express = require("express");
const router = express.Router();
const messengerService = require("../../service/messengerService");


router.post("/", messengerService.createRoom);
router.get("/:id/messages", messengerService.getMessages);
router.post("/addParticipant", messengerService.addParticipantToRoom);


module.exports = router;
