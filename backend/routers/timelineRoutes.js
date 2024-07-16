const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middlewares/auth");
const {
    createTimeline,
    updateTimeline,
    deleteTimeline,
    getAllTimeline
} = require("../controllers/timelineController");

router.post("/create", authMiddleware, createTimeline);
router.put("/update/:id", authMiddleware, updateTimeline);
router.delete("/delete/:id", authMiddleware, deleteTimeline);
router.get("/", getAllTimeline);

module.exports = router;