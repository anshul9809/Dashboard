const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middlewares/auth");
const {
    sendMessage,
    getAllMessages,
    deleteMessage,
    getSingleMessage
} = require("../controllers/messageController");

router.post("/", sendMessage);
router.delete("/:id",authMiddleware, deleteMessage);
router.get("/:id",authMiddleware, getSingleMessage);
router.get("/", authMiddleware, getAllMessages);


module.exports = router;